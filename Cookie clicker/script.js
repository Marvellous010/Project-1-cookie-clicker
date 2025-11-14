// ===== SIMPLE GAME STORAGE =====
// Beheert het opslaan en laden van speldata
class Storage {
    // Slaat data op in browser localStorage
    static save(key, data) {
        const jsonString = JSON.stringify(data);
        localStorage.setItem(key, jsonString);
    }
    
    // Laadt data uit browser localStorage
    static load(key) {
        const savedData = localStorage.getItem(key);
        
        if (savedData) {
            return JSON.parse(savedData);
        } else {
            return null;
        }
    }
    
    // Verwijdert data uit browser localStorage
    static remove(key) {
        localStorage.removeItem(key);
    }
}

// ===== EVENT =====
class GameEvent {
    constructor(id, name, icon, cost, duration, cooldown, effect) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.cost = cost;
        this.duration = duration;
        this.cooldown = cooldown;
        this.effect = effect;
        this.unlocked = false;
        this.active = false;
        this.timeLeft = 0;
        this.cooldownLeft = 0;
        
        // Koppel click event aan HTML element
        const element = document.getElementById(`${id}-event`);
        if (element) {
            element.onclick = () => this.activate();
        }
    }
    
    // Activeert het event als mogelijk
    activate() {
        if (!this.canActivate()) return false;
        
        window.game.count -= this.cost;
        this.active = true;
        this.timeLeft = this.duration;
        this.cooldownLeft = 0;
        
        this.updateUI();
        window.game.updateDisplay();
        window.game.save();
        
        return true;
    }
    
    // Controleert of event geactiveerd kan worden
    canActivate() {
        return this.unlocked && 
               !this.active && 
               this.cooldownLeft <= 0 && 
               window.game.count >= this.cost;
    }
    
    // Update event timers elke frame (ChatGPT hulp bij timer logic)
    update(deltaTime) {
        // Als event actief is, tel tijd af
        if (this.active && this.timeLeft > 0) {
            this.timeLeft -= deltaTime;
            if (this.timeLeft <= 0) {
                this.active = false;
                this.cooldownLeft = this.cooldown;
            }
        }
        
        // Als in cooldown, tel cooldown af
        if (this.cooldownLeft > 0) {
            this.cooldownLeft -= deltaTime;
            if (this.cooldownLeft < 0) this.cooldownLeft = 0;
        }
        
        this.updateUI();
    }
    
    // Update de UI elementen van het event (ChatGPT hulp bij tijd formatting)
    updateUI() {
        const element = document.getElementById(`${this.id}-event`);
        const timer = document.getElementById(`${this.id}-timer`);
        
        if (element) {
            element.setAttribute('data-active', this.active);
            element.setAttribute('data-unlocked', this.unlocked);
        }
        
        if (timer) {
            if (this.active && this.timeLeft > 0) {
                // Formatteer tijd als MM:SS
                const min = Math.floor(this.timeLeft / 60);
                const sec = Math.floor(this.timeLeft % 60);
                timer.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
            } else if (this.cooldownLeft > 0) {
                // Formatteer cooldown tijd als MM:SS
                const min = Math.floor(this.cooldownLeft / 60);
                const sec = Math.floor(this.cooldownLeft % 60);
                timer.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
            } else {
                timer.textContent = 'Klaar!';
            }
        }
    }
}

// ===== UPGRADE CONFIGURATION =====
// Configuratie object met alle upgrade instellingen
const UPGRADE_CONFIG = {
    mousePowerBtn: { cost: 15, type: 'click', value: 1, name: 'Zonnestralen' },
    autoClickerBtn: { cost: 50, type: 'perSecond', value: 0.5, name: 'Automatische groei' },
    fertilizerBtn: { cost: 125, type: 'click', value: 2, name: 'Magische Meststof' },
    beeHiveBtn: { cost: 300, type: 'perSecond', value: 1, name: 'Bijenkorf' },
    rainCloudBtn: { cost: 750, type: 'click', value: 3, name: 'Regenwolk' },
    gardenGnomeBtn: { cost: 1500, type: 'perSecond', value: 2, name: 'Tuinkabouter' },
    sunlightLensBtn: { cost: 3000, type: 'click', value: 5, name: 'Zonlicht Lens' },
    timeAcceleratorBtn: { cost: 6000, type: 'perSecond', value: 3, name: 'Tijd Versneller' },
    cosmicSeedBtn: { cost: 12000, type: 'click', value: 10, name: 'Kosmisch Zaad' },
    
    turboZonnestralenBtn: { cost: 500, type: 'multiplier', target: 'mousePowerBtn', value: 1.5, name: 'Turbo Zonnestralen' },
    superGroeiBtn: { cost: 1200, type: 'multiplier', target: 'autoClickerBtn', value: 1.5, name: 'Super Groei' },
    megaMeststofBtn: { cost: 2500, type: 'multiplier', target: 'fertilizerBtn', value: 1.5, name: 'Mega Meststof' },
    koninginneBijBtn: { cost: 4000, type: 'multiplier', target: 'beeHiveBtn', value: 2, name: 'Koningin Bij' },
    stormWolkBtn: { cost: 6500, type: 'multiplier', target: 'rainCloudBtn', value: 2, name: 'Storm Wolk' },
    aartsTuinkabouter: { cost: 10000, type: 'multiplier', target: 'gardenGnomeBtn', value: 2, name: 'Aarts Tuinkabouter' },
    prismaLensBtn: { cost: 15000, type: 'multiplier', target: 'sunlightLensBtn', value: 2, name: 'Prisma Lens' },
    tijdMeesterBtn: { cost: 25000, type: 'multiplier', target: 'timeAcceleratorBtn', value: 2, name: 'Tijd Meester' }
};

