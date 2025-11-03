// ===== SIMPLE GAME STORAGE =====
class Storage {
    static save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    static load(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
    
    static remove(key) {
        localStorage.removeItem(key);
    }
}

// ===== SIMPLE ACHIEVEMENT =====
class Achievement {
    constructor(id, name, icon, type, target) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.target = target;
        this.unlocked = false;
    }
    
    check(game) {
        if (this.unlocked) return false;
        
        let current = 0;
        switch (this.type) {
            case 'clicks': current = game.totalClicks; break;
            case 'flowers': current = game.totalFlowers; break;
            case 'upgrades': current = game.upgradesBought; break;
            case 'themes': current = game.unlockedThemes; break;
            case 'events': current = game.totalEvents; break;
            case 'perSecond': current = game.perSecond; break;
            case 'time': current = (Date.now() - game.startTime) / 60000; break;
        }
        
        if (current >= this.target) {
            this.unlocked = true;
            this.showNotification();
            return true;
        }
        return false;
    }
    
    showNotification() {
        Achievement.showNotificationMessage(this.name);
    }
    
    static showNotificationMessage(message) {
        const notification = document.getElementById('achievementNotification');
        const nameElement = document.getElementById('notificationName');
        if (notification && nameElement) {
            nameElement.textContent = message;
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 3000);
        }
    }
}

