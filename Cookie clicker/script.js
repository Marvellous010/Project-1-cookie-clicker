// Simpel Achievement Systeem
class AchievementSystem {
    constructor() {
        this.achievements = {
            'first-click': { name: 'Eerste Klik', description: 'Klik voor de eerste keer', icon: '👆', unlocked: false },
            'hundred-club': { name: 'Honderd Club', description: 'Verzamel 100 zonnebloemen', icon: '💯', unlocked: false },
            'click-master': { name: 'Klik Meester', description: 'Klik 500 keer', icon: '🖱️', unlocked: false },
            'thousand-stars': { name: 'Duizend Sterren', description: 'Verzamel 1000 zonnebloemen', icon: '⭐', unlocked: false },
            'sunflower-tycoon': { name: 'Zonnebloem Magnaat', description: 'Verzamel 5000 zonnebloemen', icon: '🌻', unlocked: false },
            'click-king': { name: 'Klik Koning', description: 'Klik 2000 keer', icon: '👑', unlocked: false },
            'mega-collector': { name: 'Mega Verzamelaar', description: 'Verzamel 10000 zonnebloemen', icon: '🏆', unlocked: false },
            'click-legend': { name: 'Klik Legende', description: 'Klik 5000 keer', icon: '🌟', unlocked: false }
        };
        this.loadAchievements();
    }

    checkAchievements(totalClicks, totalFlowers) {
        // Check eerste klik
        if (!this.achievements['first-click'].unlocked && totalClicks >= 1) {
            this.unlockAchievement('first-click');
        }
        
        // Check honderd club
        if (!this.achievements['hundred-club'].unlocked && totalFlowers >= 100) {
            this.unlockAchievement('hundred-club');
        }
        
        // Check klik meester
        if (!this.achievements['click-master'].unlocked && totalClicks >= 500) {
            this.unlockAchievement('click-master');
        }
        
        // Check duizend sterren
        if (!this.achievements['thousand-stars'].unlocked && totalFlowers >= 1000) {
            this.unlockAchievement('thousand-stars');
        }
        
        // Check zonnebloem magnaat
        if (!this.achievements['sunflower-tycoon'].unlocked && totalFlowers >= 5000) {
            this.unlockAchievement('sunflower-tycoon');
        }
        
        // Check klik koning
        if (!this.achievements['click-king'].unlocked && totalClicks >= 2000) {
            this.unlockAchievement('click-king');
        }
        
        // Check mega verzamelaar
        if (!this.achievements['mega-collector'].unlocked && totalFlowers >= 10000) {
            this.unlockAchievement('mega-collector');
        }
        
        // Check klik legende
        if (!this.achievements['click-legend'].unlocked && totalClicks >= 5000) {
            this.unlockAchievement('click-legend');
        }
    }

    unlockAchievement(achievementId) {
        this.achievements[achievementId].unlocked = true;
        this.showNotification(this.achievements[achievementId]);
        this.updateUI();
        this.saveAchievements();
    }

    showNotification(achievement) {
        const notification = document.getElementById('achievementNotification');
        const nameElement = document.getElementById('notificationName');
        
        if (notification && nameElement) {
            nameElement.textContent = achievement.name;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }

    updateUI() {
        for (let id in this.achievements) {
            const element = document.getElementById(`achievement-${id}`);
            if (element) {
                const statusElement = element.querySelector('.achievement-status');
                
                if (this.achievements[id].unlocked) {
                    // Set as achieved
                    element.classList.add('achieved');
                    element.setAttribute('data-achieved', 'true');
                    if (statusElement) {
                        statusElement.textContent = '✅';
                    }
                } else {
                    // Set as not achieved
                    element.classList.remove('achieved');
                    element.setAttribute('data-achieved', 'false');
                    if (statusElement) {
                        statusElement.textContent = '🔒';
                    }
                }
            }
        }
    }

    saveAchievements() {
        const saveData = {};
        for (let id in this.achievements) {
            saveData[id] = this.achievements[id].unlocked;
        }
        localStorage.setItem('achievements', JSON.stringify(saveData));
    }

    loadAchievements() {
        const saved = localStorage.getItem('achievements');
        if (saved) {
            const saveData = JSON.parse(saved);
            for (let id in saveData) {
                if (this.achievements[id]) {
                    this.achievements[id].unlocked = saveData[id];
                }
            }
            this.updateUI();
        }
    }

    resetAchievements() {
        for (let id in this.achievements) {
            this.achievements[id].unlocked = false;
        }
        this.updateUI();
        localStorage.removeItem('achievements');
    }
}

// Basis Event Class
class GameEvent {
    constructor(id, name, icon, description, requiredClicks, duration, cooldown) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.description = description;
        this.requiredClicks = requiredClicks;
        this.duration = duration; // in seconds
        this.cooldown = cooldown; // in seconds
        this.isActive = false;
        this.isUnlocked = false;
        this.timeRemaining = 0;
        this.cooldownRemaining = 0;
        this.element = document.getElementById(`${id}-event`);
        this.timerElement = document.getElementById(`${id}-timer`);
        this.progressElement = document.getElementById(`${id}-progress`);
    }

