package routers

import (
	"YaskBackend/controllers"
	"YaskBackend/middleware"
	"net/http"

	"github.com/gorilla/mux"
)

func RegisterUsersRoutes(r *mux.Router, usersController *controllers.UsersControllers) {
	r.HandleFunc("/users", usersController.ReadAll).Methods("GET")
	r.HandleFunc("/users/{id}", usersController.ReadById).Methods("GET")
	r.HandleFunc("/users", http.HandlerFunc(usersController.Create)).Methods("POST")
	r.Handle("/users/{id}", middleware.AuthMiddleware(http.HandlerFunc(usersController.UpdateById))).Methods("PUT")
	r.Handle("/users/{id}", middleware.AuthMiddleware(middleware.IsAdminMiddleware(http.HandlerFunc(usersController.DeleteById)))).Methods("DELETE")
}
