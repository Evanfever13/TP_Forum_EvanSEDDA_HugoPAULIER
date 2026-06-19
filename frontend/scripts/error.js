// page d'erreur generique

const ERROR_MESSAGES = {
    "404": "La page demandée est introuvable.",
    "500": "Le serveur a rencontré un problème.",
    "403": "Vous n'avez pas la permission d'accéder à cette ressource.",
    "401": "Vous devez être connecté pour accéder à cette page."
};

// affiche les details de l'erreur sur la page
function displayError() {
    const container = document.querySelector("#erreur");
    if (container === null) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    let code = params.get("code");
    if (code === null) {
        code = "000";
    }

    const box = document.createElement("div");
    box.className = "error-box";

    const title = document.createElement("h1");
    title.className = "error-title";
    title.textContent = "Erreur " + code;

    const message = document.createElement("p");
    message.className = "error-message";
    if (ERROR_MESSAGES[code]) {
        message.textContent = ERROR_MESSAGES[code];
    } else {
        message.textContent = "Une erreur inconnue est survenue.";
    }

    const img = document.createElement("img");
    img.className = "error-img";
    img.src = "https://http.cat/" + code + ".jpg";
    img.alt = "Erreur " + code;
    
    // si l'image n'existe pas pour ce code on l'enleve
    img.addEventListener("error", function() {
        img.remove();
    });

    const button = document.createElement("button");
    button.id = "back-home";
    button.textContent = "Retour à l'accueil";
    button.addEventListener("click", function() {
        window.location.href = "/home";
    });

    box.appendChild(title);
    box.appendChild(message);
    box.appendChild(img);
    box.appendChild(button);
    container.appendChild(box);
}

document.addEventListener("DOMContentLoaded", displayError);