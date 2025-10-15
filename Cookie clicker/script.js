// ===== GAME CONFIGURATION =====
const GAME_CONFIG = {
    ACHIEVEMENTS: {
        // Click & Collection Achievements
        'first-click': { name: 'Eerste Klik', description: 'Klik voor de eerste keer', icon: '👆', requirement: { type: 'clicks', value: 1 } },
        'hundred-club': { name: 'Honderd Club', description: 'Verzamel 100 zonnebloemen', icon: '💯', requirement: { type: 'flowers', value: 100 } },
        'click-master': { name: 'Klik Meester', description: 'Klik 500 keer', icon: '🖱️', requirement: { type: 'clicks', value: 500 } },
        'thousand-stars': { name: 'Duizend Sterren', description: 'Verzamel 1000 zonnebloemen', icon: '⭐', requirement: { type: 'flowers', value: 1000 } },
        'sunflower-tycoon': { name: 'Zonnebloem Magnaat', description: 'Verzamel 5000 zonnebloemen', icon: '🌻', requirement: { type: 'flowers', value: 5000 } },
        'click-king': { name: 'Klik Koning', description: 'Klik 2000 keer', icon: '👑', requirement: { type: 'clicks', value: 2000 } },
        'mega-collector': { name: 'Mega Verzamelaar', description: 'Verzamel 10000 zonnebloemen', icon: '🏆', requirement: { type: 'flowers', value: 10000 } },
        'click-legend': { name: 'Klik Legende', description: 'Klik 5000 keer', icon: '🌟', requirement: { type: 'clicks', value: 5000 } },
        
        // Higher Milestone Achievements
        'sunflower-emperor': { name: 'Zonnebloem Keizer', description: 'Verzamel 25000 zonnebloemen', icon: '👑', requirement: { type: 'flowers', value: 25000 } },
        'click-god': { name: 'Klik God', description: 'Klik 10000 keer', icon: '⚡', requirement: { type: 'clicks', value: 10000 } },
        'ultimate-collector': { name: 'Ultieme Verzamelaar', description: 'Verzamel 50000 zonnebloemen', icon: '💎', requirement: { type: 'flowers', value: 50000 } },
        'infinity-clicker': { name: 'Oneindige Klikker', description: 'Klik 25000 keer', icon: '∞', requirement: { type: 'clicks', value: 25000 } },
        
        // Upgrade Achievements
        'first-upgrade': { name: 'Eerste Upgrade', description: 'Koop je eerste upgrade', icon: '🛒', requirement: { type: 'upgrades', value: 1 } },
        'upgrade-enthusiast': { name: 'Upgrade Liefhebber', description: 'Koop 5 upgrades', icon: '📈', requirement: { type: 'upgrades', value: 5 } },
        'upgrade-master': { name: 'Upgrade Meester', description: 'Koop 15 upgrades', icon: '🎯', requirement: { type: 'upgrades', value: 15 } },
        'upgrade-collector': { name: 'Upgrade Verzamelaar', description: 'Koop 25 upgrades', icon: '🏪', requirement: { type: 'upgrades', value: 25 } },
        
        // Theme Achievements
        'style-explorer': { name: 'Stijl Ontdekkingsreiziger', description: 'Unlock je eerste thema', icon: '🎨', requirement: { type: 'themes', value: 1 } },
        'theme-collector': { name: 'Thema Verzamelaar', description: 'Unlock 2 verschillende themas', icon: '🌈', requirement: { type: 'themes', value: 2 } },
        'fashion-master': { name: 'Mode Meester', description: 'Unlock alle themas', icon: '✨', requirement: { type: 'themes', value: 3 } },
        
        // Event Achievements
        'event-starter': { name: 'Event Starter', description: 'Activeer je eerste event', icon: '🎉', requirement: { type: 'events', value: 1 } },
        'event-enthusiast': { name: 'Event Liefhebber', description: 'Activeer 5 events', icon: '🎊', requirement: { type: 'events', value: 5 } },
        'event-master': { name: 'Event Meester', description: 'Activeer 15 events', icon: '🎆', requirement: { type: 'events', value: 15 } },
        'golden-hour-fan': { name: 'Gouden Uur Fan', description: 'Activeer Gouden Uur 3 keer', icon: '🌅', requirement: { type: 'golden-hour', value: 3 } },
        'bee-friend': { name: 'Bijenvriend', description: 'Activeer Bijenzwerm 3 keer', icon: '🐝', requirement: { type: 'bee-swarm', value: 3 } },
        
        // Special Achievements
        'speed-demon': { name: 'Snelheidsduivel', description: 'Verzamel 1000 zonnebloemen in 5 minuten', icon: '💨', requirement: { type: 'speed', value: 1000 } },
        'efficiency-expert': { name: 'Efficiëntie Expert', description: 'Bereik 50 zonnebloemen per seconde', icon: '⚙️', requirement: { type: 'perSecond', value: 50 } },
        'patient-gardener': { name: 'Geduldige Tuinier', description: 'Speel 30 minuten', icon: '🕐', requirement: { type: 'time', value: 30 } },
        'dedicated-farmer': { name: 'Toegewijde Boer', description: 'Speel 2 uur', icon: '👨‍🌾', requirement: { type: 'time', value: 120 } }
    },
    
    THEMES: {
        'storm': { name: 'Storm', cost: 100, icon: '⛈️' },
        'night': { name: 'Nacht', cost: 250, icon: '🌙' },
        'autumn': { name: 'Herfst', cost: 500, icon: '🍂' }
    },
    
    EVENTS: {
        'golden-hour': { name: 'Gouden Uur', icon: '🌅', description: 'Dubbele zonnebloemen voor alle clicks!', cost: 200, duration: 15, cooldown: 300 },
        'bee-swarm': { name: 'Bijenzwerm', icon: '🐝', description: '+10 zonnebloemen per seconde!', cost: 600, duration: 15, cooldown: 400 },
        'rainbow-boost': { name: 'Regenboog Boost', icon: '🌈', description: '5x click multiplier + extra geluk!', cost: 1200, duration: 15, cooldown: 600 },
        'meteor-shower': { name: 'Meteorenregen', icon: '☄️', description: 'Willekeurige zonnebloem explosies!', cost: 2500, duration: 15, cooldown: 800 },
        'fairy-visit': { name: 'Fee Bezoek', icon: '🧚‍♀️', description: 'Alle upgrades 50% goedkoper!', cost: 5000, duration: 15, cooldown: 1000 }
    }
};

