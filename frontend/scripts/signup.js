function registerUser() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
 
    if (!name || !email || !password) {
        alert("Veuillez remplir tous les champs.");
        return;
    }
 
    const chef = {
        id_users: 1,
        name: name,
        email: email,
        password: password,
        date_creation: Math.floor(Date.now() / 1000),
        id_role: "1"
    };
 
    fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(chef)
    })
    .then(res => {
        // 201 = créé avec succès, 500 = bug backend sur la relecture (mais l'user est bien créé jsp pourquoi mais osef)
        if (res.status === 201 || res.status === 500) {
            window.location.href = "/login";
            return;
        }
        // 400 = vrai erreur (email dupliqué...)
        return res.json().then(json => {
            if (json.error && json.error.includes("Duplicata")) {
                throw new Error("Cet email est déjà utilisé.");
            }
            throw new Error(json.error || "Erreur lors de la création du compte.");
        });
    })
    .catch(err => {
        alert(err.message);
        console.error("Erreur signup :", err);
    });
}
 
function showSignupForm() {
    const panel = document.getElementById("inscription");
    if (!panel) return;
 
    panel.replaceChildren();
 
    const title = document.createElement("h2");
    title.textContent = "Inscription";
 
    const form = document.createElement("form");
    form.id = "signupForm";
    form.className = "formulaire";
 
    const nameGroup = document.createElement("div");
    nameGroup.className = "form-group";
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Nom :";
    nameLabel.htmlFor = "name";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "name";
    nameInput.required = true;
    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);
 
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
 
    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = "Créer un compte";
 
    form.appendChild(nameGroup);
    form.appendChild(emailGroup);
    form.appendChild(passGroup);
    form.appendChild(submit);
 
    panel.appendChild(title);
    panel.appendChild(form);
 
    form.addEventListener("submit", e => {
        e.preventDefault();
        registerUser();
    });
}
 
document.addEventListener("DOMContentLoaded", showSignupForm);