// ===========================================
// UI.JS
// NIC Domain Finder Premium
// Auteur : Fatou Lamine THIAM
// ===========================================

function displayResult(data){

    const homeContent = document.getElementById("homeContent");

if(homeContent){

    homeContent.classList.add("fade-out");

    setTimeout(()=>{

        homeContent.style.display = "none";

    },350);

}

    const resultSection =
    document.getElementById("resultSection");

    const suggestionsSection =
    document.getElementById("suggestionsSection");

    const suggestionsGrid =
    document.getElementById("suggestionsGrid");

    resultSection.classList.remove("hidden");

    suggestionsSection.classList.add("hidden");

    resultSection.innerHTML = "";

    suggestionsGrid.innerHTML = "";

    // ==========================
    // Badge
    // ==========================

    let badgeClass = "";

    if(data.reserved){

        badgeClass = "reserved";

    }

    else if(data.available){

        badgeClass = "available";

    }

    else{

        badgeClass = "registered";

    }

    // ==========================
    // Traduction statut
    // ==========================

    let statusText = "-";

    switch(data.status){

        case "available":

            statusText = "Disponible";

            break;

        case "registered":

            statusText = "Déjà enregistré";

            break;

        case "reserved":

            statusText = "Réservé";

            break;

        default:

            statusText = data.status ?? "-";

    }

    // ==========================
    // WHOIS
    // ==========================

    const whoisText =

        data.available

        ?

        "Non applicable"

        :

        "Disponible";

    // ==========================
    // Conseil
    // ==========================

    const advice =

        data.available

        ?

        "Ce domaine semble disponible. Pensez à l'enregistrer rapidement auprès d'un registrar agréé."

        :

        "Ce domaine est déjà enregistré. Consultez les informations WHOIS pour davantage de détails.";

   

    let html = `

<div class="result-card fade-in">

<div class="badge ${badgeClass}">

${data.icon}

${data.badge}

</div>

<h2 class="domain-title">

${data.domain}

</h2>

<p class="message">

${data.displayMessage}

</p>

<div class="info-grid">

<div class="info-box">

<h4>Statut</h4>

<p>${statusText}</p>

</div>

<div class="info-box">

<h4>Registrar</h4>

<p>${data.registrar ?? "NIC Sénégal"}</p>

</div>

<div class="info-box">

<h4>Création</h4>

<p>${formatDate(data.created)}</p>

</div>

<div class="info-box">

<h4>Expiration</h4>

<p>${formatDate(data.expires)}</p>

</div>

<div class="info-box">

<h4>Source</h4>

<p>${data.source ?? "NIC Sénégal"}</p>

</div>

<div class="info-box">

<h4>WHOIS</h4>

<p>${whoisText}</p>

</div>

</div>
`;
    // ==========================
    // DNS
    // ==========================

    if(data.nameservers && data.nameservers.length){

        html += `

<div class="nameservers">

<h3>

Serveurs DNS

</h3>

<ul>

${data.nameservers.map(ns=>`<li>${ns}</li>`).join("")}

</ul>

</div>

`;

    }

    // ==========================
    // Conseil
    // ==========================

    html += `

<div class="info-box mt-20">

<h4>

💡 Conseil

</h4>

<p>

${advice}

</p>

</div>



    // ==========================
    // Suggestions
    // ==========================

    if(data.suggestions && data.suggestions.length){

        suggestionsSection.classList.remove("hidden");

        data.suggestions.forEach(item=>{

            const card = document.createElement("div");

            card.className = "suggestion-card fade-in";

            card.innerHTML = `

<div class="suggestion-left">

<div class="suggestion-domain">

${item.domain}

</div>

<div class="suggestion-meta">

<span class="available-dot"></span>

Disponible • ${
item.length ??
item.domain.replace(".sn","").length
} caractères

</div>

</div>

<div class="suggestion-actions">

<button

class="copy-btn"

onclick="copy('${item.domain}')">

📋

</button>

<button

class="test-btn"

onclick="testSuggestion('${item.domain}')">

Tester

</button>

</div>

`;

            suggestionsGrid.appendChild(card);

        });

    }

}
// ===========================================
// DASHBOARD
// ===========================================

function loadDashboard(){

    const searchCount =
    document.getElementById("searchCount");

    const availableCount =
    document.getElementById("availableCount");

    const lastSearch =
    document.getElementById("lastSearch");

    const total =
    Number(localStorage.getItem("searchCount") || 0);

    const available =
    Number(localStorage.getItem("availableCount") || 0);

    const last =
    localStorage.getItem("lastSearch") || "-";

    if(searchCount){

        searchCount.textContent = total;

    }

    if(availableCount){

        availableCount.textContent = available;

    }

    if(lastSearch){

        lastSearch.textContent = last;

    }

}

// ===========================================
// Mise à jour Dashboard
// ===========================================

function updateDashboard(domain,isAvailable=false){

    let total =
    Number(localStorage.getItem("searchCount") || 0);

    total++;

    localStorage.setItem(
        "searchCount",
        total
    );

    localStorage.setItem(
        "lastSearch",
        domain
    );

    if(isAvailable){

        let available =
        Number(localStorage.getItem("availableCount") || 0);

        available++;

        localStorage.setItem(
            "availableCount",
            available
        );

    }

    loadDashboard();

}

// ===========================================
// Initialisation UI
// ===========================================

document.addEventListener("DOMContentLoaded",()=>{

    loadDashboard();

    renderHistory();

});
