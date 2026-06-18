package routers

import (
	"YaskBackend/controllers"
	"YaskBackend/middleware"
	"net/http"

	"github.com/gorilla/mux"
)

func RegisterRolesRoutes(r *mux.Router, rolesController *controllers.RolesControllers) {
	r.Handle("/roles", middleware.AuthMiddleware(middleware.IsAdminMiddleware(http.HandlerFunc(rolesController.ReadAll)))).Methods("GET")
	r.Handle("/roles/{id}", middleware.AuthMiddleware(middleware.IsAdminMiddleware(http.HandlerFunc(rolesController.ReadById)))).Methods("GET")
	r.Handle("/roles", middleware.AuthMiddleware(middleware.IsAdminMiddleware(http.HandlerFunc(rolesController.Create)))).Methods("POST")
	r.Handle("/roles/{id}", middleware.AuthMiddleware(middleware.IsAdminMiddleware(http.HandlerFunc(rolesController.UpdateById)))).Methods("PUT")
	r.Handle("/roles/{id}", middleware.AuthMiddleware(middleware.IsAdminMiddleware(http.HandlerFunc(rolesController.DeleteById)))).Methods("DELETE")
}
