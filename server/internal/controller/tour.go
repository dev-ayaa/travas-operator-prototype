package controller

import (
	"errors"
	"fmt"
	"github.com/travas-io/travas-op/pkg/upload"
	"io"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/travas-io/travas-op/model"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var MEMORYMAXSIZE = 10 * 1024 * 1024

// ProcessTourPackage this parse the multipart form data and  process the upload files or data as a stream
// getting the data for processing one at a time
func (op *Operator) ProcessTourPackage() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if !strings.HasPrefix(ctx.Request.Header.Get("Content-Type"), "multipart/form-data") {
			_ = ctx.AbortWithError(http.StatusBadRequest, errors.New("invalid content-Type"))
			return
		}

		boundary := "travas"
		ctx.Request.Header.Set("Content-Type", fmt.Sprintf("multipart/form-data; boundary=%s", boundary))

		// Parse the incoming posted data from the client app
		multipartReader, err := ctx.Request.MultipartReader()
		if err != nil {
			_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
		}

		// Get the store cookies in user session
		cookieData := sessions.Default(ctx)
		userInfo, ok := cookieData.Get("info").(model.UserInfo)
		if !ok {
			_ = ctx.AbortWithError(http.StatusBadRequest, errors.New("invalid user info"))
			return
		}
		// Get the uploaded images from the client app
		imageStream := make(map[string][]interface{}, 0)
		//image := make(map[string])
		count := 0
		for {
			form, err := multipartReader.NextPart()
			log.Println(form)
			if err == io.EOF {
				break
			}

			if err != nil {
				_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
			}
			if form.FileName() != "" {

				fileByte, err := ioutil.ReadAll(form)
				if err != nil {
					_ = ctx.AbortWithError(http.StatusInternalServerError, errors.New("cannot upload images"))
					return
				}
				defer func(form *multipart.Part) {
					err := form.Close()
					if err != nil {
						return
					}
				}(form)

				fileByte, err = ioutil.ReadAll(form)
				if err != nil {
					_ = ctx.AbortWithError(http.StatusInternalServerError, errors.New("cannot read image data"))
					return
				}

				if len(fileByte) > MEMORYMAXSIZE {
					_ = ctx.AbortWithError(http.StatusBadRequest, errors.New("image too large"))
					return
				}

				ext := filepath.Ext(form.FileName())
				if ext != ".png" && ext != ".jpg" && ext != ".jpeg" {
					_ = ctx.AbortWithError(http.StatusBadRequest, errors.New("invalid image format"))
				}
				count += 1
				bk := fmt.Sprintf("image_data_%d", count)
				img := fmt.Sprintf("tour_image_%d", count)
				imageStream[bk] = append(imageStream[bk], fileByte)
				imageStream["img"] = append(imageStream[img], form)

			}

		}

		// Check through the uploaded images. validate the filesize, format and append to a slice of a map

		wte := ctx.PostFormArray("what_to_expect")
		whatToExpect := make(map[string]string)
		for i, value := range wte {
			key := fmt.Sprintf("what_to_expect_%d", i)
			whatToExpect[key] = value

		}

		rules := ctx.PostFormArray("rules")
		rulesMap := make(map[string]string)
		for i, value := range rules {
			key := fmt.Sprintf("rule_%d", i)
			rulesMap[key] = value
		}

		tour := &model.Tour{
			ID:              primitive.NewObjectID(),
			OperatorID:      userInfo.ID,
			Title:           ctx.PostForm("title"),
			Destination:     strings.TrimSpace(strings.ToLower(ctx.PostForm("destination"))),
			MeetingPoint:    ctx.PostForm("meeting_point"),
			StartTime:       ctx.PostForm("start_time"),
			StartDate:       ctx.PostForm("start_date"),
			EndDate:         ctx.PostForm("end_date"),
			Price:           ctx.PostForm("price"),
			ImageStream:     imageStream,
			Contact:         ctx.PostForm("contact"),
			Language:        ctx.PostForm("language"),
			NumberOfTourist: ctx.PostForm("number_of_tourists"),
			Description:     ctx.PostForm("description"),
			WhatToExpect:    whatToExpect,
			Rules:           rulesMap,
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
		}

		// Validate the Images Upload field
		err = op.App.Validator.RegisterValidation("image_stream", ValidateImage)
		if err != nil {
			_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
			return
		}

		// Validate the input value with respect to their struct tags
		if err := op.App.Validator.Struct(&tour); err != nil {
			if _, ok := err.(*validator.InvalidValidationError); !ok {
				_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
				return
			}
		}

		cookieData.Set("tour_id", tour.ID)

		if err := cookieData.Save(); err != nil {
			_ = ctx.AbortWithError(http.StatusNotFound, gin.Error{Err: err})
			return
		}

		// insert the data into the database and check for error from the database
		_, err = op.DB.InsertPackage(tour)
		if err != nil {
			_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
			return
		}
		// send a successful response to the client app
		ctx.JSON(http.StatusCreated, gin.H{
			"message": "New package added successfully",
		})
	}
}

