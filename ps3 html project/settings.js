document.addEventListener('DOMContentLoaded', () => {
    const settingsPanel = document.querySelector('.settings-panel');
    const settingsOptions = document.querySelector('.settings-options');
    const settingsTitle = document.querySelector('.settings-title');
    
    // Currently selected setting option
    let currentSettingIndex = 0;
    let isSettingsPanelActive = false;
    
    // Function to open the settings panel with specific content
    window.openSettingsPanel = function(settingsType) {
        // Set panel title
        settingsTitle.textContent = getSettingsPanelTitle(settingsType);
        
        // Clear existing options
        settingsOptions.innerHTML = '';
        
        // Add options based on settings type
        switch(settingsType) {
            case 'themes':
                populateThemeOptions();
                break;
            case 'system':
                populateSystemInfo();
                break;
            case 'power':
                populatePowerOptions();
                break;
            // You can add more settings types here
        }
        
        // Show the panel
        settingsPanel.classList.add('visible');
        PS3XMB.playSelectSound();
        
        // Set the settings panel as active for keyboard control with a small delay
        // This prevents the open action from also triggering the first item
        setTimeout(() => {
            isSettingsPanelActive = true;
            currentSettingIndex = 0;
            // Update selected settings item
            updateSettingsSelection();
        }, 100);
    };
    
    function getSettingsPanelTitle(settingsType) {
        switch(settingsType) {
            case 'themes':
                return 'Theme Settings';
            case 'system':
                return 'System Information';
            case 'power':
                return 'Power Options';
            default:
                return 'Settings';
        }
    }
    
    // Handle keyboard navigation for settings panel
    document.addEventListener('keydown', (e) => {
        if (isSettingsPanelActive && settingsPanel.classList.contains('visible')) {
            const settingOptions = document.querySelectorAll('.settings-option');
            
            switch(e.key) {
                case 'ArrowUp':
                    if (currentSettingIndex > 0) {
                        currentSettingIndex--;
                        updateSettingsSelection();
                        PS3XMB.playNavSound('item');
                    }
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    if (currentSettingIndex < settingOptions.length - 1) {
                        currentSettingIndex++;
                        updateSettingsSelection();
                        PS3XMB.playNavSound('item');
                    }
                    e.preventDefault();
                    break;
                case 'Enter':
                case 'x':
                case 'X':
                    // Trigger click on the selected setting
                    settingOptions[currentSettingIndex].click();
                    e.preventDefault();
                    break;
                case 'o':
                case 'O':
                case 'Escape':
                    closeSettingsPanel();
                    e.preventDefault();
                    break;
            }
        }
    });
    
    function updateSettingsSelection() {
        const settingOptions = document.querySelectorAll('.settings-option');
        settingOptions.forEach((option, index) => {
            if (index === currentSettingIndex) {
                option.classList.add('selected');
                // Scroll to the selected option if needed
                option.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                option.classList.remove('selected');
            }
        });
    }
    
    function closeSettingsPanel() {
        settingsPanel.classList.remove('visible');
        PS3XMB.playNavSound('category');
        isSettingsPanelActive = false;
        
        // Ensure focus returns to XMB interface
        document.activeElement.blur();
    }
    
    // Close settings panel when O key is pressed - modified to use closeSettingsPanel function
    document.addEventListener('keydown', (e) => {
        if ((e.key === 'o' || e.key === 'O' || e.key === 'Escape') && settingsPanel.classList.contains('visible')) {
            closeSettingsPanel();
        }
    });
    
    // Handle clicking outside the settings panel to close it
    document.addEventListener('click', (e) => {
        if (settingsPanel.classList.contains('visible') && 
            !settingsPanel.contains(e.target) && 
            !e.target.closest('.xmb-items[data-category="settings"]')) {
            closeSettingsPanel();
        }
    });
    
    // Add this new function for system information
    window.populateSystemInfo = function() {
        const settingsOptions = document.querySelector('.settings-options');
        
        const infoSection = document.createElement('div');
        infoSection.className = 'settings-section';
        
        const sysInfoTitle = document.createElement('h3');
        sysInfoTitle.textContent = 'PlayStation 3 System';
        sysInfoTitle.className = 'settings-section-title';
        sysInfoTitle.style.textShadow = '0 0 8px rgba(255, 255, 255, 0.5)';
        sysInfoTitle.style.marginBottom = '15px';
        infoSection.appendChild(sysInfoTitle);
        
        // System information items
        const sysInfoItems = [
            { label: 'System Software Version', value: '4.90' },
            { label: 'MAC Address (LAN)', value: 'no lol' },
            { label: 'IP Address', value: 'no lol' },
            { label: 'Storage', value: '500 GB (420 GB Free)' },
            { label: 'Model', value: 'CECH-4000 Series' },
            { label: 'Serial Number', value: 'SA123456789' },
        ];
        
        sysInfoItems.forEach(item => {
            const infoElement = document.createElement('div');
            infoElement.className = 'settings-option system-info-item';
            
            const infoContent = `
                <div class="settings-option-title">${item.label}</div>
                <div class="settings-option-desc">${item.value}</div>
            `;
            
            infoElement.innerHTML = infoContent;
            infoSection.appendChild(infoElement);
        });
        
        // Add copyright information
        const copyrightElement = document.createElement('div');
        copyrightElement.className = 'settings-option system-info-item';
        copyrightElement.style.height = '100px'; 
        copyrightElement.innerHTML = `
            <div class="settings-option-title">Copyright</div>
            <div class="settings-option-desc" style="font-size: 13px;">All rights reserved to Sony Corporation and Sony Interactive Entertainment. The PS3 Logo and "PS3" written-out logo are trademarks of PlayStation (Sony Interactive Entertainment)</div>
        `;
        infoSection.appendChild(copyrightElement);
        
        settingsOptions.appendChild(infoSection);
        
        // Add downgrade button at the bottom
        const downgradeButton = document.createElement('div');
        downgradeButton.className = 'settings-option downgrade-button';
        downgradeButton.style.marginTop = '30px';
        downgradeButton.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        
        downgradeButton.innerHTML = `
            <div class="settings-option-title">Downgrade System</div>
            <div class="settings-option-desc">NOT RECOMMENDED, WILL POSSIBLY BRICK YOUR SYSTEM</div>
        `;
        
        downgradeButton.addEventListener('click', () => {
            // Apply black theme
            PS3XMB.currentTheme = 'black';
            // Set wave style to classic for downgrade
            PS3XMB.currentWaveStyle = 'classic';
            
            // Define black theme colors and apply them
            const colors = {
                black: { primary: '#000000', secondary: '#111111' }
            };
            
            const theme = colors.black;
            
            // Update the gradient
            const gradient = document.querySelector('#grad1');
            if (gradient) {
                gradient.querySelector('stop:first-child').style.stopColor = theme.primary;
                gradient.querySelector('stop:last-child').style.stopColor = theme.secondary;
            }
            
            // Reinitialize the background with classic wave style
            PS3XMB.initWaveBackground();
            
            PS3XMB.playSelectSound();
            PS3XMB.showNotification('WARNING: System downgraded to 3.55 OFW');
            window.settingsPanelControls.close();
        });
        
        settingsOptions.appendChild(downgradeButton);
        
        // Footer with close option
        const closeButton = document.createElement('div');
        closeButton.className = 'settings-option apply-button';
        closeButton.style.marginTop = '30px';
        closeButton.style.textAlign = 'center';
        closeButton.style.backgroundColor = 'rgba(30, 144, 255, 0.3)';
        
        closeButton.innerHTML = `
            <div class="settings-option-title">Close</div>
        `;
        
        closeButton.addEventListener('click', () => {
            window.settingsPanelControls.close();
            PS3XMB.playSelectSound();
        });
        
        settingsOptions.appendChild(closeButton);
    };
    
    // Add the power options menu
    window.populatePowerOptions = function() {
        const settingsOptions = document.querySelector('.settings-options');
        
        const powerSection = document.createElement('div');
        powerSection.className = 'settings-section';
        
        const powerTitle = document.createElement('h3');
        powerTitle.textContent = 'System Power Options';
        powerTitle.className = 'settings-section-title';
        powerTitle.style.textShadow = '0 0 8px rgba(255, 255, 255, 0.5)';
        powerTitle.style.marginBottom = '15px';
        powerSection.appendChild(powerTitle);
        
        // Power off system option
        const powerOffOption = document.createElement('div');
        powerOffOption.className = 'settings-option';
        powerOffOption.innerHTML = `
            <div class="settings-option-title">Turn Off System</div>
            <div class="settings-option-desc">Shut down your PlayStation 3 system</div>
        `;
        powerOffOption.addEventListener('click', () => {
            displayBlackScreen("System shutting down...");
            PS3XMB.playSelectSound();
        });
        powerSection.appendChild(powerOffOption);
        
        // Turn off controller option
        const controllerOffOption = document.createElement('div');
        controllerOffOption.className = 'settings-option';
        controllerOffOption.innerHTML = `
            <div class="settings-option-title">Turn Off Controller</div>
            <div class="settings-option-desc">Power off wireless controllers</div>
        `;
        controllerOffOption.addEventListener('click', () => {
            PS3XMB.showNotification("Controller turned off");
            PS3XMB.playSelectSound();
        });
        powerSection.appendChild(controllerOffOption);
        
        // Boot menu option
        const bootMenuOption = document.createElement('div');
        bootMenuOption.className = 'settings-option';
        bootMenuOption.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        bootMenuOption.innerHTML = `
            <div class="settings-option-title">Enter Boot Menu</div>
            <div class="settings-option-desc">Access recovery mode and system options</div>
        `;
        bootMenuOption.addEventListener('click', () => {
            displayBootMenu();
            PS3XMB.playSelectSound();
        });
        powerSection.appendChild(bootMenuOption);
        
        // Close button
        const closeButton = document.createElement('div');
        closeButton.className = 'settings-option apply-button';
        closeButton.style.marginTop = '30px';
        closeButton.style.textAlign = 'center';
        closeButton.style.backgroundColor = 'rgba(30, 144, 255, 0.3)';
        
        closeButton.innerHTML = `
            <div class="settings-option-title">Close</div>
        `;
        
        closeButton.addEventListener('click', () => {
            window.settingsPanelControls.close();
            PS3XMB.playSelectSound();
        });
        
        settingsOptions.appendChild(powerSection);
        settingsOptions.appendChild(closeButton);
        
        // Helper function for black screen display
        function displayBlackScreen(message) {
            // Create black screen overlay
            const overlay = document.createElement('div');
            overlay.className = 'game-launch-overlay';
            overlay.style.zIndex = '1000';
            document.querySelector('.container').appendChild(overlay);
            
            // Add message text
            const messageElement = document.createElement('div');
            messageElement.style.color = 'white';
            messageElement.style.fontSize = '24px';
            messageElement.style.textAlign = 'center';
            messageElement.textContent = message;
            overlay.appendChild(messageElement);
            
            // Make the overlay visible
            setTimeout(() => {
                overlay.classList.add('visible');
                
                // Add "Press any key to return" text after 2 seconds
                setTimeout(() => {
                    const returnText = document.createElement('div');
                    returnText.style.color = 'white';
                    returnText.style.fontSize = '16px';
                    returnText.style.opacity = '0.7';
                    returnText.style.marginTop = '20px';
                    returnText.textContent = 'Press any key to return';
                    messageElement.appendChild(returnText);
                    
                    // Add event listener to return on key press
                    const keyHandler = () => {
                        overlay.classList.remove('visible');
                        setTimeout(() => overlay.remove(), 500);
                        document.removeEventListener('keydown', keyHandler);
                        window.settingsPanelControls.close();
                    };
                    document.addEventListener('keydown', keyHandler);
                }, 2000);
            }, 100);
        }
        
        // Helper function for boot menu display
        function displayBootMenu() {
            // Create black screen overlay with different styling
            const overlay = document.createElement('div');
            overlay.className = 'game-launch-overlay';
            overlay.style.zIndex = '1000';
            overlay.style.backgroundColor = '#000';
            document.querySelector('.container').appendChild(overlay);
            
            // Create boot menu content
            const menuContent = document.createElement('div');
            menuContent.style.color = 'white';
            menuContent.style.textAlign = 'left';
            menuContent.style.fontFamily = 'monospace';
            menuContent.style.padding = '50px';
            menuContent.style.maxWidth = '800px';
            menuContent.style.margin = '0 auto';
            
            menuContent.innerHTML = `
                <h2 style="text-align: center; margin-bottom: 30px; color: #ddd;">PlayStation 3 Recovery Menu</h2>
                <div style="border: 1px solid #333; padding: 20px; background-color: #111;">
                    <div style="margin-bottom: 15px; color: #999;">No recovery options are available at this time.</div>
                    <div style="margin-bottom: 15px; color: #999;">Press X to launch system in normal mode.</div>
                    <div style="margin-bottom: 15px; color: #999;">Press O to return to XMB.</div>
                </div>
            `;
            
            overlay.appendChild(menuContent);
            
            // Make the overlay visible
            setTimeout(() => {
                overlay.classList.add('visible');
                
                // Add event listener to return on key press
                const keyHandler = (e) => {
                    if (e.key === 'x' || e.key === 'X' || e.key === 'o' || e.key === 'O' || e.key === 'Escape') {
                        overlay.classList.remove('visible');
                        setTimeout(() => overlay.remove(), 500);
                        document.removeEventListener('keydown', keyHandler);
                        window.settingsPanelControls.close();
                    }
                };
                document.addEventListener('keydown', keyHandler);
            }, 100);
        }
    };
    
    // Handle settings selection and add power options
    function handleSettings() {
        const activeCategory = categories[currentCategoryIndex];
        const activeItemsList = document.querySelector(`.xmb-items[data-category="${activeCategory.dataset.category}"]`);
        
        if (activeItemsList) {
            const activeItems = activeItemsList.querySelectorAll('.item');
            if (activeItems.length > 0 && activeItems[currentItemIndex]) {
                const itemName = activeItems[currentItemIndex].querySelector('span').textContent;
                
                if (itemName === "Themes") {
                    // Open settings panel instead of modal
                    openSettingsPanel("themes");
                } else if (itemName === "System Information") {
                    openSettingsPanel("system");
                } else if (itemName === "Power Settings") {
                    openSettingsPanel("power");
                }
            }
        }
    }
    
    // Export methods to window for access from other files
    window.settingsPanelControls = {
        isActive: () => isSettingsPanelActive,
        close: closeSettingsPanel
    };
});