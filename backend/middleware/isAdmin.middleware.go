package middleware

import (
	"YaskBackend/helper"
	"YaskBackend/models"
	"net/http"
)

func IsAdminMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, claimsErr := r.Context().Value("user").(*models.Claims)
		if !claimsErr {
			helper.WriteError(w, http.StatusUnauthorized, "unauthorized")
			return
		}

		if claims.Role != "admin" {
			helper.WriteError(w, http.StatusForbidden, "forbidden")
			return
		}

		next.ServeHTTP(w, r)
	})
}
