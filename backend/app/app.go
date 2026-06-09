package app

import (
	"database/sql"

	"YaskBackend/config"
	"YaskBackend/controllers"
	"YaskBackend/repositories"
	"YaskBackend/routers"
	"YaskBackend/services"

	"github.com/gorilla/mux"
)

type App struct {
	Db     *sql.DB
	Router *mux.Router
}

func InitApp() *App {
	
	config.LoadEnv()

	db := config.InitDB()

	usersRepository := repositories.InitUsersRepository(db)
	usersService := services.InitUsersService(usersRepository)
	usersController := controllers.InitUsersController(usersService)

	router := mux.NewRouter().PathPrefix("/api").Subrouter()
	routers.RegisterUsersRoutes(router, usersController)

	return &App{Db: db,Router: router}
}

func (a *App) Close() {
	if a.Db != nil {
		a.Db.Close()
	}
}
