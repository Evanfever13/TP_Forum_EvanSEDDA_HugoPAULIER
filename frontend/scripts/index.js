/* pour commencer , cette fonction vérifie si un utilisateur est connecté via API */
async function fetchUser() {
    try {
        const response = await fetch("/api/user", { credentials: "include" });
        if (!response.ok) return null;
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur API :", error);
        return null;
    }
}

/* récupère les catégories */
async function fetchCategories() {
    try {
        const response = await fetch("/api/categories");
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("Erreur API catégories :", error);
        return [];
    }
}

/* récupère les règles */
async function fetchRules() {
    try {
        const response = await fetch("/api/rules");
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("Erreur API règles :", error);
        return [];
    }
}

/* récupère les threads */
async function fetchThreads() {
    try {
        const response = await fetch("/api/threads");
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error("Erreur API threads :", error);
        return [];
    }
}

/* fonction pour facilité la création d’un item <li><a> */
function createNavItem(text, href = "#", img = null) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = href;

    if (img) {
        const image = document.createElement("img");
        image.src = img.src;
        image.alt = img.alt;
        a.appendChild(image);
    } else {
        a.textContent = text;
    }

    li.appendChild(a);
    return li;
}

/* le mini-header Ynov */
const miniHeader = document.querySelector("#mini-header");
const miniNav = document.createElement("div");
miniNav.className = "mini-nav";

function createMiniLink(text, href = "#") {
    const a = document.createElement("a");
    a.textContent = text;
    a.href = href;
    return a;
}

miniNav.appendChild(createMiniLink("Ymatch", "https://ymatch.ynov.com"));
miniNav.appendChild(createMiniLink("Extranet", "https://extranet.ynov.com"));
miniNav.appendChild(createMiniLink("Ecole", "https://www.ynov.com"));
miniHeader.appendChild(miniNav);

/* le header */
async function buildHeader() {
    const header = document.querySelector("header");
    const user = await fetchUser();

    const logoDiv = document.createElement("div");
    logoDiv.className = "logo";

    const logoImg = document.createElement("img");
    logoImg.src = "../assets/img/logo/logo.png";
    logoImg.alt = "logo";
    logoDiv.appendChild(logoImg);

    const nav = document.createElement("nav");
    const ul = document.createElement("ul");
    ul.className = "nav-links";

    if (user) {
        ul.appendChild(createNavItem(user.name, "/profil"));
        ul.appendChild(createNavItem("Déconnexion", "/logout"));
    } else {
        ul.appendChild(createNavItem("Connexion", "/login"));
        ul.appendChild(createNavItem("Inscription", "/signup"));
    }

    nav.appendChild(ul);
    header.replaceChildren(logoDiv, nav);
}

buildHeader();

/* c'est la barre de gauche dynamique */
async function buildSidebar() {
    const gauche = document.querySelector("#gauche");
    gauche.innerHTML = "";

    const titleCat = document.createElement("h2");
    titleCat.textContent = "Catégories";
    gauche.appendChild(titleCat);

    const categories = await fetchCategories();
    const ulCat = document.createElement("ul");
    ulCat.className = "side-list";

    categories.forEach(cat => {
        const li = document.createElement("li");
        li.textContent = cat.name;
        ulCat.appendChild(li);
    });

    gauche.appendChild(ulCat);

    const titleRules = document.createElement("h2");
    titleRules.textContent = "Règles & Confidentialité";
    gauche.appendChild(titleRules);

    const rules = await fetchRules();
    const ulRules = document.createElement("ul");
    ulRules.className = "side-list";

    rules.forEach(rule => {
        const li = document.createElement("li");
        li.textContent = rule;
        ulRules.appendChild(li);
    });

    gauche.appendChild(ulRules);
}

buildSidebar();

/* affiche des threads dans la zone principale */
async function displayThreads() {
    const container = document.querySelector("#threads");
    if (!container) return;

    const threads = await fetchThreads();
    container.innerHTML = "";

    threads.forEach(thread => {
        const div = document.createElement("div");
        div.className = "thread-card";
        div.textContent = thread.title;
        container.appendChild(div);
    });
}

displayThreads();
