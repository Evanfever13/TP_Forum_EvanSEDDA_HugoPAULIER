// fonctions utilisees sur plusieurs pages
// cookie, jwt token et appels api

// -----------------------------
// COOKIES
// -----------------------------

function setCookie(name, value, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
    const cookieArray = document.cookie.split(";");
    for (let c of cookieArray) {
        c = c.trim();
        if (c.startsWith(name + "=")) {
            return decodeURIComponent(c.substring(name.length + 1));
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
}

// -----------------------------
// TOKEN
// -----------------------------

const TOKEN_KEY = "yask_token";

function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

// -----------------------------
// JWT
// -----------------------------

function decodeToken(token) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;

        const payloadBase64 = parts[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const jsonString = atob(payloadBase64);
        return JSON.parse(jsonString);
    } catch {
        return null;
    }
}

function getCurrentUserInfo() {
    const token = getToken();
    if (!token) return null;

    const payload = decodeToken(token);
    if (!payload) return null;

    const now = Date.now() / 1000;
    if (payload.exp && now > payload.exp) {
        clearToken();
        return null;
    }

    return {
        id: payload.user_id,
        role: payload.role
    };
}

function isLoggedIn() {
    return getCurrentUserInfo() !== null;
}

function isAdmin() {
    const user = getCurrentUserInfo();
    return user && user.role === "admin";
}

function logout() {
    clearToken();
    deleteCookie("userId"); // si tu utilises encore ce cookie
    window.location.href = "/home";
}

// AUTH FETCH

async function authFetch(url, options = {}) {
    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    const fetchOptions = {
        ...options,
        headers
    };

    return fetch(url, fetchOptions);
}
