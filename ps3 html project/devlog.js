document.addEventListener('DOMContentLoaded', () => {
    // Devlog functionality
    let isDevlogPanelActive = false;
    const devlogPanel = document.querySelector('.devlog-panel');
    const devlogContent = document.querySelector('.devlog-content');
    
    // Devlog entries - add new entries at the top of the array
    const devlogEntries = [
        {
            date: 'Apr 15, 2025',
            title: 'Devlog 4: Real PS3 Assets',
            content: 'I added real sounds from the PS3 and the logo in the intro, making progress'
        },
        {
            date: 'Apr 15, 2025',
            title: 'Devlog 3: UI Improvements',
            content: 'Fixed the ui a bit and added a playstation network tab, YES I am figuring out a store system, be patient'
        },
        {
            date: 'Apr 15, 2025',
            title: 'Devlog 2: Intro Sequence',
            content: 'Added an intro, still trying to figure out the intro chord that everybody loves lol'
        },
        {
            date: 'Apr 14, 2025',
            title: 'Devlog 1: Launch Day',
            content: 'Just launched my PS3 XMB clone thingy. There are still some bugs, so I am actively working to fix them (be sure to comment any bug you encounter or feature I could add :)).'
        }
    ];
    
    // Initialize the network category with entries
    function initializeNetworkTab() {
        const networkList = document.querySelector('.xmb-items[data-category="network"]');
        
        // Clear any existing content
        networkList.innerHTML = '';
        
        // Create a dev log option
        const devlogOption = document.createElement('li');
        devlogOption.className = 'item active';
        devlogOption.innerHTML = `
            <div class="devlog-icon">
                <svg viewBox="0 0 24 24" width="64" height="64">
                    <rect width="24" height="24" rx="2" fill="#4285f4"/>
                    <path d="M4,6 L20,6 L20,18 L4,18 Z M4,9 L20,9 M10,9 L10,18" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                </svg>
            </div>
            <span>Developer Log</span>
        `;
        
        networkList.appendChild(devlogOption);
        
        // Create other network options if needed
        const statusOption = document.createElement('li');
        statusOption.className = 'item';
        statusOption.innerHTML = `
            <div class="devlog-icon">
                <svg viewBox="0 0 24 24" width="64" height="64">
                    <rect width="24" height="24" rx="2" fill="#43a047"/>
                    <path d="M12,2 L12,22 M2,12 L22,12" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                    <circle cx="12" cy="12" r="6" fill="none" stroke="white" stroke-width="1.5"/>
                </svg>
            </div>
            <span>Network Status</span>
        `;
        
        networkList.appendChild(statusOption);
    }
    
    // Populate the devlog panel with entries
    function populateDevlogPanel() {
        devlogContent.innerHTML = '';
        
        devlogEntries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'devlog-entry';
            
            entryElement.innerHTML = `
                <div class="devlog-date">${entry.date}</div>
                <div class="devlog-title">${entry.title}</div>
                <div class="devlog-text">${entry.content}</div>
            `;
            
            devlogContent.appendChild(entryElement);
        });
    }
    
    // Open the devlog panel
    function openDevlogPanel() {
        populateDevlogPanel();
        devlogPanel.classList.add('visible');
        PS3XMB.playSelectSound();
        
        // Set UI to not move main menu
        window.UIHelpers.setContextMenuActive(true);
        
        // Add a small delay before enabling keyboard controls
        setTimeout(() => {
            isDevlogPanelActive = true;
        }, 100);
    }
    
    // Close the devlog panel
    function closeDevlogPanel() {
        devlogPanel.classList.remove('visible');
        isDevlogPanelActive = false;
        PS3XMB.playNavSound('category');
        
        // Reset UI state
        window.UIHelpers.setContextMenuActive(false);
    }
    
    // Handle clicking outside the devlog panel to close it
    document.addEventListener('click', (e) => {
        if (devlogPanel.classList.contains('visible') && 
            !devlogPanel.contains(e.target) && 
            !e.target.closest('.xmb-items[data-category="network"]')) {
            closeDevlogPanel();
        }
    });
    
    // Handle keyboard for devlog panel
    document.addEventListener('keydown', (e) => {
        if (isDevlogPanelActive && (e.key === 'o' || e.key === 'O' || e.key === 'Escape')) {
            closeDevlogPanel();
            e.preventDefault();
        } else if (!isDevlogPanelActive && 
                  (e.key === 'Enter' || e.key === 'x' || e.key === 'X') && 
                  document.querySelector('.category.active')?.dataset.category === 'network') {
            const activeItem = document.querySelector('.xmb-items[data-category="network"] .item.active');
            if (activeItem && activeItem.querySelector('span').textContent === 'Developer Log') {
                openDevlogPanel();
                e.preventDefault();
            }
        }
    });
    
    // Initialize the network tab
    initializeNetworkTab();
    
    // Add click handler to open devlog
    document.addEventListener('click', (e) => {
        const networkItem = e.target.closest('.xmb-items[data-category="network"] .item');
        if (networkItem && networkItem.classList.contains('active') && 
            networkItem.querySelector('span').textContent === 'Developer Log') {
            openDevlogPanel();
        }
    });
    
    // Export devlog functionality to window object
    window.DevlogSystem = {
        open: openDevlogPanel,
        close: closeDevlogPanel,
        isActive: () => isDevlogPanelActive,
        addEntry: (title, content) => {
            const newEntry = {
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }),
                title,
                content
            };
            devlogEntries.unshift(newEntry);
            if (isDevlogPanelActive) {
                populateDevlogPanel();
            }
        }
    };
});