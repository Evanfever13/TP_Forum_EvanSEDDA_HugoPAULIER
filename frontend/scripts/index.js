/* pour commencer , cette fonction vérifie si un utilisateur est connecté via API */
async function fetchUser(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`, { credentials: "include" });
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
