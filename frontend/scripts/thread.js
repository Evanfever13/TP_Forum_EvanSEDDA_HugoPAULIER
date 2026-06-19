// page d'un fil de discussion

// affiche une modale de confirmation et retourne une promesse (true = confirme, false = annule)
function showConfirmModal(message) {
    return new Promise(function(resolve) {
        const overlay = document.createElement("div");
        overlay.className = "modal-overlay";

        const box = document.createElement("div");
        box.className = "modal-box";

        const msg = document.createElement("p");
        msg.className = "modal-message";
        msg.textContent = message;

        const btnRow = document.createElement("div");
        btnRow.className = "modal-btn-row";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Annuler";
        cancelBtn.className = "modal-btn modal-btn-cancel";

        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "Confirmer";
        confirmBtn.className = "modal-btn modal-btn-confirm";

        cancelBtn.addEventListener("click", function() {
            document.body.removeChild(overlay);
            resolve(false);
        });

        confirmBtn.addEventListener("click", function() {
            document.body.removeChild(overlay);
            resolve(true);
        });

        btnRow.appendChild(cancelBtn);
        btnRow.appendChild(confirmBtn);
        box.appendChild(msg);
        box.appendChild(btnRow);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    });
}

// affiche une modale de saisie et retourne une promesse (texte saisi ou null si annule)
function showPromptModal(message, defaultValue) {
    return new Promise(function(resolve) {
        const overlay = document.createElement("div");
        overlay.className = "modal-overlay";

        const box = document.createElement("div");
        box.className = "modal-box";

        const msg = document.createElement("p");
        msg.className = "modal-message";
        msg.textContent = message;

        const input = document.createElement("textarea");
        input.className = "modal-input";
        input.value = defaultValue;

        const btnRow = document.createElement("div");
        btnRow.className = "modal-btn-row";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Annuler";
        cancelBtn.className = "modal-btn modal-btn-cancel";

        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "Valider";
        confirmBtn.className = "modal-btn modal-btn-confirm";

        cancelBtn.addEventListener("click", function() {
            document.body.removeChild(overlay);
            resolve(null);
        });

        confirmBtn.addEventListener("click", function() {
            document.body.removeChild(overlay);
            resolve(input.value);
        });

        btnRow.appendChild(cancelBtn);
        btnRow.appendChild(confirmBtn);
        box.appendChild(msg);
        box.appendChild(input);
        box.appendChild(btnRow);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        // focus automatique sur le champ
        input.focus();
        input.select();
    });
}

// recupere le titre du fil ou valeur par defaut
function getThreadTitle(thread) {
    if (thread.titre) {
        return thread.titre;
    }
    return "Thread sans titre";
}

// recupere un fil par son identifiant
async function fetchThreadById(id) {
    try {
        const res = await fetch("/api/threads/" + id, { credentials: "include" });
        if (res.ok === false) {
            return null;
        }
        return await res.json();
    } catch (error) {
        return null;
    }
}

// recupere les messages lies a un fil de discussion
async function fetchPosts(threadId) {
    try {
        const res = await fetch("/api/posts", { credentials: "include" });
        if (res.ok === false) {
            return [];
        }

        const json = await res.json().catch(function() { return []; });
        if (Array.isArray(json) === false) {
            return [];
        }

        const list = [];
        for (let i = 0; i < json.length; i++) {
            if (json[i].id_threads === Number(threadId)) {
                list.push(json[i]);
            }
        }
        return list;
    } catch (error) {
        return [];
    }
}

// recupere les infos d'un utilisateur par son identifiant
async function fetchUser(userId) {
    try {
        const res = await fetch("/api/users/" + userId, { credentials: "include" });
        if (res.ok === false) {
            return null;
        }
        return await res.json();
    } catch (error) {
        return null;
    }
}

