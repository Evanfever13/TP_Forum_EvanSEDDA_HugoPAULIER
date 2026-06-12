function createNavItem(text, href = "#", img = null, onClick = null) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = href;
 
    if (onClick) {
        a.addEventListener("click", (e) => {
            e.preventDefault();
            onClick();
        });
    }
 
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
 
function createMiniLink(text, href = "#") {
    const a = document.createElement("a");
    a.textContent = text;
    a.href = href;
    return a;
}
 
function buildMiniHeader() {
    const miniHeader = document.querySelector("#mini-header");
    if (!miniHeader) return;
 
    const miniNav = document.createElement("div");
    miniNav.className = "mini-nav";
 
    miniNav.appendChild(createMiniLink("Ymatch", "https://ymatch.ynov.com"));
    miniNav.appendChild(createMiniLink("Extranet", "https://extranet.ynov.com"));
    miniNav.appendChild(createMiniLink("Ecole", "https://www.ynov.com"));
 
    miniHeader.appendChild(miniNav);
}
 
async function fetchCurrentUser() {
    const userId = localStorage.getItem("userId");
    if (!userId) return null; 
 
    try {
        const res = await fetch(`/api/users/${userId}`, { credentials: "include" });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}
 
async function logout() {
    localStorage.removeItem("userId");
    window.location.href = "/home";
}
 
async function buildHeader() {
    const header = document.querySelector("header");
    if (!header) return;
 
    const user = await fetchCurrentUser();
 
    const logoDiv = document.createElement("div");
    logoDiv.className = "logo";
 
    const logoImg = document.createElement("img");
    logoImg.src = "/assets/img/logo/logo.png";
    logoImg.alt = "logo";
    logoDiv.appendChild(logoImg);
 
    const nav = document.createElement("nav");
    const ul = document.createElement("ul");
    ul.className = "nav-links";
 
    if (user) {
        ul.appendChild(createNavItem(user.name, "/profil"));
        ul.appendChild(createNavItem("Déconnexion", "#", null, logout));
    } else {
        ul.appendChild(createNavItem("Connexion", "/login"));
        ul.appendChild(createNavItem("Inscription", "/signup"));
    }
 
    nav.appendChild(ul);
    header.replaceChildren(logoDiv, nav);
}
 
document.addEventListener("DOMContentLoaded", () => {
    buildMiniHeader();
    buildHeader();
});