// ===== SIMPLE UPGRADE =====
// Beheert upgrades die spelers kunnen kopen
class Upgrade {
    // Maakt nieuwe upgrade aan vanuit config
    constructor(id, config) {
        this.id = id;
        this.cost = config.cost;
        this.type = config.type;
        this.value = config.value;
        this.target = config.target;
        this.name = config.name;
        this.purchased = false;
        this.multiplier = 1;
        this.multiplierApplied = false;
        
        // Koppel click event aan HTML element
        const element = document.getElementById(id);
        if (element) {
            element.onclick = () => this.purchase();
        }
    }
    
    // Koopt de upgrade als speler genoeg geld heeft
    purchase() {
        if (this.purchased || window.game.count < this.cost) return false;
        
        window.game.count -= this.cost;
        window.game.upgradesBought++;
        this.purchased = true;
        
        this.applyEffect();
        this.updateUI();
        window.game.updateDisplay();
        window.game.save();
        
        return true;
    }
    
    // Past upgrade effect toe op spel stats
    applyEffect() {
        const game = window.game;
        
        switch (this.type) {
            case 'click':
                // Verhoog klik waarde
                game.perClick += this.value;
                break;
            case 'perSecond':
                // Verhoog automatische generatie
                game.perSecond += this.value;
                break;
            case 'multiplier':
                // Multiplier upgrade voor andere upgrades
                const targetUpgrade = game.upgrades.find(u => u.id === this.target);
                if (targetUpgrade && targetUpgrade.purchased && !this.multiplierApplied) {
                    this.multiplierApplied = true;
                    const bonusValue = targetUpgrade.value * (this.value - 1);
                    if (targetUpgrade.type === 'click') {
                        game.perClick += bonusValue;
                    } else if (targetUpgrade.type === 'perSecond') {
                        game.perSecond += bonusValue;
                    }
                }
                break;
        }
    }
    
    // Update UI styling gebaseerd op status
    updateUI() {
        const element = document.getElementById(this.id);
        if (!element) return;
        
        if (this.purchased) {
            // Toon als gekocht
            element.classList.add('purchased');
            element.style.opacity = '0.5';
            element.style.pointerEvents = 'none';
        } else if (window.game.count >= this.cost) {
            // Toon als betaalbaar
            element.classList.add('affordable');
            element.classList.remove('unaffordable');
        } else {
            // Toon als te duur
            element.classList.add('unaffordable');
            element.classList.remove('affordable');
        }
    }
}

// ===== SIMPLE THEME =====
// Beheert thema's (alleen visueel, geen gameplay effecten)
class Theme {
    // Maakt nieuw thema aan
    constructor(id, name, cost, icon) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.icon = icon;
        this.unlocked = false;
        
