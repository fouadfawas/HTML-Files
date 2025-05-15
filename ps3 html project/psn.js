document.addEventListener('DOMContentLoaded', () => {
    // Initialize the PSN category with entries
    function initializePSNTab() {
        const psnList = document.querySelector('.xmb-items[data-category="psn"]');
        
        // Clear any existing content
        psnList.innerHTML = '';
        
        // Create PSN Store option
        const storeOption = document.createElement('li');
        storeOption.className = 'item active';
        storeOption.innerHTML = `
            <div class="psn-icon">
                <svg viewBox="0 0 24 24" width="64" height="64">
                    <rect width="24" height="24" rx="2" fill="#006FCD"/>
                    <path d="M6,7 L18,7 L18,17 L6,17 Z M9,10 L15,10 M9,13 L15,13" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                    <path d="M10,5 L14,5 L14,7 L10,7 Z" fill="white" opacity="0.8"/>
                </svg>
            </div>
            <span>PlayStation Store</span>
        `;
        
        psnList.appendChild(storeOption);
        
        // Create what's new option
        const whatsNewOption = document.createElement('li');
        whatsNewOption.className = 'item';
        whatsNewOption.innerHTML = `
            <div class="psn-icon">
                <svg viewBox="0 0 24 24" width="64" height="64">
                    <rect width="24" height="24" rx="2" fill="#006FCD"/>
                    <path d="M12,7 L12,14 M12,16 L12,18" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="12" cy="16" r="1" fill="white"/>
                </svg>
            </div>
            <span>What's New</span>
        `;
        
        psnList.appendChild(whatsNewOption);
        
        // Add click handler for store
        storeOption.addEventListener('click', () => {
            if (storeOption.classList.contains('active')) {
                openPSNStore();
            }
        });
    }
    
    // Show PSN Store (currently just a notification)
    function openPSNStore() {
        PS3XMB.showNotification('PlayStation Store is not available in this simulation');
        PS3XMB.playSelectSound();
    }
    
    // Initialize the PSN tab
    initializePSNTab();
    
    // Add keypress handler for PSN items
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('.category.active')?.dataset.category === 'psn') {
            if (e.key === 'Enter' || e.key === 'x' || e.key === 'X') {
                const activeItem = document.querySelector('.xmb-items[data-category="psn"] .item.active');
                if (activeItem && activeItem.querySelector('span').textContent === 'PlayStation Store') {
                    openPSNStore();
                    e.preventDefault();
                }
            }
        }
    });
    
    // Export PSN functionality to window object
    window.PSNSystem = {
        openStore: openPSNStore
    };
});