// recupere tous les votes presents en base
async function fetchAllVotes() {
    try {
        const res = await fetch("/api/votes", { credentials: "include" });
        if (res.ok === false) {
            return [];
        }
        const json = await res.json().catch(function() { return []; });
        if (Array.isArray(json) === true) {
            return json;
        }
        return [];
    } catch (error) {
        return [];
    }
}

// calcule le score d'un message avec la liste des votes (votes = -1, 0, 1)
function computeScore(postId, votes) {
    let total = 0;
    for (let i = 0; i < votes.length; i++) {
        if (votes[i].id_posts === postId) {
            if (votes[i].vote === true) total += 1;
            else total -= 1;
        }
    }
    return total;
}




// cherche le vote d'un utilisateur sur un message
function findUserVote(postId, userId, votes) {
    for (let i = 0; i < votes.length; i++) {
        if (votes[i].id_posts === postId && votes[i].id_users === userId) {
            return votes[i];
        }
    }
    return null;
}

// envoie un nouveau message au serveur
async function sendComment(threadId, content) {
    const user = getCurrentUserInfo();
    if (user === null) {
        alert("Vous devez être connecté pour commenter.");
        return false;
    }

    try {
        const res = await authFetch("/api/posts", {
            method: "POST",
            body: JSON.stringify({
                posts: content,
                id_users: user.id,
                id_threads: Number(threadId)
            })
        });
        return res.ok;
    } catch (error) {
        return false;
    }
}

// permet de voter sur un message
async function votePost(postId, likeValue, votesCache) {
    const user = getCurrentUserInfo();
    if (user === null) {
        alert("Vous devez être connecté pour voter.");
        return false;
    }

    const existingVote = findUserVote(postId, user.id, votesCache);

    try {
        if (existingVote === null) {
            const res = await authFetch("/api/votes", {
                method: "POST",
                body: JSON.stringify({
                    id_users: user.id,
                    id_posts: postId,
                    vote: likeValue   
                })
            });
            return res.ok;
        }

        // Même vote → suppression
        if (existingVote.vote === likeValue) {  
            const res = await authFetch("/api/votes/" + existingVote.id_votes, {
                method: "DELETE"
            });
            return res.ok;
        }

        // Vote différent → mise à jour
        const res = await authFetch("/api/votes/" + existingVote.id_votes, {
            method: "PUT",
            body: JSON.stringify({
                id_users: user.id,
                id_posts: postId,
                vote: likeValue   
            })
        });
        return res.ok;

    } catch (error) {
        console.error("erreur de vote :", error);
        return false;
    }
}




const postsView = {
    sortMode: "recent",
    page: 1,
    pageSize: 10
};

// trie les messages selon le mode selectionne
function sortPosts(posts, votes) {
    const sorted = [];
    for (let i = 0; i < posts.length; i++) {
        sorted.push(posts[i]);
    }

    if (postsView.sortMode === "old") {
        sorted.sort(function(a, b) {
            return a.id_posts - b.id_posts;
        });
    } else if (postsView.sortMode === "popular") {
        sorted.sort(function(a, b) {
            const scoreA = computeScore(a.id_posts, votes);
            const scoreB = computeScore(b.id_posts, votes);
            return scoreB - scoreA;
        });
    } else {
        sorted.sort(function(a, b) {
            return b.id_posts - a.id_posts;
        });
    }

    return sorted;
}

