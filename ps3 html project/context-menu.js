document.addEventListener('DOMContentLoaded', () => {
    // Create context menu panel
    const contextMenuPanel = document.createElement('div');
    contextMenuPanel.className = 'settings-panel context-menu-panel';
    contextMenuPanel.innerHTML = `
        <div class="settings-panel-content">
            <h2 class="settings-title">File Information</h2>
            <div class="settings-options context-menu-options"></div>
            <div class="settings-controls">
                <div class="control"><span class="key">X</span> Select</div>
                <div class="control"><span class="key">O</span> Back</div>
            </div>
        </div>
    `;
    document.body.appendChild(contextMenuPanel);
    
    let currentFileItem = null;
    let currentFileType = null;
    let currentFileData = null;
    let currentFileSystem = null;
    let isContextMenuActive = false;
    let currentMenuIndex = 0;

    function showContextMenu(fileItem, fileType) {
        // Get file data based on type and ID
        currentFileItem = fileItem;
        currentFileType = fileType;
        
        switch (fileType) {
            case 'video':
                currentFileData = window.VideoSystem.getVideoById(fileItem.dataset.videoId);
                currentFileSystem = window.VideoSystem;
                break;
            case 'music':
                currentFileData = window.MusicSystem.getMusicById(fileItem.dataset.trackId);
                currentFileSystem = window.MusicSystem;
                break;
            case 'photo':
                currentFileData = window.PhotoSystem.getPhotoById(fileItem.dataset.photoId);
                currentFileSystem = window.PhotoSystem;
                break;
        }
        
        if (!currentFileData) return;
        
        // Update panel title
        const titleElement = contextMenuPanel.querySelector('.settings-title');
        titleElement.textContent = currentFileData.name;
        
        // Clear previous options
        const optionsContainer = contextMenuPanel.querySelector('.context-menu-options');
        optionsContainer.innerHTML = '';
        
        // Add file info section
        const infoSection = document.createElement('div');
        infoSection.className = 'settings-section';
        
        const infoTitle = document.createElement('h3');
        infoTitle.textContent = 'File Details';
        infoTitle.className = 'settings-section-title';
        infoTitle.style.textShadow = '0 0 8px rgba(255, 255, 255, 0.5)';
        infoTitle.style.marginBottom = '15px';
        infoSection.appendChild(infoTitle);
        
        // Create info item for file type
        const typeItem = document.createElement('div');
        typeItem.className = 'settings-option system-info-item';
        typeItem.innerHTML = `
            <div class="settings-option-title">Type</div>
            <div class="settings-option-desc">${fileType.charAt(0).toUpperCase() + fileType.slice(1)} File</div>
        `;
        infoSection.appendChild(typeItem);
        
        // Create info item for file date
        const dateItem = document.createElement('div');
        dateItem.className = 'settings-option system-info-item';
        const fileDate = currentFileData.timestamp ? new Date(currentFileData.timestamp).toLocaleString() : 'Unknown date';
        dateItem.innerHTML = `
            <div class="settings-option-title">Date Added</div>
            <div class="settings-option-desc">${fileDate}</div>
        `;
        infoSection.appendChild(dateItem);
        
        optionsContainer.appendChild(infoSection);
        
        // Add actions section
        const actionsSection = document.createElement('div');
        actionsSection.className = 'settings-section';
        actionsSection.style.marginTop = '30px';
        
        const actionsTitle = document.createElement('h3');
        actionsTitle.textContent = 'Actions';
        actionsTitle.className = 'settings-section-title';
        actionsTitle.style.textShadow = '0 0 8px rgba(255, 255, 255, 0.5)';
        actionsTitle.style.marginBottom = '15px';
        actionsSection.appendChild(actionsTitle);
        
        // Add open action
        const openAction = document.createElement('div');
        openAction.className = 'settings-option';
        openAction.innerHTML = `
            <div class="settings-option-title">Open ${fileType.charAt(0).toUpperCase() + fileType.slice(1)}</div>
            <div class="settings-option-desc">View this file</div>
        `;
        openAction.addEventListener('click', () => {
            try {
                switch (fileType) {
                    case 'video':
                        if (currentFileData.needsReupload || !currentFileData.url) {
                            PS3XMB.showNotification(`Cannot play "${currentFileData.name}". Please re-upload the file.`);
                        } else {
                            window.VideoSystem.playVideo(currentFileData);
                        }
                        break;
                    case 'music':
                        if (currentFileData.needsReupload || !currentFileData.url) {
                            PS3XMB.showNotification(`Cannot play "${currentFileData.name}". Please re-upload the file.`);
                        } else {
                            window.MusicSystem.playMusic(currentFileData);
                        }
                        break;
                    case 'photo':
                        if (currentFileData.needsReupload || !currentFileData.url) {
                            PS3XMB.showNotification(`Cannot view "${currentFileData.name}". Please re-upload the file.`);
                        } else {
                            window.PhotoSystem.viewPhoto(currentFileData);
                        }
                        break;
                }
            } catch (error) {
                console.error('Error opening file:', error);
                PS3XMB.showNotification('Error opening file');
            }
            closeContextMenu();
            PS3XMB.playSelectSound();
        });
        actionsSection.appendChild(openAction);
        
        // Add delete action
        const deleteAction = document.createElement('div');
        deleteAction.className = 'settings-option downgrade-button';
        deleteAction.innerHTML = `
            <div class="settings-option-title">Delete ${fileType.charAt(0).toUpperCase() + fileType.slice(1)}</div>
            <div class="settings-option-desc">Remove this file permanently</div>
        `;
        deleteAction.addEventListener('click', () => {
            deleteFile();
            PS3XMB.playSelectSound();
        });
        actionsSection.appendChild(deleteAction);
        
        optionsContainer.appendChild(actionsSection);
        
        // Add close button
        const closeButton = document.createElement('div');
        closeButton.className = 'settings-option apply-button';
        closeButton.style.marginTop = '30px';
        closeButton.style.textAlign = 'center';
        closeButton.innerHTML = `
            <div class="settings-option-title">Close</div>
        `;
        closeButton.addEventListener('click', closeContextMenu);
        optionsContainer.appendChild(closeButton);
        
        // Show the panel
        contextMenuPanel.classList.add('visible');
        PS3XMB.playNavSound('category');
        
        // Update selected item (first option) with a delay to prevent immediate selection
        setTimeout(() => {
            isContextMenuActive = true;
            currentMenuIndex = 0;
            updateMenuSelection();
        }, 100);
    }
    
    function updateMenuSelection() {
        const options = contextMenuPanel.querySelectorAll('.settings-option:not(.system-info-item)');
        options.forEach((option, index) => {
            if (index === currentMenuIndex) {
                option.classList.add('selected');
                // Scroll to the selected option if needed
                option.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                option.classList.remove('selected');
            }
        });
    }
    
    function closeContextMenu() {
        contextMenuPanel.classList.remove('visible');
        isContextMenuActive = false;
        currentFileItem = null;
        currentFileData = null;
        currentFileSystem = null;
        PS3XMB.playNavSound('category');
    }
    
    // Function to delete the current file without opening it
    function deleteFile() {
        currentFileSystem.deleteFile(currentFileData.id);
        currentFileItem.remove();
        PS3XMB.showNotification(`${currentFileData.name} deleted`);
        closeContextMenu();
    }
    
    // Handle keyboard navigation for context menu
    document.addEventListener('keydown', (e) => {
        if (isContextMenuActive) {
            const options = contextMenuPanel.querySelectorAll('.settings-option:not(.system-info-item)');
            
            switch(e.key) {
                case 'ArrowUp':
                    if (currentMenuIndex > 0) {
                        currentMenuIndex--;
                        updateMenuSelection();
                        PS3XMB.playNavSound('item');
                    }
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    if (currentMenuIndex < options.length - 1) {
                        currentMenuIndex++;
                        updateMenuSelection();
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
                    closeContextMenu();
                    e.preventDefault();
                    break;
            }
        } else if ((e.key === 'square' || e.key === 'Square') && !isContextMenuActive) {
            const activeCategory = document.querySelector('.category.active');
            if (activeCategory) {
                const categoryType = activeCategory.dataset.category;
                
                // Only handle file-based categories
                if (['videos', 'music', 'photos'].includes(categoryType)) {
                    const activeItem = document.querySelector(`.xmb-items[data-category="${categoryType}"] .item.active`);
                    
                    // Skip if it's the upload button
                    if (activeItem && !activeItem.querySelector('span').textContent.includes('Upload')) {
                        // Determine file type
                        let fileType;
                        if (categoryType === 'videos') fileType = 'video';
                        else if (categoryType === 'music') fileType = 'music';
                        else if (categoryType === 'photos') fileType = 'photo';
                        
                        showContextMenu(activeItem, fileType);
                        e.preventDefault();
                    }
                }
            }
        }
    });

    // Export context menu functionality
    window.ContextMenuSystem = {
        show: showContextMenu,
        close: closeContextMenu,
        isActive: () => isContextMenuActive
    };
});