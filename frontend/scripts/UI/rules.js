const container = document.querySelector("#rules-content");

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
        "Les cookies servent à mémoriser vos préférences et derniers posts vus.",
        "Vos données ne sont jamais revendues.",
        "Vous pouvez demander la suppression de votre compte à tout moment."
    ]
};

// Création du bloc principal
const wrapper = document.createElement("div");
wrapper.className = "rules-box";

// Titre Règles
const h1Rules = document.createElement("h1");
h1Rules.textContent = "Règles de la communauté";
wrapper.appendChild(h1Rules);

// Liste règles
const ulRules = document.createElement("ul");
rulesData.rules.forEach(r => {
    const li = document.createElement("li");
    li.textContent = r;
    ulRules.appendChild(li);
});
wrapper.appendChild(ulRules);

// Titre Confidentialité
const h1Privacy = document.createElement("h1");
h1Privacy.textContent = "Confidentialité";
wrapper.appendChild(h1Privacy);

// Liste confidentialité
const ulPrivacy = document.createElement("ul");
rulesData.privacy.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p;
    ulPrivacy.appendChild(li);
});
wrapper.appendChild(ulPrivacy);

// Injection finale
container.appendChild(wrapper);
