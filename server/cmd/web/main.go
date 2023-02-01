package main

import (
	"context"
	"encoding/gob"
	"log"
	"os"
	"os/signal"

	"github.com/go-playground/validator/v10"
	"github.com/travas-io/travas-op/db"
	"github.com/travas-io/travas-op/internal/config"
	"github.com/travas-io/travas-op/internal/controller"
	"github.com/travas-io/travas-op/model"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var app config.Tools

var validate *validator.Validate

func main() {
	gob.Register(model.UserInfo{})
	gob.Register(model.Operator{})
	gob.Register(model.Tour{})
	gob.Register(model.UserInfo{})
	gob.Register(primitive.ObjectID{})
	err := godotenv.Load()
	if err != nil {
		app.ErrorLogger.Fatalf("cannot load up the env file : %v", err)
	}

	validate = validator.New()
	ErrorLogger := log.New(os.Stdout, "", log.LstdFlags|log.Lshortfile)
	InfoLogger := log.New(os.Stdout, "", log.LstdFlags|log.Lshortfile)

	app.ErrorLogger = ErrorLogger
	app.InfoLogger = InfoLogger
	app.Validator = validate

	app.InfoLogger.Println("*---------- Connecting to the travas cloud database --------")

	client := db.OpenConnection()
	if client == nil {
		app.ErrorLogger.Panic("cannot connect to the database")
	}
	// close database connection
	defer func(client *mongo.Client, ctx context.Context) {
		_ = client.Disconnect(ctx)
	}(client, context.TODO())

	app.InfoLogger.Println("*---------- Starting Travas Web Server -----------*")

	gin.SetMode(gin.ReleaseMode)
	
	router := gin.New()

	err = router.SetTrustedProxies([]string{"127.0.0.1"})
	

	if err != nil {
		app.ErrorLogger.Fatalf("untrusted proxy address : %v", err)
	}

	handler := controller.NewOperator(&app, client)
	Routes(router, *handler)

	app.InfoLogger.Println("*---------- Starting Travas Web Server -----------*")

	c := make(chan os.Signal, 1)

	go func() {
		err := router.Run()
		if err != nil {
			app.ErrorLogger.Fatalf("cannot start the server : %v", err)
		}
	}()

	signal.Notify(c, os.Interrupt)
	<-c
	app.InfoLogger.Println("*---------- End of Travas Web Server Program -----------*")
}
