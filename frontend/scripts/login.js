// page de connexion

// envoie les identifiants au serveur et stocke le token recu
async function loginUser() {
    let username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const errorBox = document.getElementById("loginError");

    errorBox.textContent = "";

    if (username === "" || password === "") {
        errorBox.textContent = "Merci de remplir tous les champs.";
        return;
    }

    // si c'est un email, on resout le nom d'utilisateur correspondant
    if (username.indexOf("@") !== -1) {
        try {
            const usersRes = await fetch("/api/users");
            if (usersRes.ok === true) {
                const users = await usersRes.json();
                let matchedUser = null;
                for (let i = 0; i < users.length; i++) {
                    if (users[i].email.toLowerCase() === username.toLowerCase()) {
                        matchedUser = users[i];
                        break;
                    }
                }
                if (matchedUser !== null) {
                    username = matchedUser.name;
                } else {
                    errorBox.textContent = "Nom d'utilisateur ou mot de passe incorrect.";
                    return;
                }
            } else {
                errorBox.textContent = "Impossible de contacter le serveur pour verifier l'adresse email.";
                return;
            }
        } catch (error) {
            console.error("erreur de resolution d'email :", error);
            errorBox.textContent = "Impossible de contacter le serveur. Réessayez plus tard.";
            return;
        }
    }

    try {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password: password })
        });

        const json = await res.json().catch(function() { return null; });

        if (res.ok === false || json === null || json.access_token === undefined) {
            errorBox.textContent = "Nom d'utilisateur ou mot de passe incorrect.";
            return;
        }

        saveToken(json.access_token);
        window.location.href = "/home";
    } catch (error) {
        console.error("erreur de connexion :", error);
        errorBox.textContent = "Impossible de contacter le serveur. Réessayez plus tard.";
    }
}

// construit le formulaire de connexion
function showLoginForm() {
    const panel = document.getElementById("connection");
    if (panel === null) {
        return;
    }

    panel.replaceChildren();

    const title = document.createElement("h2");
    title.textContent = "Connexion";

    const form = document.createElement("form");
    form.id = "loginForm";
    form.className = "formulaire";

    // champ nom d'utilisateur ou email
    const userGroup = document.createElement("div");
    userGroup.className = "form-group";

    const userLabel = document.createElement("label");
    userLabel.textContent = "Nom d'utilisateur ou Email :";
    userLabel.htmlFor = "username";

    const userInput = document.createElement("input");
    userInput.type = "text";
    userInput.id = "username";
    userInput.autocomplete = "username";
    userInput.required = true;

    userGroup.appendChild(userLabel);
    userGroup.appendChild(userInput);

    // champ mot de passe
    const passGroup = document.createElement("div");
    passGroup.className = "form-group";

    const passLabel = document.createElement("label");
    passLabel.textContent = "Mot de passe :";
    passLabel.htmlFor = "password";

    const passInput = document.createElement("input");
    passInput.type = "password";
    passInput.id = "password";
    passInput.autocomplete = "current-password";
    passInput.required = true;

    passGroup.appendChild(passLabel);
    passGroup.appendChild(passInput);

    // zone de message d'erreur
    const errorBox = document.createElement("p");
    errorBox.id = "loginError";
    errorBox.className = "form-error";

    // bouton de validation
    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = "Se connecter";

    form.appendChild(userGroup);
    form.appendChild(passGroup);
    form.appendChild(errorBox);
    form.appendChild(submit);

    panel.appendChild(title);
    panel.appendChild(form);

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        loginUser();
    });
}

document.addEventListener("DOMContentLoaded", function() {
    if (isLoggedIn() === true) {
        window.location.href = "/home";
        return;
    }
    showLoginForm();
});