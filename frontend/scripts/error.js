const container = document.querySelector("#erreur");

// Récupération du code dans l’URL
const params = new URLSearchParams(window.location.search);
const code = params.get("code") || "000";

// Création du wrapper
const box = document.createElement("div");
box.className = "error-box";

// Titre
const title = document.createElement("h1");
title.className = "error-title";
title.textContent = `Erreur ${code}`;

// Message selon le code
const message = document.createElement("p");
message.className = "error-message";

switch (code) {
    case "404":
        message.textContent = "La page demandée est introuvable.";
        break;
    case "500":
        message.textContent = "Le serveur a rencontré un problème.";
        break;
    case "403":
        message.textContent = "Vous n'avez pas la permission d'accéder à cette ressource.";
        break;
    case "401":
        message.textContent = "Vous devez être connecté pour accéder à cette page.";
        break;
    default:
        message.textContent = "Une erreur inconnue est survenue.";
}

// Image HTTP Cats
const img = document.createElement("img");
img.className = "error-img";
img.src = `https://http.cat/${code}.jpg`;
img.alt = `Erreur ${code}`;

// Bouton retour
const button = document.createElement("button");
button.id = "back-home";
button.textContent = "Retour à l’accueil";

button.addEventListener("click", () => {
    window.location.href = "/home";
});

// Injection dans la page
box.appendChild(title);
box.appendChild(message);
box.appendChild(img);
box.appendChild(button);
container.appendChild(box);
