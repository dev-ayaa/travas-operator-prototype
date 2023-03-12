package query

import "go.mongodb.org/mongo-driver/mongo"

// OperatorData : function to get connected to operator collection in the database
func OperatorData(db *mongo.Client, collection string) *mongo.Collection {
	var operators = db.Database("travasdb").Collection(collection)
	return operators
}

// TourData : function to get connected to tours collection in the database
func TourData(db *mongo.Client, collection string) *mongo.Collection {
	var tours = db.Database("travasdb").Collection(collection)
	return tours
}

// TourGuideData : function to get connected to tour guide collection in the database
func TourGuideData(db *mongo.Client, collection string) *mongo.Collection {
	var guide = db.Database("travasdb").Collection(collection)
	return guide
}

// TouristsData : function to get connected to tourist collection in the database
func TouristsData(db *mongo.Client, collection string) *mongo.Collection {
	var touristData = db.Database("travasdb").Collection(collection)
	return touristData
}