        // Koppel koop knop aan functie
        const button = document.querySelector(`#${id}-unlock .purchase-btn`);
        if (button) {
            button.onclick = () => this.purchase();
        }
    }
    
    // Koopt thema als speler genoeg geld heeft
    purchase() {
        if (this.unlocked || window.game.count < this.cost) return false;
        
        window.game.count -= this.cost;
        window.game.upgradesBought++;
        window.game.unlockedThemes++;
        this.unlocked = true;
        
        window.game.updateDisplay();
        this.updateUI();
        
        return true;
    }
    
    // Update thema UI elementen (ChatGPT hulp bij DOM selectoren)
    updateUI() {
        const unlockItem = document.getElementById(`${this.id}-unlock`);
        const button = unlockItem?.querySelector('.purchase-btn');
        const themeInput = document.getElementById(`theme-${this.id}`);
        const lock = document.querySelector(`.theme-${this.id}-option .theme-lock`);
        
        if (this.unlocked) {
            // Thema is gekocht - enable selectie
            if (unlockItem) unlockItem.classList.add('purchased');
            if (button) {
                button.textContent = 'Gekocht';
                button.disabled = true;
            }
            if (themeInput) {
                themeInput.disabled = false;
                themeInput.classList.remove('theme-locked');
            }
            if (lock) lock.style.display = 'none';
        } else if (window.game.count >= this.cost) {
            // Thema is betaalbaar
            if (button) button.disabled = false;
            if (unlockItem) unlockItem.classList.add('affordable');
        } else {
            // Thema is te duur
            if (button) button.disabled = true;
            if (unlockItem) unlockItem.classList.remove('affordable');
        }
    }
    
}

// ===== MAIN GAME =====
// Hoofdklasse die het hele spel beheert
class Game {
    // Initialiseert het spel met alle basis waarden
    constructor() {
        // Basis spel statistieken
        this.count = 0; // Huidige zonnebloemen
        this.totalClicks = 0; // Totaal aantal clicks
        this.totalFlowers = 0; // Totaal gegenereerde bloemen
        this.upgradesBought = 0; // Aantal gekochte upgrades
        this.perClick = 1; // Bloemen per klik
        this.perSecond = 0; // Automatische generatie per seconde
        this.totalEvents = 0; // Aantal gebruikte events
        this.unlockedThemes = 0; // Aantal ontgrendelde thema's
        this.startTime = Date.now(); // Start tijd voor prestaties
        this.currentTheme = 'default'; // Huidig actief thema
        
        // Cache voor DOM elementen (performance)
        this.domElements = {};
        
        // Maak alle spel systemen aan
        this.events = this.createEvents();
        this.themes = this.createThemes();
        this.upgrades = this.createUpgrades();
        
        // Maak globaal beschikbaar voor HTML
        window.game = this;
        
        // Start het spel
        this.load(); // Laad opgeslagen data
        this.setupUI(); // Koppel UI events
        this.startGameLoop(); // Start game loop
    }
    
    // Maakt alle game events aan met effecten
    createEvents() {
        return [
            new GameEvent('golden-hour', 'Gouden Uur', '🌅', 200, 15, 300, {type: 'clickMultiplier', value: 2}),
            new GameEvent('bee-swarm', 'Bijenzwerm', '🐝', 600, 15, 400, {type: 'bonusPerSecond', value: 10})
        ];
    }
    
    // Maakt alle thema's aan (alleen visueel)
    createThemes() {
        return [
            new Theme('storm', 'Storm', 100, '⛈️'),
            new Theme('night', 'Nacht', 250, '🌙'),
            new Theme('autumn', 'Herfst', 500, '🍂')
        ];
    }
    
    // Maakt alle upgrades aan vanuit config object
    createUpgrades() {
        const upgrades = [];
        for (const [id, config] of Object.entries(UPGRADE_CONFIG)) {
            upgrades.push(new Upgrade(id, config));
        }
        return upgrades;
    }
    
    // Hoofdfunctie die wordt aangeroepen bij elke klik (ChatGPT hulp bij multiplier berekeningen)
    click() {
        let clickValue = this.perClick;
        
        // Pas event multipliers toe
        for (const event of this.events) {
            if (event.active && event.effect.type === 'clickMultiplier') {
                clickValue *= event.effect.value;
            }
        }
        
        // Update alle counters
        this.count += clickValue;
        this.totalClicks++;
        this.totalFlowers += clickValue;
        
        // Update alles na klik
        this.updateDisplay();
        this.checkUnlocks();
        this.save();
    }
    
    // Controleert wat ontgrendeld kan worden en update UI
    checkUnlocks() {
        // Check event unlocks en update UI in één loop
        this.events.forEach(event => {
            if (!event.unlocked && this.totalFlowers >= event.cost) {
                event.unlocked = true;
            }
            event.updateUI();
        });
        
        // Check upgrade unlocks (maak betaalbaar als je genoeg bloemen hebt)
        this.upgrades.forEach(upgrade => {
            upgrade.updateUI();
        });
        
        // Update thema UI
        this.themes.forEach(theme => theme.updateUI());
    }
    
    // Cache DOM elementen voor betere performance (ChatGPT hulp bij optimization)
    cacheDOM() {
        this.domElements = {
            sunflowerCount: document.getElementById('sunflowerCount'),
            totalFlowers: document.getElementById('totalFlowers'),
            totalClicks: document.getElementById('totalClicks'),
            perSecond: document.getElementById('perSecond'),
            upgradesBought: document.getElementById('upgradesBought'),
            perClick: document.getElementById('perClick')
        };
    }
    
