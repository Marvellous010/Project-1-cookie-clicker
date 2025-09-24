// Function to apply themes directly
function applyTheme(themeId) {
    // Reset all theme elements
    document.querySelector('.default-clouds').style.opacity = '0';
    document.querySelector('.storm-clouds').style.opacity = '0';
    document.querySelector('.night-sky').style.opacity = '0';
    document.querySelector('.autumn-background').style.opacity = '0';
    document.querySelector('.sky').style.background = 'linear-gradient(to bottom, #87CEEB, #e0f7fa)';
    
    // Apply selected theme
    switch(themeId) {
        case 'theme-default':
            document.querySelector('.default-clouds').style.opacity = '1';
            document.querySelector('.sky').style.background = 'linear-gradient(to bottom, #87CEEB, #e0f7fa)';
            break;
            
        case 'theme-storm':
            document.querySelector('.storm-clouds').style.opacity = '1';
            document.querySelector('.sky').style.background = 'linear-gradient(to bottom, #37474F, #546E7A)';
            break;
            
        case 'theme-night':
            document.querySelector('.night-sky').style.opacity = '1';
            document.querySelector('.sky').style.background = 'linear-gradient(to bottom, #0a0e2c, #1a237e)';
            break;
            
        case 'theme-autumn':
            document.querySelector('.autumn-background').style.opacity = '1';
            document.querySelector('.sky').style.background = 'linear-gradient(to bottom, #ff9800, #f57c00)';
            break;
    }
}

document.addEventListener('DOMContentLoaded', () => {
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
        // Close stats panel if open
        statsPanel.classList.remove('show');
    });

    // Stats functionality
    const statsButton = document.getElementById('statsButton');
    const statsPanel = document.getElementById('statsPanel');

    // Toggle stats panel
    statsButton.addEventListener('click', () => {
        statsPanel.classList.toggle('show');
        // Close settings panel if open
        settingsPanel.classList.remove('show');
    });

    // Close panels when clicking outside
    document.addEventListener('click', (e) => {
        if (!settingsButton.contains(e.target) && !settingsPanel.contains(e.target)) {
            settingsPanel.classList.remove('show');
        }
        if (!statsButton.contains(e.target) && !statsPanel.contains(e.target)) {
            statsPanel.classList.remove('show');
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
});

document.querySelector('.sunflower-button').addEventListener('click', function(e) {
    const clickEffect = this.querySelector('.click-effect');
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
   
    clickEffect.style.left = x + 'px';
    clickEffect.style.top = y + 'px';
    clickEffect.style.opacity = '1';
    clickEffect.style.transform = 'scale(0)';
   
    
    setTimeout(() => {
        clickEffect.style.animation = 'clickEffect 0.5s ease-out forwards';
    }, 10);
   
    // Reset after animation
    setTimeout(() => {
        clickEffect.style.animation = '';
        clickEffect.style.opacity = '0';
    }, 500);
});
