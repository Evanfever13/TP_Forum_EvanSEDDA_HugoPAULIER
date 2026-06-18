package services

import (
	"YaskBackend/models"
	"YaskBackend/repositories"
	"fmt"
)

type ThreadsService struct {
	ThreadsRepository *repositories.ThreadsRepository
}

func InitThreadsService(threadsRepository *repositories.ThreadsRepository) *ThreadsService {
	return &ThreadsService{ThreadsRepository: threadsRepository}
}

func (s *ThreadsService) Create(thread models.Threads) (int, error) {

	threadId, threadErr := s.ThreadsRepository.CreateThread(thread)
	if threadErr != nil {
		return -1, threadErr
	}

	return threadId, nil
}

func (s *ThreadsService) ReadAll() ([]models.Threads, error) {
	threadsList, threadsErr := s.ThreadsRepository.ReadAll()
	if threadsErr != nil {
		return nil, threadsErr
	}

	return threadsList, nil
}

func (s *ThreadsService) ReadById(idThread int) (models.Threads, error) {
	if idThread <= 0 {
		return models.Threads{}, fmt.Errorf(" Erreur récupération fil - identifiant invalide : %d", idThread)
	}

	threads, threadsErr := s.ThreadsRepository.ReadById(idThread)
	if threadsErr != nil {
		return models.Threads{}, threadsErr
	}

	return threads, nil
}

func (s *ThreadsService) UpdateById(idThread int, thread models.Threads, userId int, userRole string) error {
	thread, threadErr := s.ThreadsRepository.ReadById(idThread)
	if threadErr != nil {
		return threadErr
	}

	if thread.IdUsers != userId && userRole != "admin" {
		return fmt.Errorf("Vous n'avez pas les droits pour modifier ce fil")
	}

	return s.ThreadsRepository.UpdateThreadById(thread)
}

func (s *ThreadsService) DeleteById(idThread int, userId int, userRole string) error {
	thread, threadErr := s.ThreadsRepository.ReadById(idThread)
	if threadErr != nil {
		return threadErr
	}

	if thread.IdUsers != userId && userRole != "admin" {
		return fmt.Errorf("Vous n'avez pas les droits pour supprimer ce fil")
	}

	return s.ThreadsRepository.DeleteThreadById(idThread)
}
