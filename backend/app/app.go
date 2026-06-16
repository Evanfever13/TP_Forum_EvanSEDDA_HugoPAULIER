package app

import (
	"database/sql"

	"YaskBackend/auth"
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
	auth.InitSecret()

	db := config.InitDB()

	usersRepository := repositories.InitUsersRepository(db)
	postsRepository := repositories.InitPostsRepository(db)
	votesRepository := repositories.InitVotesRepository(db)
	threadsRepository := repositories.InitThreadsRepository(db)
	rolesRepository := repositories.InitRolesRepository(db)

	usersService := services.InitUsersService(usersRepository)
	postsService := services.InitPostsService(postsRepository)
	votesService := services.InitVotesService(votesRepository)
	threadsService := services.InitThreadsService(threadsRepository)
	rolesService := services.InitRolesService(rolesRepository)

	usersController := controllers.InitUsersController(usersService)
	postsController := controllers.InitPostsController(postsService)
	votesController := controllers.InitVotesController(votesService)
	threadsController := controllers.InitThreadsController(threadsService)
	rolesController := controllers.InitRolesController(rolesService)

	router := mux.NewRouter().PathPrefix("/api").Subrouter()

	routers.RegisterUsersRoutes(router, usersController)
	routers.RegisterPostsRoutes(router, postsController)
	routers.RegisterVotesRoutes(router, votesController)
	routers.RegisterThreadsRoutes(router, threadsController)
	routers.RegisterRolesRoutes(router, rolesController)

	return &App{Db: db, Router: router}
}

func (a *App) Close() {
	if a.Db != nil {
		a.Db.Close()
	}
}
