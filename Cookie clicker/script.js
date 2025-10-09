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
                if (statusElement) {
                    statusElement.textContent = this.achievements[id].unlocked ? '✅' : '';
                }
                
                if (this.achievements[id].unlocked) {
                    element.classList.add('achieved');
                } else {
                    element.classList.remove('achieved');
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
        
        this.init();
    }
    
    init() {
        this.loadCount();
        this.loadSettings();
        this.loadStats();
        this.setupClicker();
        this.setupSettings();
        this.setupStatsPanel();
        this.setupAchievementsPanel();
        this.updateStatsDisplay();
    }
    
    loadCount() {
        const saved = localStorage.getItem('sunflowerCount');
        if (saved) {
            this.count = parseInt(saved);
            this.updateDisplay();
        }
    }
    
    click() {
        this.count += this.stats.perClick;
        this.stats.totalClicks++;
        this.stats.totalFlowers += this.stats.perClick;
        this.updateDisplay();
        this.updateStatsDisplay();
        this.saveCount();
        this.saveStats();
        
        // Check achievements
        this.achievementSystem.checkAchievements(this.stats.totalClicks, this.stats.totalFlowers);
    }
    
    updateDisplay() {
        if (this.countElement) {
            this.countElement.textContent = this.count;
        }
    }
    
    saveCount() {
        localStorage.setItem('sunflowerCount', this.count);
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
