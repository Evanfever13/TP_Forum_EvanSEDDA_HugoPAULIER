package routers

import (
	"YaskBackend/controllers"
	"YaskBackend/middleware"
	"net/http"

	"github.com/gorilla/mux"
)

func RegisterThreadsRoutes(r *mux.Router, threadsController *controllers.ThreadsControllers) {
	r.HandleFunc("/threads", threadsController.ReadAll).Methods("GET")
	r.HandleFunc("/threads/{id}", threadsController.ReadById).Methods("GET")
	r.Handle("/threads", middleware.AuthMiddleware(http.HandlerFunc(threadsController.Create))).Methods("POST")
	r.Handle("/threads/{id}", middleware.AuthMiddleware(http.HandlerFunc(threadsController.UpdateById))).Methods("PUT")
	r.Handle("/threads/{id}", middleware.AuthMiddleware(http.HandlerFunc(threadsController.DeleteById))).Methods("DELETE")
}
