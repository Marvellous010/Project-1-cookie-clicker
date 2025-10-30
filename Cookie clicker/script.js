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
        this.icon = icon;
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
        const notification = document.getElementById('achievementNotification');
        const nameElement = document.getElementById('notificationName');
        if (notification && nameElement) {
            nameElement.textContent = this.name;
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
        
        // Setup click handler
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
        const notification = document.getElementById('achievementNotification');
        const nameElement = document.getElementById('notificationName');
        if (notification && nameElement) {
            nameElement.textContent = `Thema Gekocht: ${this.name} ${this.icon}`;
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 3000);
        }
    }
}

// ===== MAIN GAME =====
class Game {
    constructor() {
        // Basic game state
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
        
        // Initialize systems
        this.achievements = this.createAchievements();
        this.events = this.createEvents();
        this.themes = this.createThemes();
        
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
        // Check event unlocks
        for (const event of this.events) {
            if (!event.unlocked && this.totalFlowers >= event.cost) {
                event.unlocked = true;
                event.updateUI();
            }
        }
        
        // Check theme unlocks
        for (const theme of this.themes) {
            theme.updateUI();
        }
    }
    
    updateDisplay() {
        const countElement = document.getElementById('sunflowerCount');
        if (countElement) countElement.textContent = this.count;
        
        const statsElements = {
            totalFlowers: document.getElementById('totalFlowers'),
            totalClicks: document.getElementById('totalClicks'),
            perSecond: document.getElementById('perSecond'),
            upgradesBought: document.getElementById('upgradesBought'),
            perClick: document.getElementById('perClick')
        };
        
        if (statsElements.totalFlowers) statsElements.totalFlowers.textContent = this.totalFlowers;
        if (statsElements.totalClicks) statsElements.totalClicks.textContent = this.totalClicks;
        if (statsElements.perSecond) statsElements.perSecond.textContent = this.perSecond;
        if (statsElements.upgradesBought) statsElements.upgradesBought.textContent = this.upgradesBought;
        if (statsElements.perClick) statsElements.perClick.textContent = this.perClick;
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
        const sunflower = document.querySelector('.sunflower');
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
            button.onclick = () => panel.classList.toggle('show');
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
                for (const event of this.events) {
                    if (event.active && event.effect.type === 'bonusPerSecond') {
                        totalPerSecond += event.effect.value;
                    }
                }
                
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
            themes: this.themes.map(t => ({id: t.id, unlocked: t.unlocked}))
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
        
        // Load achievements
        if (data.achievements) {
            for (const savedAchievement of data.achievements) {
                const achievement = this.achievements.find(a => a.id === savedAchievement.id);
                if (achievement) {
                    achievement.unlocked = savedAchievement.unlocked;
                }
            }
        }
        
        // Load events
        if (data.events) {
            for (const savedEvent of data.events) {
                const event = this.events.find(e => e.id === savedEvent.id);
                if (event) {
                    event.unlocked = savedEvent.unlocked;
                    event.active = savedEvent.active;
                    event.timeLeft = savedEvent.timeLeft || 0;
                    event.cooldownLeft = savedEvent.cooldownLeft || 0;
                }
            }
        }
        
        // Load themes
        if (data.themes) {
            for (const savedTheme of data.themes) {
                const theme = this.themes.find(t => t.id === savedTheme.id);
                if (theme) {
                    theme.unlocked = savedTheme.unlocked;
                }
            }
        }
        
        // Update UI after loading
        setTimeout(() => {
            this.updateDisplay();
            for (const achievement of this.achievements) {
                if (achievement.unlocked) this.updateAchievementUI(achievement);
            }
            for (const event of this.events) {
                event.updateUI();
            }
            for (const theme of this.themes) {
                theme.updateUI();
            }
            
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
        
        for (const achievement of this.achievements) {
            achievement.unlocked = false;
        }
        
        for (const event of this.events) {
            event.unlocked = false;
            event.active = false;
            event.timeLeft = 0;
            event.cooldownLeft = 0;
        }
        
        for (const theme of this.themes) {
            theme.unlocked = false;
        }
        
        Storage.remove('gameData');
        
        // Reset UI
        this.updateDisplay();
        for (const achievement of this.achievements) {
            this.updateAchievementUI(achievement);
        }
        for (const event of this.events) {
            event.updateUI();
        }
        for (const theme of this.themes) {
            theme.updateUI();
        }
        
        const defaultTheme = document.getElementById('theme-default');
        if (defaultTheme) defaultTheme.checked = true;
        
        console.log('Game reset completed');
    }
}

// ===== GLOBAL FUNCTION FOR HTML =====
function purchaseTheme(themeId) {
    const theme = window.game.themes.find(t => t.id === themeId);
    if (theme) return theme.purchase();
    return false;
}

// ===== START GAME =====
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
