package routers

import "github.com/gorilla/mux"
import "YaskBackend/controllers"

func RegisterRolesRoutes(r *mux.Router, rolesController *controllers.RolesControllers) {
	r.HandleFunc("/roles", rolesController.ReadAll).Methods("GET")
	r.HandleFunc("/roles/{id}", rolesController.ReadById).Methods("GET")
	r.HandleFunc("/roles", rolesController.Create).Methods("POST")
	r.HandleFunc("/roles/{id}", rolesController.UpdateById).Methods("PUT")
	r.HandleFunc("/roles/{id}", rolesController.DeleteById).Methods("DELETE")
}
