// On attend que TOUTE la page soit chargée avant de lier les boutons
window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const config = {
        nom: params.get('nomEntreprise') || "Bienvenue",
        logo: params.get('logoUrl'),
        google: params.get('googleUrl'),
        lots: params.get('lots') ? params.get('lots').split(',') : ["Lot 1", "Lot 2", "Lot 3", "Lot 4", "Lot 5", "Lot 6"],
        isTest: params.get('test') === '1'
    };

    const storageKey = 'played_' + config.nom.replace(/\s/g, '');
    let unlocked = false;

    // Éléments DOM
    const actionBtn = document.getElementById('action-btn');
    const modal = document.getElementById('modal');
    const googleLink = document.getElementById('google-link');
    const wheel = document.getElementById('wheel');
    const resetBtn = document.getElementById('reset-test');

    // Init affichage
    document.getElementById('business-name').innerText = config.nom;
    if (config.logo) document.getElementById('logo').src = config.logo;
    googleLink.href = config.google;

    // Gestion du bouton Test
    if (config.isTest) {
        resetBtn.style.display = 'block';
        resetBtn.onclick = () => { localStorage.removeItem(storageKey); location.reload(); };
    }

    // Vérification blocage
    if (localStorage.getItem(storageKey)) {
        document.querySelector('.app-container').innerHTML = `<h2>Merci !</h2><p>Vous avez déjà tenté votre chance aujourd'hui.</p>`;
        return;
    }

    // Action bouton principal
    actionBtn.addEventListener('click', function() {
        if (!unlocked) {
            modal.style.display = 'flex';
        } else {
            spin();
        }
    });

    // Déblocage au clic Google
    googleLink.addEventListener('click', function() {
        unlocked = true;
        setTimeout(() => {
            modal.style.display = 'none';
            actionBtn.innerText = "Lancer la roue !";
            actionBtn.style.background = "#27ae60";
        }, 1500);
    });

    // Fermeture modale
    document.getElementById('close-modal-btn').onclick = () => modal.style.display = 'none';

    function spin() {
        actionBtn.disabled = true;
        actionBtn.style.opacity = "0.5";
        
        const deg = Math.floor(Math.random() * 3600) + 1440; // 4 tours min
        wheel.style.transform = `rotate(${deg}deg)`;

        setTimeout(() => {
            const actualDeg = deg % 360;
            const prizeIndex = Math.floor((360 - actualDeg) / 60) % 6;
            const finalPrize = decodeURIComponent(config.lots[prizeIndex]);
            
            document.getElementById('prize-name').innerText = finalPrize;
            document.getElementById('security-info').innerText = `Le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}`;
            document.getElementById('win-modal').style.display = 'flex';
            
            localStorage.setItem(storageKey, "true");
        }, 4100);
    }
};