package services

import (
	"YaskBackend/models"
	"YaskBackend/repositories"
	"fmt"
)

type PostsService struct {
	PostsRepository *repositories.PostRepository
}

func InitPostsService(postsRepository *repositories.PostRepository) *PostsService {
	return &PostsService{PostsRepository: postsRepository}
}

func (s *PostsService) Create(posts models.Posts) (int, error) {
	if posts.Id <= 0 || posts.Name == "" {
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
	if idPost <= 0 {
		return models.Posts{}, fmt.Errorf(" Erreur récupération post - identifiant invalide : %d", idPost)
	}

	posts, postsErr := s.PostsRepository.ReadById(idPost)
	if postsErr != nil {
		return models.Posts{}, postsErr
	}

	return posts, nil
}

func (s *PostsService) UpdateById(posts models.Posts) error {
	if posts.Id <= 0 || posts.Name == "" {
		return fmt.Errorf(" Erreur modification post - Donnees manquantes ou invalides")
	}

	return s.PostsRepository.UpdatePostById(posts)
}

func (s *PostsService) DeleteById(idPost int) error {
	if idPost <= 0 {
		return fmt.Errorf(" Erreur suppression post - identifiant invalide : %d", idPost)
	}

	return s.PostsRepository.DeletePostById(idPost)
}
