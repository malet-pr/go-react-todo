package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Task struct {
	Id          primitive.ObjectID `json:"id,omitempty"  bson:"_id,omitempty"`
	Title       string             `json:"title,omitempty"`
	Description string             `json:"description"`
	Completed   bool               `json:"completed,omitempty"`
}
