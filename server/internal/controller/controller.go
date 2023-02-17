package controller

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/travas-io/travas-op/internal/config"
	"github.com/travas-io/travas-op/internal/encrypt"
	"github.com/travas-io/travas-op/internal/query"
	"github.com/travas-io/travas-op/internal/token"
	"github.com/travas-io/travas-op/model"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Operator struct {
	App *config.Tools
	DB  query.Repo
}

func NewOperator(app *config.Tools, db *mongo.Client) *Operator {
	return &Operator{
		App: app,
		DB:  query.NewOperatorDB(app, db),
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

// ProcessRegister : As the name implies , this method will help to process all the registration process
// of the user
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
				op.App.InfoLogger.Println(err)
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
		email := ctx.Request.Form.Get("email")
		password := ctx.Request.Form.Get("password")

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

				if err := cookieData.Save(); err != nil {
					log.Println("error from the session storage")
					_ = ctx.AbortWithError(http.StatusNotFound, gin.Error{Err: err})
					return
				}
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
				tk := map[string]string{"t1": t1, "t2": t2}

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
		//	this will involve scanning the pdf format of the document
		//	signature and other details needed
	}
}

// Dashboard : this will help load up and process all the user details,information and all the
// necessary data need in the user menu
func (op *Operator) Dashboard() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		ctx.JSONP(http.StatusOK, gin.H{})
	}
}

func (op *Operator) TourPackagePage() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		ctx.JSONP(http.StatusOK, gin.H{})
	}
}

func (op *Operator) ProcessTourPackage() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if err := ctx.Request.ParseForm(); err != nil {
			_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
		}

		cookieData := sessions.Default(ctx)
		userInfo := cookieData.Get("info").(model.UserInfo)

		CreatedAt, _ := time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		UpdatedAt, _ := time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))

		imgMap := make(map[string]any)

		ctx.Writer.Header().Set("Content-Type", "multipart/form-data")
		multiForm, err := ctx.MultipartForm()
		if err != nil {
			_ = ctx.AbortWithError(http.StatusInternalServerError, err)
		}

		imgForm, ok := multiForm.File["tour_images"]
		if !ok {
			_ = ctx.AbortWithError(http.StatusInternalServerError, errors.New("cannot upload images"))
			ctx.JSON(http.StatusInternalServerError, "error while uploading images")
			return
		}
		for i, file := range imgForm {
			x := fmt.Sprintf("image_%v", i)
			imgMap[x] = file
			if i > 5 {
				break
			}
		}

		wte := []string{ctx.Request.FormValue("what_to_expect")}
		whatToExpect := make(map[string]string)
		for x, y := range wte {
			key := fmt.Sprintf("what_to_expect_%v", x)
			whatToExpect[key] = y

		}

		rules := []string{ctx.Request.FormValue("rules")}
		rulesMap := make(map[string]string)
		for x, y := range rules {
			key := fmt.Sprintf("rule_%v", x)
			rulesMap[key] = y
		}

		tour := &model.Tour{
			ID:              primitive.NewObjectID(),
			OperatorID:      userInfo.ID,
			Title:           ctx.Request.FormValue("title"),
			Destination:     strings.TrimSpace(strings.ToLower(ctx.Request.FormValue("destination"))),
			MeetingPoint:    ctx.Request.FormValue("meeting_point"),
			StartTime:       ctx.Request.FormValue("start_time"),
			StartDate:       ctx.Request.FormValue("start_date"),
			EndDate:         ctx.Request.FormValue("end_date"),
			Price:           ctx.Request.FormValue("price"),
			Image:           imgMap,
			Contact:         ctx.Request.FormValue("contact"),
			Language:        ctx.Request.FormValue("language"),
			NumberOfTourist: ctx.Request.FormValue("number_of_tourists"),
			Description:     ctx.Request.FormValue("description"),
			WhatToExpect:    whatToExpect,
			Rules:           rulesMap,
			CreatedAt:       CreatedAt,
			UpdatedAt:       UpdatedAt,
		}

		if err := op.App.Validator.Struct(&tour); err != nil {
			if _, ok := err.(*validator.InvalidValidationError); !ok {
				_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
				log.Println(err)
				return
			}
		}

		cookieData.Set("tour_id", tour.ID)

		if err := cookieData.Save(); err != nil {
			log.Println("error from the session storage")
			_ = ctx.AbortWithError(http.StatusNotFound, gin.Error{Err: err})
			return
		}

		_, err = op.DB.InsertPackage(tour)
		if err != nil {
			_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
			return
		}

		ctx.JSON(http.StatusCreated, gin.H{
			"message": "New package added successfully",
		})
	}
}

// PreviewTour : this handler will handle the request to preview tour package that is recently created
func (op *Operator) PreviewTour() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		cookieData := sessions.Default(ctx)
		tourID, ok := cookieData.Get("tour_id").(primitive.ObjectID)
		if !ok {
			_ = ctx.AbortWithError(http.StatusNotFound, errors.New("cannot find tour id"))
		}
		tour, err := op.DB.LoadTour(tourID)
		if err != nil {
			_ = ctx.AbortWithError(http.StatusInternalServerError, gin.Error{Err: err})
			return
		}
		ctx.JSONP(http.StatusOK, gin.H{"tour": tour})
	}
}

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
