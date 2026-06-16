package routers

import "github.com/gorilla/mux"
import "YaskBackend/controllers"

func RegisterVotesRoutes(r *mux.Router, voteController *controllers.VotesControllers) {
	r.HandleFunc("/votes", voteController.ReadAll).Methods("GET")
	r.HandleFunc("/votes/{id}", voteController.ReadById).Methods("GET")
	r.HandleFunc("/votes", voteController.Create).Methods("POST")
	r.HandleFunc("/votes/{id}", voteController.UpdateById).Methods("PUT")
	r.HandleFunc("/votes/{id}", voteController.DeleteById).Methods("DELETE")
}
