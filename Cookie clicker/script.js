class SimpleCookieClicker {
    constructor() {
        this.count = 0;
        this.countElement = document.getElementById('sunflowerCount');
        this.volume = 50; // Default volume
        this.init();
    }
    
    init() {
        this.loadCount();
        this.loadSettings();
        this.setupClicker();
        this.setupSettings();
    }
    
    loadCount() {
        const saved = localStorage.getItem('sunflowerCount');
        if (saved) {
            this.count = parseInt(saved);
            this.updateDisplay();
        }
    }
    
    click() {
        this.count++;
        this.updateDisplay();
        this.saveCount();
    }
    
    updateDisplay() {
        if (this.countElement) {
            this.countElement.textContent = this.count;
        }
    }
    
    saveCount() {
        localStorage.setItem('sunflowerCount', this.count);
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
        
    
        localStorage.removeItem('sunflowerCount');
        localStorage.removeItem('gameVolume');
        
        
        this.updateDisplay();
        this.updateVolumeDisplay();
        
        
        const plantName = document.getElementById('plant-name');
        if (plantName) {
            plantName.textContent = 'Naamloze Plant';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SimpleCookieClicker();
});
