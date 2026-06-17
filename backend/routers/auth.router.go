package routers

import (
	"YaskBackend/controllers"
	"YaskBackend/middleware"
	"net/http"

	"github.com/gorilla/mux"
)

func AuthProductRoutes(r *mux.Router, authController *controllers.AuthControllers) {
	r.HandleFunc("/login", authController.Login).Methods("POST")
	r.Handle("/me", middleware.AuthMiddleware(http.HandlerFunc(authController.Me))).Methods("GET")
}
