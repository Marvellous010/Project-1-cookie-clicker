// Cookie Clicker Game - Object Oriented Programming
class CookieClickerGame {
    constructor() {
        // Game state variables
        this.sunflowerCount = 0;
        this.totalClicks = 0;
        this.clickTimes = [];
        this.clickMultiplier = 1.0;
        
        // DOM elements
        this.sunflowerCountElement = document.getElementById('sunflowerCount');
        this.plantNameElement = document.getElementById('plant-name');
        
        // Theme unlock system
        this.themeUnlocks = {
            storm: { unlocked: false, cost: 100, multiplier: 2.0 },
            night: { unlocked: false, cost: 250, multiplier: 4.0 },
            autumn: { unlocked: false, cost: 500, multiplier: 8.0 }
        };
        
        // Upgrade system
        this.upgrades = {
            zonnestralen: { 
                bought: false, 
                cost: 15, 
                clickBonus: 1.0,
                description: "Verdubbelt je click kracht"
            },
            autoGroei: { 
                bought: false, 
                cost: 50, 
                autoClickRate: 1000, // milliseconds
                autoClickAmount: 1,
                description: "Genereert automatisch 1 zonnebloem per seconde"
            }
        };
        
        // Auto clicker interval
        this.autoClickerInterval = null;
        
        // Achievement system
        this.achievements = {
            'first-click': { unlocked: false, condition: () => this.totalClicks >= 1 },
            'hundred-club': { unlocked: false, condition: () => this.sunflowerCount >= 100 },
            'click-master': { unlocked: false, condition: () => this.totalClicks >= 500 },
            'thousand-stars': { unlocked: false, condition: () => this.sunflowerCount >= 1000 },
            'fast-fingers': { unlocked: false, condition: () => this.checkFastFingers() },
            'theme-collector': { unlocked: false, condition: () => this.checkAllThemesUnlocked() },
            'shopaholic': { unlocked: false, condition: () => this.checkFirstUpgrade() },
            'sunflower-tycoon': { unlocked: false, condition: () => this.sunflowerCount >= 5000 },
            'click-king': { unlocked: false, condition: () => this.totalClicks >= 2000 },
            'perfectionist': { unlocked: false, condition: () => this.checkAllUpgradesBought() }
        };
        
        // Initialize game
        this.init();
    }
    
    init() {
        this.loadGameData();
        this.setupEventListeners();
        this.updateUI();
        this.makeGlobalFunctions();
    }
    
    loadGameData() {
        // Load saved count from localStorage
        const savedCount = localStorage.getItem('sunflowerCount');
        if (savedCount) {
            this.sunflowerCount = parseInt(savedCount);
            this.sunflowerCountElement.textContent = this.sunflowerCount;
        }
        
        // Load saved total clicks
        const savedClicks = localStorage.getItem('totalClicks');
        if (savedClicks) {
            this.totalClicks = parseInt(savedClicks);
        }
        
        // Load saved theme unlocks
        const savedThemeUnlocks = localStorage.getItem('themeUnlocks');
        if (savedThemeUnlocks) {
            const parsed = JSON.parse(savedThemeUnlocks);
            Object.keys(parsed).forEach(key => {
                if (this.themeUnlocks[key]) {
                    this.themeUnlocks[key].unlocked = parsed[key].unlocked;
                }
            });
        }
        
        // Calculate click multiplier based on unlocked themes
        this.clickMultiplier = this.calculateClickMultiplier();
        
        // Load saved achievements
        const savedAchievements = localStorage.getItem('achievements');
        if (savedAchievements) {
            const parsed = JSON.parse(savedAchievements);
            Object.keys(parsed).forEach(key => {
                if (this.achievements[key]) {
                    this.achievements[key].unlocked = parsed[key].unlocked;
                }
            });
        }
        
        // Load saved upgrades
        const savedUpgrades = localStorage.getItem('upgrades');
        if (savedUpgrades) {
            const parsed = JSON.parse(savedUpgrades);
            Object.keys(parsed).forEach(key => {
                if (this.upgrades[key]) {
                    this.upgrades[key].bought = parsed[key].bought;
                }
            });
        }
        
        // Start auto clicker if purchased
        if (this.upgrades.autoGroei.bought) {
            this.startAutoClicker();
        }
        
        // Load plant name from localStorage
        const savedName = localStorage.getItem('plantName');
        if (savedName) {
            this.plantNameElement.textContent = savedName;
        }
    }
    
