// page d'accueil

// recupere la liste des fils de discussion depuis le serveur
async function fetchThreads() {
    try {
        const res = await fetch("/api/threads", { credentials: "include" });
        const json = await res.json().catch(function() { return null; });

        if (res.ok === false || json === null) {
            return [];
        }

        if (Array.isArray(json) === true) {
            return json;
        }
        if (Array.isArray(json.data) === true) {
            return json.data;
        }
        if (Array.isArray(json.threads) === true) {
            return json.threads;
        }

        return [];
    } catch (error) {
        console.error("erreur api threads :", error);
        return [];
    }
}

// enregistre un fil recemment consulte dans un cookie
function saveRecentThread(thread) {
    let recent = [];
    const cookie = getCookie("recentThreads");
    if (cookie !== null) {
        try {
            recent = JSON.parse(cookie);
        } catch (error) {
            recent = [];
        }
    }

    // enleve le fil de la liste s'il y est deja
    const newRecent = [];
    for (let i = 0; i < recent.length; i++) {
        if (recent[i].id !== thread.id_threads) {
            newRecent.push(recent[i]);
        }
    }
    
    // ajoute le nouveau fil au debut
    newRecent.unshift({ id: thread.id_threads, title: thread.titre });
    
    // limite la liste aux 10 derniers
    recent = newRecent.slice(0, 10);
    setCookie("recentThreads", JSON.stringify(recent));
}

// recupere les fils recemment consultes depuis le cookie
function getRecentThreads() {
    const cookie = getCookie("recentThreads");
    if (cookie === null) {
        return [];
    }
    try {
        return JSON.parse(cookie);
    } catch (error) {
        return [];
    }
}




// construit la barre laterale gauche
function buildSidebar() {
    const gauche = document.querySelector("#gauche");
    if (gauche === null) {
        return;
    }

    gauche.replaceChildren();

    // derniers posts vus
    const titleRecent = document.createElement("h2");
    titleRecent.textContent = "Derniers posts vus";
    gauche.appendChild(titleRecent);

    const ulRecent = document.createElement("ul");
    ulRecent.className = "side-list";

    const recent = getRecentThreads();

    if (recent.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Aucun post vu";
        ulRecent.appendChild(li);
    } else {
        const showCount = Math.min(recent.length, 5);
        for (let i = 0; i < showCount; i++) {
            const t = recent[i];
            const li = document.createElement("li");
            li.textContent = t.title;
            li.className = "side-link";
            li.addEventListener("click", function() {
                window.location.href = "/thread/" + t.id;
            });
            ulRecent.appendChild(li);
        }
    }

    gauche.appendChild(ulRecent);

    // regles du forum
    const titleRules = document.createElement("h2");
    titleRules.textContent = "Règles et Confidentialité";
    gauche.appendChild(titleRules);

    const rulesLink = document.createElement("p");
    rulesLink.textContent = "Voir les règles ->";
    rulesLink.className = "side-link";
    rulesLink.addEventListener("click", function() {
        window.location.href = "/rules";
    });

    gauche.appendChild(rulesLink);

    // copyright
    const copy = document.createElement("p");
    copy.className = "copyright";
    copy.textContent = "© 2026 Yask. Tous droits réservés.";
    gauche.appendChild(copy);
}

// recupere le titre du fil ou valeur par defaut
function getThreadTitle(thread) {
    if (thread.titre) {
        return thread.titre;
    }
    return "Thread sans titre";
}

const pagination = {
    page: 1,
    pageSize: 10
};

let allThreads = [];

// filtre la liste globale des fils de discussion
function filterThreadsBySearch(threads) {
    let result = [];

    // copie tous les fils
    for (let i = 0; i < threads.length; i++) {
        result.push(threads[i]);
    }

    // filtre par recherche de texte dans l'url
    const params = new URLSearchParams(window.location.search);
    const query = (params.get("q") || "").trim().toLowerCase();

    if (query === "") {
        return result;
    }

    let searchResult = [];
    for (let i = 0; i < result.length; i++) {
        const t = result[i];
        if (getThreadTitle(t).toLowerCase().indexOf(query) !== -1) {
            searchResult.push(t);
        }
    }
    return searchResult;
}

