// page d'inscription

// verifie les regles de securite du mot de passe
// renvoie un texte d'erreur ou null
function checkPasswordRules(password) {
    if (password.length < 12) {
        return "Le mot de passe doit contenir au moins 12 caractères.";
    }

    const hasUppercase = /[A-Z]/.test(password);
    if (hasUppercase === false) {
        return "Le mot de passe doit contenir au moins une majuscule.";
    }

    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
    if (hasSpecialChar === false) {
        return "Le mot de passe doit contenir au moins un caractère spécial.";
    }

    return null;
}

// envoie les donnees d'inscription au serveur backend
async function registerUser() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorBox = document.getElementById("signupError");

    errorBox.textContent = "";

    if (name === "" || email === "" || password === "") {
        errorBox.textContent = "Merci de remplir tous les champs.";
        return;
    }

    const passwordError = checkPasswordRules(password);
    if (passwordError !== null) {
        errorBox.textContent = passwordError;
        return;
    }

    const newUser = {
        name: name,
        email: email,
        password: password,
        date_creation: new Date().toISOString(),
        id_roles: 1
    };

    try {
        const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        });

        if (res.status === 201) {
            window.location.href = "/login";
            return;
        }

        const json = await res.json().catch(function() { return null; });

        if (json && json.error && json.error.toLowerCase().indexOf("duplicata") !== -1) {
            errorBox.textContent = "Ce nom d'utilisateur ou cet email est déjà utilisé.";
            return;
        }

        if (json && json.error) {
            errorBox.textContent = json.error;
        } else {
            errorBox.textContent = "Erreur lors de la création du compte.";
        }
    } catch (error) {
        console.error("erreur signup :", error);
        errorBox.textContent = "Impossible de contacter le serveur. Réessayez plus tard.";
    }
}

// cree les elements html du formulaire d'inscription
function showSignupForm() {
    const panel = document.getElementById("inscription");
    if (panel === null) {
        return;
    }

    panel.replaceChildren();

    const title = document.createElement("h2");
    title.textContent = "Inscription";

    const form = document.createElement("form");
    form.id = "signupForm";
    form.className = "formulaire";

    // champ nom d'utilisateur
    const nameGroup = document.createElement("div");
    nameGroup.className = "form-group";

    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Nom d'utilisateur :";
    nameLabel.htmlFor = "name";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "name";
    nameInput.required = true;

    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);

    // champ email
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

    // champ mot de passe
    const passGroup = document.createElement("div");
    passGroup.className = "form-group";

    const passLabel = document.createElement("label");
    passLabel.textContent = "Mot de passe :";
    passLabel.htmlFor = "password";

    const passInput = document.createElement("input");
    passInput.type = "password";
    passInput.id = "password";
    passInput.required = true;

    const passHint = document.createElement("small");
    passHint.className = "form-hint";
    passHint.textContent = "Au moins 12 caractères, 1 majuscule et 1 caractère spécial.";

    passGroup.appendChild(passLabel);
    passGroup.appendChild(passInput);
    passGroup.appendChild(passHint);

    // zone de message d'erreur
    const errorBox = document.createElement("p");
    errorBox.id = "signupError";
    errorBox.className = "form-error";

    // bouton de validation
    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = "Créer un compte";

    form.appendChild(nameGroup);
    form.appendChild(emailGroup);
    form.appendChild(passGroup);
    form.appendChild(errorBox);
    form.appendChild(submit);

    panel.appendChild(title);
    panel.appendChild(form);

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        registerUser();
    });
}

document.addEventListener("DOMContentLoaded", function() {
    if (isLoggedIn() === true) {
        window.location.href = "/home";
        return;
    }
    showSignupForm();
});