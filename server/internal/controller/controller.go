package controller

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"time"

	"github.com/travas-io/travas-op/internal"
	"github.com/travas-io/travas-op/internal/pkg/encrypt"
	"github.com/travas-io/travas-op/internal/pkg/token"
	"github.com/travas-io/travas-op/internal/query/mongodb"
	"github.com/travas-io/travas-op/pkg/config"
	"github.com/travas-io/travas-op/pkg/upload"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/travas-io/travas-op/internal/query"
	"github.com/travas-io/travas-op/model"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Operator : It holds all the necessary field n
type Operator struct {
	App *config.Logger
	DB  query.Repo
}

func NewOperator(app *config.Logger, db *mongo.Client) internal.MainStore {
	return &Operator{
		App: app,
		DB:  mongodb.NewOperatorDB(app, db),
	}
}

// Welcome : This method render the welcome page of the flutter mobile application
func (op *Operator) Welcome() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Todo : render the home page of the application
		ctx.JSON(http.StatusOK, gin.H{})
	}
}

// Register : this Handler will render and show the register page for user
func (op *Operator) Register() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{})
	}
}

// ProcessRegister : this helps to process user registration
func (op *Operator) ProcessRegister() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if err := ctx.Request.ParseForm(); err != nil {
			_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
		}
		CreatedAt, _ := time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		UpdatedAt, _ := time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		user := &model.Operator{
			CompanyName:     ctx.Request.FormValue("company_name"),
			Email:           ctx.Request.FormValue("email"),
			Password:        ctx.Request.FormValue("password"),
			ConfirmPassword: ctx.Request.FormValue("confirm_password"),
			Phone:           ctx.Request.FormValue("phone"),
			TourGuide:       []string{},
			ToursList:       []model.Tour{},
			GeoLocation:     "",
			Token:           "",
			NewToken:        "",
			CreatedAt:       CreatedAt,
			UpdatedAt:       UpdatedAt,
		}

		if user.Password != user.ConfirmPassword {
			ctx.JSON(http.StatusNotAcceptable, gin.H{
				"message": "unmatched password !Input correct password",
			})
			return
		}
		user.Password, _ = encrypt.Hash(user.Password)
		user.ConfirmPassword, _ = encrypt.Hash(user.ConfirmPassword)

		if err := op.App.Validator.Struct(&user); err != nil {
			if _, ok := err.(*validator.InvalidValidationError); !ok {
				_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
				op.App.Info.Println(err)
				return
			}
		}

		found, status, err := op.DB.InsertUser(user)
		if err != nil {
			_ = ctx.AbortWithError(http.StatusBadRequest, errors.New("error while adding new user"))
			ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
			return
		}

		switch {
		case found && status == 1:
			ctx.JSON(http.StatusOK, gin.H{
				"message": "Registered Successfully",
			})
			return

		case found && status == 2:
			ctx.JSON(http.StatusSeeOther, gin.H{
				"message": "Existing Account, Go to the Login page",
			})
			return

		}
	}
}

// LoginPage : this will show the login page for user
func (op *Operator) LoginPage() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.JSONP(http.StatusOK, gin.H{})
	}
}

