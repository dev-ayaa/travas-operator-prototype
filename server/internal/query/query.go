package query

import (
	"context"
	"errors"
	"regexp"
	"time"

	"github.com/travas-io/travas-op/internal/config"
	"github.com/travas-io/travas-op/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// INFO --> These files hold the main setup for the database queries methods for operator collection in the database
//      -->  other collections


type OperatorDB struct {
	App *config.Tools
	DB  *mongo.Client
}

func NewOperatorDB(app *config.Tools, db *mongo.Client) Repo {
	return &OperatorDB{
		App: app,
		DB:  db,
	}
}

// InsertUser : this will check for existing user and also insert new to the operator collection
func (op *OperatorDB) InsertUser(user *model.Operator) (bool, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	regMail := regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
	ok := regMail.MatchString(user.Email)
	if !ok {
		op.App.ErrorLogger.Println("invalid registered details")
		return false, 0, errors.New("invalid registered details")
	}

	filter := bson.D{{Key: "email", Value: user.Email}}

	var res bson.M
	err := OperatorData(op.DB, "operators").FindOne(ctx, filter).Decode(&res)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			user.ID = primitive.NewObjectID()
			_, insertErr := OperatorData(op.DB, "operators").InsertOne(ctx, user)
			if insertErr != nil {
				op.App.ErrorLogger.Fatalf("cannot add user to the database : %v ", insertErr)
			}
			return true, 1, nil
		}
		op.App.ErrorLogger.Fatal(err)
	}
	return true, 2, nil
}

// VerifyUser : this method will verify the user login details store in the database
// and compare with the input details
func (op *OperatorDB) VerifyUser(email string) (primitive.M, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	var res bson.M

	filter := bson.D{{Key: "email", Value: email}}
	err := OperatorData(op.DB, "operators").FindOne(ctx, filter).Decode(&res)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			op.App.ErrorLogger.Println("no document found for this query")
			return nil, err
		}
		op.App.ErrorLogger.Fatalf("cannot execute the database query perfectly : %v ", err)
	}

	return res, nil
}

func (op *OperatorDB) UpdateInfo(userID primitive.ObjectID, tk map[string]string) (bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	filter := bson.D{{Key: "_id", Value: userID}}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "token", Value: tk["t1"]}, {Key: "new_token", Value: tk["t2"]}}}}

	_, err := OperatorData(op.DB, "operators").UpdateOne(ctx, filter, update)
	if err != nil {
		return false, err
	}
	return true, nil
}

// ValidTourRequest This query below is to get all the valid tour requested by the tourist
func (op *OperatorDB) ValidTourRequest() ([]primitive.M, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	filter := bson.D{{}}
	cursor, err := TouristsData(op.DB, "tourists").Find(ctx, filter)
	if err != nil {
		op.App.ErrorLogger.Fatal(err)
	}

	defer func(cursor *mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			return
		}
	}(cursor, ctx)

	var tourist []bson.M
	if err = cursor.All(ctx, &tourist); err != nil {
		op.App.ErrorLogger.Fatal(err)
	}
	var validReq []primitive.M
	var rqTours []primitive.M
	for _, t := range tourist {
		rq := t["request_tour"].(primitive.A)
		for _, r := range rq {
			v := r.(primitive.M)
			date, _ := time.Parse("2006-01-02", v["start_time"].(string))
			currentDate, _ := time.Parse("2006-01-02", time.Now().Format("2006-01-02"))
			if currentDate.Before(date) {
				newReq := map[string]interface{}{
					"first_name":   t["first_name"],
					"last_name":    t["last_name"],
					"request_tour": append(rqTours, v),
				}
				validReq = append(validReq, newReq)
			}
		}

	}

	return validReq, nil
}
