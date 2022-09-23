package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/malet-pr/go-react-todo/server/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var collection *mongo.Collection

func init() {
	loadTheEnv()
	createDBInstance()
}

func loadTheEnv() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading the .env file.")
	}
}

func createDBInstance() {
	connectionString := os.Getenv("DB_URI")
	dbName := os.Getenv("DB_NAME")
	collectionName := os.Getenv("DB_COLLECTION_NAME")
	clientOptions := options.Client().ApplyURI(connectionString)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err.Error())
	}
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err.Error())
	}
	fmt.Println("Connected to MongoDB")
	collection = client.Database(dbName).Collection(collectionName)
	fmt.Println("Collection instance created")
}

func GetAllTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	payload := getAllTasks()
	json.NewEncoder(w).Encode(payload)
}
func getAllTasks() []primitive.M {
	cursor, err := collection.Find(context.Background(), bson.D{})
	if err != nil {
		log.Fatal(err.Error())
	}
	var results []primitive.M
	for cursor.Next(context.Background()) {
		var result bson.M
		e := cursor.Decode(&result)
		if e != nil {
			log.Fatal(e)
		}
		results = append(results, result)
	}
	fmt.Printf("Number of documents found: %v \n", len(results))
	return results
}

func AddTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Allow-Methods", "POST")
	w.Header().Set("Allow-Headers", "Content-Type")
	var task model.Task
	json.NewDecoder(r.Body).Decode(&task)
	task = insertOne(task)
	json.NewEncoder(w).Encode(task)
}
func insertOne(task model.Task) model.Task {
	res, err := collection.InsertOne(context.Background(), task)
	if err != nil {
		log.Fatal(err)
	}
	filter := bson.D{{Key: "_id", Value: res.InsertedID}}
	createdRecord := collection.FindOne(context.Background(), filter)
	createdTask := &model.Task{}
	createdRecord.Decode(createdTask)
	fmt.Printf("inserted document with ID %v\n", res.InsertedID)
	return *createdTask
}

func DeleteTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Allow-Methods", "DELETE")
	w.Header().Set("Allow-Headers", "Content-Type")
	params := mux.Vars(r)
	deleteTask(params["id"])
	json.NewEncoder(w).Encode(params["id"])
}
func deleteTask(s string) {
	ID, _ := primitive.ObjectIDFromHex(s)
	query := bson.D{{Key: "_id", Value: ID}}
	result, err := collection.DeleteOne(context.Background(), &query)
	if err != nil {
		log.Fatal(err.Error())
	}
	fmt.Printf("deleted %v document(s)\n", result.DeletedCount)
}

func DeleteAllTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	count := deleteAllTasks()
	json.NewEncoder(w).Encode(count)
}
func deleteAllTasks() int64 {
	res, err := collection.DeleteMany(context.Background(), bson.D{})
	if err != nil {
		log.Fatal(err.Error())
	}
	fmt.Printf("deleted %v document(s)\n", res.DeletedCount)
	return res.DeletedCount
}

func CompleteTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Allow-Methods", "PUT")
	w.Header().Set("Allow-Headers", "Content-Type")
	params := mux.Vars(r)
	taskCompleted(params["id"])
	json.NewEncoder(w).Encode(params["id"])
}
func taskCompleted(s string) {
	id, _ := primitive.ObjectIDFromHex(s)
	filter := bson.M{"_id": id}
	update := bson.M{"$set": bson.M{"completed": true}}
	_, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err.Error())
	}
	fmt.Printf("Completed task with ID = %v \n", id)
}

func UndoCompleteTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Allow-Methods", "PUT")
	w.Header().Set("Allow-Headers", "Content-Type")
	params := mux.Vars(r)
	undoCompleted(params["id"])
	json.NewEncoder(w).Encode(params["id"])
}
func undoCompleted(s string) {
	id, _ := primitive.ObjectIDFromHex(s)
	filter := bson.M{"_id": id}
	update := bson.M{"$set": bson.M{"completed": false}}
	_, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal(err.Error())
	}
	fmt.Printf("Set task with ID = %v as incomplete\n", id)
}

func EditTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Allow-Methods", "PATCH")
	w.Header().Set("Allow-Headers", "Content-Type")
	params := mux.Vars(r)
	var task model.Task
	json.NewDecoder(r.Body).Decode(&task)
	newTask := editTask(params["id"], task)
	json.NewEncoder(w).Encode(newTask)
}
func editTask(s string, t model.Task) model.Task {
	id, _ := primitive.ObjectIDFromHex(s)
	res := collection.FindOne(context.Background(), bson.M{"_id": id})
	old := &model.Task{}
	res.Decode(old)
	var title, description string
	if t.Title != "" {
		title = t.Title
	} else {
		title = old.Title
	}
	if t.Description != "" {
		description = t.Description
	} else {
		description = old.Description
	}
	updatedTask := &model.Task{Id: id, Title: title, Description: description, Completed: t.Completed}
	filter := bson.D{{Key: "_id", Value: id}}
	collection.FindOneAndReplace(context.Background(), filter, updatedTask)
	fmt.Printf("updated document with ID %v\n", id)
	return *updatedTask
}

func GetTaskById(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Allow-Methods", "GET")
	w.Header().Set("Allow-Headers", "Content-Type")
	params := mux.Vars(r)
	task := getTaskById(params["id"])
	json.NewEncoder(w).Encode(task)
}
func getTaskById(s string) model.Task {
	id, err := primitive.ObjectIDFromHex(s)
	if err != nil {
		log.Fatal(err.Error())
	}
	res := collection.FindOne(context.Background(), bson.M{"_id": id})
	task := &model.Task{}
	res.Decode(task)
	fmt.Println("found document: ", task)
	return *task
}

func GetTaskByTitle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Allow-Methods", "GET")
	w.Header().Set("Allow-Headers", "Content-Type")
	params := mux.Vars(r)
	tasks := getTaskByTitle(params["string"])
	json.NewEncoder(w).Encode(tasks)
}
func getTaskByTitle(s string) []primitive.M {
	filter := bson.M{"title": bson.M{"$regex": s, "$options": "i"}}
	cur, err := collection.Find(context.Background(), filter)
	if err != nil {
		log.Fatal(err.Error())
	}
	var results []primitive.M
	for cur.Next(context.Background()) {
		var result bson.M
		e := cur.Decode(&result)
		if e != nil {
			log.Fatal(e)
		}
		results = append(results, result)
	}
	fmt.Printf("Number of documents found: %v \n", len(results))
	return results
}
