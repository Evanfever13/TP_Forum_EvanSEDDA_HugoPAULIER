package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"

	"YaskBackend/app"
)

//go:embed all:dist
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

	dist, err := fs.Sub(frontFS, "dist")
	if err != nil {
		log.Fatal(err)
	}
	fileServer := http.FileServer(http.FS(dist))

	http.Handle("/api/", app.Router)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := strings.TrimPrefix(r.URL.Path, "/")
		if path == "" {
			path = "index.html"
		}
		// Si le fichier n'existe pas, on renvoie index.html (routes du front)
		if _, err := fs.Stat(dist, path); err != nil {
			r.URL.Path = "/"
		}
		fileServer.ServeHTTP(w, r)
	})

	log.Fatal(http.ListenAndServe(":"+port, nil))
}
