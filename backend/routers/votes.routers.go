package routers

import (
	"YaskBackend/controllers"
	"YaskBackend/middleware"
	"net/http"

	"github.com/gorilla/mux"
)

func RegisterVotesRoutes(r *mux.Router, voteController *controllers.VotesControllers) {
	r.HandleFunc("/votes", voteController.ReadAll).Methods("GET")
	r.HandleFunc("/votes/{id}", voteController.ReadById).Methods("GET")
	r.Handle("/votes", middleware.AuthMiddleware(http.HandlerFunc(voteController.Create))).Methods("POST")
	r.Handle("/votes/{id}", middleware.AuthMiddleware(http.HandlerFunc(voteController.UpdateById))).Methods("PUT")
	r.Handle("/votes/{id}", middleware.AuthMiddleware(http.HandlerFunc(voteController.DeleteById))).Methods("DELETE")
}
