package models

type Users struct {
	Id	int     `json:"id_users"`
	Name	string  `json:"name"`
	Email	string  `json:"email"`
	Password	string  `json:"password"`
	DateCreation	string     `json:"date_creation"`
	IdRole	int  `json:"id_role"`
}