// 1. Récupération et Décodage des paramètres
const params = new URLSearchParams(window.location.search);

function getParam(name) {
    const val = params.get(name);
    return val ? decodeURIComponent(val) : null;
}

const config = {
    nom: getParam('nomEntreprise') || "Notre Établissement",
    logo: getParam('logoUrl'),
    google: getParam('googleUrl'),
    lots: getParam('lots') ? getParam('lots').split(',') : ["Cadeau 1", "Cadeau 2", "Cadeau 3", "Cadeau 4", "Cadeau 5", "Cadeau 6"]
};

// 2. Initialisation de l'interface
document.getElementById('business-name').innerText = config.nom;
if (config.logo) document.getElementById('logo').src = config.logo;
document.getElementById('google-link').href = config.google;

let hasUnlocked = false;
const storageKey = 'avisclic_played_' + config.nom.replace(/\s/g, '');

// Vérifier si déjà joué
if (localStorage.getItem(storageKey)) {
    document.querySelector('.wheel-section').innerHTML = `<p style="text-align:center; padding:20px; font-weight:bold; color:#636e72;">Vous avez déjà tenté votre chance aujourd'hui ! <br><br> Revenez nous voir très vite. ✨</p>`;
    document.getElementById('action-btn').style.display = 'none';
}

// 3. Actions
function handleMainAction() {
    if (!hasUnlocked) {
        document.getElementById('modal').style.display = 'flex';
    } else {
        spinWheel();
    }
}

document.getElementById('action-btn').onclick = handleMainAction;

// Déblocage après clic sur le lien Google
document.getElementById('google-link').onclick = function() {
    hasUnlocked = true;
    setTimeout(() => {
        document.getElementById('modal').style.display = 'none';
        const btn = document.getElementById('action-btn');
        btn.innerText = "Lancer la roue !";
        btn.style.background = "#27ae60";
    }, 1200);
};

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// 4. Logique de la Roulette
function spinWheel() {
    const wheel = document.getElementById('wheel');
    const btn = document.getElementById('action-btn');
    
    btn.disabled = true;
    btn.style.opacity = "0.5";
    
    // Rotation : au moins 5 tours + angle aléatoire
    const randomRotation = Math.floor(Math.random() * 360) + 1800; 
    wheel.style.transform = `rotate(${randomRotation}deg)`;

    setTimeout(() => {
        const finalAngle = randomRotation % 360;
        // Calcul du segment (6 segments de 60°)
        const prizeIndex = Math.floor((360 - finalAngle) / 60) % 6;
        const result = config.lots[prizeIndex];
        
        showWin(result);
        localStorage.setItem(storageKey, new Date().toLocaleDateString());
    }, 4100);
}

function showWin(prize) {
    document.getElementById('prize-name').innerText = prize;
    const now = new Date();
    document.getElementById('security-date').innerText = `Validé le ${now.toLocaleDateString()} à ${now.toLocaleTimeString()}`;
    document.getElementById('win-modal').style.display = 'flex';
}