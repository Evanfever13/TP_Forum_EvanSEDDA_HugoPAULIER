/* fonction pour se connecter */
function loginUser() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Veuillez remplir tous les champs");
        return;
    }

    fetch("/api/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
    .then(async res => {
        if (!res.ok) throw new Error("Erreur de communication avec le serveur");
        const users = await res.json();
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error("Identifiants incorrects");
        }
        
        localStorage.setItem("userId", user.id_users);
        
        window.location.href = "/home";
    })
    .catch(err => {
        alert("Erreur de connexion : " + err.message);
        console.error("Erreur login :", err);
    });
}

/* afficher le formulaire de connexion */
function showLoginForm() {
    const panel = document.getElementById("connection");
    if (!panel) return;

    panel.replaceChildren();

    const title = document.createElement("h2");
    title.textContent = "Connexion";

    const form = document.createElement("form");
    form.id = "loginForm";
    form.className = "formulaire";

    /* Champ Email */
    const emailGroup = document.createElement("div");
    emailGroup.className = "form-group";

    const emailLabel = document.createElement("label");
    emailLabel.textContent = "Email :";
    emailLabel.htmlFor = "email";

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.id = "email";
    emailInput.required = true;

    emailGroup.appendChild(emailLabel);
    emailGroup.appendChild(emailInput);

    /* Champ Mot de passe */
    const passGroup = document.createElement("div");
    passGroup.className = "form-group";

    const passLabel = document.createElement("label");
    passLabel.textContent = "Mot de passe :";
    passLabel.htmlFor = "password";

    const passInput = document.createElement("input");
    passInput.type = "password";
    passInput.id = "password";
    passInput.required = true;

    passGroup.appendChild(passLabel);
    passGroup.appendChild(passInput);

    /* Bouton Submit */
    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = "Se connecter";

    form.appendChild(emailGroup);
    form.appendChild(passGroup);
    form.appendChild(submit);

    panel.appendChild(title);
    panel.appendChild(form);

    form.addEventListener("submit", e => {
        e.preventDefault();
        loginUser();
    });
}

document.addEventListener("DOMContentLoaded", showLoginForm);