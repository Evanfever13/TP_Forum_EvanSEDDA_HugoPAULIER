package main

import (
	"log"
	"net/http"
	"os"

	"YaskBackend/app"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("Initialisation de l'app...")
	app := app.InitApp()
	defer app.Close()
	log.Println("App initialisée, écoute sur le port " + port)

	http.Handle("/api/", app.Router)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