    calculateClickMultiplier() {
        // Get currently selected theme
        const selectedTheme = document.querySelector('input[name="theme"]:checked');
        if (!selectedTheme) {
            return 1.0; // Default multiplier
        }
        
        const themeId = selectedTheme.id;
        const themeName = themeId.replace('theme-', '');
        
        let multiplier = 1.0;
        
        // Add theme multiplier if theme is unlocked and selected (not for default)
        if (themeName !== 'default' && this.themeUnlocks[themeName] && this.themeUnlocks[themeName].unlocked) {
            multiplier += this.themeUnlocks[themeName].multiplier;
        }
        
        // Add Zonnestralen upgrade bonus (works with all themes)
        if (this.upgrades.zonnestralen.bought) {
            multiplier += this.upgrades.zonnestralen.clickBonus;
        }
        
        return multiplier;
    }
    
    // Achievement helper methods
    checkFastFingers() {
        const now = Date.now();
        this.clickTimes = this.clickTimes.filter(time => now - time <= 5000);
        return this.clickTimes.length >= 10;
    }
    
    checkAllThemesUnlocked() {
        return Object.keys(this.themeUnlocks).every(theme => this.themeUnlocks[theme].unlocked);
    }
    
    checkFirstUpgrade() {
        return Object.keys(this.upgrades).some(key => this.upgrades[key].bought);
    }
    
    checkAllUpgradesBought() {
        return false; // Simplified for now
    }
    
    checkAchievements() {
        Object.keys(this.achievements).forEach(key => {
            if (!this.achievements[key].unlocked && this.achievements[key].condition()) {
                this.unlockAchievement(key);
            }
        });
    }
    
    unlockAchievement(achievementId) {
        this.achievements[achievementId].unlocked = true;
        localStorage.setItem('achievements', JSON.stringify(this.achievements));
        
        // Update UI
        const achievementElement = document.getElementById(`achievement-${achievementId}`);
        if (achievementElement) {
            achievementElement.setAttribute('data-achieved', 'true');
        }
        
        // Show notification
        this.showAchievementNotification(achievementId);
    }
    