// affiche les details du fil de discussion
async function displayThreadById() {
    const container = document.querySelector("#Thread");
    if (container === null) {
        return;
    }

    const parts = window.location.pathname.split("/");
    const id = parts[parts.length - 1];
    const thread = await fetchThreadById(id);

    container.textContent = "";

    if (thread === null) {
        const h2 = document.createElement("h2");
        h2.textContent = "Erreur : Thread introuvable.";
        container.appendChild(h2);
        return;
    }

    const h1 = document.createElement("h1");
    h1.textContent = getThreadTitle(thread);
    container.appendChild(h1);

    const authorUser = await fetchUser(thread.id_users);
    let authorName = "Utilisateur #" + thread.id_users;
    if (authorUser !== null) {
        authorName = authorUser.name;
    }

    const infoDiv = document.createElement("div");
    infoDiv.className = "thread-info-bar";

    const createdByText = document.createTextNode("Créé par : ");
    infoDiv.appendChild(createdByText);

    const authorStrong = document.createElement("strong");
    authorStrong.textContent = authorName;
    infoDiv.appendChild(authorStrong);

    container.appendChild(infoDiv);

    const currentUser = getCurrentUserInfo();

    // suppression du fil par l'auteur ou l'admin
    if (currentUser !== null && (currentUser.id === thread.id_users || currentUser.role === "admin")) {
        const delBtn = document.createElement("button");
        delBtn.textContent = "Supprimer ce thread";
        delBtn.className = "thread-action-delete";
        delBtn.addEventListener("click", async function() {
            if (confirm("Voulez-vous vraiment supprimer ce thread ainsi que tous ses messages ?")) {
                const res = await authFetch("/api/threads/" + thread.id_threads, {
                    method: "DELETE"
                });
                if (res.ok === true) {
                    window.location.href = "/home";
                } else {
                    alert("Erreur lors de la suppression du thread.");
                }
            }
        });
        container.appendChild(delBtn);
    }

    // edition du titre du fil par l'auteur
    if (currentUser !== null && currentUser.id === thread.id_users) {
        const editBtn = document.createElement("button");
        editBtn.textContent = "Modifier le titre";
        editBtn.className = "thread-action-edit";
        editBtn.addEventListener("click", async function() {
            const newTitle = prompt("Modifier le titre du thread :", thread.titre);
            if (newTitle !== null && newTitle.trim() !== "") {
                const res = await authFetch("/api/threads/" + thread.id_threads, {
                    method: "PUT",
                    body: JSON.stringify({
                        titre: newTitle.trim(),
                        id_users: thread.id_users
                    })
                });
                if (res.ok === true) {
                    window.location.reload();
                } else {
                    alert("Erreur lors de la modification du titre.");
                }
            }
        });
        container.appendChild(editBtn);
    }

    buildCommentForm(id);
    await displayPosts(id);
}

// construit la zone d'ajout de message
function buildCommentForm(threadId) {
    const main = document.querySelector("main");
    if (main === null) {
        return;
    }

    const postsSection = document.createElement("section");
    postsSection.id = "comments";
    main.appendChild(postsSection);

    const form = document.createElement("div");
    form.id = "commentForm";

    const formTitle = document.createElement("h2");
    formTitle.textContent = "Ajouter un message";
    form.appendChild(formTitle);

    if (isLoggedIn() === false) {
        const loginMsg = document.createElement("p");
        loginMsg.innerHTML = 'Vous devez être connecté pour participer à la discussion. <a href="/login" style="color:#187B73;font-weight:bold;">Se connecter</a>';
        loginMsg.style.textAlign = "center";
        loginMsg.style.padding = "20px";
        form.appendChild(loginMsg);
        main.appendChild(form);
        return;
    }

    const textarea = document.createElement("textarea");
    textarea.id = "commentText";
    textarea.placeholder = "Écrire un message...";
    form.appendChild(textarea);

    const sendButton = document.createElement("button");
    sendButton.id = "sendComment";
    sendButton.textContent = "Envoyer";
    form.appendChild(sendButton);

    main.appendChild(form);

    sendButton.addEventListener("click", async function() {
        const content = textarea.value.trim();
        if (content === "") {
            alert("Le message ne peut pas être vide.");
            return;
        }

        const ok = await sendComment(threadId, content);

        if (ok === true) {
            textarea.value = "";
            await displayPosts(threadId);
        } else {
            alert("Erreur lors de l'envoi du message. Vérifiez que vous êtes bien connecté.");
        }
    });
}