    unlock() {
        this.isUnlocked = true;
        this.updateUI();
    }

    activate() {
        if (!this.isUnlocked || this.isActive || this.cooldownRemaining > 0) return false;
        
        this.isActive = true;
        this.timeRemaining = this.duration;
        this.updateUI();
        this.onActivate();
        return true;
    }

    deactivate() {
        if (!this.isActive) return;
        
        this.isActive = false;
        this.cooldownRemaining = this.cooldown;
        this.timeRemaining = 0;
        this.updateUI();
        this.onDeactivate();
    }

    update(deltaTime) {
        if (this.isActive && this.timeRemaining > 0) {
            this.timeRemaining -= deltaTime;
            if (this.timeRemaining <= 0) {
                this.deactivate();
            }
            this.updateTimer();
        }

        if (this.cooldownRemaining > 0) {
            this.cooldownRemaining -= deltaTime;
            if (this.cooldownRemaining <= 0) {
                this.cooldownRemaining = 0;
            }
            this.updateTimer();
        }
    }

    updateUI() {
        if (!this.element) return;

        this.element.setAttribute('data-active', this.isActive);
        this.element.setAttribute('data-unlocked', this.isUnlocked);
        
        const lockElement = this.element.querySelector('.event-lock');
        const timerElement = this.element.querySelector('.event-timer');
        
        if (lockElement) {
            lockElement.style.display = this.isUnlocked ? 'none' : 'block';
        }
        
        if (timerElement) {
            timerElement.style.display = this.isUnlocked ? 'block' : 'none';
        }
    }