    showAchievementNotification(achievementId) {
        const achievementElement = document.getElementById(`achievement-${achievementId}`);
        const name = achievementElement.querySelector('.achievement-name').textContent;
        const notification = document.getElementById('achievementNotification');
        const notificationName = document.getElementById('notificationName');
        
        // Update notification content
        notificationName.textContent = name;
        
        // Show notification
        notification.classList.add('show');
        
        // Hide notification after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }
    
    updateAchievementUI() {
        Object.keys(this.achievements).forEach(key => {
            const achievementElement = document.getElementById(`achievement-${key}`);
            if (achievementElement) {
                if (this.achievements[key].unlocked) {
                    achievementElement.setAttribute('data-achieved', 'true');
                } else {
                    achievementElement.setAttribute('data-achieved', 'false');
                }
            }
        });
    }
    
    // Core game methods
    updateSunflowerCount() {
        const flowersToAdd = Math.round(this.clickMultiplier * 10) / 10;
        this.sunflowerCount += flowersToAdd;
        this.totalClicks++;
        this.clickTimes.push(Date.now());
        
        this.sunflowerCountElement.textContent = Math.floor(this.sunflowerCount);
        localStorage.setItem('sunflowerCount', this.sunflowerCount);
        localStorage.setItem('totalClicks', this.totalClicks);
        
        this.checkAchievements();
        this.updatePurchaseButtons();
        this.updateUpgradeButtons();
        this.updateStats();
    }
    
    purchaseTheme(themeName) {
        const theme = this.themeUnlocks[themeName];
        
        if (this.sunflowerCount >= theme.cost && !theme.unlocked) {
            // Deduct cost from sunflower count
            this.sunflowerCount -= theme.cost;
            this.sunflowerCountElement.textContent = Math.floor(this.sunflowerCount);
            localStorage.setItem('sunflowerCount', this.sunflowerCount);
            
            // Unlock the theme
            theme.unlocked = true;
            localStorage.setItem('themeUnlocks', JSON.stringify(this.themeUnlocks));
            
            // Update click multiplier
            this.clickMultiplier = this.calculateClickMultiplier();
            
            // Update UI
            this.updateThemeUI();
            this.showThemeUnlockNotification(themeName);
            this.updateStats();
            this.checkAchievements();
            
            console.log(`🎨 Purchased ${themeName} theme for ${theme.cost} sunflowers!`);
            return true;
        } else {
            console.log(`❌ Cannot purchase ${themeName} theme`);
            return false;
        }
    }
    
    updateThemeUI() {
        // Update storm theme
        if (this.themeUnlocks.storm.unlocked) {
            document.getElementById('unlock-storm').checked = true;
            const stormOption = document.querySelector('.theme-storm-option');
            const stormLock = document.querySelector('.theme-storm-option .theme-lock');
            if (stormLock) stormLock.style.display = 'none';
            if (stormOption) {
                stormOption.style.opacity = '1';
                stormOption.style.pointerEvents = 'auto';
            }
        }
        
        // Update night theme
        if (this.themeUnlocks.night.unlocked) {
            document.getElementById('unlock-night').checked = true;
            const nightOption = document.querySelector('.theme-night-option');
            const nightLock = document.querySelector('.theme-night-option .theme-lock');
            if (nightLock) nightLock.style.display = 'none';
            if (nightOption) {
                nightOption.style.opacity = '1';
                nightOption.style.pointerEvents = 'auto';
            }
        }
        
        // Update autumn theme
        if (this.themeUnlocks.autumn.unlocked) {
            document.getElementById('unlock-autumn').checked = true;
            const autumnOption = document.querySelector('.theme-autumn-option');
            const autumnLock = document.querySelector('.theme-autumn-option .theme-lock');
            if (autumnLock) autumnLock.style.display = 'none';
            if (autumnOption) {
                autumnOption.style.opacity = '1';
                autumnOption.style.pointerEvents = 'auto';
            }
        }
        
        this.updatePurchaseButtons();
    }
    
    updatePurchaseButtons() {
        // Update storm purchase button
        const stormBtn = document.querySelector('#storm-unlock .purchase-btn');
        if (stormBtn) {
            if (this.themeUnlocks.storm.unlocked) {
                stormBtn.disabled = true;
                stormBtn.textContent = 'Gekocht';
            } else if (this.sunflowerCount >= this.themeUnlocks.storm.cost) {
                stormBtn.disabled = false;
                stormBtn.textContent = 'Koop';
            } else {
                stormBtn.disabled = true;
                stormBtn.textContent = 'Koop';
            }
        }
        
        // Update night purchase button
        const nightBtn = document.querySelector('#night-unlock .purchase-btn');
        if (nightBtn) {
            if (this.themeUnlocks.night.unlocked) {
                nightBtn.disabled = true;
                nightBtn.textContent = 'Gekocht';
            } else if (this.sunflowerCount >= this.themeUnlocks.night.cost) {
                nightBtn.disabled = false;
                nightBtn.textContent = 'Koop';
            } else {
                nightBtn.disabled = true;
                nightBtn.textContent = 'Koop';
            }
        }
        
        // Update autumn purchase button
        const autumnBtn = document.querySelector('#autumn-unlock .purchase-btn');
        if (autumnBtn) {
            if (this.themeUnlocks.autumn.unlocked) {
                autumnBtn.disabled = true;
                autumnBtn.textContent = 'Gekocht';
            } else if (this.sunflowerCount >= this.themeUnlocks.autumn.cost) {
                autumnBtn.disabled = false;
                autumnBtn.textContent = 'Koop';
            } else {
                autumnBtn.disabled = true;
                autumnBtn.textContent = 'Koop';
            }
        }
    }
    
    updateStats() {
        // Update total flowers
        const totalFlowersElement = document.getElementById('totalFlowers');
        if (totalFlowersElement) {
            totalFlowersElement.textContent = Math.floor(this.sunflowerCount);
        }
        
        // Update total clicks
        const totalClicksElement = document.getElementById('totalClicks');
        if (totalClicksElement) {
            totalClicksElement.textContent = this.totalClicks;
        }
        
        // Update per click multiplier
        const perClickElement = document.getElementById('perClick');
        if (perClickElement) {
            perClickElement.textContent = this.clickMultiplier.toFixed(1) + 'x';
        }
        
        // Calculate clicks per second (last 60 seconds)
        const now = Date.now();
        const recentClicks = this.clickTimes.filter(time => now - time <= 60000);
        const clicksPerSecond = (recentClicks.length / 60).toFixed(1);
        const perSecondElement = document.getElementById('perSecond');
        if (perSecondElement) {
            perSecondElement.textContent = clicksPerSecond + '/s';
        }
        
        // Update upgrades bought
        const upgradesBoughtElement = document.getElementById('upgradesBought');
        if (upgradesBoughtElement) {
            let upgradeCount = 0;
            Object.keys(this.themeUnlocks).forEach(theme => {
                if (this.themeUnlocks[theme].unlocked) upgradeCount++;
            });
            Object.keys(this.upgrades).forEach(upgrade => {
                if (this.upgrades[upgrade].bought) upgradeCount++;
            });
            upgradesBoughtElement.textContent = upgradeCount;
        }
    }
    
    // Upgrade purchase methods
    purchaseUpgrade(upgradeName) {
        const upgrade = this.upgrades[upgradeName];
        
        if (!upgrade) {
            console.log(`❌ Unknown upgrade: ${upgradeName}`);
            return false;
        }
        
        if (upgrade.bought) {
            console.log(`❌ Upgrade ${upgradeName} already bought`);
            return false;
        }
        
        if (this.sunflowerCount < upgrade.cost) {
            console.log(`❌ Not enough sunflowers for ${upgradeName}`);
            return false;
        }
        
        // Deduct cost
        this.sunflowerCount -= upgrade.cost;
        this.sunflowerCountElement.textContent = Math.floor(this.sunflowerCount);
        localStorage.setItem('sunflowerCount', this.sunflowerCount);
        
        // Mark as bought
        upgrade.bought = true;
        localStorage.setItem('upgrades', JSON.stringify(this.upgrades));
        
        // Apply upgrade effects
        if (upgradeName === 'zonnestralen') {
            // Update click multiplier
            this.clickMultiplier = this.calculateClickMultiplier();
            console.log(`🌟 Zonnestralen purchased! Click multiplier now: ${this.clickMultiplier}x`);
        } else if (upgradeName === 'autoGroei') {
            // Start auto clicker
            this.startAutoClicker();
            console.log(`🌱 Automatische groei purchased! Auto-generating sunflowers...`);
        }
        
        // Update UI
        this.updateUpgradeButtons();
        this.updateStats();
        this.checkAchievements();
        
        return true;
    }
    
    startAutoClicker() {
        if (this.autoClickerInterval) {
            clearInterval(this.autoClickerInterval);
        }
        
        this.autoClickerInterval = setInterval(() => {
            this.sunflowerCount += this.upgrades.autoGroei.autoClickAmount;
            this.sunflowerCountElement.textContent = Math.floor(this.sunflowerCount);
            localStorage.setItem('sunflowerCount', this.sunflowerCount);
            
            // Update purchase buttons in case we can afford new items
            this.updatePurchaseButtons();
            this.updateUpgradeButtons();
            this.updateStats();
        }, this.upgrades.autoGroei.autoClickRate);
    }
    
    stopAutoClicker() {
        if (this.autoClickerInterval) {
            clearInterval(this.autoClickerInterval);
            this.autoClickerInterval = null;
        }
    }
    
    updateUpgradeButtons() {
        // Update Zonnestralen button
        const zonnestralenBtn = document.getElementById('mousePowerBtn');
        if (zonnestralenBtn) {
            if (this.upgrades.zonnestralen.bought) {
                zonnestralenBtn.classList.add('purchased');
                zonnestralenBtn.style.opacity = '0.6';
                zonnestralenBtn.style.pointerEvents = 'none';
            } else if (this.sunflowerCount >= this.upgrades.zonnestralen.cost) {
                zonnestralenBtn.classList.remove('disabled');
                zonnestralenBtn.style.opacity = '1';
                zonnestralenBtn.style.pointerEvents = 'auto';
            } else {
                zonnestralenBtn.classList.add('disabled');
                zonnestralenBtn.style.opacity = '0.6';
                zonnestralenBtn.style.pointerEvents = 'none';
            }
        }
        
        // Update Auto Groei button
        const autoGroeiBtn = document.getElementById('autoClickerBtn');
        if (autoGroeiBtn) {
            if (this.upgrades.autoGroei.bought) {
                autoGroeiBtn.classList.add('purchased');
                autoGroeiBtn.style.opacity = '0.6';
                autoGroeiBtn.style.pointerEvents = 'none';
            } else if (this.sunflowerCount >= this.upgrades.autoGroei.cost) {
                autoGroeiBtn.classList.remove('disabled');
                autoGroeiBtn.style.opacity = '1';
                autoGroeiBtn.style.pointerEvents = 'auto';
            } else {
                autoGroeiBtn.classList.add('disabled');
                autoGroeiBtn.style.opacity = '0.6';
                autoGroeiBtn.style.pointerEvents = 'none';
            }
        }
    }
    
    showThemeUnlockNotification(themeName) {
        const themeNames = {
            storm: 'Storm Thema',
            night: 'Nacht Thema',
            autumn: 'Herfst Thema'
        };
        
        const notification = document.getElementById('achievementNotification');
        const notificationName = document.getElementById('notificationName');
        const notificationTitle = notification.querySelector('.notification-title');
        
        // Update notification content
        notificationTitle.textContent = 'Thema Ontgrendeld!';
        notificationName.textContent = `${themeNames[themeName]} (+${this.themeUnlocks[themeName].multiplier}x click multiplier)`;
        
        // Show notification
        notification.classList.add('show');
        
        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            notificationTitle.textContent = 'Achievement Unlocked!';
        }, 5000);
    }
    
    applyTheme(theme) {
        const themeElements = {
            sky: document.querySelector('.sky'),
            garden: document.querySelector('.garden'),
            sunflowerImage: document.querySelector('.sunflower-image')
        };

        // Remove all theme classes first
        document.body.classList.remove('theme-storm', 'theme-night', 'theme-autumn');
        
        switch(theme) {
            case 'theme-storm':
                document.body.classList.add('theme-storm');
                themeElements.sky.style.background = 'linear-gradient(to bottom, #37474F, #546E7A)';
                break;
            case 'theme-night':
                document.body.classList.add('theme-night');
                themeElements.sky.style.background = 'linear-gradient(to bottom, #1a237e, #0d1b2a)';
                break;
            case 'theme-autumn':
                document.body.classList.add('theme-autumn');
                themeElements.sky.style.background = 'linear-gradient(to bottom, #bf360c, #e65100)';
                break;
            default:
                themeElements.sky.style.background = 'linear-gradient(to bottom, #87CEEB, #98D8E8)';
                break;
        }
        
        if (theme === 'theme-autumn') {
            if (themeElements.garden) {
                themeElements.sky.style.background = 'linear-gradient(to bottom, #ff9800, #f57c00)';
            }
        }
    }
    
    resetGame() {
        console.log('🔄 Resetting game...');
        
        // Clear all localStorage data
        localStorage.removeItem('sunflowerCount');
        localStorage.removeItem('totalClicks');
        localStorage.removeItem('plantName');
        localStorage.removeItem('achievements');
        localStorage.removeItem('gameVolume');
        localStorage.removeItem('upgrades');
        localStorage.removeItem('themeUnlocks');
        
        // Reset all game variables
        this.sunflowerCount = 0;
        this.totalClicks = 0;
        this.clickTimes = [];
        this.clickMultiplier = 1.0;
        
        // Reset achievements
        Object.keys(this.achievements).forEach(key => {
            this.achievements[key].unlocked = false;
        });
        
        // Reset theme unlocks
        Object.keys(this.themeUnlocks).forEach(key => {
            this.themeUnlocks[key].unlocked = false;
        });
        
        // Reset upgrades
        Object.keys(this.upgrades).forEach(key => {
            this.upgrades[key].bought = false;
        });
        
        // Stop auto clicker
        this.stopAutoClicker();
        
        // Reset UI elements
        this.sunflowerCountElement.textContent = '0';
        this.plantNameElement.textContent = 'Naamloze Plant';
        
        // Reset all achievement UI
        document.querySelectorAll('.achievement-item').forEach(item => {
            item.setAttribute('data-achieved', 'false');
        });
        
        // Reset theme to default
        document.querySelectorAll('input[name="theme"]').forEach(radio => {
            radio.checked = false;
        });
        document.getElementById('theme-default').checked = true;
        
        // Reset theme unlocks
        document.getElementById('unlock-storm').checked = false;
        document.getElementById('unlock-night').checked = false;
        document.getElementById('unlock-autumn').checked = false;
        
        // Re-lock themes
        document.querySelectorAll('.theme-lock').forEach(lock => {
            lock.style.display = 'block';
        });
        
        document.querySelectorAll('.theme-option:not(.theme-default-option)').forEach(option => {
            option.style.opacity = '0.5';
            option.style.pointerEvents = 'none';
        });
        
        // Reset purchase buttons to disabled state
        const stormBtn = document.querySelector('#storm-unlock .purchase-btn');
        const nightBtn = document.querySelector('#night-unlock .purchase-btn');
        const autumnBtn = document.querySelector('#autumn-unlock .purchase-btn');
        
        if (stormBtn) {
            stormBtn.disabled = true;
            stormBtn.textContent = 'Koop';
        }
        if (nightBtn) {
            nightBtn.disabled = true;
            nightBtn.textContent = 'Koop';
        }
        if (autumnBtn) {
            autumnBtn.disabled = true;
            autumnBtn.textContent = 'Koop';
        }
        
        // Apply default theme
        this.applyTheme('theme-default');
        
        // Update all UI elements after reset
        this.updateUI();
        
        console.log('✅ Game reset complete!');
    }
    
    setupEventListeners() {
        // Sunflower click handler
        const sunflowerButton = document.querySelector('.sunflower-button');
        if (sunflowerButton) {
            sunflowerButton.addEventListener('click', (e) => {
                this.updateSunflowerCount();
                
                // Click effect animation
                const clickEffect = sunflowerButton.querySelector('.click-effect');
                const rect = sunflowerButton.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
               
                requestAnimationFrame(() => {
                    clickEffect.style.left = x + 'px';
                    clickEffect.style.top = y + 'px';
                    clickEffect.style.animation = 'none';
                    clickEffect.offsetHeight; // Trigger reflow
                    clickEffect.style.animation = 'clickEffect 0.6s ease-out';
                });
            });
        }
        
        // Plant name editing
        if (this.plantNameElement) {
            this.plantNameElement.addEventListener('blur', () => {
                localStorage.setItem('plantName', this.plantNameElement.textContent);
            });
        }
        
        // Settings functionality
        const settingsButton = document.getElementById('settingsButton');
        const settingsPanel = document.getElementById('settingsPanel');
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');
        const resetButton = document.getElementById('resetGameBtn');
        const resetModal = document.getElementById('resetModal');
        const resetCancelBtn = document.getElementById('resetCancelBtn');
        const resetConfirmBtn = document.getElementById('resetConfirmBtn');
        const successModal = document.getElementById('successModal');
        const successOkBtn = document.getElementById('successOkBtn');
        
        if (settingsButton && settingsPanel) {
            settingsButton.addEventListener('click', () => {
                settingsPanel.classList.toggle('show');
                // Close other panels
                const statsPanel = document.getElementById('statsPanel');
                const achievementsPanel = document.getElementById('achievementsPanel');
                if (statsPanel) statsPanel.classList.remove('show');
                if (achievementsPanel) achievementsPanel.classList.remove('show');
            });
        }
        
        if (volumeSlider && volumeValue) {
            const savedVolume = localStorage.getItem('gameVolume');
            if (savedVolume) {
                volumeSlider.value = savedVolume;
                volumeValue.textContent = savedVolume + '%';
            }
            
            volumeSlider.addEventListener('input', () => {
                const volume = volumeSlider.value;
                volumeValue.textContent = volume + '%';
                localStorage.setItem('gameVolume', volume);
            });
        }
        
        if (resetButton && resetModal) {
            resetButton.addEventListener('click', () => {
                resetModal.classList.add('show');
                settingsPanel.classList.remove('show');
            });
        }
        
        if (resetCancelBtn && resetModal) {
            resetCancelBtn.addEventListener('click', () => {
                resetModal.classList.remove('show');
            });
        }
        
        if (resetConfirmBtn && resetModal && successModal) {
            resetConfirmBtn.addEventListener('click', () => {
                resetModal.classList.remove('show');
                this.resetGame();
                setTimeout(() => {
                    successModal.classList.add('show');
                }, 300);
            });
        }
        
        if (successOkBtn && successModal) {
            successOkBtn.addEventListener('click', () => {
                successModal.classList.remove('show');
            });
        }
        
        // Stats functionality
        const statsButton = document.getElementById('statsButton');
        const statsPanel = document.getElementById('statsPanel');
        
        if (statsButton && statsPanel) {
            statsButton.addEventListener('click', () => {
                statsPanel.classList.toggle('show');
                // Close other panels
                if (settingsPanel) settingsPanel.classList.remove('show');
                const achievementsPanel = document.getElementById('achievementsPanel');
                if (achievementsPanel) achievementsPanel.classList.remove('show');
            });
        }
        
        // Achievements functionality
        const achievementsButton = document.getElementById('achievementsButton');
        const achievementsPanel = document.getElementById('achievementsPanel');
        
        if (achievementsButton && achievementsPanel) {
            achievementsButton.addEventListener('click', () => {
                achievementsPanel.classList.toggle('show');
                // Close other panels
                if (settingsPanel) settingsPanel.classList.remove('show');
                if (statsPanel) statsPanel.classList.remove('show');
            });
        }
        
        // Close panels when clicking outside
        document.addEventListener('click', (e) => {
            if (settingsButton && settingsPanel && !settingsButton.contains(e.target) && !settingsPanel.contains(e.target)) {
                settingsPanel.classList.remove('show');
            }
            if (statsButton && statsPanel && !statsButton.contains(e.target) && !statsPanel.contains(e.target)) {
                statsPanel.classList.remove('show');
            }
            if (achievementsButton && achievementsPanel && !achievementsButton.contains(e.target) && !achievementsPanel.contains(e.target)) {
                achievementsPanel.classList.remove('show');
            }
        });
        
        // Theme switching
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const themeId = option.getAttribute('for');
                const themeName = themeId.replace('theme-', '');
                
                // Always allow default theme
                if (themeName === 'default' || this.themeUnlocks[themeName]?.unlocked) {
                    e.preventDefault();
                    
                    // Uncheck all theme radios first
                    document.querySelectorAll('input[name="theme"]').forEach(radio => {
                        radio.checked = false;
                    });
                    
                    // Check the selected theme
                    const selectedTheme = document.getElementById(themeId);
                    if (selectedTheme) {
                        selectedTheme.checked = true;
                        this.applyTheme(themeId);
                        
                        // Update click multiplier based on new theme
                        this.clickMultiplier = this.calculateClickMultiplier();
                        
                        // Update stats to show new multiplier
                        this.updateStats();
                        
                        console.log('🎨 Theme switched to:', themeId);
                    }
                } else {
                    e.preventDefault();
                    console.log('🔒 Theme locked:', themeName);
                }
            });
        });
        
        // Upgrade button event listeners
        const zonnestralenBtn = document.getElementById('mousePowerBtn');
        if (zonnestralenBtn) {
            zonnestralenBtn.addEventListener('click', () => {
                if (!this.upgrades.zonnestralen.bought && this.sunflowerCount >= this.upgrades.zonnestralen.cost) {
                    this.purchaseUpgrade('zonnestralen');
                }
            });
        }
        
        const autoGroeiBtn = document.getElementById('autoClickerBtn');
        if (autoGroeiBtn) {
            autoGroeiBtn.addEventListener('click', () => {
                if (!this.upgrades.autoGroei.bought && this.sunflowerCount >= this.upgrades.autoGroei.cost) {
                    this.purchaseUpgrade('autoGroei');
                }
            });
        }
    }
    
    updateUI() {
        this.updateAchievementUI();
        this.updateThemeUI();
        this.updateUpgradeButtons();
        this.updateStats();
    }
    
    makeGlobalFunctions() {
        // Make purchaseTheme function globally accessible for HTML onclick
        window.purchaseTheme = (themeName) => this.purchaseTheme(themeName);
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CookieClickerGame();
});