// cree la barre de tri et de pagination pour les messages
function buildPostsToolbar(totalItems) {
    const old = document.querySelector("#posts-toolbar");
    if (old !== null) {
        old.remove();
    }

    const toolbar = document.createElement("div");
    toolbar.id = "posts-toolbar";
    toolbar.className = "posts-toolbar";

    // choix du tri
    const sortLabel = document.createElement("label");
    sortLabel.textContent = "Trier par : ";

    const sortSelect = document.createElement("select");
    const sortOptions = [
        { value: "recent", label: "Plus récents" },
        { value: "old", label: "Plus anciens" },
        { value: "popular", label: "Popularité" }
    ];

    for (let i = 0; i < sortOptions.length; i++) {
        const opt = sortOptions[i];
        const option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.label;
        if (opt.value === postsView.sortMode) {
            option.selected = true;
        }
        sortSelect.appendChild(option);
    }

    sortSelect.addEventListener("change", function() {
        postsView.sortMode = sortSelect.value;
        postsView.page = 1;
        renderPostsList();
    });

    sortLabel.appendChild(sortSelect);

    // calcul du nombre de pages
    let totalPages = 1;
    if (postsView.pageSize !== "all") {
        totalPages = Math.max(1, Math.ceil(totalItems / postsView.pageSize));
    }

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "← Précédent";
    prevBtn.disabled = (postsView.page <= 1);
    prevBtn.addEventListener("click", function() {
        postsView.page = postsView.page - 1;
        renderPostsList();
    });

    const pageInfo = document.createElement("span");
    pageInfo.textContent = "Page " + postsView.page + " / " + totalPages;

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Suivant →";
    nextBtn.disabled = (postsView.page >= totalPages);
    nextBtn.addEventListener("click", function() {
        postsView.page = postsView.page + 1;
        renderPostsList();
    });

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
        if (val === postsView.pageSize) {
            option.selected = true;
        }
        sizeSelect.appendChild(option);
    }

    sizeSelect.addEventListener("change", function() {
        const val = sizeSelect.value;
        if (val === "all") {
            postsView.pageSize = "all";
        } else {
            postsView.pageSize = Number(val);
        }
        postsView.page = 1;
        renderPostsList();
    });

    toolbar.appendChild(sortLabel);
    toolbar.appendChild(prevBtn);
    toolbar.appendChild(pageInfo);
    toolbar.appendChild(nextBtn);
    toolbar.appendChild(sizeSelect);

    const comments = document.querySelector("#comments");
    if (comments !== null) {
        comments.appendChild(toolbar);
    }
}

let currentPosts = [];
let currentVotes = [];
let currentThreadId = null;

// recupere les messages et votes et declenche l'affichage
async function displayPosts(threadId) {
    currentThreadId = threadId;

    const posts = await fetchPosts(threadId);
    const votes = await fetchAllVotes();

    currentPosts = posts;
    currentVotes = votes;
    postsView.page = 1;

    renderPostsList();
}

// affiche la liste des messages
async function renderPostsList() {
    const container = document.querySelector("#comments");
    if (container === null) {
        return;
    }

    // reinitialise la zone
    container.textContent = "";

    const title = document.createElement("h2");
    title.textContent = "Messages";
    container.appendChild(title);

    if (currentPosts.length === 0) {
        const p = document.createElement("p");
        p.textContent = "Soyez le premier à écrire un message dans ce thread !";
        container.appendChild(p);
        return;
    }

    const sorted = sortPosts(currentPosts, currentVotes);

    let pageItems = sorted;
    if (postsView.pageSize !== "all") {
        const start = (postsView.page - 1) * postsView.pageSize;
        const end = start + postsView.pageSize;
        pageItems = sorted.slice(start, end);
    }

    for (let i = 0; i < pageItems.length; i++) {
        const postCard = await renderPostCard(pageItems[i]);
        container.appendChild(postCard);
    }

    buildPostsToolbar(sorted.length);
}

