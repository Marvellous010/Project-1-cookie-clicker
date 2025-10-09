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
        
        this.init();
    }
    
    init() {
        this.loadCount();
        this.loadSettings();
        this.loadStats();
        this.setupClicker();
        this.setupSettings();
        this.setupStatsPanel();
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
