package controller

import (
	"errors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/travas-io/travas-op/model"
	"github.com/travas-io/travas-op/pkg/upload"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"net/http"
	"strings"
)

func (op *Operator) AddTourGuide() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if err := ctx.Request.ParseMultipartForm(int64(MEMORYMAXSIZE)); err != nil {
			_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
		}

		cookieData := sessions.Default(ctx)
		userInfo, ok := cookieData.Get("info").(model.UserInfo)

		if !ok {
			_ = ctx.AbortWithError(http.StatusNotFound, errors.New("cannot find operator id"))
    }

		form := ctx.Request.MultipartForm

		imageInfo, err := upload.SingleFile(form, "profile_image","profile_data",)
		if err != nil {
			_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
      return
		}

    IDInfo, err := upload.SingleFile(form, "id_card", "id_card_data")
    if err != nil{
      _ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
    return
    }

    
	
		tourGuide := &model.TourGuide{
			OperatorID:   userInfo.ID,
			ID:           primitive.NewObjectID().Hex(),
			Name:         ctx.Request.Form.Get("full_name"),
			Bio:          ctx.Request.Form.Get("bio"),
			ProfileImage: imageInfo,
      IDCard: IDInfo,
		}

		ok, err = op.DB.InsertTourGuide(tourGuide)
		if !ok {
			_ = ctx.AbortWithError(http.StatusInternalServerError, gin.Error{Err: err})
		}

		ctx.JSONP(http.StatusOK, gin.H{"message": "tour guide added"})
	}
}

func (op *Operator) GetTourGuide() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		cookieData := sessions.Default(ctx)
		userInfo, ok := cookieData.Get("info").(model.UserInfo)

		if !ok {
			_ = ctx.AbortWithError(http.StatusNotFound, errors.New("cannot find operator id"))
		}

		arrRes, err := op.DB.FindTourGuide(userInfo.ID)
		if err != nil {
			_ = ctx.AbortWithError(http.StatusInternalServerError, gin.Error{Err: err})
			return
		}
		// all the value to the id key should be added to the remove url
		ctx.JSONP(http.StatusOK, gin.H{"TourGuides": arrRes})
	}
}

func (op *Operator) DeleteTourGuide() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		guideID := ctx.Param("id")
		guideID = strings.TrimSpace(guideID)
		err := op.DB.UpdateTourGuide(guideID)
		if err != nil {
			_ = ctx.AbortWithError(http.StatusInternalServerError, gin.Error{Err: err})
			return
		}

		ctx.JSONP(http.StatusOK, gin.H{"message": "tour guide delete successfully"})
	}
}

func (op *Operator) SelectTourGuide() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		//	Todo -> make enquire from the frontend dev before coding this up
		// find the right selected guide and add that to the tour packages as well

	}
}
