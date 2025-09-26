// Cache DOM elements for better performance
const themeElements = {
    defaultClouds: document.querySelector('.default-clouds'),
    stormClouds: document.querySelector('.storm-clouds'),
    nightSky: document.querySelector('.night-sky'),
    autumnBackground: document.querySelector('.autumn-background'),
    sky: document.querySelector('.sky')
};

// Function to apply themes directly
function applyTheme(themeId) {
    // Reset all theme elements
    themeElements.defaultClouds.style.opacity = '0';
    themeElements.stormClouds.style.opacity = '0';
    themeElements.nightSky.style.opacity = '0';
    themeElements.autumnBackground.style.opacity = '0';
    themeElements.sky.style.background = 'linear-gradient(to bottom, #87CEEB, #e0f7fa)';
    
    // Apply selected theme
    switch(themeId) {
        case 'theme-default':
            themeElements.defaultClouds.style.opacity = '1';
            themeElements.sky.style.background = 'linear-gradient(to bottom, #87CEEB, #e0f7fa)';
            break;
            
        case 'theme-storm':
            themeElements.stormClouds.style.opacity = '1';
            themeElements.sky.style.background = 'linear-gradient(to bottom, #37474F, #546E7A)';
            break;
            
        case 'theme-night':
            themeElements.nightSky.style.opacity = '1';
            themeElements.sky.style.background = 'linear-gradient(to bottom, #0a0e2c, #1a237e)';
            break;
            
        case 'theme-autumn':
            themeElements.autumnBackground.style.opacity = '1';
            themeElements.sky.style.background = 'linear-gradient(to bottom, #ff9800, #f57c00)';
            break;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Sunflower counter variables
    let sunflowerCount = 0;
    let totalClicks = 0;
    let clickTimes = [];
    const sunflowerCountElement = document.getElementById('sunflowerCount');
    
    // Load saved count from localStorage
    const savedCount = localStorage.getItem('sunflowerCount');
    if (savedCount) {
        sunflowerCount = parseInt(savedCount);
        sunflowerCountElement.textContent = sunflowerCount;
    }
    
    // Load saved total clicks
    const savedClicks = localStorage.getItem('totalClicks');
    if (savedClicks) {
        totalClicks = parseInt(savedClicks);
    }
    
    // Achievement system
    const achievements = {
        'first-click': { unlocked: false, condition: () => totalClicks >= 1 },
        'hundred-club': { unlocked: false, condition: () => sunflowerCount >= 100 },
        'click-master': { unlocked: false, condition: () => totalClicks >= 500 },
        'thousand-stars': { unlocked: false, condition: () => sunflowerCount >= 1000 },
        'fast-fingers': { unlocked: false, condition: () => checkFastFingers() },
        'theme-collector': { unlocked: false, condition: () => checkAllThemesUnlocked() },
        'shopaholic': { unlocked: false, condition: () => checkFirstUpgrade() },
        'sunflower-tycoon': { unlocked: false, condition: () => sunflowerCount >= 5000 },
        'click-king': { unlocked: false, condition: () => totalClicks >= 2000 },
        'perfectionist': { unlocked: false, condition: () => checkAllUpgradesBought() }
    };
    
    // Load saved achievements
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
        const parsed = JSON.parse(savedAchievements);
        Object.keys(parsed).forEach(key => {
            if (achievements[key]) {
                achievements[key].unlocked = parsed[key].unlocked;
            }
        });
    }
    
    function checkFastFingers() {
        const now = Date.now();
        clickTimes = clickTimes.filter(time => now - time <= 5000);
        return clickTimes.length >= 10;
    }
    
    function checkAllThemesUnlocked() {
        // This would check if all themes are unlocked - simplified for now
        return false;
    }
    
    function checkFirstUpgrade() {
        // This would check if any upgrade is bought - simplified for now
        return false;
    }
    
    function checkAllUpgradesBought() {
        // This would check if all upgrades are bought - simplified for now
        return false;
    }
    
    function checkAchievements() {
        Object.keys(achievements).forEach(key => {
            if (!achievements[key].unlocked && achievements[key].condition()) {
                unlockAchievement(key);
            }
        });
    }
    
    function unlockAchievement(achievementId) {
        achievements[achievementId].unlocked = true;
        localStorage.setItem('achievements', JSON.stringify(achievements));
        
        // Update UI
        const achievementElement = document.getElementById(`achievement-${achievementId}`);
        if (achievementElement) {
            achievementElement.setAttribute('data-achieved', 'true');
        }
        
        // Show notification
        showAchievementNotification(achievementId);
    }
    
    function showAchievementNotification(achievementId) {
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
    
    function updateAchievementUI() {
        Object.keys(achievements).forEach(key => {
            const achievementElement = document.getElementById(`achievement-${key}`);
            if (achievementElement) {
                if (achievements[key].unlocked) {
                    achievementElement.setAttribute('data-achieved', 'true');
                } else {
                    achievementElement.setAttribute('data-achieved', 'false');
                }
            }
        });
    }
    
    // Function to update sunflower count
    function updateSunflowerCount() {
        sunflowerCount++;
        totalClicks++;
        clickTimes.push(Date.now());
        
        sunflowerCountElement.textContent = sunflowerCount;
        localStorage.setItem('sunflowerCount', sunflowerCount);
        localStorage.setItem('totalClicks', totalClicks);
        
        checkAchievements();
    }
    
    const plantNameElement = document.getElementById('plant-name');

    // Load plant name from localStorage
    const savedName = localStorage.getItem('plantName');
    if (savedName) {
        plantNameElement.textContent = savedName;
    }

    // Save plant name to localStorage on edit
    plantNameElement.addEventListener('blur', () => {
        const newName = plantNameElement.textContent.trim();
        if (newName) {
            localStorage.setItem('plantName', newName);
        } else {
            plantNameElement.textContent = 'Naamloze Plant';
            localStorage.setItem('plantName', 'Naamloze Plant');
        }
    });

    // Save on Enter key press
    plantNameElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            plantNameElement.blur();
        }
    });

    // Settings functionality
    const settingsButton = document.getElementById('settingsButton');
    const settingsPanel = document.getElementById('settingsPanel');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');

    // Toggle settings panel
    settingsButton.addEventListener('click', () => {
        settingsPanel.classList.toggle('show');
        // Close other panels if open
        statsPanel.classList.remove('show');
        achievementsPanel.classList.remove('show');
    });

    // Stats functionality
    const statsButton = document.getElementById('statsButton');
    const statsPanel = document.getElementById('statsPanel');

    // Toggle stats panel
    statsButton.addEventListener('click', () => {
        statsPanel.classList.toggle('show');
        // Close other panels if open
        settingsPanel.classList.remove('show');
        achievementsPanel.classList.remove('show');
    });

    // Achievements functionality
    const achievementsButton = document.getElementById('achievementsButton');
    const achievementsPanel = document.getElementById('achievementsPanel');

    // Toggle achievements panel
    achievementsButton.addEventListener('click', () => {
        achievementsPanel.classList.toggle('show');
        // Close other panels if open
        settingsPanel.classList.remove('show');
        statsPanel.classList.remove('show');
    });

    // Close panels when clicking outside
    document.addEventListener('click', (e) => {
        if (!settingsButton.contains(e.target) && !settingsPanel.contains(e.target)) {
            settingsPanel.classList.remove('show');
        }
        if (!statsButton.contains(e.target) && !statsPanel.contains(e.target)) {
            statsPanel.classList.remove('show');
        }
        if (!achievementsButton.contains(e.target) && !achievementsPanel.contains(e.target)) {
            achievementsPanel.classList.remove('show');
        }
    });

    // Volume slider functionality
    volumeSlider.addEventListener('input', (e) => {
        const volume = e.target.value;
        volumeValue.textContent = volume + '%';
        localStorage.setItem('gameVolume', volume);
        // When you add music later, you can use this volume value
    });

    // Load saved volume
    const savedVolume = localStorage.getItem('gameVolume');
    if (savedVolume) {
        volumeSlider.value = savedVolume;
        volumeValue.textContent = savedVolume + '%';
    }

    // Reset game functionality
    const resetButton = document.getElementById('resetGameBtn');
    const resetModal = document.getElementById('resetModal');
    const resetCancelBtn = document.getElementById('resetCancelBtn');
    const resetConfirmBtn = document.getElementById('resetConfirmBtn');
    const successModal = document.getElementById('successModal');
    const successOkBtn = document.getElementById('successOkBtn');
    
    resetButton.addEventListener('click', () => {
        // Show custom reset modal
        resetModal.classList.add('show');
        // Close settings panel
        settingsPanel.classList.remove('show');
    });
    
    resetCancelBtn.addEventListener('click', () => {
        // Hide reset modal
        resetModal.classList.remove('show');
    });
    
    resetConfirmBtn.addEventListener('click', () => {
        // Hide reset modal and perform reset
        resetModal.classList.remove('show');
        resetGame();
    });
    
    successOkBtn.addEventListener('click', () => {
        // Hide success modal
        successModal.classList.remove('show');
    });
    
    // Close modals when clicking outside
    resetModal.addEventListener('click', (e) => {
        if (e.target === resetModal) {
            resetModal.classList.remove('show');
        }
    });
    
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('show');
        }
    });
    
    function resetGame() {
        console.log('🔄 Resetting game...');
        
        // Clear all localStorage data
        localStorage.removeItem('sunflowerCount');
        localStorage.removeItem('totalClicks');
        localStorage.removeItem('plantName');
        localStorage.removeItem('achievements');
        localStorage.removeItem('gameVolume');
        localStorage.removeItem('upgrades');
        localStorage.removeItem('unlockedThemes');
        
        // Reset all game variables
        sunflowerCount = 0;
        totalClicks = 0;
        clickTimes = [];
        
        // Reset achievements
        Object.keys(achievements).forEach(key => {
            achievements[key].unlocked = false;
        });
        
        // Reset UI elements
        sunflowerCountElement.textContent = '0';
        plantNameElement.textContent = 'Naamloze Plant';
        volumeSlider.value = 50;
        volumeValue.textContent = '50%';
        
        // Reset all achievement UI
        document.querySelectorAll('.achievement-item').forEach(item => {
            item.setAttribute('data-achieved', 'false');
        });
        
        // Reset theme to default
        document.querySelectorAll('input[name="theme"]').forEach(radio => {
            radio.checked = false;
        });
        document.getElementById('theme-default').checked = true;
        
        // Reset theme unlocks (unless in admin mode)
        if (!adminMode) {
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
        }
        
        // Apply default theme
        applyTheme('theme-default');
        
        // Show success modal
        setTimeout(() => {
            successModal.classList.add('show');
        }, 300);
        
        console.log('✅ Game reset complete!');
    }

    // Initialize achievement UI
    updateAchievementUI();

    // ADMIN MODE: Unlock all themes for preview
    // Remove this section when you want normal gameplay
    const adminMode = true; // Set to false to disable admin mode
    
    if (adminMode) {
        // Unlock all themes
        document.getElementById('unlock-storm').checked = true;
        document.getElementById('unlock-night').checked = true;
        document.getElementById('unlock-autumn').checked = true;
        
        // Remove lock icons and make themes clickable
        document.querySelectorAll('.theme-lock').forEach(lock => {
            lock.style.display = 'none';
        });
        
        document.querySelectorAll('.theme-option').forEach(option => {
            option.style.opacity = '1';
            option.style.pointerEvents = 'auto';
        });
        
        // Make theme switching work by adding click handlers
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get the theme type from the label's 'for' attribute
                const themeId = option.getAttribute('for');
                
                // Uncheck all theme radios first
                document.querySelectorAll('input[name="theme"]').forEach(radio => {
                    radio.checked = false;
                });
                
                // Check the selected theme
                const selectedTheme = document.getElementById(themeId);
                if (selectedTheme) {
                    selectedTheme.checked = true;
                    
                    // Apply theme directly with JavaScript
                    applyTheme(themeId);
                    console.log('🎨 Theme switched to:', themeId);
                }
            });
        });
        
        console.log('🔓 Admin Mode: All themes unlocked for preview');
    }
    
    // Sunflower click handler
    const sunflowerButton = document.querySelector('.sunflower-button');
    if (sunflowerButton) {
        sunflowerButton.addEventListener('click', function(e) {
            // Update sunflower count
            updateSunflowerCount();
            
            // Click effect animation with requestAnimationFrame for better performance
            const clickEffect = this.querySelector('.click-effect');
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
           
            // Use requestAnimationFrame for smooth animation
            requestAnimationFrame(() => {
                clickEffect.style.left = x + 'px';
                clickEffect.style.top = y + 'px';
                clickEffect.style.opacity = '1';
                clickEffect.style.transform = 'scale(0)';
                
                requestAnimationFrame(() => {
                    clickEffect.style.animation = 'clickEffect 0.5s ease-out forwards';
                });
            });
           
            // Reset after animation
            setTimeout(() => {
                clickEffect.style.animation = '';
                clickEffect.style.opacity = '0';
            }, 500);
        });
    }
});