    // Update alle nummers op het scherm (ChatGPT hulp bij number formatting)
    updateDisplay() {
        if (!this.domElements.sunflowerCount) this.cacheDOM();
        
        const { sunflowerCount, totalFlowers, totalClicks, perSecond, upgradesBought, perClick } = this.domElements;
        
        // Formatteer nummers netjes zonder lange decimalen
        if (sunflowerCount) sunflowerCount.textContent = Math.floor(this.count);
        if (totalFlowers) totalFlowers.textContent = Math.floor(this.totalFlowers);
        if (totalClicks) totalClicks.textContent = this.totalClicks;
        if (perSecond) perSecond.textContent = Math.round(this.perSecond * 10) / 10;
        if (upgradesBought) upgradesBought.textContent = this.upgradesBought;
        if (perClick) perClick.textContent = Math.round(this.perClick * 10) / 10;
    }
    
    setupUI() {
        // Zet zonnebloem klik op
        const sunflower = document.querySelector('.sunflower-button');
        if (sunflower) {
            sunflower.onclick = () => this.click();
        }
        
        // Zet panelen op
        this.setupPanel('settings', 'settingsButton', 'settingsPanel');
        this.setupPanel('stats', 'statsButton', 'statsPanel');
        
        // Zet reset op
        const resetBtn = document.getElementById('resetGameBtn');
        if (resetBtn) {
            resetBtn.onclick = () => this.showResetModal();
        }
        
        this.setupResetModal();
        this.setupThemeSelector();
    }
    
