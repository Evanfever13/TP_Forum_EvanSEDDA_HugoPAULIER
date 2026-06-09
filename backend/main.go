package main

import (
	"net/http"

	"YaskBackend/app"
)

func main() {
	app := app.InitApp()
	defer app.Close()

	http.Handle("/api/", app.Router)
	http.ListenAndServe(":8080", nil)
}