    updateTimer() {
        if (!this.timerElement) return;

        if (this.isActive && this.timeRemaining > 0) {
            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = Math.floor(this.timeRemaining % 60);
            this.timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else if (this.cooldownRemaining > 0) {
            const minutes = Math.floor(this.cooldownRemaining / 60);
            const seconds = Math.floor(this.cooldownRemaining % 60);
            this.timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else {
            this.timerElement.textContent = 'Klaar!';
        }
    }

    // Override deze methods in subclasses
    onActivate() {}
    onDeactivate() {}
    getEffect() { return 1; }
}

// Gouden Uur Event - Dubbele zonnebloemen voor clicks
class GoldenHourEvent extends GameEvent {
    constructor() {
        super('golden-hour', 'Gouden Uur', '🌅', 'Dubbele zonnebloemen voor alle clicks!', 50, 15, 300);
        this.multiplier = 2;
    }

    onActivate() {
        console.log('Gouden Uur geactiveerd! Dubbele zonnebloemen voor clicks!');
    }

    onDeactivate() {
        console.log('Gouden Uur beëindigd.');
    }

    getClickMultiplier() {
        return this.isActive ? this.multiplier : 1;
    }
}

// Bijenzwerm Event - Extra zonnebloemen per seconde
class BeeSwarmEvent extends GameEvent {
    constructor() {
        super('bee-swarm', 'Bijenzwerm', '🐝', '+10 zonnebloemen per seconde!', 150, 15, 400);
        this.bonusPerSecond = 10;
    }

    onActivate() {
        console.log('Bijenzwerm geactiveerd! +10 zonnebloemen per seconde!');
    }

    onDeactivate() {
        console.log('Bijenzwerm beëindigd.');
    }

    getBonusPerSecond() {
        return this.isActive ? this.bonusPerSecond : 0;
    }
}

// Regenboog Boost Event - 5x click multiplier
class RainbowBoostEvent extends GameEvent {
    constructor() {
        super('rainbow-boost', 'Regenboog Boost', '🌈', '5x click multiplier + extra geluk!', 300, 15, 600);
        this.multiplier = 5;
    }

    onActivate() {
        console.log('Regenboog Boost geactiveerd! 5x click multiplier!');
    }

    onDeactivate() {
        console.log('Regenboog Boost beëindigd.');
    }

    getClickMultiplier() {
        return this.isActive ? this.multiplier : 1;
    }
}

// Meteorenregen Event - Willekeurige zonnebloem bonuses
class MeteorShowerEvent extends GameEvent {
    constructor() {
        super('meteor-shower', 'Meteorenregen', '☄️', 'Willekeurige zonnebloem explosies!', 500, 15, 800);
    }

    onActivate() {
        console.log('Meteorenregen geactiveerd! Willekeurige bonuses!');
    }

    onDeactivate() {
        console.log('Meteorenregen beëindigd.');
    }

}

// Fee Bezoek Event - Alle upgrades 50% goedkoper
class FairyVisitEvent extends GameEvent {
    constructor() {
        super('fairy-visit', 'Fee Bezoek', '🧚‍♀️', 'Alle upgrades 50% goedkoper!', 750, 15, 1000);
        this.discount = 0.5;
    }

    onActivate() {
        console.log('Fee Bezoek geactiveerd! Alle upgrades 50% goedkoper!');
    }

    onDeactivate() {
        console.log('Fee Bezoek beëindigd.');
    }

    getUpgradeDiscount() {
        return this.isActive ? this.discount : 0;
    }
}

// Event System Manager
class EventSystem {
    constructor() {
        this.events = {
            'golden-hour': new GoldenHourEvent(),
            'bee-swarm': new BeeSwarmEvent(),
            'rainbow-boost': new RainbowBoostEvent(),
            'meteor-shower': new MeteorShowerEvent(),
            'fairy-visit': new FairyVisitEvent()
        };
        
        this.lastUpdate = Date.now();
        this.setupEventListeners();
        this.startUpdateLoop();
    }

    setupEventListeners() {
        // Voeg click listeners toe voor unlocked events
        Object.values(this.events).forEach(event => {
            if (event.element) {
                event.element.addEventListener('click', () => {
                    if (event.isUnlocked && !event.isActive && event.cooldownRemaining <= 0) {
                        event.activate();
                    }
                });
            }
        });
    }

    checkUnlocks(totalClicks) {
        Object.values(this.events).forEach(event => {
            if (!event.isUnlocked && totalClicks >= event.requiredClicks) {
                event.unlock();
                this.showEventUnlockNotification(event);
            }
            
            // Update progress bar
            this.updateEventProgress(event, totalClicks);
        });
    }
    
    updateEventProgress(event, totalClicks) {
        if (event.progressElement) {
            let progress = 0;
            
            if (event.isActive) {
                // Toon resterende tijd als progress
                progress = ((event.duration - event.timeRemaining) / event.duration) * 100;
            } else if (event.cooldownRemaining > 0) {
                // Toon cooldown progress
                progress = ((event.cooldown - event.cooldownRemaining) / event.cooldown) * 100;
            } else if (!event.isUnlocked) {
                // Toon unlock progress
                progress = (totalClicks / event.requiredClicks) * 100;
            } else {
                // Event is klaar om geactiveerd te worden
                progress = 100;
            }
            
            event.progressElement.style.width = Math.min(progress, 100) + '%';
        }
    }

    showEventUnlockNotification(event) {
        // Gebruik bestaande achievement notification systeem
        const notification = document.getElementById('achievementNotification');
        const nameElement = document.getElementById('notificationName');
        
        if (notification && nameElement) {
            nameElement.textContent = `Event Unlocked: ${event.name}`;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }

    startUpdateLoop() {
        const update = () => {
            const now = Date.now();
            const deltaTime = (now - this.lastUpdate) / 1000; // Convert to seconds
            this.lastUpdate = now;

            Object.values(this.events).forEach(event => {
                event.update(deltaTime);
                // Update progress voor actieve events
                if (event.isActive || event.cooldownRemaining > 0) {
                    this.updateEventProgress(event, 0);
                }
            });

            requestAnimationFrame(update);
        };
        
        requestAnimationFrame(update);
    }

    getClickMultiplier() {
        let multiplier = 1;
        Object.values(this.events).forEach(event => {
            if (event.getClickMultiplier) {
                multiplier *= event.getClickMultiplier();
            }
        });
        return multiplier;
    }

    getBonusPerSecond() {
        let bonus = 0;
        Object.values(this.events).forEach(event => {
            if (event.getBonusPerSecond) {
                bonus += event.getBonusPerSecond();
            }
        });
        return bonus;
    }

    getUpgradeDiscount() {
        let maxDiscount = 0;
        Object.values(this.events).forEach(event => {
            if (event.getUpgradeDiscount) {
                maxDiscount = Math.max(maxDiscount, event.getUpgradeDiscount());
            }
        });
        return maxDiscount;
    }


    saveEventData() {
        const saveData = {};
        Object.entries(this.events).forEach(([id, event]) => {
            saveData[id] = {
                isUnlocked: event.isUnlocked,
                isActive: event.isActive,
                timeRemaining: event.timeRemaining,
                cooldownRemaining: event.cooldownRemaining
            };
        });
        localStorage.setItem('eventData', JSON.stringify(saveData));
    }

    loadEventData() {
        const saved = localStorage.getItem('eventData');
        if (saved) {
            const saveData = JSON.parse(saved);
            Object.entries(saveData).forEach(([id, data]) => {
                if (this.events[id]) {
                    this.events[id].isUnlocked = data.isUnlocked;
                    this.events[id].isActive = data.isActive;
                    this.events[id].timeRemaining = data.timeRemaining || 0;
                    this.events[id].cooldownRemaining = data.cooldownRemaining || 0;
                    this.events[id].updateUI();
                }
            });
        }
    }

    resetEvents() {
        Object.values(this.events).forEach(event => {
            event.isUnlocked = false;
            event.isActive = false;
            event.timeRemaining = 0;
            event.cooldownRemaining = 0;
            event.updateUI();
        });
        localStorage.removeItem('eventData');
    }
}

// Theme System Class
class ThemeSystem {
    constructor(game) {
        this.game = game;
        this.themes = {
            'storm': { 
                name: 'Storm', 
                cost: 100, 
                unlocked: false,
                icon: '⛈️'
            },
            'night': { 
                name: 'Nacht', 
                cost: 250, 
                unlocked: false,
                icon: '🌙'
            },
            'autumn': { 
                name: 'Herfst', 
                cost: 500, 
                unlocked: false,
                icon: '🍂'
            }
        };
        this.currentTheme = 'default';
        this.loadThemeData();
        this.setupThemeListeners();
    }

    checkUnlocks() {
        let hasNewUnlock = false;
        
        Object.entries(this.themes).forEach(([themeId, theme]) => {
            if (!theme.unlocked && this.game.count >= theme.cost) {
                // Theme kan nu gekocht worden - update UI
                this.updateThemeUI(themeId);
            }
        });
    }

    updateThemeUI(themeId = null) {
        if (themeId) {
            // Update specifiek thema
            const unlockItem = document.getElementById(`${themeId}-unlock`);
            const purchaseBtn = unlockItem?.querySelector('.purchase-btn');
            
            if (unlockItem && purchaseBtn) {
                if (this.themes[themeId].unlocked) {
                    // Thema is al gekocht
                    unlockItem.classList.add('purchased');
                    purchaseBtn.textContent = 'Gekocht';
                    purchaseBtn.disabled = true;
                    
                    // Unlock het thema in de selector
                    const themeInput = document.getElementById(`theme-${themeId}`);
                    const themeLock = document.querySelector(`.theme-${themeId}-option .theme-lock`);
                    
                    if (themeInput) {
                        themeInput.classList.remove('theme-locked');
                        themeInput.disabled = false;
                    }
                    if (themeLock) {
                        themeLock.style.display = 'none';
                    }
                } else if (this.game.count >= this.themes[themeId].cost) {
                    // Thema kan gekocht worden
                    purchaseBtn.disabled = false;
                    unlockItem.classList.add('affordable');
                } else {
                    // Niet genoeg geld
                    purchaseBtn.disabled = true;
                    unlockItem.classList.remove('affordable');
                }
            }
        } else {
            // Update alle themas
            Object.keys(this.themes).forEach(id => this.updateThemeUI(id));
        }
    }

    purchaseTheme(themeId) {
        const theme = this.themes[themeId];
        
        if (!theme) {
            console.error(`Thema ${themeId} bestaat niet`);
            return false;
        }

        if (theme.unlocked) {
            console.log(`Thema ${theme.name} is al gekocht`);
            return false;
        }

        if (this.game.count < theme.cost) {
            console.log(`Niet genoeg zonnebloemen voor ${theme.name}. Nodig: ${theme.cost}, Heb: ${this.game.count}`);
            return false;
        }

        // Koop het thema
        this.game.count -= theme.cost;
        theme.unlocked = true;
        this.game.stats.upgradesBought++;

        // Update displays
        this.game.updateDisplay();
        this.game.updateStatsDisplay();
        this.updateThemeUI(themeId);
        
        // Save data
        this.game.saveCount();
        this.game.saveStats();
        this.saveThemeData();

        // Toon notificatie
        this.showThemeUnlockNotification(theme);

        console.log(`Thema ${theme.name} gekocht voor ${theme.cost} zonnebloemen!`);
        return true;
    }

    showThemeUnlockNotification(theme) {
        const notification = document.getElementById('achievementNotification');
        const nameElement = document.getElementById('notificationName');
        
        if (notification && nameElement) {
            nameElement.textContent = `Thema Gekocht: ${theme.name} ${theme.icon}`;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }

    setupThemeListeners() {
        // Luister naar thema wijzigingen
        const themeInputs = document.querySelectorAll('input[name="theme"]');
        themeInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                if (e.target.checked) {
                    const themeId = e.target.id.replace('theme-', '');
                    
                    // Controleer of het thema unlocked is (default is altijd unlocked)
                    if (themeId === 'default' || (this.themes[themeId] && this.themes[themeId].unlocked)) {
                        this.currentTheme = themeId;
                        this.saveThemeData();
                    } else {
                        // Thema is vergrendeld, ga terug naar vorige thema
                        e.target.checked = false;
                        const currentThemeInput = document.getElementById(`theme-${this.currentTheme}`);
                        if (currentThemeInput) {
                            currentThemeInput.checked = true;
                        }
                        
                        // Toon melding dat thema vergrendeld is
                        const theme = this.themes[themeId];
                        if (theme) {
                            console.log(`Thema ${theme.name} is nog vergrendeld! Kost: ${theme.cost} zonnebloemen`);
                        }
                    }
                }
            });
            
            // Voorkom dat vergrendelde themas geklikt kunnen worden
            input.addEventListener('click', (e) => {
                const themeId = e.target.id.replace('theme-', '');
                if (themeId !== 'default' && (!this.themes[themeId] || !this.themes[themeId].unlocked)) {
                    e.preventDefault();
                    return false;
                }
            });
        });
    }

