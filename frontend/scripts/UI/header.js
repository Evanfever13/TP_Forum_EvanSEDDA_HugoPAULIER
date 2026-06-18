// composant en-tete de l'application

// cree un element du menu de navigation
function createNavItem(text, href = "#", onClick = null) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = href;
    a.textContent = text;

    if (onClick !== null) {
        a.addEventListener("click", function(e) {
            e.preventDefault();
            onClick();
        });
    }

    li.appendChild(a);
    return li;
}

// cree un lien simple pour le mini bandeau du haut
function createMiniLink(text, href = "#") {
    const a = document.createElement("a");
    a.textContent = text;
    a.href = href;
    return a;
}

// construit le petit bandeau ynov en haut de page
function buildMiniHeader() {
    const miniHeader = document.querySelector("#mini-header");
    if (miniHeader === null) {
        return;
    }

    const miniNav = document.createElement("div");
    miniNav.className = "mini-nav";

    miniNav.appendChild(createMiniLink("Ymatch", "https://ymatch.ynov.com"));
    miniNav.appendChild(createMiniLink("Extranet", "https://extranet.ynov.com"));
    miniNav.appendChild(createMiniLink("Ecole", "https://www.ynov.com"));

    miniHeader.appendChild(miniNav);
}

// construit le champ de recherche dans le menu
function buildSearchBox() {
    const search = document.createElement("div");
    search.className = "search";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Rechercher un thread";
    input.id = "search-input";

    const params = new URLSearchParams(window.location.search);
    input.value = params.get("q") || "";

    input.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            launchSearch(input.value);
        }
    });

    search.appendChild(input);
    return search;
}

// redirige vers l'accueil avec le parametre de recherche
function launchSearch(query) {
    const trimmed = query.trim();
    let url = "/home";
    if (trimmed !== "") {
        url = "/home?q=" + encodeURIComponent(trimmed);
    }
    window.location.href = url;
}

// construit l'en-tete principal de la page
function buildHeader() {
    const header = document.querySelector("header");
    if (header === null) {
        return;
    }

    const user = getCurrentUserInfo();

    // bloc contenant le logo cliquable
    const logoDiv = document.createElement("div");
    logoDiv.className = "logo";

    const boutonImg = document.createElement("button");
    boutonImg.className = "boutonImg";
    boutonImg.addEventListener("click", function() {
        window.location.href = "/home";
    });

    const logoImg = document.createElement("img");
    logoImg.src = "/assets/img/logo/logo.png";
    logoImg.alt = "logo";

    boutonImg.appendChild(logoImg);
    logoDiv.appendChild(boutonImg);

    // menu de navigation principal
    const nav = document.createElement("nav");
    const ul = document.createElement("ul");
    ul.className = "nav-links";

    if (user !== null) {
        ul.appendChild(createNavItem("Mon profil", "/profil"));
        ul.appendChild(createNavItem("Déconnexion", "#", logout));
    } else {
        ul.appendChild(createNavItem("Connexion", "/login"));
        ul.appendChild(createNavItem("Inscription", "/signup"));
    }

    // la recherche n'apparait que sur la page d'accueil si connecte
    if (window.location.pathname === "/home" && user !== null) {
        nav.appendChild(buildSearchBox());
    }

    nav.appendChild(ul);
    header.replaceChildren(logoDiv, nav);
}

document.addEventListener("DOMContentLoaded", function() {
    buildMiniHeader();
    buildHeader();
});