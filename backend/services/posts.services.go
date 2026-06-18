package services

import (
	"YaskBackend/models"
	"YaskBackend/repositories"
	"fmt"
)

type PostsService struct {
	PostsRepository *repositories.PostsRepository
}

func InitPostsService(postsRepository *repositories.PostsRepository) *PostsService {
	return &PostsService{PostsRepository: postsRepository}
}

func (s *PostsService) Create(posts models.Posts) (int, error) {
	if posts.Posts == "" {
			return -1, fmt.Errorf(" Erreur ajout post - Données manquantes ou invalides")
	}

	postId, postErr := s.PostsRepository.CreatePost(posts)
	if postErr != nil {
		return -1, postErr
	}

	return postId, nil
}

func (s *PostsService) ReadAll() ([]models.Posts, error) {
	postsList, postsErr := s.PostsRepository.ReadAll()
	if postsErr != nil {
		return nil, postsErr
	}

	return postsList, nil
}

func (s *PostsService) ReadById(idPost int) (models.Posts, error) {
	if idPost < 0 {
		return models.Posts{}, fmt.Errorf(" Erreur récupération post - identifiant invalide : %d", idPost)
	}

	posts, postsErr := s.PostsRepository.ReadById(idPost)
	if postsErr != nil {
		return models.Posts{}, postsErr
	}

	return posts, nil
}

func (s *PostsService) UpdateById(posts models.Posts, userId int, userRole string) error {
	if posts.Posts == "" {
		return fmt.Errorf(" Erreur modification post - Donnees manquantes ou invalides")
	}

	if posts.IdUsers != userId && userRole != "admin" {
		return fmt.Errorf("Vous n'avez pas les droits pour modifier ce fil")
	}

	return s.PostsRepository.UpdatePostById(posts)
}

func (s *PostsService) DeleteById(idPost int, userId int, userRole string) error {
	posts, postsErr := s.PostsRepository.ReadById(idPost)
	if postsErr != nil {
		return postsErr
	}

	if idPost < 0 {
		return fmt.Errorf(" Erreur suppression post - identifiant invalide : %d", idPost)
	}

	if posts.IdUsers != userId && userRole != "admin" {
		return fmt.Errorf("Vous n'avez pas les droits pour modifier ce fil")
	}

	return s.PostsRepository.DeletePostById(idPost)
}
