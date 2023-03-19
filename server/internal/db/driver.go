package db

import (
	"context"
	"github.com/travas-io/travas-op/pkg/config"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var app = config.NewLogger()

func SetConnection(uri string) (*mongo.Client, error) {
	serverAPIOptions := options.ServerAPI(options.ServerAPIVersion1)

	ctx, cancelCtx := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancelCtx()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri).SetServerAPIOptions(serverAPIOptions))
	if err != nil {
		app.Error.Panicln(err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		app.Error.Fatalln(err)
	}

	return client, nil
}

func OpenConnection() *mongo.Client {
	uri := os.Getenv("TRAVAS_DB_URI")

	count := 0
	for {
		client, err := SetConnection(uri)
		if err != nil {
			app.Info.Println("MongoDB not yet ready to connect ...")
			count++

		} else {
			app.Info.Println("Connecting to MongoDB Atlas ...")
			return client
		}
		if count >= 10 {
			app.Info.Println(err)
			return nil
		}
		app.Info.Println("Trying to reconnect MongoDB database ...")
		time.Sleep(5 * time.Second)
		continue
	}
}
