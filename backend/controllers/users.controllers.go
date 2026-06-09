package controllers

import (
	"YaskBackend/helper"
	"YaskBackend/models"
	"YaskBackend/services"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type UsersControllers struct {
	service *services.UsersService
}

func InitUsersController(service *services.UsersService) *UsersControllers {
	return &UsersControllers{service: service}
}

func readUserId(r *http.Request) (int, error) {
	return strconv.Atoi(mux.Vars(r)["id"])
}

func (c *UsersControllers) Create(w http.ResponseWriter, r *http.Request) {
	var newProduct models.Users
	if err := json.NewDecoder(r.Body).Decode(&newProduct); err != nil {
		helper.WriteError(w, http.StatusBadRequest, "JSON invalide")
		return
	}

	productId, productErr := c.service.Create(newProduct)
	if productErr != nil {
		helper.WriteError(w, http.StatusBadRequest, productErr.Error())
		return
	}

	product, productErr := c.service.ReadById(productId)
	if productErr != nil {
		helper.WriteError(w, http.StatusInternalServerError, productErr.Error())
		return
	}

	helper.WriteJSON(w, http.StatusCreated, product)
}

func (c *UsersControllers) ReadAll(w http.ResponseWriter, r *http.Request) {
	productList, productErr := c.service.ReadAll()
	if productErr != nil {
		helper.WriteError(w, http.StatusInternalServerError, productErr.Error())
		return
	}

	helper.WriteJSON(w, http.StatusOK, productList)
}

func (c *UsersControllers) ReadById(w http.ResponseWriter, r *http.Request) {
	idUser, idUserErr := readUserId(r)
	if idUserErr != nil {
		helper.WriteError(w, http.StatusBadRequest, "Identifiant utlisateur invalide")
		return
	}

	product, productErr := c.service.ReadById(idUser)
	if productErr != nil {
		helper.WriteError(w, http.StatusInternalServerError, productErr.Error())
		return
	}
	if product.Id == 0 {
		helper.WriteError(w, http.StatusNotFound, "L'utlisateur introuvable")
		return
	}

	helper.WriteJSON(w, http.StatusOK, product)
}

func (c *UsersControllers) UpdateById(w http.ResponseWriter, r *http.Request) {
	idUser, idUserErr := readUserId(r)
	if idUserErr != nil {
		helper.WriteError(w, http.StatusBadRequest, "Identifiant utlisateur invalide")
		return
	}

	var product models.Users
	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		helper.WriteError(w, http.StatusBadRequest, "JSON invalide")
		return
	}
	product.Id = idUser

	productErr := c.service.UpdateById(product)
	if productErr != nil {
		helper.WriteError(w, http.StatusBadRequest, productErr.Error())
		return
	}

	updatedProduct, productErr := c.service.ReadById(idUser)
	if productErr != nil {
		helper.WriteError(w, http.StatusInternalServerError, productErr.Error())
		return
	}

	helper.WriteJSON(w, http.StatusOK, updatedProduct)
}

func (c *UsersControllers) DeleteById(w http.ResponseWriter, r *http.Request) {
	idUser, idUserErr := readUserId(r)
	if idUserErr != nil {
		helper.WriteError(w, http.StatusBadRequest, "Identifiant utlisateur invalide")
		return
	}

	productErr := c.service.DeleteById(idUser)
	if productErr != nil {
		helper.WriteError(w, http.StatusBadRequest, productErr.Error())
		return
	}

	helper.WriteJSON(w, http.StatusOK, map[string]string{
		"message": "utlisateur supprime",
	})
}
