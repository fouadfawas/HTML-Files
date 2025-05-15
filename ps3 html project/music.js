document.addEventListener('DOMContentLoaded', () => {
    // Local storage for uploaded music
    let userMusic = loadMusicFromStorage();
    
    // Initialize elements
    const musicList = document.querySelector('.xmb-items[data-category="music"]');
    const musicUploadInput = document.createElement('input');
    musicUploadInput.type = 'file';
    musicUploadInput.id = 'musicUpload';
    musicUploadInput.accept = 'audio/*';
    musicUploadInput.style.display = 'none';
    document.body.appendChild(musicUploadInput);
    
    // Create audio player modal
    const audioModal = document.createElement('div');
    audioModal.id = 'audioPlayerModal';
    audioModal.className = 'video-modal'; // Reuse video modal styling
    audioModal.innerHTML = `
        <div class="video-modal-content">
            <div class="video-modal-header">
                <h2 id="audioTitle">Music Title</h2>
                <span class="audio-close-button close-button">&times;</span>
            </div>
            <div class="audio-player-container" style="padding: 20px; text-align: center;">
                <audio id="audioPlayer" controls style="width: 100%;"></audio>
                <div class="audio-visualizer">
                    <canvas id="audioCanvas" height="200"></canvas>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(audioModal);
    
    // Initialize upload option in music tab
    function initializeMusicTab() {
        // Create upload option if music list is empty
        if (musicList.children.length === 0) {
            const uploadItem = document.createElement('li');
            uploadItem.className = 'item active';
            uploadItem.innerHTML = `
                <div class="music-icon">
                    <svg viewBox="0 0 24 24" width="64" height="64">
                        <circle cx="12" cy="12" r="10" fill="transparent"/>
                        <path d="M12,6 L12,14 M8,14 C8,15.1 8.9,16 10,16 C11.1,16 12,15.1 12,14 M16,6 L16,12 C16,13.1 15.1,14 14,14 C12.9,14 12,13.1 12,12" 
                              stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <span>Upload Music</span>
            `;
            musicList.appendChild(uploadItem);
        }
        
        // Add uploaded music
        userMusic.forEach(track => {
            addMusicToUI(track);
        });
    }
    
    // Set up upload functionality
    function setupMusicUpload() {
        // Create a listener for the Upload Music option
        document.addEventListener('click', (e) => {
            const musicItem = e.target.closest('.xmb-items[data-category="music"] .item');
            if (musicItem && musicItem.classList.contains('active') && 
                musicItem.querySelector('span').textContent === 'Upload Music') {
                musicUploadInput.click();
                PS3XMB.playSelectSound();
            }
        });
        
        // Handle file selection
        musicUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                // Create an object URL for the audio
                const audioUrl = URL.createObjectURL(file);
                
                // Add to user music
                const trackId = 'track_' + Date.now();
                const trackItem = {
                    id: trackId,
                    name: file.name,
                    url: audioUrl,
                    timestamp: Date.now()
                };
                
                userMusic.push(trackItem);
                saveMusicToStorage();
                
                // Add to UI
                addMusicToUI(trackItem);
                
                // Show success notification
                PS3XMB.showNotification(`Music "${file.name}" uploaded successfully`);
            }
        });
    }
    
    // Add uploaded music to the UI
    function addMusicToUI(trackItem) {
        const newTrackItem = document.createElement('li');
        newTrackItem.className = 'item';
        newTrackItem.dataset.trackId = trackItem.id;
        
        // Create music icon with custom color based on the track name
        const hue = Math.abs(hashCode(trackItem.name) % 360);
        
        newTrackItem.innerHTML = `
            <div class="music-icon">
                <svg viewBox="0 0 24 24" width="64" height="64">
                    <rect width="24" height="24" rx="2" fill="hsl(${hue}, 70%, 50%)"/>
                    <path d="M12,6 L12,14 M8,14 C8,15.1 8.9,16 10,16 C11.1,16 12,15.1 12,14 M16,6 L16,12 C16,13.1 15.1,14 14,14 C12.9,14 12,13.1 12,12" 
                          stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
            <span>${trackItem.name}</span>
        `;
        
        // Add to the music list
        musicList.appendChild(newTrackItem);
        
        // Add click handler to play the track
        newTrackItem.addEventListener('click', () => {
            if (newTrackItem.classList.contains('active')) {
                playMusic(trackItem);
            }
        });
    }
    
    // Play a selected track
    function playMusic(trackItem) {
        // Check if track needs reupload
        if (trackItem.needsReupload || !trackItem.url) {
            PS3XMB.showNotification(`Cannot play "${trackItem.name}". Please re-upload the file.`);
            return;
        }
        
        const audioPlayer = document.getElementById('audioPlayer');
        const audioTitle = document.getElementById('audioTitle');
        const audioModal = document.getElementById('audioPlayerModal');
        
        // Set the audio source
        audioPlayer.src = trackItem.url;
        
        // Set the audio title
        audioTitle.textContent = trackItem.name;
        
        // Show the modal
        audioModal.style.display = 'block';
        
        // Play the audio
        audioPlayer.play().catch(error => {
            console.log('Audio playback error:', error);
            PS3XMB.showNotification('Failed to play audio');
        });
        
        // Setup visualizer if available
        setupAudioVisualizer(audioPlayer);
        
        PS3XMB.playSelectSound();
    }
    
    // Setup audio visualizer
    function setupAudioVisualizer(audioPlayer) {
        const canvas = document.getElementById('audioCanvas');
        const ctx = canvas.getContext('2d');
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let audioSource = null;
        let analyser = null;
        
        try {
            // Create audio source
            audioSource = audioContext.createMediaElementSource(audioPlayer);
            analyser = audioContext.createAnalyser();
            audioSource.connect(analyser);
            analyser.connect(audioContext.destination);
            
            // Configure analyser
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            // Set canvas width
            canvas.width = canvas.clientWidth;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Visualizer function
            function renderFrame() {
                requestAnimationFrame(renderFrame);
                
                // Get frequency data
                analyser.getByteFrequencyData(dataArray);
                
                // Clear canvas
                ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw visualizer
                const barWidth = (canvas.width / bufferLength) * 2.5;
                let x = 0;
                
                for(let i = 0; i < bufferLength; i++) {
                    const barHeight = dataArray[i] / 2;
                    
                    // Use color based on frequency
                    const hue = i / bufferLength * 360;
                    ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.8)`;
                    
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                    
                    x += barWidth + 1;
                }
            }
            
            renderFrame();
        } catch (error) {
            console.error("Audio visualizer error:", error);
            // Hide canvas if visualization fails
            canvas.style.display = 'none';
        }
    }
    
    // Close the audio player
    function closeAudioPlayer() {
        const audioPlayer = document.getElementById('audioPlayer');
        const audioModal = document.getElementById('audioPlayerModal');
        
        audioPlayer.pause();
        audioModal.style.display = 'none';
    }
    
    // Add event listener for the close button
    document.querySelector('.audio-close-button').addEventListener('click', closeAudioPlayer);
    
    // Handle keyboard controls for audio interaction
    document.addEventListener('keydown', (e) => {
        const audioModal = document.getElementById('audioPlayerModal');
        
        if (audioModal.style.display === 'block') {
            if (e.key === 'Escape' || e.key === 'o' || e.key === 'O') {
                closeAudioPlayer();
                e.preventDefault();
            }
        } else if (document.querySelector('.category.active')?.dataset.category === 'music') {
            if (e.key === 'Enter' || e.key === 'x' || e.key === 'X') {
                const activeItem = document.querySelector('.xmb-items[data-category="music"] .item.active');
                if (activeItem) {
                    if (activeItem.querySelector('span').textContent === 'Upload Music') {
                        musicUploadInput.click();
                        PS3XMB.playSelectSound();
                    } else {
                        const trackId = activeItem.dataset.trackId;
                        const trackItem = userMusic.find(t => t.id === trackId);
                        if (trackItem) {
                            playMusic(trackItem);
                        }
                    }
                    e.preventDefault();
                }
            }
        }
    });
    
    // Load music from localStorage
    function loadMusicFromStorage() {
        const savedMusic = localStorage.getItem('ps3xmb_music');
        return savedMusic ? JSON.parse(savedMusic).map(track => {
            // Don't attempt to use stored URLs, they won't be valid between sessions
            if (track.url && track.url.startsWith('blob:')) {
                track.needsReupload = true;
                track.url = null;
            }
            return track;
        }) : [];
    }
    
    // Save music to localStorage
    function saveMusicToStorage() {
        localStorage.setItem('ps3xmb_music', JSON.stringify(userMusic));
    }
    
    // Simple hash function for generating colors
    function hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }
    
    // Initialize the music functionality
    initializeMusicTab();
    setupMusicUpload();
    
    // Export music functionality to window object
    window.MusicSystem = {
        uploadMusic: () => musicUploadInput.click(),
        playMusic: playMusic,
        closeMusic: closeAudioPlayer,
        getMusicById: (id) => userMusic.find(t => t.id === id),
        deleteFile: (id) => {
            const index = userMusic.findIndex(t => t.id === id);
            if (index !== -1) {
                userMusic.splice(index, 1);
                saveMusicToStorage();
            }
        }
    };
});