// ProcessLogin : this method will help to parse, verify, and as well as authenticate the user
// login details, and it also helps to generate jwt token for restricted routers
func (op *Operator) ProcessLogin() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if err := ctx.Request.ParseForm(); err != nil {
			_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
		}
		// get user inputs
		email := ctx.Request.Form.Get("email")
		password := ctx.Request.Form.Get("password")

		// validate email using regex expression
		regMail := regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
		ok := regMail.MatchString(email)

		if ok {

			res, checkErr := op.DB.VerifyUser(email)

			if checkErr != nil {
				_ = ctx.AbortWithError(http.StatusUnauthorized, fmt.Errorf("unregistered user %v", checkErr))
				ctx.JSON(http.StatusUnauthorized, gin.H{"message": "unregistered user"})
				return
			}

			id := (res["_id"]).(primitive.ObjectID)
			inputPass := (res["password"]).(string)
			compName := (res["company_name"]).(string)

			verified, err := encrypt.Verify(password, inputPass)
			if err != nil {
				_ = ctx.AbortWithError(http.StatusUnauthorized, errors.New("cannot verify user details"))
				ctx.JSON(http.StatusUnauthorized, gin.H{"message": "Incorrect login details"})
				return
			}
			switch {
			case verified:
				cookieData := sessions.Default(ctx)

				userInfo := model.UserInfo{
					ID:          id,
					Email:       email,
					Password:    password,
					CompanyName: compName,
				}
				cookieData.Set("info", userInfo)

				// generate the jwt token
				t1, t2, err := token.Generate(email, id)
				if err != nil {
					_ = ctx.AbortWithError(http.StatusInternalServerError, fmt.Errorf("token no generated : %v ", err))
				}

				cookieData.Set("token", t1)

				if err := cookieData.Save(); err != nil {
					log.Println("error from the session storage")
					_ = ctx.AbortWithError(http.StatusNotFound, gin.Error{Err: err})
					return
				}

				// var tk map[string]string
				tk := map[string]any{"token": t1, "new_token": t2}

				// update the database adding the token to user database
				_, updateErr := op.DB.UpdateInfo(userInfo.ID, tk)
				if updateErr != nil {
					_ = ctx.AbortWithError(http.StatusBadRequest, fmt.Errorf("unregistered user %v", updateErr))
					ctx.JSON(http.StatusBadRequest, gin.H{"message": "Incorrect login details"})
					return
				}

				ctx.JSON(http.StatusOK, gin.H{
					"message":       "Welcome to user homepage",
					"email":         email,
					"id":            id,
					"company_name":  compName,
					"session_token": t1,
				})
			case !verified:
				ctx.JSON(http.StatusUnauthorized, gin.H{"message": "Incorrect login details"})
				return
			}

		}
	}
}

// VerifyDocument : this will be used to implement the upload of files
func (op *Operator) VerifyDocument() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		//	todo --> verify document upload by the tour operator
		if err := ctx.Request.ParseMultipartForm(int64(MEMORYMAXSIZE)); err != nil {
			_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
		}

		cookieData := sessions.Default(ctx)
		userInfo, ok := cookieData.Get("info").(model.UserInfo)

		if !ok {
			_ = ctx.AbortWithError(http.StatusNotFound, errors.New("cannot find operator id"))
		}

		form := ctx.Request.MultipartForm

		IDcard, err := upload.SingleFile(form, "id_card", "Id_data")
		if err != nil {
			_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
			return
		}

		certf, err := upload.SingleFile(form, "certificate", "certificate_data")
		if err != nil {
			_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
			return
		}

		credential := map[string]any{
			"full_name":   form.Value["full_name"],
			"phone":       form.Value["phone"],
			"id_card":     IDcard,
			"certificate": certf,
			"status":      "Not Verified",
		}

		ok, err = op.DB.UpdateInfo(userInfo.ID, credential)
		if !ok {
			_ = ctx.AbortWithError(http.StatusInternalServerError, gin.Error{Err: err})
			return
		}

		ctx.JSONP(http.StatusOK, gin.H{"message": "credential submitted successfully"})
	}

}

func (op *Operator) CheckStatus() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		cookieData := sessions.Default(ctx)
		userInfo, ok := cookieData.Get("info").(model.UserInfo)
		
    if !ok {
			_ = ctx.AbortWithError(http.StatusNotFound, errors.New("cannot find operator id"))
		}

		res, err := op.DB.FindStatus(userInfo.ID)
    if err != nil{
      _ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
      return
    }

		status := (res["status"]).(string) 

    switch status {
		case "":
        ctx.JSONP(http.StatusNoContent, gin.H{"message": "Please verify your credential"})
    case "Verified":
      // this will be added in the backend of the admin panel after the admin verify the operator
			ctx.JSONP(http.StatusOK, gin.H{"message": "You have been verified successfully"})
    case "Not Verified":
			ctx.JSONP(http.StatusNoContent, gin.H{"message": "You credential is still under review"})
     }
  }
}

// Dashboard : this will help load up and process all the user details,information and all the
// necessary data need in the user menu
func (op *Operator) Dashboard() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.JSONP(http.StatusOK, gin.H{})
	}
}

// GetTourRequest :: not implemented yet
func (op *Operator) GetTourRequest() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Todo -> get all the tour request from the tourists collections
		//	and compare and check for the date with the present date
		requestTours, err := op.DB.ValidTourRequest()
if err != nil {
			_ = ctx.AbortWithError(http.StatusInternalServerError, gin.Error{Err: err})
			return
		}
		ctx.JSONP(http.StatusOK, gin.H{"tourRequests": requestTours})
	}
}
