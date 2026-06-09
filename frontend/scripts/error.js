
/* fonction pour facilité la création d’un item <li><a> */
function createNavItem(text, href = "#", img = null) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = href;

    if (img) {
        const image = document.createElement("img");
        image.src = img.src;
        image.alt = img.alt;
        a.appendChild(image);
    } else {
        a.textContent = text;
    }

    li.appendChild(a);
    return li;
}

/* le mini-header Ynov */
const miniHeader = document.querySelector("#mini-header");
const miniNav = document.createElement("div");
miniNav.className = "mini-nav";

function createMiniLink(text, href = "#") {
    const a = document.createElement("a");
    a.textContent = text;
    a.href = href;
    return a;
}

miniNav.appendChild(createMiniLink("Ymatch", "https://ymatch.ynov.com"));
miniNav.appendChild(createMiniLink("Extranet", "https://extranet.ynov.com"));
miniNav.appendChild(createMiniLink("Ecole", "https://www.ynov.com"));
miniHeader.appendChild(miniNav);

/* le header */
async function buildHeader() {
    const header = document.querySelector("header");
    const user = await fetchUser();

    const logoDiv = document.createElement("div");
    logoDiv.className = "logo";

    const logoImg = document.createElement("img");
    logoImg.src = "../assets/img/logo/logo.png";
    logoImg.alt = "logo";
    logoDiv.appendChild(logoImg);

    const nav = document.createElement("nav");
    const ul = document.createElement("ul");
    ul.className = "nav-links";

    if (user) {
        ul.appendChild(createNavItem(user.name, "/profil"));
        ul.appendChild(createNavItem("Déconnexion", "/logout"));
    } else {
        ul.appendChild(createNavItem("Connexion", "/login"));
        ul.appendChild(createNavItem("Inscription", "/signup"));
    }

    nav.appendChild(ul);
    header.replaceChildren(logoDiv, nav);
}

buildHeader();

async function errorHandler(reponse) {
    
}
