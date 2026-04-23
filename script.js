// 1. Parsing des données de l'URL
const params = new URLSearchParams(window.location.search);
const config = {
    nom: params.get('nomEntreprise') || "Notre Établissement",
    logo: params.get('logoUrl'),
    google: params.get('googleUrl'),
    lots: params.get('lots') ? params.get('lots').split(',') : ["Cadeau 1", "Cadeau 2", "Cadeau 3", "Cadeau 4", "Cadeau 5", "Cadeau 6"]
};

// Initialisation interface
document.getElementById('business-name').innerText = config.nom;
if (config.logo) document.getElementById('logo').src = config.logo;
document.getElementById('google-link').href = config.google;

let hasUnlocked = false;

// 2. Sécurité : Vérifier si déjà joué (LocalStorage)
const storageKey = 'avisclic_played_' + config.nom.replace(/\s/g, '');
if (localStorage.getItem(storageKey)) {
    document.querySelector('main').innerHTML = `<p style="padding:20px; font-weight:bold;">Vous avez déjà tenté votre chance aujourd'hui ! Revenez demain. ✨</p>`;
}

// 3. Gestion des actions
function handleMainAction() {
    if (!hasUnlocked) {
        document.getElementById('modal').style.display = 'flex';
    } else {
        spinNow();
    }
}

document.getElementById('action-btn').onclick = handleMainAction;

document.getElementById('google-link').onclick = function() {
    hasUnlocked = true;
    setTimeout(() => {
        document.getElementById('modal').style.display = 'none';
        document.getElementById('action-btn').innerText = "Lancer la roue !";
        document.getElementById('action-btn').style.background = "#27ae60";
    }, 1000);
};

function closeModal() { document.getElementById('modal').style.display = 'none'; }

// 4. Logique de la Roulette
function spinNow() {
    const wheel = document.getElementById('wheel');
    const btn = document.getElementById('action-btn');
    
    btn.disabled = true;
    btn.style.opacity = "0.5";
    
    const randomDeg = Math.floor(Math.random() * 3600) + 1440; // 4 tours min
    wheel.style.transform = `rotate(${randomDeg}deg)`;

    setTimeout(() => {
        const actualDeg = randomDeg % 360;
        // Calcul de l'index (6 segments de 60°)
        const prizeIndex = Math.floor((360 - actualDeg) / 60) % 6;
        showWin(config.lots[prizeIndex]);
        localStorage.setItem(storageKey, new Date().toLocaleDateString());
    }, 4100);
}

function showWin(prize) {
    document.getElementById('prize-name').innerText = prize;
    const now = new Date();
    document.getElementById('security-info').innerText = `Validé le ${now.toLocaleDateString()} à ${now.toLocaleTimeString()}`;
    document.getElementById('win-modal').style.display = 'flex';
}