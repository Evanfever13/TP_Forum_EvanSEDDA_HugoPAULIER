/* création et gestion des cookies*/

function setCookie(name, value, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith(name + "="))
        ?.split("=")[1];
}


/* recherche api pour retrouver les users*/

async function fetchUser(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`, { credentials: "include" });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Erreur API :", error);
        return null;
    }
}


/* recherche api pour trouver les threads ou 1 thread*/

async function fetchThreads() {
    try {
        const response = await fetch("/api/threads");
        if (!response.ok) return { error: true, data: [] };
        return { error: false, data: await response.json() };
    } catch (error) {
        console.error("Erreur API threads :", error);
        return { error: true, data: [] };
    }
}

async function fetchThread(id) {
    try {
        const response = await fetch(`/api/threads/${id}`);
        if (!response.ok) return { error: true, data: null };
        return { error: false, data: await response.json() };
    } catch (error) {
        console.error("Erreur API thread :", error);
        return { error: true, data: null };
    }
}


/*catégorie a revoir, c'est du static pour l'instant*/

async function fetchCategories() {
    return [
        { name: "Ya PAS" },
        { name: "Développement" },
        { name: "Discussions" }
    ];
}


/* fonction qui sauvegarde les dernières post vu par l'user et le stocke dans le cookie*/

function saveRecentThread(thread) {
    let recent = [];

    const cookie = getCookie("recentThreads");
    if (cookie) {
        try {
            recent = JSON.parse(decodeURIComponent(cookie));
        } catch {
            recent = [];
        }
    }

    recent = recent.filter(t => t.id !== thread.id);
    recent.unshift({ id: thread.id, title: thread.title });
    recent = recent.slice(0, 10);

    setCookie("recentThreads", JSON.stringify(recent));
}


/* la sidebar de gauche dynamique*/

async function buildSidebar() {
    const gauche = document.querySelector("#gauche");
    gauche.innerHTML = "";

    /*  catégories  */
    const titleCat = document.createElement("h2");
    titleCat.textContent = "Catégories";
    gauche.appendChild(titleCat);

    const categories = await fetchCategories();
    const ulCat = document.createElement("ul");
    ulCat.className = "side-list";

    categories.forEach(cat => {
        const li = document.createElement("li");
        li.textContent = cat.name;
        li.className = "side-link";
        li.addEventListener("click", () => {
            window.location.href = "/category/" + cat.name.toLowerCase();
        });
        ulCat.appendChild(li);
    });

    gauche.appendChild(ulCat);


    /*  derniers posts vus  */
    const titleRecent = document.createElement("h2");
    titleRecent.textContent = "Derniers posts vus";
    gauche.appendChild(titleRecent);

    const ulRecent = document.createElement("ul");
    ulRecent.className = "side-list";

    let recent = [];
    const cookie = getCookie("recentThreads");

    if (cookie) {
        try {
            recent = JSON.parse(decodeURIComponent(cookie));
        } catch {
            recent = [];
        }
    }

    if (recent.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Aucun post vu";
        ulRecent.appendChild(li);
    } else {
        recent.slice(0, 5).forEach(t => {
            const li = document.createElement("li");
            li.textContent = t.title;
            li.className = "side-link";
            li.addEventListener("click", () => {
                window.location.href = "/thread/" + t.id;
            });
            ulRecent.appendChild(li);
        });
    }

    gauche.appendChild(ulRecent);


    /*  règles et confidentialité  */
    const titleRules = document.createElement("h2");
    titleRules.textContent = "Règles et Confidentialité";
    gauche.appendChild(titleRules);

    const rulesLink = document.createElement("p");
    rulesLink.textContent = "Voir les règles ->";
    rulesLink.className = "side-link";
    rulesLink.addEventListener("click", () => {
        window.location.href = "/rules";
    });

    gauche.appendChild(rulesLink);


    /* copyright  */
    const copy = document.createElement("p");
    copy.className = "copyright";
    copy.textContent = "© 2026 Yask. Tous droits réservés.";
    gauche.appendChild(copy);
}

buildSidebar();


/* fonction qui permet d'afficher tout les threads*/

async function displayThreads() {
    const container = document.querySelector("#threads");
    if (!container) return;

    const result = await fetchThreads();
    container.innerHTML = "";

    if (result.error) {
        const box = document.createElement("div");
        box.className = "boxbox";
        const texte = document.createElement("h2");
        texte.textContent = "Le serveur a des problèmes 😅";
        box.appendChild(texte);
        container.appendChild(box);
        return;
    }

    const threads = result.data;

    if (threads.length === 0) {
        const box = document.createElement("div");
        box.className = "boxbox";
        const texte = document.createElement("h2");
        texte.textContent = "Écrivez le tout premier thread !";
        box.appendChild(texte);
        container.appendChild(box);
        return;
    }

    threads.forEach(thread => {
        const div = document.createElement("div");
        div.className = "thread-card";

        const h2 = document.createElement("h2");
        h2.textContent = thread.title;

        div.appendChild(h2);
        container.appendChild(div);
    });
}

displayThreads();


/* bouton ajout de thread*/

const addThreadBtn = document.getElementById("add-thread-btn");

if (addThreadBtn) {
    addThreadBtn.addEventListener("click", () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("Vous devez être connecté pour ajouter un thread.");
            window.location.href = "/login";
            return;
        }
        window.location.href = "/submit";
    });
}
