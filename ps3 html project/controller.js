document.addEventListener('DOMContentLoaded', () => {
    // Controller mapping and state
    const controllerState = {
        connected: false,
        controllerType: null, // 'xbox' or 'playstation'
        buttons: {},
        axes: {},
        lastButtonPressed: null
    };

    // Button mappings for different controllers
    const buttonMappings = {
        playstation: {
            0: { name: 'cross', xmbAction: 'select' },    // Cross button
            1: { name: 'circle', xmbAction: 'back' },     // Circle button
            2: { name: 'square', xmbAction: 'options' },  // Square button
            3: { name: 'triangle', xmbAction: 'display' }, // Triangle button
            12: { name: 'dpadUp', xmbAction: 'up' },      // D-pad up
            13: { name: 'dpadDown', xmbAction: 'down' },  // D-pad down
            14: { name: 'dpadLeft', xmbAction: 'left' },  // D-pad left
            15: { name: 'dpadRight', xmbAction: 'right' }, // D-pad right
            9: { name: 'start', xmbAction: 'start' },     // Start button
            8: { name: 'select', xmbAction: 'select' }    // Select button
        },
        xbox: {
            0: { name: 'a', xmbAction: 'select' },        // A button
            1: { name: 'b', xmbAction: 'back' },          // B button
            2: { name: 'x', xmbAction: 'options' },       // X button
            3: { name: 'y', xmbAction: 'display' },       // Y button
            12: { name: 'dpadUp', xmbAction: 'up' },      // D-pad up
            13: { name: 'dpadDown', xmbAction: 'down' },  // D-pad down
            14: { name: 'dpadLeft', xmbAction: 'left' },  // D-pad left
            15: { name: 'dpadRight', xmbAction: 'right' }, // D-pad right
            9: { name: 'start', xmbAction: 'start' },     // Start button
            8: { name: 'back', xmbAction: 'select' }      // Back button
        }
    };

    // Initialize controller support
    function initControllerSupport() {
        // Check for Gamepad API support
        if (!navigator.getGamepads) {
            console.log("This browser doesn't support the Gamepad API");
            return;
        }

        // Listen for controller connection
        window.addEventListener('gamepadconnected', (e) => {
            console.log(`Controller connected: ${e.gamepad.id}`);
            controllerState.connected = true;
            
            // Determine controller type
            const controllerId = e.gamepad.id.toLowerCase();
            if (controllerId.includes('playstation') || controllerId.includes('ps') || 
                controllerId.includes('dualshock') || controllerId.includes('dualsense')) {
                controllerState.controllerType = 'playstation';
                PS3XMB.showNotification('PlayStation controller connected');
            } else {
                controllerState.controllerType = 'xbox';
                PS3XMB.showNotification('Xbox controller connected');
            }
            
            // Start polling the controller
            startPollingController();
        });

        // Listen for controller disconnection
        window.addEventListener('gamepaddisconnected', (e) => {
            console.log(`Controller disconnected: ${e.gamepad.id}`);
            controllerState.connected = false;
            PS3XMB.showNotification('Controller disconnected');
        });
    }

    // Poll the controller for input
    function startPollingController() {
        let lastPollTime = 0;
        const pollInterval = 50; // Poll every 50ms (20 times per second)
        
        function pollController() {
            if (!controllerState.connected) return;
            
            const now = performance.now();
            if (now - lastPollTime < pollInterval) {
                requestAnimationFrame(pollController);
                return;
            }
            
            lastPollTime = now;
            
            // Get all connected gamepads
            const gamepads = navigator.getGamepads();
            
            // Find the first connected gamepad
            let activeGamepad = null;
            for (const gamepad of gamepads) {
                if (gamepad && gamepad.connected) {
                    activeGamepad = gamepad;
                    break;
                }
            }
            
            if (activeGamepad) {
                // Process buttons
                processControllerButtons(activeGamepad);
                
                // Process analog sticks
                processControllerAxes(activeGamepad);
            }
            
            requestAnimationFrame(pollController);
        }
        
        // Start polling
        requestAnimationFrame(pollController);
    }

    // Process controller buttons
    function processControllerButtons(gamepad) {
        const mapping = buttonMappings[controllerState.controllerType];
        
        // Process each button
        gamepad.buttons.forEach((button, index) => {
            const isPressed = button.pressed;
            const wasPressed = controllerState.buttons[index];
            
            // Store button state
            controllerState.buttons[index] = isPressed;
            
            // Button just pressed (not held)
            if (isPressed && !wasPressed) {
                console.log(`Button ${index} pressed`);
                
                // Look up the button mapping
                const buttonMapping = mapping[index];
                if (buttonMapping) {
                    controllerState.lastButtonPressed = buttonMapping.name;
                    
                    // Special handling for square button to trigger context menu
                    if (buttonMapping.name === 'square' || buttonMapping.name === 'x') {
                        // Simulate square key press to trigger context menu
                        const squareEvent = new KeyboardEvent('keydown', { key: 'square' });
                        document.dispatchEvent(squareEvent);
                    } else {
                        // Execute the corresponding action
                        executeControllerAction(buttonMapping.xmbAction);
                    }
                }
            }
        });
    }

    // Process controller analog sticks
    function processControllerAxes(gamepad) {
        const deadzone = 0.5; // Larger deadzone for digital-style control
        
        // Store previous axes values
        const prevLeftStickX = controllerState.axes.leftStickX;
        const prevLeftStickY = controllerState.axes.leftStickY;
        
        // Get current axes values
        const leftStickX = gamepad.axes[0];
        const leftStickY = gamepad.axes[1];
        
        // Store current axes values
        controllerState.axes.leftStickX = leftStickX;
        controllerState.axes.leftStickY = leftStickY;
        
        // Left stick right
        if (leftStickX > deadzone && (prevLeftStickX === undefined || prevLeftStickX <= deadzone)) {
            executeControllerAction('right');
        }
        // Left stick left
        else if (leftStickX < -deadzone && (prevLeftStickX === undefined || prevLeftStickX >= -deadzone)) {
            executeControllerAction('left');
        }
        
        // Left stick down
        if (leftStickY > deadzone && (prevLeftStickY === undefined || prevLeftStickY <= deadzone)) {
            executeControllerAction('down');
        }
        // Left stick up
        else if (leftStickY < -deadzone && (prevLeftStickY === undefined || prevLeftStickY >= -deadzone)) {
            executeControllerAction('up');
        }
    }

    // Execute an action based on controller input
    function executeControllerAction(action) {
        // Skip if settings panel is active, it has its own controls
        if (window.settingsPanelControls && window.settingsPanelControls.isActive()) {
            executeSettingsPanelAction(action);
            return;
        }
        
        // Skip if context menu is active
        if (window.ContextMenuSystem && window.ContextMenuSystem.isActive()) {
            executeContextMenuAction(action);
            return;
        }
        
        // Skip if devlog panel is active
        if (window.DevlogSystem && window.DevlogSystem.isActive()) {
            if (action === 'back') {
                window.DevlogSystem.close();
            }
            return;
        }
        
        // Skip if a modal is open
        const videoModal = document.getElementById('videoPlayerModal');
        const audioModal = document.getElementById('audioPlayerModal');
        const photoModal = document.getElementById('photoViewerModal');
        
        if (videoModal && videoModal.style.display === 'block') {
            executeVideoAction(action);
            return;
        }
        
        if (audioModal && audioModal.style.display === 'block') {
            executeAudioAction(action);
            return;
        }
        
        if (photoModal && photoModal.style.display === 'block') {
            executePhotoAction(action);
            return;
        }
        
        // Check for game launch overlay
        const gameOverlay = document.querySelector('.game-launch-overlay');
        if (gameOverlay && gameOverlay.classList.contains('visible')) {
            if (action === 'back') {
                // Simulate ESC key to exit game
                const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
                document.dispatchEvent(escEvent);
            }
            return;
        }
        
        // Main XMB navigation
        switch (action) {
            case 'up':
                simulateKeyPress('ArrowUp');
                break;
            case 'down':
                simulateKeyPress('ArrowDown');
                break;
            case 'left':
                simulateKeyPress('ArrowLeft');
                break;
            case 'right':
                simulateKeyPress('ArrowRight');
                break;
            case 'select':
                simulateKeyPress('x');
                break;
            case 'back':
                simulateKeyPress('o');
                break;
        }
    }
    
    // Execute an action in the settings panel
    function executeSettingsPanelAction(action) {
        switch (action) {
            case 'up':
                simulateKeyPress('ArrowUp');
                break;
            case 'down':
                simulateKeyPress('ArrowDown');
                break;
            case 'select':
                simulateKeyPress('x');
                break;
            case 'back':
                simulateKeyPress('o');
                break;
            case 'options':
                simulateKeyPress('square');
                break;
        }
    }
    
    // Execute an action in the context menu
    function executeContextMenuAction(action) {
        switch (action) {
            case 'up':
                simulateKeyPress('ArrowUp');
                break;
            case 'down':
                simulateKeyPress('ArrowDown');
                break;
            case 'select':
                simulateKeyPress('x');
                break;
            case 'back':
                simulateKeyPress('o');
                break;
        }
    }
    
    // Execute an action in the video player
    function executeVideoAction(action) {
        if (action === 'back') {
            window.VideoSystem.closeVideo();
        }
    }
    
    // Execute an action in the audio player
    function executeAudioAction(action) {
        if (action === 'back') {
            window.MusicSystem.closeMusic();
        }
    }
    
    // Execute an action in the photo viewer
    function executePhotoAction(action) {
        if (action === 'back') {
            window.PhotoSystem.closePhoto();
        }
    }
    
    // Helper function to simulate keyboard events
    function simulateKeyPress(key) {
        const event = new KeyboardEvent('keydown', { key });
        document.dispatchEvent(event);
    }

    // Handle keyboard navigation for context menu
    document.addEventListener('keydown', (e) => {
        if (window.ContextMenuSystem && window.ContextMenuSystem.isActive()) {
            const contextMenuPanel = document.querySelector('.context-menu-panel');
            const options = contextMenuPanel.querySelectorAll('.settings-option:not(.system-info-item)');
            
            // Get currentMenuIndex from the ContextMenuSystem
            let currentMenuIndex = window.ContextMenuSystem.getCurrentMenuIndex();
            
            switch(e.key) {
                case 'ArrowUp':
                    if (currentMenuIndex > 0) {
                        currentMenuIndex--;
                        window.ContextMenuSystem.updateMenuSelection(currentMenuIndex);
                        PS3XMB.playNavSound('item');
                    }
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    if (currentMenuIndex < options.length - 1) {
                        currentMenuIndex++;
                        window.ContextMenuSystem.updateMenuSelection(currentMenuIndex);
                        PS3XMB.playNavSound('item');
                    }
                    e.preventDefault();
                    break;
                case 'Enter':
                case 'x':
                case 'X':
                    // Trigger click on the selected option
                    options[currentMenuIndex].click();
                    e.preventDefault();
                    break;
                case 'o':
                case 'O':
                case 'Escape':
                    window.ContextMenuSystem.close();
                    e.preventDefault();
                    break;
            }
        } else if ((e.key === 'square' || e.key === 'Square' || e.key === 'Shift') && !window.ContextMenuSystem.isActive()) {
            const activeCategory = document.querySelector('.category.active');
            if (activeCategory) {
                const categoryType = activeCategory.dataset.category;
                
                // Only handle file-based categories
                if (['videos', 'music', 'photos'].includes(categoryType)) {
                    const activeItem = document.querySelector(`.xmb-items[data-category="${categoryType}"] .item.active`);
                    
                    // Skip if it's the upload button
                    if (activeItem && !activeItem.querySelector('span').textContent.includes('Upload')) {
                        let fileType;
                        if (categoryType === 'videos') fileType = 'video';
                        else if (categoryType === 'music') fileType = 'music';
                        else if (categoryType === 'photos') fileType = 'photo';
                        
                        window.ContextMenuSystem.show(activeItem, fileType);
                        e.preventDefault();
                    }
                }
            }
        }
    });

    // Initialize controller support
    initControllerSupport();
    
    // Export controller functions to window object
    window.ControllerSystem = {
        getState: () => ({ ...controllerState }),
        isConnected: () => controllerState.connected,
        getControllerType: () => controllerState.controllerType,
        getLastButtonPressed: () => controllerState.lastButtonPressed
    };
});