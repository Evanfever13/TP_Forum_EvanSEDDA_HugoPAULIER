package controllers

import (
	"YaskBackend/helper"
	"YaskBackend/models"
	"YaskBackend/services"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type ThreadsControllers struct {
	service *services.ThreadsService
}

func InitThreadsController(service *services.ThreadsService) *ThreadsControllers {
	return &ThreadsControllers{service: service}
}

func readThreadId(r *http.Request) (int, error) {
	return strconv.Atoi(mux.Vars(r)["id"])
}

func (c *ThreadsControllers) Create(w http.ResponseWriter, r *http.Request) {
	var newThread models.Threads
	if err := json.NewDecoder(r.Body).Decode(&newThread); err != nil {
		helper.WriteError(w, http.StatusBadRequest, "JSON invalide")
		return
	}

	threadId, productErr := c.service.Create(newThread)
	if productErr != nil {
		helper.WriteError(w, http.StatusBadRequest, productErr.Error())
		return
	}

	thread, threadErr := c.service.ReadById(threadId)
	if threadErr != nil {
		helper.WriteError(w, http.StatusInternalServerError, threadErr.Error())
		return
	}

	helper.WriteJSON(w, http.StatusCreated, thread)
}

func (c *ThreadsControllers) ReadAll(w http.ResponseWriter, r *http.Request) {
	threadList, threadErr := c.service.ReadAll()
	if threadErr != nil {
		helper.WriteError(w, http.StatusInternalServerError, threadErr.Error())
		return
	}

	helper.WriteJSON(w, http.StatusOK, threadList)
}

func (c *ThreadsControllers) ReadById(w http.ResponseWriter, r *http.Request) {
	idThread, idThreadErr := readThreadId(r)
	if idThreadErr != nil {
		helper.WriteError(w, http.StatusBadRequest, "Identifiant thread invalide")
		return
	}

	thread, threadErr := c.service.ReadById(idThread)
	if threadErr != nil {
		helper.WriteError(w, http.StatusInternalServerError, threadErr.Error())
		return
	}
	if thread.Id == 0 {
		helper.WriteError(w, http.StatusNotFound, "Le thread introuvable")
		return
	}

	helper.WriteJSON(w, http.StatusOK, thread)
}

func (c *ThreadsControllers) UpdateById(w http.ResponseWriter, r *http.Request) {
	fmt.Println("test")
	ctx := r.Context().Value("user")
	if ctx == nil {
		helper.WriteError(w, http.StatusUnauthorized, "Utilisateur non authentifié")
		return
	}
	idThread, idThreadErr := readThreadId(r)
	if idThreadErr != nil {
		helper.WriteError(w, http.StatusBadRequest, "Identifiant thread invalide")
		return
	}

	var thread models.Threads
	if err := json.NewDecoder(r.Body).Decode(&thread); err != nil {
		helper.WriteError(w, http.StatusBadRequest, "JSON invalide")
		return
	}
	thread.Id = idThread

	threadErr := c.service.UpdateById(idThread, thread, ctx.(*models.Claims).UserID, ctx.(*models.Claims).Role)
	if threadErr != nil {
		helper.WriteError(w, http.StatusBadRequest, threadErr.Error())
		return
	}

	updatedThread, threadErr := c.service.ReadById(idThread)
	if threadErr != nil {
		helper.WriteError(w, http.StatusInternalServerError, threadErr.Error())
		return
	}

	helper.WriteJSON(w, http.StatusOK, updatedThread)
}

func (c *ThreadsControllers) DeleteById(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context().Value("user")
	if ctx == nil {
		helper.WriteError(w, http.StatusUnauthorized, "Utilisateur non authentifié")
		return
	}
	idThread, idThreadErr := readThreadId(r)
	if idThreadErr != nil {
		helper.WriteError(w, http.StatusBadRequest, "Identifiant thread invalide")
		return
	}

	threadErr := c.service.DeleteById(idThread, ctx.(*models.Claims).UserID, ctx.(*models.Claims).Role)
	if threadErr != nil {
		helper.WriteError(w, http.StatusBadRequest, threadErr.Error())
		return
	}

	helper.WriteJSON(w, http.StatusOK, map[string]string{
		"message": "thread supprime",
	})
}