// cree la carte html representant un fil
function renderThreadCard(thread) {
    const div = document.createElement("div");
    div.className = "thread-card";

    const id = thread.id_threads;
    div.id = "thread-" + id;

    div.addEventListener("click", function() {
        saveRecentThread(thread);
        window.location.href = "/thread/" + id;
    });

    const h2 = document.createElement("h2");
    h2.textContent = getThreadTitle(thread);
    div.appendChild(h2);

    return div;
}

// cree la barre de pagination
function renderPagination(totalItems) {
    const old = document.querySelector("#pagination");
    if (old !== null) {
        old.remove();
    }

    const container = document.createElement("div");
    container.id = "pagination";
    container.className = "pagination";

    let totalPages = 1;
    if (pagination.pageSize !== "all") {
        totalPages = Math.max(1, Math.ceil(totalItems / pagination.pageSize));
    }

    // bouton precedent
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "← Précédent";
    prevBtn.disabled = (pagination.page <= 1);
    prevBtn.addEventListener("click", function() {
        pagination.page = pagination.page - 1;
        displayThreads();
    });

    // texte explicatif de page
    const pageInfo = document.createElement("span");
    pageInfo.textContent = "Page " + pagination.page + " / " + totalPages;

    // bouton suivant
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Suivant →";
    nextBtn.disabled = (pagination.page >= totalPages);
    nextBtn.addEventListener("click", function() {
        pagination.page = pagination.page + 1;
        displayThreads();
    });

    // selecteur de taille de page
    const sizeSelect = document.createElement("select");
    const sizes = [10, 20, 30, "all"];
    for (let i = 0; i < sizes.length; i++) {
        const val = sizes[i];
        const option = document.createElement("option");
        option.value = val;
        if (val === "all") {
            option.textContent = "Tout afficher";
        } else {
            option.textContent = val + " / page";
        }
        if (val === pagination.pageSize) {
            option.selected = true;
        }
        sizeSelect.appendChild(option);
    }

    sizeSelect.addEventListener("change", function() {
        const val = sizeSelect.value;
        if (val === "all") {
            pagination.pageSize = "all";
        } else {
            pagination.pageSize = Number(val);
        }
        pagination.page = 1;
        displayThreads();
    });

    container.appendChild(prevBtn);
    container.appendChild(pageInfo);
    container.appendChild(nextBtn);
    container.appendChild(sizeSelect);

    const center = document.querySelector("#center");
    if (center !== null) {
        center.appendChild(container);
    }
}

// affiche les fils de discussion sur l'ecran
async function displayThreads() {
    const container = document.querySelector("#threads");
    if (container === null) {
        return;
    }

    container.replaceChildren();

    const filtered = filterThreadsBySearch(allThreads);

    if (filtered.length === 0) {
        const box = document.createElement("div");
        box.className = "boxbox";
        const h2 = document.createElement("h2");
        h2.textContent = "Aucun thread pour le moment";
        box.appendChild(h2);
        container.appendChild(box);
        renderPagination(0);
        return;
    }

    let pageItems = filtered;
    if (pagination.pageSize !== "all") {
        const start = (pagination.page - 1) * pagination.pageSize;
        const end = start + pagination.pageSize;
        pageItems = filtered.slice(start, end);
    }

    for (let i = 0; i < pageItems.length; i++) {
        container.appendChild(renderThreadCard(pageItems[i]));
    }

    renderPagination(filtered.length);
}

// charge la page d'accueil
async function initThreadsPage() {
    buildSidebar();
    allThreads = await fetchThreads();
    pagination.page = 1;
    await displayThreads();
}

document.addEventListener("DOMContentLoaded", initThreadsPage);

// bouton d'ajout de fil
document.addEventListener("DOMContentLoaded", function() {
    const addThreadBtn = document.getElementById("add-thread-btn");
    if (addThreadBtn === null) {
        return;
    }

    addThreadBtn.addEventListener("click", function() {
        if (isLoggedIn() === false) {
            alert("Vous devez être connecté pour ajouter un thread.");
            window.location.href = "/login";
            return;
        }
        window.location.href = "/submit";
    });
});