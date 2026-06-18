// page de profil de l'utilisateur connecte

// recupere les donnees d'un utilisateur par son identifiant
async function fetchUser(userId) {
    try {
        const response = await fetch("/api/users/" + userId, { credentials: "include" });
        if (response.ok === false) {
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("erreur api :", error);
        return null;
    }
}

// formate une date brute en format lisible jj/mm/aaaa
function formatDate(rawDate) {
    if (rawDate === undefined || rawDate === null || rawDate === "") {
        return "Date inconnue";
    }

    const date = new Date(rawDate);
    const timeValue = date.getTime();
    if (isNaN(timeValue) === true) {
        return rawDate;
    }

    return date.toLocaleDateString("fr-FR");
}

// affiche les informations de l'utilisateur sur la page
async function displayInformationProfil() {
    const panel = document.getElementById("profil");
    if (panel === null) {
        return;
    }

    const currentUser = getCurrentUserInfo();

    if (currentUser === null) {
        window.location.href = "/login";
        return;
    }

    const user = await fetchUser(currentUser.id);

    if (user === null) {
        panel.replaceChildren();
        const p = document.createElement("p");
        p.textContent = "Erreur lors de la récupération de votre profil.";
        panel.appendChild(p);
        return;
    }

    panel.replaceChildren();

    const title = document.createElement("h2");
    title.textContent = "Mon profil";

    const div = document.createElement("div");
    div.className = "profil-card";

    const h2 = document.createElement("h2");
    h2.textContent = user.name;

    const pEmail = document.createElement("p");
    pEmail.textContent = "Email : " + user.email;

    const pDate = document.createElement("p");
    pDate.textContent = "Créé le : " + formatDate(user.date_creation);

    const pRole = document.createElement("p");
    if (currentUser.role === "admin") {
        pRole.textContent = "Rôle : Administrateur";
    } else {
        pRole.textContent = "Rôle : Membre";
    }

    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Se déconnecter";
    logoutBtn.className = "btn-logout";
    logoutBtn.addEventListener("click", logout);

    div.appendChild(h2);
    div.appendChild(pEmail);
    div.appendChild(pDate);
    div.appendChild(pRole);
    div.appendChild(logoutBtn);

    panel.appendChild(title);
    panel.appendChild(div);

    // partie admin pour lister et bannir les utilisateurs
    if (isAdmin() === true) {
        const adminSection = document.createElement("div");
        adminSection.className = "admin-users-panel";

        const adminTitle = document.createElement("h3");
        adminTitle.textContent = "Administration (Bannir des utilisateurs)";
        adminTitle.className = "admin-users-title";
        adminSection.appendChild(adminTitle);

        try {
            const usersRes = await fetch("/api/users");
            if (usersRes.ok === true) {
                const usersList = await usersRes.json();
                const ul = document.createElement("ul");
                ul.className = "admin-users-list";
                
                for (let i = 0; i < usersList.length; i++) {
                    const u = usersList[i];
                    if (u.id_users === currentUser.id) {
                        continue;
                    }

                    const li = document.createElement("li");
                    li.className = "admin-users-item";

                    const nameSpan = document.createElement("span");
                    nameSpan.textContent = u.name + " (" + u.email + ")";

                    const banBtn = document.createElement("button");
                    banBtn.textContent = "Bannir";
                    banBtn.className = "admin-ban-btn";
                    
                    banBtn.addEventListener("click", async function() {
                        if (confirm("Voulez-vous vraiment bannir l'utilisateur " + u.name + " ?") === true) {
                            const delRes = await authFetch("/api/users/" + u.id_users, {
                                method: "DELETE"
                            });
                            if (delRes.ok === true) {
                                alert("Utilisateur banni avec succès.");
                                displayInformationProfil();
                            } else {
                                alert("Erreur lors de la suppression de l'utilisateur.");
                            }
                        }
                    });

                    li.appendChild(nameSpan);
                    li.appendChild(banBtn);
                    ul.appendChild(li);
                }
                adminSection.appendChild(ul);
            }
        } catch (err) {
            console.error("erreur de recuperation des utilisateurs :", err);
        }

        panel.appendChild(adminSection);
    }
}

document.addEventListener("DOMContentLoaded", displayInformationProfil);