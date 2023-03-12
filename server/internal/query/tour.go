package query

import (
	"context"
	"time"

	"github.com/travas-io/travas-op/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// INFO --> these methods are only meant to interact with the tour collection in the database 
//      --> and the tour packages.


// InsertPackage : this will help the operator to add new create tour packages in the
// tours collection with respect to a particular operators ID
func (op *OperatorDB) InsertPackage(tour *model.Tour) (bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	filter := bson.D{
		{Key: "destination", Value: tour.Destination},
		{Key: "operator_id", Value: tour.OperatorID},
	}
	var res bson.M
	err := TourData(op.DB, "tours").FindOne(ctx, filter).Decode(&res)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			_, err := TourData(op.DB, "tours").InsertOne(ctx, tour)
			if err != nil {
				return false, err
			}
			return false, nil
		}
		op.App.InfoLogger.Printf("error while searching for data : %v ", err)
		return false, err
	}

	return true, nil
}

// LoadTours : this query method help to get all the added tour packages
func (op *OperatorDB) LoadTours(id primitive.ObjectID) ([]primitive.M, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	filter := bson.D{{Key: "operator_id", Value: id}}
	var res []bson.M

	cursor, err := TourData(op.DB, "tours").Find(ctx, filter)
	if err != nil {
		op.App.InfoLogger.Printf("error while checking for tour package : %v ", err)
		return []bson.M{}, err
	}

	defer func(cursor *mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			return
		}
	}(cursor, ctx)

	if err := cursor.All(ctx, &res); err != nil {
		return nil, err
	}

	if err := cursor.Err(); err != nil {
		op.App.InfoLogger.Printf("error while searching for data : %v ", err)
		return nil, err
	}
	return res, nil
}

/*
func (op *OperatorDB) InsertPackage(id primitive.ObjectID, file []map[string]any) (primitive.ObjectID, bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()
	// filter := bson.D{{Key: "tour_image", Value: tour.Destination}, {Key: "operator_id", Value: tour.OperatorID}}

	filter := bson.D{{Key: "operator_id", Value: id}, {Key: "tour_image", Value: file}}
	var res bson.M
	err := TourData(op.DB, "tours").FindOne(ctx, filter).Decode(&res)
	if err != nil {
		if err == mongo.ErrNoDocuments {

			doc := bson.D{
				{Key: "operator_id", Value: id},
				{Key: "tour_image", Value: file},
			}

			insertRes, err := TourData(op.DB, "tours").InsertOne(ctx, doc)
			if err != nil {
				return primitive.NilObjectID, false, err
			}
			fmt.Println(insertRes)
			insertID := insertRes.InsertedID.(primitive.ObjectID)
			return insertID, true, nil
		}
		op.App.ErrorLogger.Fatalf("error while searching for data : %v ", err)
	}

	return res["_id"].(primitive.ObjectID), true, nil
}
*/
