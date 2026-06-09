package models

type Users struct {
	Id	int     `json:"id_users"`
	Name	string  `json:"name"`
	Email	string  `json:"email"`
	Password	string  `json:"password"`
	DateCreation	int     `json:"date_creation"`
	IdRole	string  `json:"id_role"`
}