package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"

	"YaskBackend/app"
)

//go:embed all:frontend
var frontFS embed.FS

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("Initialisation de l'app...")
	app := app.InitApp()
	defer app.Close()
	log.Println("App initialisée, écoute sur le port " + port)

	front, err := fs.Sub(frontFS, "frontend")
	if err != nil {
		log.Fatal(err)
	}

	// Pages HTML (mêmes URLs que l'ancien serveur Express)
	pages := map[string]string{
		"/home":   "templates/index.html",
		"/login":  "templates/login.html",
		"/signup": "templates/signup.html",
		"/error":  "templates/error.html",
	}
	for route, file := range pages {
		file := file
		http.HandleFunc(route, func(w http.ResponseWriter, r *http.Request) {
			http.ServeFileFS(w, r, front, file)
		})
	}

	// Fichiers statiques
	for _, dir := range []string{"assets", "scripts", "templates"} {
		http.Handle("/"+dir+"/", http.FileServerFS(front))
	}

	// "/" redirige vers /home
	http.HandleFunc("/{$}", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/home", http.StatusFound)
	})

	// API
	http.Handle("/api/", app.Router)

	log.Fatal(http.ListenAndServe(":"+port, nil))
}
