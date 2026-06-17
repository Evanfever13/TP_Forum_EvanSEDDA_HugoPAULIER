/* Afficher le formulaire de création du thread */
async function buildFormularThread() {
    const panel = document.getElementById("submit"); 
    panel.replaceChildren();

    const title = document.createElement("h1");
    title.textContent = "Créer un nouveau thread";

    const form = document.createElement("form");
    form.id = "threadForm";
    form.className = "formulaire";

    /* Titre du thread */
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

    /* Bouton */
    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = "Publier le thread";

    form.appendChild(titleGroup);
    form.appendChild(submit);

    panel.appendChild(title);
    panel.appendChild(form);

    form.addEventListener("submit", e => {
        e.preventDefault();
        submitThread();
    });
}

buildFormularThread();


/* fonction qui envoie les données */
async function submitThread() {
    const title = document.getElementById("threadTitle").value.trim();
    const userId = localStorage.getItem("userId");

    if (!title || !userId) {
        alert("Veuillez remplir tous les champs");
        return;
    }

    try {
        const res = await fetch("/api/threads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title,
                id_users: userId
            })
        });

        if (!res.ok) {
            console.log("Status serveur :", res.status);
            console.log("Réponse brute :", await res.text());
            throw new Error("Erreur lors de la création du thread");
        }

        alert("Thread créé !");
        window.location.href = "/home";

    } catch (err) {
        alert("Erreur : " + err.message);
        console.error("Erreur submitThread :", err);
    }
}
