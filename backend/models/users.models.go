package models

import "time"

type Users struct {
	Id           int       `json:"id_users"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	Password     string    `json:"password"`
	DateCreation time.Time `json:"date_creation"`
	IdRole       int       `json:"id_roles"`
}