    setupPanel(name, buttonId, panelId) {
        const button = document.getElementById(buttonId);
        const panel = document.getElementById(panelId);
        if (button && panel) {
            // Schakel paneel om wanneer knop wordt geklikt
            button.onclick = (e) => {
                e.stopPropagation(); // Voorkom dat document klik meteen sluit
                panel.classList.toggle('show');
            };
            
            // Sluit paneel wanneer buiten wordt geklikt
            document.addEventListener('click', (e) => {
                // Controleer of klik buiten paneel en knop is
                if (!panel.contains(e.target) && !button.contains(e.target)) {
                    panel.classList.remove('show');
                }
            });
            
            // Voorkom dat paneel kliks het paneel sluiten
            panel.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
    
    setupResetModal() {
        const modal = document.getElementById('resetModal');
        const cancelBtn = document.getElementById('resetCancelBtn');
        const confirmBtn = document.getElementById('resetConfirmBtn');
        const successModal = document.getElementById('successModal');
        
        if (cancelBtn) {
            cancelBtn.onclick = () => modal?.classList.remove('show');
        }
        
        if (confirmBtn) {
            confirmBtn.onclick = () => {
                this.reset();
                modal?.classList.remove('show');
                if (successModal) {
                    successModal.classList.add('show');
                    setTimeout(() => successModal.classList.remove('show'), 3000);
                }
            };
        }
    }
    
    setupThemeSelector() {
        const themeInputs = document.querySelectorAll('input[name="theme"]');
        themeInputs.forEach(input => {
            input.onchange = (e) => {
                if (e.target.checked) {
                    const themeId = e.target.id.replace('theme-', '');
                    if (themeId === 'default') {
                        this.currentTheme = themeId;
                        this.save();
                        this.updateDisplay();
                    } else {
                        const theme = this.themes.find(t => t.id === themeId);
                        if (theme && theme.unlocked) {
                            this.currentTheme = themeId;
                            this.save();
                            this.updateDisplay();
                        } else {
                            e.target.checked = false;
                            const currentInput = document.getElementById(`theme-${this.currentTheme}`);
                            if (currentInput) currentInput.checked = true;
                        }
                    }
                }
            };
        });
    }
    
    showResetModal() {
        const modal = document.getElementById('resetModal');
        if (modal) modal.classList.add('show');
    }
    
    startGameLoop() {
        let lastTime = Date.now();
        
        const loop = () => {
            const now = Date.now();
            const deltaTime = (now - lastTime) / 1000;
            lastTime = now;
            
            // Automatische generatie
            if (this.perSecond > 0) {
                let totalPerSecond = this.perSecond;
                
                // Voeg event bonussen toe
                totalPerSecond += this.events
                    .filter(event => event.active && event.effect.type === 'bonusPerSecond')
                    .reduce((sum, event) => sum + event.effect.value, 0);
                
                const increment = totalPerSecond * deltaTime;
                this.count += increment;
                this.totalFlowers += increment;
                this.updateDisplay();
                this.checkUnlocks();
            }
            
            // Update events
            for (const event of this.events) {
                event.update(deltaTime);
            }
            
            // Sla elke 5 seconden op
            if (Math.floor(now / 5000) !== Math.floor((now - 1000) / 5000)) {
                this.save();
            }
            
            requestAnimationFrame(loop);
        };
        
        requestAnimationFrame(loop);
    }
    
    save() {
        Storage.save('gameData', {
            count: this.count,
            totalClicks: this.totalClicks,
            totalFlowers: this.totalFlowers,
            upgradesBought: this.upgradesBought,
            perClick: this.perClick,
            perSecond: this.perSecond,
            totalEvents: this.totalEvents,
            unlockedThemes: this.unlockedThemes,
            startTime: this.startTime,
            currentTheme: this.currentTheme,
            events: this.events.map(e => ({
                id: e.id, 
                unlocked: e.unlocked, 
                active: e.active, 
                timeLeft: e.timeLeft, 
                cooldownLeft: e.cooldownLeft
            })),
            themes: this.themes.map(t => ({id: t.id, unlocked: t.unlocked})),
            upgrades: this.upgrades.map(u => ({id: u.id, purchased: u.purchased, multiplier: u.multiplier, multiplierApplied: u.multiplierApplied}))
        });
    }
    
    load() {
        const data = Storage.load('gameData');
        if (!data) return;
        
        this.count = data.count || 0;
        this.totalClicks = data.totalClicks || 0;
        this.totalFlowers = data.totalFlowers || 0;
        this.upgradesBought = data.upgradesBought || 0;
        this.perClick = data.perClick || 1;
        this.perSecond = data.perSecond || 0;
        this.totalEvents = data.totalEvents || 0;
        this.unlockedThemes = data.unlockedThemes || 0;
        this.startTime = data.startTime || Date.now();
        this.currentTheme = data.currentTheme || 'default';
        
        // Laad alle systeem data
        this.loadSystemData(data.events, this.events, (item, saved) => {
            item.unlocked = saved.unlocked;
            item.active = saved.active;
            item.timeLeft = saved.timeLeft || 0;
            item.cooldownLeft = saved.cooldownLeft || 0;
        });
        
        this.loadSystemData(data.themes, this.themes, (item, saved) => {
            item.unlocked = saved.unlocked;
        });
        
        this.loadSystemData(data.upgrades, this.upgrades, (item, saved) => {
            item.purchased = saved.purchased;
            item.multiplier = saved.multiplier || 1;
            item.multiplierApplied = saved.multiplierApplied || false;
            if (item.purchased) item.applyEffect();
        });
        
        // Update UI na het laden
        setTimeout(() => {
            this.updateDisplay();
            this.updateAllUI();
            
            // Zet huidig thema
            const themeInput = document.getElementById(`theme-${this.currentTheme}`);
            if (themeInput) themeInput.checked = true;
        }, 100);
    }
    
    reset() {
        this.count = 0;
        this.totalClicks = 0;
        this.totalFlowers = 0;
        this.upgradesBought = 0;
        this.perClick = 1;
        this.perSecond = 0;
        this.totalEvents = 0;
        this.unlockedThemes = 0;
        this.startTime = Date.now();
        this.currentTheme = 'default';
        
        // Reset alle systemen
        this.events.forEach(event => {
            event.unlocked = false;
            event.active = false;
            event.timeLeft = 0;
            event.cooldownLeft = 0;
        });
        this.themes.forEach(theme => theme.unlocked = false);
        this.upgrades.forEach(upgrade => {
            upgrade.purchased = false;
            upgrade.multiplier = 1;
            upgrade.multiplierApplied = false;
        });
        
        Storage.remove('gameData');
        
        // Reset UI
        this.updateDisplay();
        this.updateAllUI();
        
        const defaultTheme = document.getElementById('theme-default');
        if (defaultTheme) defaultTheme.checked = true;
        
        console.log('Game reset completed');
    }
    
    // Helper methode voor het laden van systeem data
    loadSystemData(savedData, systemArray, applyFunction) {
        if (!savedData) return;
        savedData.forEach(saved => {
            const item = systemArray.find(i => i.id === saved.id);
            if (item) applyFunction(item, saved);
        });
    }
    
    // Helper methode voor het updaten van alle UI elementen
    updateAllUI() {
        this.events.forEach(event => event.updateUI());
        this.themes.forEach(theme => theme.updateUI());
        this.upgrades.forEach(upgrade => upgrade.updateUI());
    }
}

// ===== START GAME =====
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
