/* rules.js Page des règles de la communauté et de confidentialité */

const rulesData = {
    rules: [
        "Restez courtois et respectueux.",
        "Aucune insulte ou harcèlement.",
        "Pas de spam ni de publicité.",
        "Publiez dans la bonne catégorie.",
        "Cherchez avant de poster un sujet."
    ],
    privacy: [
        "Nous collectons uniquement les données nécessaires au fonctionnement du site.",
        "Les cookies servent à mémoriser vos préférences et vos derniers posts vus.",
        "Vos données ne sont jamais revendues.",
        "Vous pouvez demander la suppression de votre compte à tout moment."
    ]
};

function buildList(items) {
    const ul = document.createElement("ul");
    items.forEach(text => {
        const li = document.createElement("li");
        li.textContent = text;
        ul.appendChild(li);
    });
    return ul;
}

function displayRules() {
    const container = document.querySelector("#rules-content");
    if (!container) return;

    const wrapper = document.createElement("div");
    wrapper.className = "rules-box";

    const h1Rules = document.createElement("h1");
    h1Rules.textContent = "Règles de la communauté";
    wrapper.appendChild(h1Rules);
    wrapper.appendChild(buildList(rulesData.rules));

    const h1Privacy = document.createElement("h1");
    h1Privacy.textContent = "Confidentialité";
    wrapper.appendChild(h1Privacy);
    wrapper.appendChild(buildList(rulesData.privacy));

    container.appendChild(wrapper);
}

document.addEventListener("DOMContentLoaded", displayRules);