// ===== UTILITY CLASSES =====

/**
 * Storage utility class for handling localStorage operations
 */
class GameStorage {
    static save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
            return false;
        }
    }
    
    static load(key, defaultValue = null) {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : defaultValue;
        } catch (error) {
            console.error(`Error loading ${key}:`, error);
            return defaultValue;
        }
    }
    
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
            return false;
        }
    }
    
    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }
}

/**
 * Game statistics tracking class
 */
class GameStats {
    constructor() {
        this.totalClicks = 0;
        this.totalFlowers = 0;
        this.upgradesBought = 0;
        this.perClick = 1;
        this.perSecond = 0;
        this.gameStartTime = Date.now();
    }
    
    save() {
        GameStorage.save('gameStats', {
            totalClicks: this.totalClicks,
            totalFlowers: this.totalFlowers,
            upgradesBought: this.upgradesBought,
            perClick: this.perClick,
            perSecond: this.perSecond,
            gameStartTime: this.gameStartTime
        });
    }
    
    load() {
        const saved = GameStorage.load('gameStats');
        if (saved) {
            Object.assign(this, saved);
        }
    }
    
    reset() {
        this.totalClicks = 0;
        this.totalFlowers = 0;
        this.upgradesBought = 0;
        this.perClick = 1;
        this.perSecond = 0;
        this.gameStartTime = Date.now();
        this.save();
    }
    
