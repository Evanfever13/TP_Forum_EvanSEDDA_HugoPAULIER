// page de creation d'un nouveau fil de discussion

// construit le formulaire html de creation de fil
function buildFormularThread() {
    const panel = document.getElementById("submit");
    if (panel === null) {
        return;
    }
    panel.replaceChildren();

    if (isLoggedIn() === false) {
        const p = document.createElement("p");
        p.textContent = "Vous devez être connecté pour créer un thread.";
        panel.appendChild(p);
        window.location.href = "/login";
        return;
    }

    const title = document.createElement("h1");
    title.textContent = "Créer un nouveau thread";

    const form = document.createElement("form");
    form.id = "threadForm";
    form.className = "formulaire";

    // titre du fil
    const titleGroup = document.createElement("div");
    titleGroup.className = "form-group";

    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Titre du thread :";
    titleLabel.htmlFor = "threadTitle";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "threadTitle";
    titleInput.required = true;

    titleGroup.appendChild(titleLabel);
    titleGroup.appendChild(titleInput);

    // message initial du fil
    const contentGroup = document.createElement("div");
    contentGroup.className = "form-group";

    const contentLabel = document.createElement("label");
    contentLabel.textContent = "Message initial :";
    contentLabel.htmlFor = "threadContent";

    const contentInput = document.createElement("textarea");
    contentInput.id = "threadContent";
    contentInput.required = true;

    contentGroup.appendChild(contentLabel);
    contentGroup.appendChild(contentInput);

    // zone d'affichage des erreurs
    const errorBox = document.createElement("p");
    errorBox.id = "submitError";
    errorBox.className = "form-error";

    // bouton de validation
    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = "Publier le thread";

    form.appendChild(titleGroup);
    form.appendChild(contentGroup);
    form.appendChild(errorBox);
    form.appendChild(submit);

    panel.appendChild(title);
    panel.appendChild(form);

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        submitThread();
    });
}

document.addEventListener("DOMContentLoaded", buildFormularThread);

// envoie les donnees de creation de fil au serveur
async function submitThread() {
    const title = document.getElementById("threadTitle").value.trim();
    const content = document.getElementById("threadContent").value.trim();
    const errorBox = document.getElementById("submitError");
    const user = getCurrentUserInfo();

    errorBox.textContent = "";

    if (title === "" || content === "") {
        errorBox.textContent = "Le titre et le message initial ne peuvent pas être vides.";
        return;
    }

    if (user === null) {
        errorBox.textContent = "Vous devez être connecté.";
        return;
    }

    try {
        const res = await authFetch("/api/threads", {
            method: "POST",
            body: JSON.stringify({
                titre: title,
                id_users: user.id
            })
        });

        if (res.ok === false) {
            errorBox.textContent = "Erreur lors de la création du thread.";
            return;
        }

        const newThread = await res.json();

        // envoie le premier message du fil de discussion
        const postRes = await authFetch("/api/posts", {
            method: "POST",
            body: JSON.stringify({
                posts: content,
                id_users: user.id,
                id_threads: newThread.id_threads
            })
        });

        if (postRes.ok === false) {
            errorBox.textContent = "Thread créé, mais erreur lors de la publication du message initial.";
            return;
        }

        window.location.href = "/thread/" + newThread.id_threads;
    } catch (error) {
        console.error("erreur submit :", error);
        errorBox.textContent = "Impossible de contacter le serveur. Réessayez plus tard.";
    }
}