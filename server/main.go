package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/malet-pr/go-react-todo/server/router"
)

func main() {
	handler := router.Router()
	fmt.Printf("Starting server at port 9000\n")
	if err := http.ListenAndServe(":9000", handler); err != nil {
		log.Fatal(err)
	}
}
