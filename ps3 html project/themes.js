document.addEventListener('DOMContentLoaded', () => {
    // Theme options
    const colorOptions = [
        { name: 'Default', value: 'default', color: '#0d47a1' },
        { name: 'Emerald', value: 'emerald', color: '#00796b' },
        { name: 'Ruby', value: 'ruby', color: '#c62828' },
        { name: 'Amethyst', value: 'amethyst', color: '#6a1b9a' },
        { name: 'Gold', value: 'gold', color: '#f57f17' }
    ];
    
    const waveOptions = [
        { name: 'Default', value: 'default' },
        { name: 'Classic', value: 'classic' }
    ];
    
    // Populate theme options in the settings panel
    window.populateThemeOptions = function() {
        const settingsOptions = document.querySelector('.settings-options');
        
        // Color themes section
        const colorSection = document.createElement('div');
        colorSection.className = 'settings-section';
        
        const colorTitle = document.createElement('h3');
        colorTitle.textContent = 'Color Theme';
        colorTitle.className = 'settings-section-title';
        colorTitle.style.textShadow = '0 0 8px rgba(255, 255, 255, 0.5)';
        colorTitle.style.marginBottom = '15px';
        colorSection.appendChild(colorTitle);
        
        colorOptions.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = `settings-option ${option.value === PS3XMB.currentTheme ? 'selected' : ''}`;
            optionElement.dataset.theme = option.value;
            
            const optionContent = `
                <div class="settings-option-title">
                    <span style="display: inline-block; width: 12px; height: 12px; background-color: ${option.color}; border-radius: 50%; margin-right: 8px;"></span>
                    ${option.name}
                </div>
                <div class="settings-option-desc">Change XMB color to ${option.name.toLowerCase()} theme</div>
            `;
            
            optionElement.innerHTML = optionContent;
            
            optionElement.addEventListener('click', () => {
                optionElement.classList.add('selected');
                PS3XMB.currentTheme = option.value;
                applyTheme();
                PS3XMB.playNavSound('item');
            });
            
            colorSection.appendChild(optionElement);
        });
        
        settingsOptions.appendChild(colorSection);
        
        // Wave style section
        const waveSection = document.createElement('div');
        waveSection.className = 'settings-section';
        waveSection.style.marginTop = '30px';
        
        const waveTitle = document.createElement('h3');
        waveTitle.textContent = 'Wave Style';
        waveTitle.className = 'settings-section-title';
        waveTitle.style.textShadow = '0 0 8px rgba(255, 255, 255, 0.5)';
        waveTitle.style.marginBottom = '15px';
        waveSection.appendChild(waveTitle);
        
        waveOptions.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = `settings-option ${option.value === PS3XMB.currentWaveStyle ? 'selected' : ''}`;
            optionElement.dataset.wave = option.value;
            
            const optionContent = `
                <div class="settings-option-title">${option.name}</div>
                <div class="settings-option-desc">${option.value === 'default' ? 'Animated waves with particles' : 'Classic wave pattern without particles'}</div>
            `;
            
            optionElement.innerHTML = optionContent;
            
            optionElement.addEventListener('click', () => {
                optionElement.classList.add('selected');
                PS3XMB.currentWaveStyle = option.value;
                PS3XMB.initWaveBackground();
                PS3XMB.playNavSound('item');
            });
            
            waveSection.appendChild(optionElement);
        });
        
        settingsOptions.appendChild(waveSection);
        
        // Apply button
        const applyButton = document.createElement('div');
        applyButton.className = 'settings-option apply-button';
        applyButton.style.marginTop = '30px';
        applyButton.style.textAlign = 'center';
        applyButton.style.backgroundColor = 'rgba(30, 144, 255, 0.3)';
        
        applyButton.innerHTML = `
            <div class="settings-option-title">Apply Changes</div>
        `;
        
        applyButton.addEventListener('click', () => {
            PS3XMB.showNotification('Theme settings applied');
            document.querySelector('.settings-panel').classList.remove('visible');
            PS3XMB.playSelectSound();
            
            // Return control to XMB and ensure settings panel is marked as inactive
            isSettingsPanelActive = false;
            window.settingsPanelControls.close();
        });
        
        settingsOptions.appendChild(applyButton);
    };
    
    // Theme application function moved from script.js
    function applyTheme() {
        const colors = {
            default: { primary: '#0d47a1', secondary: '#072259' },
            emerald: { primary: '#00796b', secondary: '#004d40' },
            ruby: { primary: '#c62828', secondary: '#8e0000' },
            amethyst: { primary: '#6a1b9a', secondary: '#38006b' },
            gold: { primary: '#f57f17', secondary: '#bc5100' }
        };
        
        const theme = colors[PS3XMB.currentTheme] || colors.default;
        
        // Update the gradient
        const gradient = document.querySelector('#grad1');
        if (gradient) {
            gradient.querySelector('stop:first-child').style.stopColor = theme.primary;
            gradient.querySelector('stop:last-child').style.stopColor = theme.secondary;
        }
    }
    
    // Make applyTheme available to window scope
    window.applyTheme = applyTheme;
});