    getPlayTimeMinutes() {
        return (Date.now() - this.gameStartTime) / 1000 / 60;
    }
}

/**
 * Individual Achievement class
 */
class Achievement {
    constructor(id, config) {
        this.id = id;
        this.name = config.name;
        this.description = config.description;
        this.icon = config.icon;
        this.requirement = config.requirement;
        this.unlocked = false;
    }
    
    checkRequirement(stats, game) {
        if (this.unlocked) return false;
        
        switch (this.requirement.type) {
            case 'clicks':
                return stats.totalClicks >= this.requirement.value;
            case 'flowers':
                return stats.totalFlowers >= this.requirement.value;
            case 'upgrades':
                return stats.upgradesBought >= this.requirement.value;
            case 'themes':
                if (!game.themeSystem) return false;
                const unlockedThemes = Object.values(game.themeSystem.themes).filter(theme => theme.unlocked).length;
                return unlockedThemes >= this.requirement.value;
            case 'events':
                if (!game.achievementSystem.eventStats) return false;
                return game.achievementSystem.eventStats.totalEventsActivated >= this.requirement.value;
            case 'golden-hour':
                if (!game.achievementSystem.eventStats) return false;
                return game.achievementSystem.eventStats.goldenHourActivated >= this.requirement.value;
            case 'bee-swarm':
                if (!game.achievementSystem.eventStats) return false;
                return game.achievementSystem.eventStats.beeSwarmActivated >= this.requirement.value;
            case 'perSecond':
                return stats.perSecond >= this.requirement.value;
            case 'time':
                return stats.getPlayTimeMinutes() >= this.requirement.value;
            case 'speed':
                // This would need special handling for speed achievements
                return false;
            default:
                return false;
        }
    }
    
    unlock() {
        this.unlocked = true;
    }
}

// ===== ACHIEVEMENT SYSTEM =====

/**
 * Achievement system with improved organization
 */
class AchievementSystem {
    constructor() {
        this.achievements = {};
        this.eventStats = {
            totalEventsActivated: 0,
            goldenHourActivated: 0,
            beeSwarmActivated: 0,
            rainbowBoostActivated: 0,
            meteorShowerActivated: 0,
            fairyVisitActivated: 0
        };
        
        this.initializeAchievements();
        this.load();
    } 
    
    initializeAchievements() {
        for (const [id, config] of Object.entries(GAME_CONFIG.ACHIEVEMENTS)) {
            this.achievements[id] = new Achievement(id, config);
        }
    }
    
    checkAchievements(stats, game) {
        for (const achievement of Object.values(this.achievements)) {
            if (achievement.checkRequirement(stats, game)) {
                this.unlockAchievement(achievement.id);
            }
        }
    }
    
    unlockAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement || achievement.unlocked) return;
        
        achievement.unlock();
        this.showNotification(achievement);
        this.updateUI();
        this.save();
    }
    
    trackEventActivation(eventId) {
        this.eventStats.totalEventsActivated++;
        
        switch(eventId) {
            case 'golden-hour':
                this.eventStats.goldenHourActivated++;
                break;
            case 'bee-swarm':
                this.eventStats.beeSwarmActivated++;
                break;
            case 'rainbow-boost':
                this.eventStats.rainbowBoostActivated++;
                break;
            case 'meteor-shower':
                this.eventStats.meteorShowerActivated++;
                break;
            case 'fairy-visit':
                this.eventStats.fairyVisitActivated++;
                break;
        }
        
        this.saveEventStats();
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
        for (const achievement of Object.values(this.achievements)) {
            const element = document.getElementById(`achievement-${achievement.id}`);
            if (element) {
                const statusElement = element.querySelector('.achievement-status');
                
                if (achievement.unlocked) {
                    element.classList.add('achieved');
                    element.setAttribute('data-achieved', 'true');
                    if (statusElement) {
                        statusElement.textContent = '✅';
                    }
                } else {
                    element.classList.remove('achieved');
                    element.setAttribute('data-achieved', 'false');
                    if (statusElement) {
                        statusElement.textContent = '🔒';
                    }
                }
            }
        }
    }
    
    save() {
        const saveData = {};
        for (const [id, achievement] of Object.entries(this.achievements)) {
            saveData[id] = achievement.unlocked;
        }
        GameStorage.save('achievements', saveData);
    }
    
    saveEventStats() {
        GameStorage.save('eventStats', this.eventStats);
    }
    
    load() {
        // Load achievements
        const achievementData = GameStorage.load('achievements', {});
        for (const [id, unlocked] of Object.entries(achievementData)) {
            if (this.achievements[id]) {
                this.achievements[id].unlocked = unlocked;
            }
        }
        
        // Load event stats
        const eventData = GameStorage.load('eventStats', {});
        this.eventStats = { ...this.eventStats, ...eventData };
        
        this.updateUI();
    }
    
    reset() {
        for (const achievement of Object.values(this.achievements)) {
            achievement.unlocked = false;
        }
        
        this.eventStats = {
            totalEventsActivated: 0,
            goldenHourActivated: 0,
            beeSwarmActivated: 0,
            rainbowBoostActivated: 0,
            meteorShowerActivated: 0,
            fairyVisitActivated: 0
        };
        
        this.updateUI();
        GameStorage.remove('achievements');
        GameStorage.remove('eventStats');
    }
}

// ===== EVENT SYSTEM =====

/**
 * Base Event class with improved structure
 */
class GameEvent {
    constructor(id, config) {
        this.id = id;
        this.name = config.name;
        this.icon = config.icon;
        this.description = config.description;
        this.requiredFlowers = config.cost;
        this.duration = config.duration;
        this.cooldown = config.cooldown;
        this.isActive = false;
        this.isUnlocked = false;
        this.timeRemaining = 0;
        this.cooldownRemaining = 0;
        
        // DOM elements
        this.element = document.getElementById(`${id}-event`);
        this.timerElement = document.getElementById(`${id}-timer`);
        this.progressElement = document.getElementById(`${id}-progress`);
    }
    
    unlock() {
        this.isUnlocked = true;
        this.updateUI();
    }
    
    activate(game) {
        if (!this.canActivate(game)) return false;
        
        // Deduct cost
        if (game) {
            game.count -= this.requiredFlowers;
            game.updateDisplay();
            game.saveCount();
        }
        
        this.isActive = true;
        this.timeRemaining = this.duration;
        this.updateUI();
        this.onActivate();
        
        // Track for achievements
        if (game && game.achievementSystem) {
            game.achievementSystem.trackEventActivation(this.id);
        }
        
        return true;
    }
    
