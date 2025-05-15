document.addEventListener('DOMContentLoaded', () => {
    window.GameSystem = {
        launchGame: function(gameTitle) {
            // Create game launch overlay with black screen
            const overlay = document.createElement('div');
            overlay.className = 'game-launch-overlay';
            document.querySelector('.container').appendChild(overlay);
            
            // Make the overlay visible immediately (black screen)
            setTimeout(() => {
                overlay.classList.add('visible');
            }, 50);
            
            // After 5 seconds, show the game simulation content
            setTimeout(() => {
                const content = document.createElement('div');
                content.className = 'game-launch-content';
                
                const title = document.createElement('h1');
                title.textContent = gameTitle;
                
                const message = document.createElement('p');
                message.textContent = 'This is where the game would be playing right now.';
                message.style.marginTop = '20px';
                
                const exitMessage = document.createElement('p');
                exitMessage.textContent = 'Press ESC or O to return to XMB.';
                exitMessage.style.marginTop = '30px';
                exitMessage.style.fontSize = '14px';
                exitMessage.style.opacity = '0.7';
                
                content.appendChild(title);
                content.appendChild(message);
                content.appendChild(exitMessage);
                overlay.appendChild(content);
            }, 5000);
            
            // Add event listener to exit game
            const exitGameHandler = (e) => {
                if (e.key === 'Escape' || e.key === 'o' || e.key === 'O') {
                    overlay.classList.remove('visible');
                    setTimeout(() => {
                        overlay.remove();
                        document.removeEventListener('keydown', exitGameHandler);
                    }, 1000);
                }
            };
            
            document.addEventListener('keydown', exitGameHandler);
            PS3XMB.playSelectSound();
        }
    };
});