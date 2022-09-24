package router

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/malet-pr/go-react-todo/server/middleware"
	"github.com/rs/cors"
)

func Router() http.Handler {
	r := mux.NewRouter()
	r.HandleFunc("/api/v1/tasks/find-all", middleware.GetAllTasks).Methods("GET", "OPTIONS")
	r.HandleFunc("/api/v1/tasks/find-by-id/{id}", middleware.GetTaskById).Methods("GET", "OPTIONS")
	r.HandleFunc("/api/v1/tasks/find-by-title/{string}", middleware.GetTaskByTitle).Methods("GET", "OPTIONS")
	r.HandleFunc("/api/v1/tasks/add-task", middleware.AddTask).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/v1/tasks/edit-task/{id}", middleware.EditTask).Methods("PATCH", "OPTIONS")
	r.HandleFunc("/api/v1/tasks/delete-task/{id}", middleware.DeleteTask).Methods("DELETE", "OPTIONS")
	r.HandleFunc("/api/v1/tasks/delete-all", middleware.DeleteAllTasks).Methods("DELETE", "OPTIONS")
	r.HandleFunc("/api/v1/tasks/complete-task/{id}", middleware.CompleteTask).Methods("PUT", "OPTIONS")
	r.HandleFunc("/api/v1/tasks/undo-task/{id}", middleware.UndoCompleteTask).Methods("PUT", "OPTIONS")
	handler := cors.AllowAll().Handler(r)
	return handler
}