    saveThemeData() {
        const saveData = {
            themes: {},
            currentTheme: this.currentTheme
        };
        
        Object.entries(this.themes).forEach(([id, theme]) => {
            saveData.themes[id] = {
                unlocked: theme.unlocked
            };
        });
        
        localStorage.setItem('themeData', JSON.stringify(saveData));
    }

    loadThemeData() {
        // Eerst alle themas vergrendelen
        this.initializeLockedThemes();
        
        const saved = localStorage.getItem('themeData');
        if (saved) {
            try {
                const saveData = JSON.parse(saved);
                
                // Laad thema unlock status
                if (saveData.themes) {
                    Object.entries(saveData.themes).forEach(([id, data]) => {
                        if (this.themes[id]) {
                            this.themes[id].unlocked = data.unlocked || false;
                        }
                    });
                }
                
                // Laad huidig thema
                if (saveData.currentTheme) {
                    this.currentTheme = saveData.currentTheme;
                    
                    // Stel het thema in alleen als het unlocked is
                    const themeInput = document.getElementById(`theme-${this.currentTheme}`);
                    if (themeInput && (this.currentTheme === 'default' || this.themes[this.currentTheme]?.unlocked)) {
                        themeInput.checked = true;
                    } else {
                        // Als het opgeslagen thema niet unlocked is, ga terug naar default
                        this.currentTheme = 'default';
                        const defaultTheme = document.getElementById('theme-default');
                        if (defaultTheme) {
                            defaultTheme.checked = true;
                        }
                    }
                }
                
                // Update UI na laden
                setTimeout(() => {
                    this.updateThemeUI();
                }, 100);
                
            } catch (error) {
                console.error('Fout bij laden thema data:', error);
                this.initializeLockedThemes();
            }
        } else {
            // Geen opgeslagen data, zorg ervoor dat alles vergrendeld is
            this.initializeLockedThemes();
        }
    }

