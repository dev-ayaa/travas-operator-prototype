package main

import (
	"context"
	"encoding/gob"
	"github.com/travas-io/travas-op/internal/db"
	"github.com/travas-io/travas-op/pkg/config"
	"os"
	"os/signal"

	"github.com/travas-io/travas-op/internal/controller"
	"github.com/travas-io/travas-op/model"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func main() {
	app := config.NewLogger()

	gob.Register(model.UserInfo{})
	gob.Register(model.Operator{})
	gob.Register(model.Tour{})
	gob.Register(model.UserInfo{})
	gob.Register(primitive.ObjectID{})

	err := godotenv.Load()
	if err != nil {
		app.Error.Fatalf("cannot load up the env file : %v", err)
	}

	app.Info.Println("*---------- Connecting to the travas cloud database --------")

	client := db.OpenConnection()
	if client == nil {
		app.Error.Panic("cannot connect to the database")
	}
	// close database connection
	defer func(client *mongo.Client, ctx context.Context) {
		_ = client.Disconnect(ctx)
	}(client, context.TODO())

	app.Info.Println("*---------- Starting Travas Web Server -----------*")

	gin.SetMode(gin.ReleaseMode)
	router := gin.New()

	err = router.SetTrustedProxies([]string{"127.0.0.1"})
	if err != nil {
		app.Error.Fatalf("untrusted proxy address : %v", err)
	}

	srv := controller.NewOperator(app, client)
	Routes(router, srv)

	app.Info.Println("*---------- Starting Travas Web Server -----------*")

	// Exiting the service appropriately
	c := make(chan os.Signal, 1)

	go func() {
		err := router.Run()
		if err != nil {
			app.Error.Fatalf("cannot start the server : %v", err)
		}
	}()

	signal.Notify(c, os.Interrupt)
	<-c
	app.Info.Println("*---------- End of Travas Web Server Program -----------*")
}
