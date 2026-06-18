/* Récupère l'userId depuis le cookie */
async function getUserId() {
    const cookie = await cookieStore.get("userId");
    return cookie?.value || null;
}

/* Récupère un utilisateur via l'API */
async function fetchUser(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            credentials: "include"
        });

        if (!response.ok) return null;

        return await response.json();
    } catch (error) {
        console.error("Erreur API :", error);
        return null;
    }
}

/* Affichage du profil */
async function displayInformationProfil() {
    const panel = document.getElementById("profil");

    const userId = await getUserId(); // 🔥 FIX ICI

    if (!userId) {
        alert("Vous devez être connecté pour accéder à votre profil.");
        window.location.href = "/login";
        return;
    }

    const user = await fetchUser(userId);

    if (!user) {
        alert("Erreur lors de la récupération des informations de l'utilisateur.");
        return;
    }

    panel.replaceChildren();

    const title = document.createElement("h2");
    title.textContent = "Mon Profil";

    const div = document.createElement("div");
    div.className = "profil-card";

    const h2 = document.createElement("h2");
    h2.textContent = user.name;

    const pEmail = document.createElement("p");
    pEmail.textContent = "Email : " + user.email;

    const pDate = document.createElement("p");
    pDate.textContent = "Créé le : " + (user.date_creation || "N/A");

    div.appendChild(h2);
    div.appendChild(pEmail);
    div.appendChild(pDate);

    panel.appendChild(title);
    panel.appendChild(div);
}

displayInformationProfil();