    initializeLockedThemes() {
        // Zorg ervoor dat alle themas vergrendeld zijn bij start
        Object.keys(this.themes).forEach(themeId => {
            const themeInput = document.getElementById(`theme-${themeId}`);
            const themeLock = document.querySelector(`.theme-${themeId}-option .theme-lock`);
            
            if (themeInput) {
                themeInput.disabled = true;
                themeInput.checked = false;
                themeInput.classList.add('theme-locked');
            }
            if (themeLock) {
                themeLock.style.display = 'block';
            }
        });
        
        // Zorg ervoor dat default thema geselecteerd is
        const defaultTheme = document.getElementById('theme-default');
        if (defaultTheme) {
            defaultTheme.checked = true;
        }
    }

    resetThemes() {
        // Reset alle themas naar locked
        Object.values(this.themes).forEach(theme => {
            theme.unlocked = false;
        });
        
        this.currentTheme = 'default';
        
        // Reset UI
        const defaultTheme = document.getElementById('theme-default');
        if (defaultTheme) {
            defaultTheme.checked = true;
        }
        
        // Lock alle themas weer
        Object.keys(this.themes).forEach(themeId => {
            const themeInput = document.getElementById(`theme-${themeId}`);
            const themeLock = document.querySelector(`.theme-${themeId}-option .theme-lock`);
            const unlockItem = document.getElementById(`${themeId}-unlock`);
            
            if (themeInput) {
                themeInput.classList.add('theme-locked');
                themeInput.disabled = true;
                themeInput.checked = false;
            }
            if (themeLock) {
                themeLock.style.display = 'block';
            }
            if (unlockItem) {
                unlockItem.classList.remove('purchased', 'affordable');
                const purchaseBtn = unlockItem.querySelector('.purchase-btn');
                if (purchaseBtn) {
                    purchaseBtn.textContent = 'Koop';
                    purchaseBtn.disabled = true;
                }
            }
        });
        
        // Verwijder opgeslagen data
        localStorage.removeItem('themeData');
    }
}

