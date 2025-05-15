/**
 * UI Helper functions that assist with menu transitions and animations
 * Moved from script.js to reduce file size
 */
document.addEventListener('DOMContentLoaded', () => {
    // Create and add proper class to container for context menu state
    const container = document.querySelector('.container');
    
    // Update UI state when context menu or settings panel is active
    window.UIHelpers = {
        // Set UI to context menu mode - prevents main menu movement
        setContextMenuActive: function(isActive) {
            if (isActive) {
                container.classList.add('context-menu-active');
            } else {
                container.classList.remove('context-menu-active');
            }
        },
        
        // Function to update game title display
        updateGameTitleDisplay: function() {
            const gameTitleDisplay = document.querySelector('.game-title-display');
            const categories = document.querySelectorAll('.category');
            const currentCategoryIndex = Array.from(categories).findIndex(cat => cat.classList.contains('active'));
            
            // Only show for games category
            if (categories[currentCategoryIndex].dataset.category === 'games') {
                const activeItemsList = document.querySelector('.xmb-items[data-category="games"]');
                const activeItem = activeItemsList.querySelector('.item.active');
                
                if (activeItem) {
                    const gameTitle = activeItem.querySelector('span').textContent;
                    gameTitleDisplay.textContent = gameTitle;
                    gameTitleDisplay.classList.add('visible');
                }
            } else {
                gameTitleDisplay.classList.remove('visible');
            }
        },
        
        // Get current selected category index
        getCurrentCategoryIndex: function() {
            const categories = document.querySelectorAll('.category');
            return Array.from(categories).findIndex(cat => cat.classList.contains('active'));
        },
        
        // Get current selected item index
        getCurrentItemIndex: function() {
            const activeCategory = document.querySelector('.category.active');
            if (!activeCategory) return 0;
            
            const categoryType = activeCategory.dataset.category;
            const items = document.querySelectorAll(`.xmb-items[data-category="${categoryType}"] .item`);
            return Array.from(items).findIndex(item => item.classList.contains('active'));
        }
    };
});