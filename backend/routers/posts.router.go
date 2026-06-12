package routers

import "github.com/gorilla/mux"
import "YaskBackend/controllers"

func RegisterPostsRoutes(r *mux.Router, postsController *controllers.PostsControllers) {
	r.HandleFunc("/posts", postsController.ReadAll).Methods("GET")
	r.HandleFunc("/posts/{id}", postsController.ReadById).Methods("GET")
	r.HandleFunc("/posts", postsController.Create).Methods("POST")
	r.HandleFunc("/posts/{id}", postsController.UpdateById).Methods("PUT")
	r.HandleFunc("/posts/{id}", postsController.DeleteById).Methods("DELETE")
}
