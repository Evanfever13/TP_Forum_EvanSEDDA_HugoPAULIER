package controllers

import (
	"YaskBackend/dto"
	"YaskBackend/helper"
	"YaskBackend/models"
	"YaskBackend/services"
	"encoding/json"
	"net/http"
)

type AuthControllers struct {
	service *services.AuthService
}

func AuthProductController(authService *services.AuthService) *AuthControllers {
	return &AuthControllers{service: authService}
}

func (c *AuthControllers) Login(w http.ResponseWriter, r *http.Request) {
	var data dto.LoginRequestDto

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		helper.WriteError(w, http.StatusBadRequest, "JSON invalide")
		return
	}

	response, err := c.service.Login(data)
	if err != nil {
		helper.WriteError(w, http.StatusBadRequest, "Identifiants invalides")
		return
	}

	helper.WriteJSON(w, http.StatusOK, response)
}

func (c *AuthControllers) Me(w http.ResponseWriter, r *http.Request) {

	claims, ok := r.Context().Value("user").(*models.Claims)
	if !ok {
		helper.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	message := "Hello user " + claims.UserID + " with role " + claims.Role

	helper.WriteJSON(w, http.StatusOK, dto.ResponseDto{
		Code:    http.StatusOK,
		Message: message,
	})
}
