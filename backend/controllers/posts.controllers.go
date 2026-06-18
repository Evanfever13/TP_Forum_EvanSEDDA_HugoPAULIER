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

type PostsControllers struct {
	service *services.PostsService
}

func InitPostsController(service *services.PostsService) *PostsControllers {
	return &PostsControllers{service: service}
}

func readPostId(r *http.Request) (int, error) {
	return strconv.Atoi(mux.Vars(r)["id"])
}

func (c *PostsControllers) Create(w http.ResponseWriter, r *http.Request) {
	var newProduct models.Posts
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

func (c *PostsControllers) ReadAll(w http.ResponseWriter, r *http.Request) {
	productList, productErr := c.service.ReadAll()
	if productErr != nil {
		helper.WriteError(w, http.StatusInternalServerError, productErr.Error())
		return
	}

	helper.WriteJSON(w, http.StatusOK, productList)
}

func (c *PostsControllers) ReadById(w http.ResponseWriter, r *http.Request) {
	idPost, idPostErr := readPostId(r)
	if idPostErr != nil {
		helper.WriteError(w, http.StatusBadRequest, "Identifiant post invalide")
		return
	}

	product, productErr := c.service.ReadById(idPost)
	if productErr != nil {
		helper.WriteError(w, http.StatusInternalServerError, productErr.Error())
		return
	}
	if product.Id == 0 {
		helper.WriteError(w, http.StatusNotFound, "Le post introuvable")
		return
	}

	helper.WriteJSON(w, http.StatusOK, product)
}

func (c *PostsControllers) UpdateById(w http.ResponseWriter, r *http.Request) {
	idPost, idPostErr := readPostId(r)
	if idPostErr != nil {
		helper.WriteError(w, http.StatusBadRequest, "Identifiant post invalide")
		return
	}

	var product models.Posts
	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		helper.WriteError(w, http.StatusBadRequest, "JSON invalide")
		return
	}
	product.Id = idPost

	ctx := r.Context().Value("user")
	productErr := c.service.UpdateById(product, ctx.(int), ctx.(string))
	if productErr != nil {
		helper.WriteError(w, http.StatusBadRequest, productErr.Error())
		return
	}

	updatedProduct, productErr := c.service.ReadById(idPost)
	if productErr != nil {
		helper.WriteError(w, http.StatusInternalServerError, productErr.Error())
		return
	}

	helper.WriteJSON(w, http.StatusOK, updatedProduct)
}

func (c *PostsControllers) DeleteById(w http.ResponseWriter, r *http.Request) {
	idPost, idPostErr := readPostId(r)
	if idPostErr != nil {
		helper.WriteError(w, http.StatusBadRequest, "Identifiant post invalide")
		return
	}

	ctx := r.Context().Value("user")
	productErr := c.service.DeleteById(idPost, ctx.(int), ctx.(string))
	if productErr != nil {
		helper.WriteError(w, http.StatusBadRequest, productErr.Error())
		return
	}

	helper.WriteJSON(w, http.StatusOK, map[string]string{
		"message": "post supprime",
	})
}
