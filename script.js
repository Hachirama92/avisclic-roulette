const params = new URLSearchParams(window.location.search);
const config = {
    nom: params.get('nomEntreprise') || "Bienvenue",
    logo: params.get('logoUrl'),
    google: params.get('googleUrl'),
    lots: params.get('lots') ? params.get('lots').split(',') : ["Lot 1", "Lot 2", "Lot 3", "Lot 4", "Lot 5", "Lot 6"]
};

// Initialisation
document.getElementById('business-name').innerText = config.nom;
if (config.logo) document.getElementById('logo').src = config.logo;
document.getElementById('google-link').href = config.google;

let unlocked = false;
const storageKey = 'played_' + config.nom.replace(/\s/g, '');

if (localStorage.getItem(storageKey)) {
    document.querySelector('.app-container').innerHTML = "<h2>Désolé</h2><p>Vous avez déjà joué aujourd'hui !</p>";
}

function handleMainAction() {
    if (!unlocked) {
        document.getElementById('modal').style.display = 'flex';
    } else {
        spin();
    }
}

function unlockWheel() {
    unlocked = true;
    setTimeout(() => {
        document.getElementById('modal').style.display = 'none';
        const btn = document.getElementById('action-btn');
        btn.innerText = "Lancer la roue !";
        btn.style.background = "#27ae60";
    }, 1000);
}

function closeModal() { document.getElementById('modal').style.display = 'none'; }

function spin() {
    const wheel = document.getElementById('wheel');
    const btn = document.getElementById('action-btn');
    btn.disabled = true;
    
    const deg = Math.floor(Math.random() * 3600) + 720;
    wheel.style.transform = `rotate(${deg}deg)`;

    setTimeout(() => {
        const actualDeg = deg % 360;
        const prizeIndex = Math.floor((360 - actualDeg) / 60) % 6;
        
        // CORRECTION DÉCODAGE ICI
        const prizeName = decodeURIComponent(config.lots[prizeIndex]);
        
        document.getElementById('prize-name').innerText = prizeName;
        document.getElementById('security-info').innerText = `Validé le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}`;
        document.getElementById('win-modal').style.display = 'flex';
        localStorage.setItem(storageKey, "true");
    }, 4100);
}