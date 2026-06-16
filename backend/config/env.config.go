package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	err := godotenv.Load("./.env")
	if err != nil {
		log.Println("Erreur (env.config.go) - Aucun fichier .env ")
	}
}

func GetEnv(key string) string {
	envVar, envErr := os.LookupEnv(key)
	if !envErr {
		log.Fatalf("Erreur (env.config.go) - Variable d'environnement manquante : %s", key)
	}
	return envVar
}
