package routers

import (
	"YaskBackend/controllers"

	"github.com/gorilla/mux"
)

func RegisterUsersRoutes(r *mux.Router, usersController *controllers.UsersControllers) {
	r.HandleFunc("/users", usersController.ReadAll).Methods("GET")
	r.HandleFunc("/users/{id}", usersController.ReadById).Methods("GET")
	r.HandleFunc("/users", usersController.Create).Methods("POST")
	r.HandleFunc("/users/{id}", usersController.UpdateById).Methods("PUT")
	r.HandleFunc("/users/{id}", usersController.DeleteById).Methods("DELETE")
}