// cree la carte html representant un message
async function renderPostCard(post) {
    const div = document.createElement("div");
    div.className = "comment";

    // zone de votes
    const voteBox = document.createElement("div");
    voteBox.className = "vote-box";

    const up = document.createElement("button");
    up.className = "upvote";
    up.textContent = "▲";

    const score = document.createElement("span");
    score.className = "score";
    score.textContent = computeScore(post.id_posts, currentVotes);

    const down = document.createElement("button");
    down.className = "downvote";
    down.textContent = "▼";

    voteBox.appendChild(up);
    voteBox.appendChild(score);
    voteBox.appendChild(down);
    div.appendChild(voteBox);

    // recuperation de l'auteur du message
    const user = await fetchUser(post.id_users);
    let pseudo = "Utilisateur #" + post.id_users;
    if (user !== null) {
        pseudo = user.name;
    }

    const textContainer = document.createElement("div");
    textContainer.style.flexGrow = "1";

    const userP = document.createElement("p");
    userP.textContent = pseudo;

    const content = document.createElement("p");
    content.textContent = post.posts;

    textContainer.appendChild(userP);
    textContainer.appendChild(content);
    div.appendChild(textContainer);

    const currentUser = getCurrentUserInfo();

    // suppression ou edition de message
    if (currentUser !== null && (currentUser.id === post.id_users || currentUser.role === "admin")) {
        const delBtn = document.createElement("button");
        delBtn.textContent = "×";
        delBtn.title = "Supprimer ce message";
        delBtn.style.alignSelf = "flex-start";
        delBtn.style.padding = "2px 8px";
        delBtn.style.fontSize = "1.2rem";
        delBtn.style.lineHeight = "1";
        delBtn.style.backgroundColor = "transparent";
        delBtn.style.color = "#c0392b";
        delBtn.style.border = "none";
        delBtn.style.cursor = "pointer";
        delBtn.style.fontWeight = "bold";
        delBtn.addEventListener("click", async function() {
            const ok = await showConfirmModal("Voulez-vous vraiment supprimer ce message ?");
            if (ok === true) {
                const res = await authFetch("/api/posts/" + post.id_posts, {
                    method: "DELETE"
                });
                if (res.ok === true) {
                    await displayPosts(currentThreadId);
                } else {
                    alert("Erreur lors de la suppression du message.");
                }
            }
        });

        if (currentUser.id === post.id_users) {
            const editBtn = document.createElement("button");
            editBtn.textContent = "✎";
            editBtn.title = "Modifier ce message";
            editBtn.style.alignSelf = "flex-start";
            editBtn.style.padding = "2px 8px";
            editBtn.style.fontSize = "1rem";
            editBtn.style.lineHeight = "1";
            editBtn.style.backgroundColor = "transparent";
            editBtn.style.color = "#187B73";
            editBtn.style.border = "none";
            editBtn.style.cursor = "pointer";
            editBtn.addEventListener("click", async function() {
                const newContent = await showPromptModal("Modifier le message :", post.posts);
                if (newContent !== null && newContent.trim() !== "") {
                    const res = await authFetch("/api/posts/" + post.id_posts, {
                        method: "PUT",
                        body: JSON.stringify({
                            posts: newContent.trim(),
                            id_users: post.id_users,
                            id_threads: post.id_threads
                        })
                    });
                    if (res.ok === true) {
                        await displayPosts(currentThreadId);
                    } else {
                        alert("Erreur lors de la modification du message.");
                    }
                }
            });
            div.appendChild(editBtn);
        }

        div.appendChild(delBtn);
    }

    // clics sur les boutons de votes
    up.addEventListener("click", async function() {
        const ok = await votePost(post.id_posts, true, currentVotes);
        if (ok === true) {
            await displayPosts(currentThreadId);
        }
    });

    down.addEventListener("click", async function() {
        const ok = await votePost(post.id_posts, false, currentVotes);
        if (ok === true) {
            await displayPosts(currentThreadId);
        }
    });

    return div;
}

document.addEventListener("DOMContentLoaded", displayThreadById);