// Globale functie voor HTML onclick handlers
function purchaseTheme(themeId) {
    if (window.gameInstance && window.gameInstance.themeSystem) {
        return window.gameInstance.themeSystem.purchaseTheme(themeId);
    }
    console.error('Game instance niet gevonden');
    return false;
}

class SimpleCookieClicker {
    constructor() {
        this.count = 0;
        this.countElement = document.getElementById('sunflowerCount');
        this.volume = 50;
        
        // Stats tracking
        this.stats = {
            totalClicks: 0,
            totalFlowers: 0,
            upgradesBought: 0,
            perClick: 1,
            perSecond: 0,
            gameStartTime: Date.now()
        };

        // Achievement systeem
        this.achievementSystem = new AchievementSystem();
        
        // Event systeem
        this.eventSystem = new EventSystem();
        
        // Theme systeem
        this.themeSystem = new ThemeSystem(this);
        
        // Maak game instance globaal beschikbaar voor HTML onclick handlers
        window.gameInstance = this;
        
        this.init();
    }
    
    init() {
        this.loadCount();
        this.loadSettings();
        this.loadStats();
        this.eventSystem.loadEventData();
        this.setupClicker();
        this.setupSettings();
        this.setupStatsPanel();
        this.setupAchievementsPanel();
        this.updateStatsDisplay();
        this.startAutoGeneration();
    }
    
    loadCount() {
        const saved = localStorage.getItem('sunflowerCount');
        if (saved) {
            this.count = parseInt(saved);
            this.updateDisplay();
        }
    }
    
