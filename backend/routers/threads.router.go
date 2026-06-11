package routers

import "github.com/gorilla/mux"
import "YaskBackend/controllers"

func RegisterThreadsRoutes(r *mux.Router, threadsController *controllers.ThreadsControllers) {
	r.HandleFunc("/threads", threadsController.ReadAll).Methods("GET")
	r.HandleFunc("/threads/{id}", threadsController.ReadById).Methods("GET")
	r.HandleFunc("/threads", threadsController.Create).Methods("POST")
	r.HandleFunc("/threads/{id}", threadsController.UpdateById).Methods("PUT")
	r.HandleFunc("/threads/{id}", threadsController.DeleteById).Methods("DELETE")
}