// TestTourPackage  this is a test endpoint to try parsing of a multipart form data and processing the uploaded file or data
// as a whole all at once
func (op *Operator) TestTourPackage() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if !strings.HasPrefix(ctx.Request.Header.Get("Content-Type"), "multipart/form-data") {
			_ = ctx.AbortWithError(http.StatusBadRequest, errors.New("invalid content-Type"))
			return
		}

		boundary := "travas"
		ctx.Request.Header.Set("Content-Type", fmt.Sprintf("multipart/form-data; boundary=%s", boundary))

		// Parse the incoming posted data from the client app
		if err := ctx.Request.ParseMultipartForm(int64(MEMORYMAXSIZE)); err != nil {
			_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
		}

		// Get the store cookies in user session
		cookieData := sessions.Default(ctx)
		userInfo, ok := cookieData.Get("info").(model.UserInfo)
		if !ok {
			_ = ctx.AbortWithError(http.StatusBadRequest, errors.New("invalid user info"))
			return
		}

		// Get the uploaded images from the client app
		var imageArr map[string]interface{}

		form := ctx.Request.MultipartForm

		imageArr, err := upload.MultiFile(form, "tour_image", "tour_image_data")
		if err != nil {
			_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})

		}

		wte := ctx.Request.MultipartForm.Value["what_to_expect"]
		whatToExpect := make(map[string]string)
		for i, value := range wte {
			key := fmt.Sprintf("what_to_expect_%d", i)
			whatToExpect[key] = value

		}

		rules := ctx.Request.MultipartForm.Value["rules"]
		rulesMap := make(map[string]string)
		for i, value := range rules {
			key := fmt.Sprintf("rule_%d", i)
			rulesMap[key] = value
		}

		tour := &model.Tour{
			ID:              primitive.NewObjectID(),
			OperatorID:      userInfo.ID,
			Title:           ctx.PostForm("title"),
			Destination:     strings.TrimSpace(strings.ToLower(ctx.PostForm("destination"))),
			MeetingPoint:    ctx.PostForm("meeting_point"),
			StartTime:       ctx.PostForm("start_time"),
			StartDate:       ctx.PostForm("start_date"),
			EndDate:         ctx.PostForm("end_date"),
			Price:           ctx.PostForm("price"),
			Image:           imageArr,
			Contact:         ctx.PostForm("contact"),
			Language:        ctx.PostForm("language"),
			NumberOfTourist: ctx.PostForm("number_of_tourists"),
			Description:     ctx.PostForm("description"),
			WhatToExpect:    whatToExpect,
			Rules:           rulesMap,
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
		}
	
		// Validate the Images Upload field
		err = op.App.Validator.RegisterValidation("tour_image", ValidateImage)
		if err != nil {
			_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
			return
		}

		// Validate the input value with respect to their struct tags
		if err := op.App.Validator.Struct(&tour); err != nil {
			if _, ok := err.(*validator.InvalidValidationError); !ok {
				_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
				return
			}
		}

		cookieData.Set("tour_id", tour.ID)

		if err := cookieData.Save(); err != nil {
			_ = ctx.AbortWithError(http.StatusNotFound, gin.Error{Err: err})
			return
		}
		// insert the data into the database and check for error from the database
		_, err = op.DB.InsertPackage(tour)
		if err != nil {
			_ = ctx.AbortWithError(http.StatusBadRequest, gin.Error{Err: err})
			return
		}
		// send a successful response to the client app
		ctx.JSON(http.StatusCreated, gin.H{
			"message": "New package added successfully",
		})
	}
}

// LoadTourPackage this will load all tour package created by the operator
func (op *Operator) LoadTourPackage() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Get the needed data from session cookies
		cookieData := sessions.Default(ctx)
		userInfo, ok := cookieData.Get("info").(model.UserInfo)
		if !ok {
			_ = ctx.AbortWithError(http.StatusNotFound, errors.New("cannot find tour id"))
		}

		// get all the created tour package from the tour collection
		res, err := op.DB.LoadTours(userInfo.ID)
		if err != nil {
			_ = ctx.AbortWithError(http.StatusInternalServerError, gin.Error{Err: err})
			return
		}
		ctx.JSONP(http.StatusOK, gin.H{
			"tours":   res,
			"message": "success! loading tour packages",
		})
	}
}