// ===== SIMPLE EVENT =====
class GameEvent {
    constructor(id, name, icon, cost, duration, cooldown, effect) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.cost = cost;
        this.duration = duration;
        this.cooldown = cooldown;
        this.effect = effect;
        this.active = false;
        this.unlocked = false;
        this.timeLeft = 0;
        this.cooldownLeft = 0;
        
        
        const element = document.getElementById(`${id}-event`);
        if (element) {
            element.onclick = () => this.activate();
        }
    }
    
    activate() {
        if (!this.canActivate()) return false;
        
        window.game.count -= this.cost;
        window.game.totalEvents++;
        window.game.updateDisplay();
        
        this.active = true;
        this.timeLeft = this.duration;
        this.updateUI();
        
        return true;
    }
    
    canActivate() {
        return this.unlocked && !this.active && this.cooldownLeft <= 0 && window.game.count >= this.cost;
    }
    
    update(deltaTime) {
        if (this.active && this.timeLeft > 0) {
            this.timeLeft -= deltaTime;
            if (this.timeLeft <= 0) {
                this.active = false;
                this.cooldownLeft = this.cooldown;
            }
        }
        
        if (this.cooldownLeft > 0) {
            this.cooldownLeft -= deltaTime;
            if (this.cooldownLeft <= 0) this.cooldownLeft = 0;
        }
        
        this.updateUI();
    }
    
    updateUI() {
        const element = document.getElementById(`${this.id}-event`);
        const timer = document.getElementById(`${this.id}-timer`);
        
        if (element) {
            element.setAttribute('data-active', this.active);
            element.setAttribute('data-unlocked', this.unlocked);
        }
        
        if (timer) {
            if (this.active && this.timeLeft > 0) {
                const min = Math.floor(this.timeLeft / 60);
                const sec = Math.floor(this.timeLeft % 60);
                timer.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
            } else if (this.cooldownLeft > 0) {
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
const UPGRADE_CONFIG = {
 
    mousePowerBtn: { cost: 15, type: 'click', value: 1, name: 'Zonnestralen' },
    autoClickerBtn: { cost: 50, type: 'perSecond', value: 2, name: 'Automatische groei' },
    fertilizerBtn: { cost: 125, type: 'click', value: 2, name: 'Magische Meststof' },
    beeHiveBtn: { cost: 300, type: 'perSecond', value: 0.1, name: 'Bijenkorf' },
    rainCloudBtn: { cost: 750, type: 'click', value: 5, name: 'Regenwolk' },
    gardenGnomeBtn: { cost: 1500, type: 'perSecond', value: 0.2, name: 'Tuinkabouter' },
    sunlightLensBtn: { cost: 3000, type: 'click', value: 10, name: 'Zonlicht Lens' },
    timeAcceleratorBtn: { cost: 6000, type: 'perSecond', value: 0.5, name: 'Tijd Versneller' },
    cosmicSeedBtn: { cost: 12000, type: 'click', value: 25, name: 'Kosmisch Zaad' },
    
    turboZonnestralenBtn: { cost: 500, type: 'multiplier', target: 'mousePowerBtn', value: 1.5, name: 'Turbo Zonnestralen' },
    superGroeiBtn: { cost: 1200, type: 'multiplier', target: 'autoClickerBtn', value: 1.1, name: 'Super Groei' },
    megaMeststofBtn: { cost: 2500, type: 'multiplier', target: 'fertilizerBtn', value: 1.5, name: 'Mega Meststof' },
    koninginneBijBtn: { cost: 4000, type: 'multiplier', target: 'beeHiveBtn', value: 2, name: 'Koningin Bij' },
    stormWolkBtn: { cost: 6500, type: 'multiplier', target: 'rainCloudBtn', value: 2, name: 'Storm Wolk' },
    aartsTuinkabouter: { cost: 10000, type: 'multiplier', target: 'gardenGnomeBtn', value: 2, name: 'Aarts Tuinkabouter' },
    prismaLensBtn: { cost: 15000, type: 'multiplier', target: 'sunlightLensBtn', value: 2.5, name: 'Prisma Lens' },
    tijdMeesterBtn: { cost: 20000, type: 'multiplier', target: 'timeAcceleratorBtn', value: 2.5, name: 'Tijd Meester' }
};

// ===== SIMPLE UPGRADE =====
class Upgrade {
    constructor(id, config) {
        this.id = id;
        this.cost = config.cost;
        this.type = config.type;
        this.value = config.value;
        this.target = config.target;
        this.name = config.name;
        this.purchased = false;
        this.multiplier = 1;
        
        // Setup click handler
        const element = document.getElementById(id);
        if (element) {
            element.onclick = () => this.purchase();
        }
    }
    
    purchase() {
        if (this.purchased || window.game.count < this.cost) return false;
        
        window.game.count -= this.cost;
        window.game.upgradesBought++;
        this.purchased = true;
        
        this.applyEffect();
        this.updateUI();
        window.game.updateDisplay();
        window.game.checkAchievements();
        window.game.save();
        
        return true;
    }
    
    applyEffect() {
        const game = window.game;
        
        switch (this.type) {
            case 'click':
                game.perClick += this.value;
                break;
            case 'perSecond':
                game.perSecond += this.value;
                break;
            case 'multiplier':
                const targetUpgrade = game.upgrades.find(u => u.id === this.target);
                if (targetUpgrade && targetUpgrade.purchased) {
                    targetUpgrade.multiplier *= this.value;
                    // Recalculate effect
                    if (targetUpgrade.type === 'click') {
                        game.perClick += (targetUpgrade.value * (this.value - 1));
                    } else if (targetUpgrade.type === 'perSecond') {
                        game.perSecond += (targetUpgrade.value * (this.value - 1));
                    }
                }
                break;
        }
    }
    
    updateUI() {
        const element = document.getElementById(this.id);
        if (!element) return;
        
        if (this.purchased) {
            element.classList.add('purchased');
            element.style.opacity = '0.5';
            element.style.pointerEvents = 'none';
        } else if (window.game.count >= this.cost) {
            element.classList.add('affordable');
            element.classList.remove('unaffordable');
        } else {
            element.classList.add('unaffordable');
            element.classList.remove('affordable');
        }
    }
}

// ===== SIMPLE THEME =====
class Theme {
    constructor(id, name, cost, icon) {
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.icon = icon;
        this.unlocked = false;
        
        // Setup purchase button
        const button = document.querySelector(`#${id}-unlock .purchase-btn`);
        if (button) {
            button.onclick = () => this.purchase();
        }
    }
    
    purchase() {
        if (this.unlocked || window.game.count < this.cost) return false;
        
        window.game.count -= this.cost;
        window.game.upgradesBought++;
        window.game.unlockedThemes++;
        this.unlocked = true;
        
        window.game.updateDisplay();
        this.updateUI();
        this.showNotification();
        
        return true;
    }
    
    updateUI() {
        const unlockItem = document.getElementById(`${this.id}-unlock`);
        const button = unlockItem?.querySelector('.purchase-btn');
        const themeInput = document.getElementById(`theme-${this.id}`);
        const lock = document.querySelector(`.theme-${this.id}-option .theme-lock`);
        
        if (this.unlocked) {
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
            if (button) button.disabled = false;
            if (unlockItem) unlockItem.classList.add('affordable');
        } else {
            if (button) button.disabled = true;
            if (unlockItem) unlockItem.classList.remove('affordable');
        }
    }
    
    showNotification() {
        Achievement.showNotificationMessage(`Thema Gekocht: ${this.name} ${this.icon}`);
    }
}

// ===== MAIN GAME =====
class Game {
    constructor() {
        
        this.count = 0;
        this.totalClicks = 0;
        this.totalFlowers = 0;
        this.upgradesBought = 0;
        this.perClick = 1;
        this.perSecond = 0;
        this.totalEvents = 0;
        this.unlockedThemes = 0;
        this.startTime = Date.now();
        this.volume = 50;
        this.currentTheme = 'default';
        
        
        this.domElements = {};
        
       
        this.achievements = this.createAchievements();
        this.events = this.createEvents();
        this.themes = this.createThemes();
        this.upgrades = this.createUpgrades();
        
        // Make globally available
        window.game = this;
        
        this.load();
        this.setupUI();
        this.startGameLoop();
    }
    
    createAchievements() {
        return [
            new Achievement('first-click', 'Eerste Klik', '👆', 'clicks', 1),
            new Achievement('hundred-club', 'Honderd Club', '💯', 'flowers', 100),
            new Achievement('click-master', 'Klik Meester', '🖱️', 'clicks', 500),
            new Achievement('thousand-stars', 'Duizend Sterren', '⭐', 'flowers', 1000),
            new Achievement('click-king', 'Klik Koning', '👑', 'clicks', 2000),
            new Achievement('sunflower-tycoon', 'Zonnebloem Magnaat', '🌻', 'flowers', 5000),
            new Achievement('click-legend', 'Klik Legende', '🌟', 'clicks', 5000),
            new Achievement('mega-collector', 'Mega Verzamelaar', '🏆', 'flowers', 10000),
            new Achievement('click-god', 'Klik God', '⚡', 'clicks', 10000),
            new Achievement('sunflower-emperor', 'Zonnebloem Keizer', '👑', 'flowers', 25000),
            new Achievement('infinity-clicker', 'Oneindige Klikker', '∞', 'clicks', 25000),
            new Achievement('ultimate-collector', 'Ultieme Verzamelaar', '💎', 'flowers', 50000),
            new Achievement('first-upgrade', 'Eerste Upgrade', '🛒', 'upgrades', 1),
            new Achievement('upgrade-enthusiast', 'Upgrade Liefhebber', '📈', 'upgrades', 5),
            new Achievement('upgrade-master', 'Upgrade Meester', '🎯', 'upgrades', 15),
            new Achievement('upgrade-collector', 'Upgrade Verzamelaar', '🏪', 'upgrades', 25),
            new Achievement('style-explorer', 'Stijl Ontdekkingsreiziger', '🎨', 'themes', 1),
            new Achievement('theme-collector', 'Thema Verzamelaar', '🌈', 'themes', 2),
            new Achievement('fashion-master', 'Mode Meester', '✨', 'themes', 3),
            new Achievement('event-starter', 'Event Starter', '🎉', 'events', 1),
            new Achievement('event-enthusiast', 'Event Liefhebber', '🎊', 'events', 5),
            new Achievement('event-master', 'Event Meester', '🎆', 'events', 15),
            new Achievement('efficiency-expert', 'Efficiëntie Expert', '⚙️', 'perSecond', 50),
            new Achievement('patient-gardener', 'Geduldige Tuinier', '🕐', 'time', 30),
            new Achievement('dedicated-farmer', 'Toegewijde Boer', '👨‍🌾', 'time', 120)
        ];
    }
    
    createEvents() {
        return [
            new GameEvent('golden-hour', 'Gouden Uur', '🌅', 200, 15, 300, {type: 'clickMultiplier', value: 2}),
            new GameEvent('bee-swarm', 'Bijenzwerm', '🐝', 600, 15, 400, {type: 'bonusPerSecond', value: 10}),
            new GameEvent('rainbow-boost', 'Regenboog Boost', '🌈', 1200, 15, 600, {type: 'clickMultiplier', value: 5}),
            new GameEvent('meteor-shower', 'Meteorenregen', '☄️', 2500, 15, 800, {type: 'randomBonus', value: 0.3}),
            new GameEvent('fairy-visit', 'Fee Bezoek', '🧚‍♀️', 5000, 15, 1000, {type: 'discount', value: 0.5})
        ];
    }
    
    createThemes() {
        return [
            new Theme('storm', 'Storm', 100, '⛈️'),
            new Theme('night', 'Nacht', 250, '🌙'),
            new Theme('autumn', 'Herfst', 500, '🍂')
        ];
    }
    
    createUpgrades() {
        const upgrades = [];
        for (const [id, config] of Object.entries(UPGRADE_CONFIG)) {
            upgrades.push(new Upgrade(id, config));
        }
        return upgrades;
    }
    
    click() {
        let clickValue = this.perClick;
        
        // Apply event multipliers
        for (const event of this.events) {
            if (event.active && event.effect.type === 'clickMultiplier') {
                clickValue *= event.effect.value;
            }
        }
        
        this.count += clickValue;
        this.totalClicks++;
        this.totalFlowers += clickValue;
        
        // Meteor shower bonus
        const meteorEvent = this.events.find(e => e.id === 'meteor-shower');
        if (meteorEvent && meteorEvent.active && Math.random() < meteorEvent.effect.value) {
            const bonus = Math.floor(Math.random() * 21) + 5;
            this.count += bonus;
            this.totalFlowers += bonus;
            console.log(`Meteor bonus: +${bonus} zonnebloemen!`);
        }
        
        this.updateDisplay();
        this.checkAchievements();
        this.checkUnlocks();
        this.save();
    }
    
    checkAchievements() {
        for (const achievement of this.achievements) {
            if (achievement.check(this)) {
                this.updateAchievementUI(achievement);
            }
        }
    }
    
    checkUnlocks() {
        // Check event unlocks and update all UI in one loop
        this.events.forEach(event => {
            if (!event.unlocked && this.totalFlowers >= event.cost) {
                event.unlocked = true;
            }
            event.updateUI();
        });
        
        // Update theme and upgrade UI
        this.themes.forEach(theme => theme.updateUI());
        this.upgrades.forEach(upgrade => upgrade.updateUI());
    }
    
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
    
    updateDisplay() {
        if (!this.domElements.sunflowerCount) this.cacheDOM();
        
        const { sunflowerCount, totalFlowers, totalClicks, perSecond, upgradesBought, perClick } = this.domElements;
        
        if (sunflowerCount) sunflowerCount.textContent = this.count;
        if (totalFlowers) totalFlowers.textContent = this.totalFlowers;
        if (totalClicks) totalClicks.textContent = this.totalClicks;
        if (perSecond) perSecond.textContent = this.perSecond;
        if (upgradesBought) upgradesBought.textContent = this.upgradesBought;
        if (perClick) perClick.textContent = this.perClick;
    }
    
    updateAchievementUI(achievement) {
        const element = document.getElementById(`achievement-${achievement.id}`);
        if (element) {
            element.classList.add('achieved');
            element.setAttribute('data-achieved', 'true');
            const status = element.querySelector('.achievement-status');
            if (status) status.textContent = '✅';
        }
    }
    
    setupUI() {
        // Setup sunflower click
        const sunflower = document.querySelector('.sunflower-button');
        if (sunflower) {
            sunflower.onclick = () => this.click();
        }
        
        // Setup panels
        this.setupPanel('settings', 'settingsButton', 'settingsPanel');
        this.setupPanel('stats', 'statsButton', 'statsPanel');
        this.setupPanel('achievements', 'achievementsButton', 'achievementsPanel');
        
        // Setup volume
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');
        if (volumeSlider && volumeValue) {
            volumeSlider.value = this.volume;
            volumeValue.textContent = this.volume + '%';
            volumeSlider.oninput = (e) => {
                this.volume = parseInt(e.target.value);
                volumeValue.textContent = this.volume + '%';
                this.save();
            };
        }
        
        // Setup reset
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
            // Toggle panel when button is clicked
            button.onclick = (e) => {
                e.stopPropagation(); // Prevent document click from immediately closing
                panel.classList.toggle('show');
            };
            
            // Close panel when clicking outside
            document.addEventListener('click', (e) => {
                // Check if click is outside the panel and button
                if (!panel.contains(e.target) && !button.contains(e.target)) {
                    panel.classList.remove('show');
                }
            });
            
            // Prevent panel clicks from closing the panel
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
                    } else {
                        const theme = this.themes.find(t => t.id === themeId);
                        if (theme && theme.unlocked) {
                            this.currentTheme = themeId;
                            this.save();
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
            
            // Auto generation
            if (this.perSecond > 0) {
                let totalPerSecond = this.perSecond;
                
                // Add event bonuses
                totalPerSecond += this.events
                    .filter(event => event.active && event.effect.type === 'bonusPerSecond')
                    .reduce((sum, event) => sum + event.effect.value, 0);
                
                this.count += totalPerSecond;
                this.totalFlowers += totalPerSecond;
                this.updateDisplay();
                this.checkAchievements();
                this.checkUnlocks();
            }
            
            // Update events
            for (const event of this.events) {
                event.update(deltaTime);
            }
            
            // Save every 5 seconds
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
            volume: this.volume,
            currentTheme: this.currentTheme,
            achievements: this.achievements.map(a => ({id: a.id, unlocked: a.unlocked})),
            events: this.events.map(e => ({
                id: e.id, 
                unlocked: e.unlocked, 
                active: e.active, 
                timeLeft: e.timeLeft, 
                cooldownLeft: e.cooldownLeft
            })),
            themes: this.themes.map(t => ({id: t.id, unlocked: t.unlocked})),
            upgrades: this.upgrades.map(u => ({id: u.id, purchased: u.purchased, multiplier: u.multiplier}))
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
        this.volume = data.volume || 50;
        this.currentTheme = data.currentTheme || 'default';
        
        // Load all systems data
        this.loadSystemData(data.achievements, this.achievements, (item, saved) => {
            item.unlocked = saved.unlocked;
        });
        
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
            if (item.purchased) item.applyEffect();
        });
        
        // Update UI after loading
        setTimeout(() => {
            this.updateDisplay();
            this.updateAllUI();
            
            // Set current theme
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
        
        // Reset all systems
        this.achievements.forEach(achievement => achievement.unlocked = false);
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
        });
        
        Storage.remove('gameData');
        
        // Reset UI
        this.updateDisplay();
        this.updateAllUI();
        
        const defaultTheme = document.getElementById('theme-default');
        if (defaultTheme) defaultTheme.checked = true;
        
        console.log('Game reset completed');
    }
    
    // Helper method for loading system data
    loadSystemData(savedData, systemArray, applyFunction) {
        if (!savedData) return;
        savedData.forEach(saved => {
            const item = systemArray.find(i => i.id === saved.id);
            if (item) applyFunction(item, saved);
        });
    }
    
    // Helper method for updating all UI elements
    updateAllUI() {
        this.achievements.forEach(achievement => {
            if (achievement.unlocked) this.updateAchievementUI(achievement);
        });
        this.events.forEach(event => event.updateUI());
        this.themes.forEach(theme => theme.updateUI());
        this.upgrades.forEach(upgrade => upgrade.updateUI());
    }
}

// ===== START GAME =====
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
