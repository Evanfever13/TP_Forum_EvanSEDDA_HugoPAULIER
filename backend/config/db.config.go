package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

func InitDB() *sql.DB {

	user := GetEnv("DB_USER")
	pwd := GetEnv("DB_PWD")
	host := GetEnv("DB_HOST")
	port := GetEnv("DB_PORT")
	name := GetEnv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&timeout=10s", user, pwd, host, port, name)

	// Sur Scalingo, ajouter la variable DB_TLS=skip-verify
	if tls, ok := os.LookupEnv("DB_TLS"); ok && tls != "" {
		dsn += "&tls=" + tls
	}

	dbContext, dbContextErr := sql.Open("mysql", dsn)
	if dbContextErr != nil {
		log.Fatalf("Erreur (db.config.go) - Connection base de donnees : %s", dbContextErr.Error())
	}

	pingErr := dbContext.Ping()
	if pingErr != nil {
		dbContext.Close()
		log.Fatalf("Erreur (db.config.go) - Ping base de donnees : %s", pingErr.Error())
	}

	log.Printf("BDD - Connexion reussie")
	return dbContext
}
