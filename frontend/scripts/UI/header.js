/* fonctions utilitaires */

function getUserIdFromCookie() {
    const cookies = document.cookie.split(";").map(c => c.trim());
    for (const c of cookies) {
        if (c.startsWith("userId=")) {
            return c.split("=")[1];
        }
    }
    return null;
}

function createNavItem(text, href = "#", img = null, onClick = null) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = href;

    if (onClick) {
        a.addEventListener("click", (e) => {
            e.preventDefault();
            onClick();
        });
    }

    if (img) {
        const image = document.createElement("img");
        image.src = img.src;
        image.alt = img.alt ?? "";
        a.appendChild(image);
    } else {
        a.textContent = text;
    }

    li.appendChild(a);
    return li;
}

function createMiniLink(text, href = "#") {
    const a = document.createElement("a");
    a.textContent = text;
    a.href = href;
    return a;
}

/* mini header d'ynov */

function buildMiniHeader() {
    const miniHeader = document.querySelector("#mini-header");
    if (!miniHeader) return;

    const miniNav = document.createElement("div");
    miniNav.className = "mini-nav";

    miniNav.appendChild(createMiniLink("Ymatch", "https://ymatch.ynov.com"));
    miniNav.appendChild(createMiniLink("Extranet", "https://extranet.ynov.com"));
    miniNav.appendChild(createMiniLink("Ecole", "https://www.ynov.com"));

    miniHeader.appendChild(miniNav);
}

/* fetch user courant */

async function fetchCurrentUser() {
    const userId = getUserIdFromCookie();
    if (!userId) return null;

    try {
        const res = await fetch(`/api/users/${userId}`, { credentials: "include" });
        if (!res.ok) return null;
        return await res.json().catch(() => null);
    } catch (err) {
        console.error("Erreur fetchCurrentUser :", err);
        return null;
    }
}

/* fonction pour se déco */

function logout() {
    document.cookie = "userId=; Max-Age=0; path=/; SameSite=Lax";
    window.location.href = "/home";
}

/* header principal */

async function buildHeader() {
    const header = document.querySelector("header");
    if (!header) return;

    const user = await fetchCurrentUser();

    const logoDiv = document.createElement("div");
    logoDiv.className = "logo";

    const boutonImg = document.createElement("button");
    boutonImg.className = "boutonImg";
    boutonImg.addEventListener("click", () => window.location.href = "/home");

    const logoImg = document.createElement("img");
    logoImg.src = "/assets/img/logo/logo.png";
    logoImg.alt = "logo";

    boutonImg.appendChild(logoImg);
    logoDiv.appendChild(boutonImg);

    const nav = document.createElement("nav");
    const ul = document.createElement("ul");
    ul.className = "nav-links";

    if (user) {
        ul.appendChild(createNavItem(user.name ?? "Profil", "/profil"));
        ul.appendChild(createNavItem("Déconnexion", "#", null, logout));
    } else {
        ul.appendChild(createNavItem("Connexion", "/login"));
        ul.appendChild(createNavItem("Inscription", "/signup"));
    }

    if (window.location.href === "/home") {
        const search = document.createElement("div");
        search.className = "search";
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Rechercher un thread";
        search.appendChild(input);
        nav.appendChild(search);
    }

    nav.appendChild(ul);
    header.replaceChildren(logoDiv, nav);
}

document.addEventListener("DOMContentLoaded", () => {
    buildMiniHeader();
    buildHeader();
});