    click() {
        // Bereken click waarde met event multipliers
        const eventMultiplier = this.eventSystem.getClickMultiplier();
        const clickValue = this.stats.perClick * eventMultiplier;
        
        this.count += clickValue;
        this.stats.totalClicks++;
        this.stats.totalFlowers += clickValue;
        
        // Check voor meteor bonus (alleen bij clicks)
        const meteorEvent = this.eventSystem.events['meteor-shower'];
        if (meteorEvent && meteorEvent.isActive && Math.random() < 0.3) { // 30% kans per click
            const meteorBonus = Math.floor(Math.random() * 21) + 5; // 5-25 bonus
            this.count += meteorBonus;
            this.stats.totalFlowers += meteorBonus;
            this.showMeteorEffect(meteorBonus);
        }
        
        this.updateDisplay();
        this.updateStatsDisplay();
        this.saveCount();
        this.saveStats();
        this.eventSystem.saveEventData();
        
        // Check achievements
        this.achievementSystem.checkAchievements(this.stats.totalClicks, this.stats.totalFlowers);
        
        // Check event unlocks
        this.eventSystem.checkUnlocks(this.stats.totalClicks);
        
        // Check theme unlocks
        this.themeSystem.checkUnlocks();
    }
    
    updateDisplay() {
        if (this.countElement) {
            this.countElement.textContent = this.count;
        }
    }
    
    saveCount() {
        localStorage.setItem('sunflowerCount', this.count);
    }
    
