/* fonction utilitaire */

function getThreadTitle(thread) {
    return (thread.titre || "Thread sans titre");
}

function getThreadId(thread) {
    return thread.id_threads;
}

/* Utilitaire cookie */
function getUserIdFromCookie() {
    const cookies = document.cookie.split(";").map(c => c.trim());
    for (const c of cookies) {
        if (c.startsWith("userId=")) {
            return c.split("=")[1];
        }
    }
    return null;
}

/* fonction qui affiche un thread par son id */

async function fetchThreadById(id) {
    try {
        const res = await fetch(`/api/threads/${id}`, { credentials: "include" });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

/* fonction qui récupère tous les posts puis filtre par id_threads */

async function fetchPosts(threadId) {
    try {
        const res = await fetch(`/api/posts`, { credentials: "include" });
        if (!res.ok) return [];

        const json = await res.json().catch(() => []);
        if (!Array.isArray(json)) return [];

        return json.filter(p => p.id_threads === Number(threadId));
    } catch {
        return [];
    }
}

/* envoyer un commentaire */
async function sendComment(threadId, content) {
    const userId = getUserIdFromCookie();

    if (!userId) {
        alert("Vous devez être connecté pour commenter.");
        return false;
    }

    try {
        const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                posts: content,
                id_users: Number(userId),
                id_threads: Number(threadId)
            })
        });

        return res.ok;
    } catch {
        return false;
    }
}

/* 🔥 Récupérer le score d’un post via id_posts */
async function getPostScore(postId) {
    try {
        const res = await fetch(`/api/votes/${postId}`, {
            credentials: "include"
        });

        if (!res.ok) {
            // PATCH : ignorer les 404
            return 0;
        }

        const json = await res.json();
        return json.score || 0;
    } catch {
        return 0;
    }
}

/* 🔥 Voter sur un post via id_posts */
async function votePost(postId, value) {
    const userId = getUserIdFromCookie();
    if (!userId) {
        alert("Vous devez être connecté pour voter.");
        return null;
    }

    try {
        const res = await fetch(`/api/votes/${postId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                id_users: Number(userId),
                vote: value
            })
        });

        if (!res.ok) {
            // PATCH : ignorer les 404
            return { score: 0 };
        }

        return await res.json();
    } catch {
        return { score: 0 };
    }
}

/* afficher le thread */

async function displayThreadById() {
    const container = document.querySelector("#Thread");
    if (!container) return;

    const id = window.location.pathname.split("/").pop();
    const thread = await fetchThreadById(id);

    container.textContent = "";

    if (!thread) {
        const h2 = document.createElement("h2");
        h2.textContent = "Erreur : Thread introuvable.";
        container.appendChild(h2);
        return;
    }

    const h1 = document.createElement("h1");
    h1.textContent = getThreadTitle(thread);

    container.appendChild(h1);

    displayPostsbyID(id);
    displayPosts(id);
}

/* fonction qui affiche les posts */

function displayPostsbyID(threadId) {
    const main = document.querySelector("main");

    // Section posts
    const postsSection = document.createElement("section");
    postsSection.id = "comments";

    const title = document.createElement("h2");
    title.textContent = "Posts";
    postsSection.appendChild(title);

    main.appendChild(postsSection);

    // Formulaire d’ajout
    const form = document.createElement("div");
    form.id = "commentForm";

    const formTitle = document.createElement("h2");
    formTitle.textContent = "Ajouter un Post";
    form.appendChild(formTitle);

    const textarea = document.createElement("textarea");
    textarea.id = "commentText";
    textarea.placeholder = "Écrire un Post...";
    form.appendChild(textarea);

    const sendButton = document.createElement("button");
    sendButton.id = "sendComment";
    sendButton.textContent = "Envoyer";
    form.appendChild(sendButton);

    main.appendChild(form);

    sendButton.addEventListener("click", async () => {
        const content = textarea.value.trim();
        if (!content) {
            alert("Post vide.");
            return;
        }

        const ok = await sendComment(threadId, content);

        if (ok) {
            textarea.value = "";
            displayPosts(threadId);
        } else {
            alert("Erreur lors de l'envoi du post.");
        }
    });
}

/* fonction qui recupere un user via son id */

async function fetchUser(userId) {
    try {
        const res = await fetch(`/api/users/${userId}`, { credentials: "include" });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

/* afficher les posts */

async function displayPosts(threadId) {
    const container = document.querySelector("#comments");
    if (!container) return;

    container.textContent = "";
    const title = document.createElement("h2");
    title.textContent = "Posts";
    container.appendChild(title);

    const posts = await fetchPosts(threadId);

    if (posts.length === 0) {
        const p = document.createElement("p");
        p.textContent = "Soyez le Premier à mettre un Post dans le Thread ! ";
        container.appendChild(p);
        return;
    }

    for (const c of posts) {
        const div = document.createElement("div");
        div.className = "comment";

        /* 🔥 Bloc vote façon Reddit */
        const voteBox = document.createElement("div");
        voteBox.className = "vote-box";

        const up = document.createElement("button");
        up.className = "upvote";
        up.textContent = "▲";

        const score = document.createElement("span");
        score.className = "score";
        score.textContent = await getPostScore(c.id_posts);

        const down = document.createElement("button");
        down.className = "downvote";
        down.textContent = "▼";

        voteBox.appendChild(up);
        voteBox.appendChild(score);
        voteBox.appendChild(down);

        div.appendChild(voteBox);

        /* Infos user + contenu */
        const user = await fetchUser(c.id_users);
        const pseudo = user?.name || `Utilisateur #${c.id_users}`;

        const userP = document.createElement("p");
        userP.textContent = pseudo;

        const content = document.createElement("p");
        content.textContent = c.posts;

        div.appendChild(userP);
        div.appendChild(content);

        container.appendChild(div);

        up.addEventListener("click", async () => {
            const result = await votePost(c.id_posts, 1);
            score.textContent = result.score;
        });

        down.addEventListener("click", async () => {
            const result = await votePost(c.id_posts, -1);
            score.textContent = result.score;
        });
    }
}

document.addEventListener("DOMContentLoaded", displayThreadById);
