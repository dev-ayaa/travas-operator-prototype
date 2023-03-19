package mongodb

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"

	"github.com/travas-io/travas-op/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// INFO --> these methods are only meant to interact with the tour guide collection
//      --> in the database and other tour guide related queries

// InsertTourGuide : this will allow the operator to add new tour guide
func (op *OperatorDB) InsertTourGuide(tg *model.TourGuide) (bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	filter := bson.D{{Key: "_id", Value: tg.ID}}

	var res bson.M
	err := OperatorData(op.DB, "tour_guide").FindOne(ctx, filter).Decode(&res)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			_, insertErr := OperatorData(op.DB, "tour_guide").InsertOne(ctx, &tg)
			if insertErr != nil {
				op.App.Error.Fatalf("cannot add user to the database : %v ", insertErr)
			}
			return true, nil
		}
		op.App.Error.Fatal(err)
	}
	return true, nil
}

// FindTourGuide : this will help get all the register tour guide and made available for
// selection
func (op *OperatorDB) FindTourGuide(operatorID primitive.ObjectID) ([]primitive.M, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	filter := bson.D{{Key: "operator_id", Value: operatorID}}

	cursor, err := TourGuideData(op.DB, "tour_guide").Find(ctx, filter)
	if err != nil {
		op.App.Error.Fatalf("error while searching for data : %v \n", err)

	}
	defer func(cursor *mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			return
		}
	}(cursor, ctx)

	var res []bson.M
	if err := cursor.All(ctx, &res); err != nil {
		op.App.Error.Fatal(err)
	}

	return res, nil
}

// UpdateTourGuide : allow any form of update for the tour guide
func (op *OperatorDB) UpdateTourGuide(guideID string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	opt := options.Delete().SetCollation(&options.Collation{
		Locale:    "en_US",
		Strength:  1,
		CaseLevel: false,
	})
	filter := bson.D{{Key: "_id", Value: guideID}}

	_, err := TourGuideData(op.DB, "tour_guide").DeleteOne(ctx, filter, opt)
	if err != nil {
		op.App.Error.Fatal(err)
	}
	return nil
}