    showMeteorEffect(bonus) {
        // Toon een visueel effect voor meteor bonus
        const notification = document.getElementById('achievementNotification');
        const nameElement = document.getElementById('notificationName');
        
        if (notification && nameElement) {
            nameElement.textContent = `Meteor Bonus: +${bonus} zonnebloemen! ☄️`;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 2000);
        }
    }
    
    startAutoGeneration() {
        setInterval(() => {
            if (this.stats.perSecond > 0) {
                const eventBonus = this.eventSystem.getBonusPerSecond();
                const totalPerSecond = this.stats.perSecond + eventBonus;
                
                this.count += totalPerSecond;
                this.stats.totalFlowers += totalPerSecond;
                
                this.updateDisplay();
                this.updateStatsDisplay();
                this.saveCount();
                this.saveStats();
                
                // Check achievements
                this.achievementSystem.checkAchievements(this.stats.totalClicks, this.stats.totalFlowers);
                
                // Check theme unlocks
                this.themeSystem.checkUnlocks();
            }
        }, 1000); // Elke seconde
    }
    
    // Stats methods
    loadStats() {
        const savedStats = localStorage.getItem('gameStats');
        if (savedStats) {
            const parsed = JSON.parse(savedStats);
            this.stats = { ...this.stats, ...parsed };
        }
    }
    
    saveStats() {
        localStorage.setItem('gameStats', JSON.stringify(this.stats));
    }
    
    updateStatsDisplay() {
        const totalFlowersEl = document.getElementById('totalFlowers');
        const totalClicksEl = document.getElementById('totalClicks');
        const perSecondEl = document.getElementById('perSecond');
        const upgradesBoughtEl = document.getElementById('upgradesBought');
        const perClickEl = document.getElementById('perClick');
        
        if (totalFlowersEl) totalFlowersEl.textContent = this.stats.totalFlowers.toLocaleString();
        if (totalClicksEl) totalClicksEl.textContent = this.stats.totalClicks.toLocaleString();
        if (perSecondEl) perSecondEl.textContent = this.stats.perSecond.toLocaleString();
        if (upgradesBoughtEl) upgradesBoughtEl.textContent = this.stats.upgradesBought.toLocaleString();
        if (perClickEl) perClickEl.textContent = this.stats.perClick.toLocaleString();
    }
    
    setupStatsPanel() {
        const statsButton = document.getElementById('statsButton');
        const statsPanel = document.getElementById('statsPanel');
        
        if (statsButton && statsPanel) {
            statsButton.addEventListener('click', () => {
                statsPanel.classList.toggle('show');
            });
            
            // Close stats panel when clicking outside
            document.addEventListener('click', (e) => {
                if (!statsPanel.contains(e.target) && !statsButton.contains(e.target)) {
                    statsPanel.classList.remove('show');
                }
            });
        }
    }

    setupAchievementsPanel() {
        const achievementsButton = document.getElementById('achievementsButton');
        const achievementsPanel = document.getElementById('achievementsPanel');
        
        if (achievementsButton && achievementsPanel) {
            achievementsButton.addEventListener('click', () => {
                achievementsPanel.classList.toggle('show');
            });
            
            // Close achievements panel when clicking outside
            document.addEventListener('click', (e) => {
                if (!achievementsPanel.contains(e.target) && !achievementsButton.contains(e.target)) {
                    achievementsPanel.classList.remove('show');
                }
            });
        }
    }
    
    setupClicker() {
        const button = document.querySelector('.sunflower-button');
        if (button) {
            button.addEventListener('click', () => this.click());
        }
    }

    loadSettings() {
        const savedVolume = localStorage.getItem('gameVolume');
        if (savedVolume) {
            this.volume = parseInt(savedVolume);
        }
        this.updateVolumeDisplay();
    }

    saveSettings() {
        localStorage.setItem('gameVolume', this.volume);
    }

    updateVolumeDisplay() {
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');
        
        if (volumeSlider) {
            volumeSlider.value = this.volume;
        }
        if (volumeValue) {
            volumeValue.textContent = this.volume + '%';
        }
    }

    setupSettings() {
        const settingsButton = document.getElementById('settingsButton');
        const settingsPanel = document.getElementById('settingsPanel');
        
        if (settingsButton && settingsPanel) {
            settingsButton.addEventListener('click', () => {
                settingsPanel.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!settingsPanel.contains(e.target) && !settingsButton.contains(e.target)) {
                    settingsPanel.classList.remove('show');
                }
            });
        }

        
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.volume = parseInt(e.target.value);
                this.updateVolumeDisplay();
                this.saveSettings();
            });
        }

       
        const resetButton = document.getElementById('resetGameBtn');
        const resetModal = document.getElementById('resetModal');
        const resetCancelBtn = document.getElementById('resetCancelBtn');
        const resetConfirmBtn = document.getElementById('resetConfirmBtn');
        const successModal = document.getElementById('successModal');
        const successOkBtn = document.getElementById('successOkBtn');

        if (resetButton && resetModal) {
            resetButton.addEventListener('click', () => {
                resetModal.classList.add('show');
            });
        }

        if (resetCancelBtn && resetModal) {
            resetCancelBtn.addEventListener('click', () => {
                resetModal.classList.remove('show');
            });
        }

        if (resetConfirmBtn && resetModal && successModal) {
            resetConfirmBtn.addEventListener('click', () => {
                this.resetGame();
                resetModal.classList.remove('show');
                successModal.classList.add('show');
            });
        }

        if (successOkBtn && successModal) {
            successOkBtn.addEventListener('click', () => {
                successModal.classList.remove('show');
            });
        }

       
        if (resetModal) {
            resetModal.addEventListener('click', (e) => {
                if (e.target === resetModal) {
                    resetModal.classList.remove('show');
                }
            });
        }

        if (successModal) {
            successModal.addEventListener('click', (e) => {
                if (e.target === successModal) {
                    successModal.classList.remove('show');
                }
            });
        }
    }

    resetGame() {
        this.count = 0;
        this.volume = 50;
        
        // Reset stats
        this.stats = {
            totalClicks: 0,
            totalFlowers: 0,
            upgradesBought: 0,
            perClick: 1,
            perSecond: 0,
            gameStartTime: Date.now()
        };
        
        // Reset achievements
        this.achievementSystem.resetAchievements();
        
        // Reset events
        this.eventSystem.resetEvents();
        
        // Reset themes
        this.themeSystem.resetThemes();
        
        // Clear localStorage
        localStorage.removeItem('sunflowerCount');
        localStorage.removeItem('gameVolume');
        localStorage.removeItem('gameStats');
        
        // Update displays
        this.updateDisplay();
        this.updateVolumeDisplay();
        this.updateStatsDisplay();
        
        // Reset plant name
        const plantName = document.getElementById('plant-name');
        if (plantName) {
            plantName.textContent = 'Naamloze Plant';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SimpleCookieClicker();
});