    canActivate(game) {
        return this.isUnlocked && 
               !this.isActive && 
               this.cooldownRemaining <= 0 && 
               game && 
               game.count >= this.requiredFlowers;
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
    
    // Override in subclasses
    onActivate() {}
    onDeactivate() {}
    getEffect() { return 1; }
}

/**
 * Specific event implementations
 */
class GoldenHourEvent extends GameEvent {
    constructor() {
        super('golden-hour', GAME_CONFIG.EVENTS['golden-hour']);
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

class BeeSwarmEvent extends GameEvent {
    constructor() {
        super('bee-swarm', GAME_CONFIG.EVENTS['bee-swarm']);
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

class RainbowBoostEvent extends GameEvent {
    constructor() {
        super('rainbow-boost', GAME_CONFIG.EVENTS['rainbow-boost']);
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

class MeteorShowerEvent extends GameEvent {
    constructor() {
        super('meteor-shower', GAME_CONFIG.EVENTS['meteor-shower']);
    }
    
    onActivate() {
        console.log('Meteorenregen geactiveerd! Willekeurige bonuses!');
    }
    
    onDeactivate() {
        console.log('Meteorenregen beëindigd.');
    }
}

class FairyVisitEvent extends GameEvent {
    constructor() {
        super('fairy-visit', GAME_CONFIG.EVENTS['fairy-visit']);
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

/**
 * Event System Manager with improved organization
 */
class EventSystem {
    constructor(game) {
        this.game = game;
        this.events = this.createEvents();
        this.lastUpdate = Date.now();
        
        this.setupEventListeners();
        this.startUpdateLoop();
    }
    
    createEvents() {
        return {
            'golden-hour': new GoldenHourEvent(),
            'bee-swarm': new BeeSwarmEvent(),
            'rainbow-boost': new RainbowBoostEvent(),
            'meteor-shower': new MeteorShowerEvent(),
            'fairy-visit': new FairyVisitEvent()
        };
    }
    
    setupEventListeners() {
        Object.values(this.events).forEach(event => {
            if (event.element) {
                event.element.addEventListener('click', () => {
                    if (event.canActivate(this.game)) {
                        event.activate(this.game);
                    }
                });
            }
        });
    }
    
    checkUnlocks(totalFlowers) {
        Object.values(this.events).forEach(event => {
            if (!event.isUnlocked && totalFlowers >= event.requiredFlowers) {
                event.unlock();
                this.showEventUnlockNotification(event);
            }
            
            this.updateEventProgress(event, totalFlowers);
        });
    }
    
    updateEventProgress(event, totalFlowers) {
        if (!event.progressElement) return;
        
        let progress = 0;
        
        if (event.isActive) {
            progress = ((event.duration - event.timeRemaining) / event.duration) * 100;
        } else if (event.cooldownRemaining > 0) {
            progress = ((event.cooldown - event.cooldownRemaining) / event.cooldown) * 100;
        } else if (!event.isUnlocked) {
            progress = (totalFlowers / event.requiredFlowers) * 100;
        } else {
            progress = 100;
        }
        
        event.progressElement.style.width = Math.min(progress, 100) + '%';
    }
    
    showEventUnlockNotification(event) {
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
            const deltaTime = (now - this.lastUpdate) / 1000;
            this.lastUpdate = now;

            Object.values(this.events).forEach(event => {
                event.update(deltaTime);
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
    
    save() {
        const saveData = {};
        Object.entries(this.events).forEach(([id, event]) => {
            saveData[id] = {
                isUnlocked: event.isUnlocked,
                isActive: event.isActive,
                timeRemaining: event.timeRemaining,
                cooldownRemaining: event.cooldownRemaining
            };
        });
        GameStorage.save('eventData', saveData);
    }
    
    load() {
        const saveData = GameStorage.load('eventData', {});
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
    
    reset() {
        Object.values(this.events).forEach(event => {
            event.isUnlocked = false;
            event.isActive = false;
            event.timeRemaining = 0;
            event.cooldownRemaining = 0;
            event.updateUI();
        });
        GameStorage.remove('eventData');
    }
}

// ===== THEME SYSTEM =====

/**
 * Individual Theme class
 */
class Theme {
    constructor(id, config) {
        this.id = id;
        this.name = config.name;
        this.cost = config.cost;
        this.icon = config.icon;
        this.unlocked = false;
    }
    
    unlock() {
        this.unlocked = true;
    }
    
    canPurchase(sunflowers) {
        return !this.unlocked && sunflowers >= this.cost;
    }
}

/**
 * Theme System with improved organization
 */
class ThemeSystem {
    constructor(game) {
        this.game = game;
        this.themes = this.createThemes();
        this.currentTheme = 'default';
        
        this.load();
        this.setupThemeListeners();
    }
    
    createThemes() {
        const themes = {};
        for (const [id, config] of Object.entries(GAME_CONFIG.THEMES)) {
            themes[id] = new Theme(id, config);
        }
        return themes;
    }
    
    checkUnlocks() {
        Object.values(this.themes).forEach(theme => {
            if (theme.canPurchase(this.game.count)) {
                this.updateThemeUI(theme.id);
            }
        });
    }
    
    updateThemeUI(themeId = null) {
        if (themeId) {
            this.updateSingleThemeUI(themeId);
        } else {
            Object.keys(this.themes).forEach(id => this.updateSingleThemeUI(id));
        }
    }
    
    updateSingleThemeUI(themeId) {
        const theme = this.themes[themeId];
        const unlockItem = document.getElementById(`${themeId}-unlock`);
        const purchaseBtn = unlockItem?.querySelector('.purchase-btn');
        
        if (unlockItem && purchaseBtn) {
            if (theme.unlocked) {
                unlockItem.classList.add('purchased');
                purchaseBtn.textContent = 'Gekocht';
                purchaseBtn.disabled = true;
                
                this.unlockThemeInSelector(themeId);
            } else if (theme.canPurchase(this.game.count)) {
                purchaseBtn.disabled = false;
                unlockItem.classList.add('affordable');
            } else {
                purchaseBtn.disabled = true;
                unlockItem.classList.remove('affordable');
            }
        }
    }
    
    unlockThemeInSelector(themeId) {
        const themeInput = document.getElementById(`theme-${themeId}`);
        const themeLock = document.querySelector(`.theme-${themeId}-option .theme-lock`);
        
        if (themeInput) {
            themeInput.classList.remove('theme-locked');
            themeInput.disabled = false;
        }
        if (themeLock) {
            themeLock.style.display = 'none';
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

        if (!theme.canPurchase(this.game.count)) {
            console.log(`Niet genoeg zonnebloemen voor ${theme.name}. Nodig: ${theme.cost}, Heb: ${this.game.count}`);
            return false;
        }

        // Purchase theme
        this.game.count -= theme.cost;
        theme.unlock();
        this.game.stats.upgradesBought++;

        // Update displays
        this.game.updateDisplay();
        this.game.updateStatsDisplay();
        this.updateThemeUI(themeId);
        
        // Save data
        this.game.saveCount();
        this.game.stats.save();
        this.save();

        // Show notification
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
        const themeInputs = document.querySelectorAll('input[name="theme"]');
        themeInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                if (e.target.checked) {
                    const themeId = e.target.id.replace('theme-', '');
                    
                    if (themeId === 'default' || (this.themes[themeId] && this.themes[themeId].unlocked)) {
                        this.currentTheme = themeId;
                        this.save();
                    } else {
                        e.target.checked = false;
                        const currentThemeInput = document.getElementById(`theme-${this.currentTheme}`);
                        if (currentThemeInput) {
                            currentThemeInput.checked = true;
                        }
                        
                        const theme = this.themes[themeId];
                        if (theme) {
                            console.log(`Thema ${theme.name} is nog vergrendeld! Kost: ${theme.cost} zonnebloemen`);
                        }
                    }
                }
            });
            
            input.addEventListener('click', (e) => {
                const themeId = e.target.id.replace('theme-', '');
                if (themeId !== 'default' && (!this.themes[themeId] || !this.themes[themeId].unlocked)) {
                    e.preventDefault();
                    return false;
                }
            });
        });
    }
    
    save() {
        const saveData = {
            themes: {},
            currentTheme: this.currentTheme
        };
        
        Object.entries(this.themes).forEach(([id, theme]) => {
            saveData.themes[id] = {
                unlocked: theme.unlocked
            };
        });
        
        GameStorage.save('themeData', saveData);
    }
    
    load() {
        this.initializeLockedThemes();
        
        const saveData = GameStorage.load('themeData');
        if (saveData) {
            try {
                if (saveData.themes) {
                    Object.entries(saveData.themes).forEach(([id, data]) => {
                        if (this.themes[id]) {
                            this.themes[id].unlocked = data.unlocked || false;
                        }
                    });
                }
                
                if (saveData.currentTheme) {
                    this.currentTheme = saveData.currentTheme;
                    
                    const themeInput = document.getElementById(`theme-${this.currentTheme}`);
                    if (themeInput && (this.currentTheme === 'default' || this.themes[this.currentTheme]?.unlocked)) {
                        themeInput.checked = true;
                    } else {
                        this.currentTheme = 'default';
                        const defaultTheme = document.getElementById('theme-default');
                        if (defaultTheme) {
                            defaultTheme.checked = true;
                        }
                    }
                }
                
                setTimeout(() => {
                    this.updateThemeUI();
                }, 100);
                
            } catch (error) {
                console.error('Fout bij laden thema data:', error);
                this.initializeLockedThemes();
            }
        } else {
            this.initializeLockedThemes();
        }
    }
    
    initializeLockedThemes() {
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
        
        const defaultTheme = document.getElementById('theme-default');
        if (defaultTheme) {
            defaultTheme.checked = true;
        }
    }
    
    reset() {
        Object.values(this.themes).forEach(theme => {
            theme.unlocked = false;
        });
        
        this.currentTheme = 'default';
        
        const defaultTheme = document.getElementById('theme-default');
        if (defaultTheme) {
            defaultTheme.checked = true;
        }
        
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
        
        GameStorage.remove('themeData');
    }
}

// ===== MAIN GAME CLASS =====

/**
 * Main Cookie Clicker Game class with improved organization
 */
class CookieClickerGame {
    constructor() {
        // Core game state
        this.count = 0;
        this.volume = 50;
        
        // DOM elements
        this.countElement = document.getElementById('sunflowerCount');
        
        // Game systems
        this.stats = new GameStats();
        this.achievementSystem = new AchievementSystem();
        this.eventSystem = new EventSystem(this);
        this.themeSystem = new ThemeSystem(this);
        
        // Make globally available
        window.gameInstance = this;
        
        this.initialize();
    }
    
    initialize() {
        this.loadCount();
        this.loadSettings();
        this.stats.load();
        this.eventSystem.load();
        
        this.setupClicker();
        this.setupSettings();
        this.setupStatsPanel();
        this.setupAchievementsPanel();
        this.updateStatsDisplay();
        this.startAutoGeneration();
    }
    
    // Core game mechanics
    click() {
        const eventMultiplier = this.eventSystem.getClickMultiplier();
        const clickValue = this.stats.perClick * eventMultiplier;
        
        this.count += clickValue;
        this.stats.totalClicks++;
        this.stats.totalFlowers += clickValue;
        
        // Meteor bonus check
        const meteorEvent = this.eventSystem.events['meteor-shower'];
        if (meteorEvent && meteorEvent.isActive && Math.random() < 0.3) {
            const meteorBonus = Math.floor(Math.random() * 21) + 5;
            this.count += meteorBonus;
            this.stats.totalFlowers += meteorBonus;
            this.showMeteorEffect(meteorBonus);
        }
        
        this.updateDisplay();
        this.updateStatsDisplay();
        this.saveCount();
        this.stats.save();
        this.eventSystem.save();
        
        // Check systems
        this.achievementSystem.checkAchievements(this.stats, this);
        this.eventSystem.checkUnlocks(this.stats.totalFlowers);
        this.themeSystem.checkUnlocks();
    }
    
    updateDisplay() {
        if (this.countElement) {
            this.countElement.textContent = this.count;
        }
    }
    
    saveCount() {
        GameStorage.save('sunflowerCount', this.count);
    }
    
    loadCount() {
        this.count = GameStorage.load('sunflowerCount', 0);
        this.updateDisplay();
    }
    
    // Settings management
    loadSettings() {
        this.volume = GameStorage.load('gameVolume', 50);
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');
        
        if (volumeSlider) {
            volumeSlider.value = this.volume;
        }
        if (volumeValue) {
            volumeValue.textContent = this.volume + '%';
        }
    }
    
    saveSettings() {
        GameStorage.save('gameVolume', this.volume);
    }
    
    // Auto generation system
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
                this.stats.save();
                
                this.achievementSystem.checkAchievements(this.stats, this);
                this.themeSystem.checkUnlocks();
            }
        }, 1000);
    }
    
    // UI Setup methods
    setupClicker() {
        const sunflower = document.querySelector('.sunflower');
        if (sunflower) {
            sunflower.addEventListener('click', () => this.click());
        }
    }
    
    setupSettings() {
        const settingsButton = document.getElementById('settingsButton');
        const settingsPanel = document.getElementById('settingsPanel');
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');
        const resetBtn = document.getElementById('resetGameBtn');
        
        if (settingsButton && settingsPanel) {
            settingsButton.addEventListener('click', () => {
                settingsPanel.classList.toggle('show');
            });
        }
        
        if (volumeSlider && volumeValue) {
            volumeSlider.addEventListener('input', (e) => {
                this.volume = parseInt(e.target.value);
                volumeValue.textContent = this.volume + '%';
                this.saveSettings();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.showResetModal());
        }
        
        this.setupResetModal();
    }
    
    setupStatsPanel() {
        const statsButton = document.getElementById('statsButton');
        const statsPanel = document.getElementById('statsPanel');
        
        if (statsButton && statsPanel) {
            statsButton.addEventListener('click', () => {
                statsPanel.classList.toggle('show');
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
        }
    }
    
    setupResetModal() {
        const resetModal = document.getElementById('resetModal');
        const resetCancelBtn = document.getElementById('resetCancelBtn');
        const resetConfirmBtn = document.getElementById('resetConfirmBtn');
        const successModal = document.getElementById('successModal');
        
        if (resetCancelBtn) {
            resetCancelBtn.addEventListener('click', () => {
                if (resetModal) resetModal.classList.remove('show');
            });
        }
        
        if (resetConfirmBtn) {
            resetConfirmBtn.addEventListener('click', () => {
                this.resetGame();
                if (resetModal) resetModal.classList.remove('show');
                if (successModal) {
                    successModal.classList.add('show');
                    setTimeout(() => {
                        successModal.classList.remove('show');
                    }, 3000);
                }
            });
        }
    }
    
    updateStatsDisplay() {
        const elements = {
            totalFlowers: document.getElementById('totalFlowers'),
            totalClicks: document.getElementById('totalClicks'),
            perSecond: document.getElementById('perSecond'),
            upgradesBought: document.getElementById('upgradesBought'),
            perClick: document.getElementById('perClick')
        };
        
        if (elements.totalFlowers) elements.totalFlowers.textContent = this.stats.totalFlowers;
        if (elements.totalClicks) elements.totalClicks.textContent = this.stats.totalClicks;
        if (elements.perSecond) elements.perSecond.textContent = this.stats.perSecond;
        if (elements.upgradesBought) elements.upgradesBought.textContent = this.stats.upgradesBought;
        if (elements.perClick) elements.perClick.textContent = this.stats.perClick;
    }
    
    showMeteorEffect(bonus) {
        // Meteor effect implementation would go here
        console.log(`Meteor bonus: +${bonus} zonnebloemen!`);
    }
    
    showResetModal() {
        const resetModal = document.getElementById('resetModal');
        if (resetModal) {
            resetModal.classList.add('show');
        }
    }
    
    resetGame() {
        this.count = 0;
        this.stats.reset();
        this.achievementSystem.reset();
        this.eventSystem.reset();
        this.themeSystem.reset();
        
        this.updateDisplay();
        this.updateStatsDisplay();
        this.saveCount();
        
        GameStorage.remove('sunflowerCount');
        
        console.log('Game reset completed');
    }
}

// ===== GLOBAL FUNCTIONS =====

/**
 * Global function for HTML onclick handlers
 */
function purchaseTheme(themeId) {
    if (window.gameInstance && window.gameInstance.themeSystem) {
        return window.gameInstance.themeSystem.purchaseTheme(themeId);
    }
    console.error('Game instance niet gevonden');
    return false;
}

// ===== GAME INITIALIZATION =====

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CookieClickerGame();
});
