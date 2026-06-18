package routers

import (
	"YaskBackend/controllers"
	"YaskBackend/middleware"
	"net/http"

	"github.com/gorilla/mux"
)

func RegisterPostsRoutes(r *mux.Router, postsController *controllers.PostsControllers) {
	r.HandleFunc("/posts", postsController.ReadAll).Methods("GET")
	r.HandleFunc("/posts/{id}", postsController.ReadById).Methods("GET")
	r.Handle("/posts", middleware.AuthMiddleware(http.HandlerFunc(postsController.Create))).Methods("POST")
	r.Handle("/posts/{id}", middleware.AuthMiddleware(http.HandlerFunc(postsController.UpdateById))).Methods("PUT")
	r.Handle("/posts/{id}", middleware.AuthMiddleware(http.HandlerFunc(postsController.DeleteById))).Methods("DELETE")
}
