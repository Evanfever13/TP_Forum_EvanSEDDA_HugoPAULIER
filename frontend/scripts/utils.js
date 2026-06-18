// fonctions utilisees sur plusieurs pages
// cookie, jwt token et appels api

// ecrit un cookie dans le navigateur
function setCookie(name, value, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = date.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expires + "; path=/; SameSite=Lax";
}

// lit un cookie dans le navigateur
function getCookie(name) {
    const cookieArray = document.cookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
        const c = cookieArray[i].trim();
        if (c.indexOf(name + "=") === 0) {
            return decodeURIComponent(c.substring(name.length + 1));
        }
    }
    return null;
}

// supprime un cookie du navigateur
function deleteCookie(name) {
    document.cookie = name + "=; Max-Age=0; path=/; SameSite=Lax";
}

const TOKEN_KEY = "yask_token";

// enregistre le token de connexion
function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

// recupere le token de connexion
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// efface le token de connexion
function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

// decode un token jwt pour lire les donnees
function decodeToken(token) {
    try {
        const parts = token.split(".");
        const payloadBase64 = parts[1];
        const base64Clean = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
        const jsonString = atob(base64Clean);
        return JSON.parse(jsonString);
    } catch (error) {
        return null;
    }
}

// renvoie les informations de l'utilisateur connecte
function getCurrentUserInfo() {
    const token = getToken();
    if (token === null) {
        return null;
    }

    const payload = decodeToken(token);
    if (payload === null) {
        return null;
    }

    // verifie si le token est expire
    const nowInSeconds = Date.now() / 1000;
    if (payload.exp && nowInSeconds > payload.exp) {
        clearToken();
        return null;
    }

    return {
        id: payload.user_id,
        role: payload.role
    };
}

// verifie si l'utilisateur est connecte
function isLoggedIn() {
    const user = getCurrentUserInfo();
    if (user !== null) {
        return true;
    }
    return false;
}

// verifie si l'utilisateur est admin
function isAdmin() {
    const user = getCurrentUserInfo();
    if (user !== null && user.role === "admin") {
        return true;
    }
    return false;
}

// deconnecte l'utilisateur et recharge la page
function logout() {
    clearToken();
    window.location.href = "/home";
}

// fait une requete fetch en ajoutant le token d'autorisation
async function authFetch(url, options = {}) {
    const token = getToken();

    let headers = {};
    headers["Content-Type"] = "application/json";

    if (options.headers) {
        for (let key in options.headers) {
            headers[key] = options.headers[key];
        }
    }

    if (token !== null) {
        headers["Authorization"] = "Bearer " + token;
    }

    let fetchOptions = {};
    for (let key in options) {
        fetchOptions[key] = options[key];
    }
    fetchOptions.headers = headers;

    return fetch(url, fetchOptions);
}

