// Spelstatus
let cookies = 0;
let cookiesPerSecond = 0;
let clickPower = 1;

// Upgrade kosten en effecten
const upgrades = {
    autoClicker: {
        cost: 50,
        owned: 0,
        cps: 1, // koekjes per seconde
        name: "Automatische klikker"
    },
    mousePower: {
        cost: 15,
        owned: 0,
        clickBonus: 1,
        name: "Krachtige muis"
    }
};

// Initialiseer spel
function initGame() {
    updateDisplay();
    updateUpgradeButtons();
    
    // Start automatische koekjes generatie
    setInterval(generateAutoCookies, 1000);
    setInterval(updateDisplay, 100);
}

// Klik op de koek
function clickCookie() {
    cookies += clickPower;
    updateDisplay();
    updateUpgradeButtons();
    
    // Voeg klik animatie toe
    const cookieBtn = document.querySelector('.cookie-button');
    cookieBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        cookieBtn.style.transform = 'scale(1)';
    }, 100);
}

// Genereer automatische koekjes
function generateAutoCookies() {
    if (cookiesPerSecond > 0) {
        cookies += cookiesPerSecond;
        updateDisplay();
        updateUpgradeButtons();
    }
}

// Koop upgrade
function buyUpgrade(upgradeType) {
    const upgrade = upgrades[upgradeType];
    
    if (cookies >= upgrade.cost) {
        cookies -= upgrade.cost;
        upgrade.owned++;
        
        if (upgradeType === 'autoClicker') {
            cookiesPerSecond += upgrade.cps;
        } else if (upgradeType === 'mousePower') {
            clickPower += upgrade.clickBonus;
        }
        
        // Verhoog kosten voor volgende aankoop
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        
        updateDisplay();
        updateUpgradeButtons();
    }
}

// Update weergave
function updateDisplay() {
    document.getElementById('cookieCount').textContent = `${cookies} KOEKJES (${cookiesPerSecond}/s)`;
    document.getElementById('cpsDisplay').textContent = `${clickPower} per klik`;
}

// Update upgrade knoppen
function updateUpgradeButtons() {
    // Automatische klikker knop
    const autoBtn = document.getElementById('autoClickerBtn');
    const autoUpgrade = upgrades.autoClicker;
    autoBtn.textContent = `${autoUpgrade.name} (${autoUpgrade.cost} koekjes)`;
    autoBtn.disabled = cookies < autoUpgrade.cost;
    
    // Krachtige muis knop
    const mouseBtn = document.getElementById('mousePowerBtn');
    const mouseUpgrade = upgrades.mousePower;
    mouseBtn.textContent = `${mouseUpgrade.name} (${mouseUpgrade.cost} koekjes)`;
    mouseBtn.disabled = cookies < mouseUpgrade.cost;
}

// Start het spel wanneer de pagina laadt
window.addEventListener('load', initGame);
