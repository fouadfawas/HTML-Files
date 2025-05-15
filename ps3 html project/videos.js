document.addEventListener('DOMContentLoaded', () => {
    // Local storage for uploaded videos
    let userVideos = loadVideosFromStorage();
    
    // Initialize any required elements
    const videosList = document.querySelector('.xmb-items[data-category="videos"]');
    // Clear existing items first
    videosList.innerHTML = '';
    
    const videoUploadInput = document.getElementById('videoUpload');
    const videoModal = document.getElementById('videoPlayerModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoTitle = document.getElementById('videoTitle');
    const closeButton = document.querySelector('.close-button');
    
    // Event listeners for video interactions
    document.addEventListener('keydown', handleVideoKeyPress);
    
    // Set up upload functionality
    function setupVideoUpload() {
        // Create a listener for the Upload Video option
        const uploadItem = document.createElement('li');
        uploadItem.className = 'item active';
        uploadItem.innerHTML = `
            <div class="video-icon">
                <svg viewBox="0 0 24 24" width="64" height="64">
                    <circle cx="12" cy="12" r="10" fill="transparent"/>
                    <path d="M10,8 L16,12 L10,16 Z" fill="#ffffff"/>
                    <path d="M12,20 L12,21 M12,3 L12,4 M12,4 L12,20" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.6" fill="none"/>
                </svg>
            </div>
            <span>Upload Video</span>
        `;
        videosList.appendChild(uploadItem);
        
        uploadItem.addEventListener('click', () => {
            videoUploadInput.click();
            PS3XMB.playSelectSound();
        });
        
        // Handle file selection
        videoUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                // Create an object URL for the video
                const videoUrl = URL.createObjectURL(file);
                
                // Add to user videos
                const videoId = 'video_' + Date.now();
                const videoItem = {
                    id: videoId,
                    name: file.name,
                    url: videoUrl,
                    timestamp: Date.now()
                };
                
                userVideos.push(videoItem);
                saveVideosToStorage();
                
                // Add to UI
                addVideoToUI(videoItem);
                
                // Show success notification
                PS3XMB.showNotification(`Video "${file.name}" uploaded successfully`);
            }
        });
    }
    
    // Add uploaded videos to the UI
    function addVideoToUI(videoItem) {
        const newVideoItem = document.createElement('li');
        newVideoItem.className = 'item';
        newVideoItem.dataset.videoId = videoItem.id;
        
        // Create video icon with custom color based on the video name
        const hue = Math.abs(hashCode(videoItem.name) % 360);
        
        newVideoItem.innerHTML = `
            <div class="video-icon">
                <svg viewBox="0 0 24 24" width="64" height="64">
                    <rect width="24" height="24" rx="2" fill="hsl(${hue}, 70%, 50%)"/>
                    <path d="M10,8 L16,12 L10,16 Z" fill="white"/>
                </svg>
            </div>
            <span>${videoItem.name}</span>
        `;
        
        // Add to the videos list after the upload option
        videosList.appendChild(newVideoItem);
        
        // Add click handler to play the video
        newVideoItem.addEventListener('click', () => {
            if (newVideoItem.classList.contains('active')) {
                playVideo(videoItem);
            }
        });
    }
    
    // Play a selected video
    function playVideo(videoItem) {
        // Check if video needs reupload
        if (videoItem.needsReupload || !videoItem.url) {
            PS3XMB.showNotification(`Cannot play "${videoItem.name}". Please re-upload the file.`);
            return;
        }
        
        // Set the video source
        videoPlayer.src = videoItem.url;
        
        // Set the video title
        videoTitle.textContent = videoItem.name;
        
        // Show the modal
        videoModal.style.display = 'block';
        
        // Play the video
        videoPlayer.play().catch(error => {
            console.log('Video playback error:', error);
            PS3XMB.showNotification('Failed to play video');
        });
        
        PS3XMB.playSelectSound();
    }
    
    // Close the video player
    function closeVideoPlayer() {
        videoPlayer.pause();
        videoModal.style.display = 'none';
    }
    
    // Add event listener for the close button
    if (closeButton) {
        closeButton.addEventListener('click', closeVideoPlayer);
    }
    
    // Handle keyboard controls for video interaction
    function handleVideoKeyPress(e) {
        if (videoModal.style.display === 'block') {
            if (e.key === 'Escape' || e.key === 'o' || e.key === 'O') {
                closeVideoPlayer();
                e.preventDefault();
            }
        } else if (document.querySelector('.category.active').dataset.category === 'videos') {
            if (e.key === 'Enter' || e.key === 'x' || e.key === 'X') {
                const activeItem = document.querySelector('.xmb-items[data-category="videos"] .item.active');
                if (activeItem) {
                    if (activeItem.querySelector('span').textContent === 'Upload Video') {
                        videoUploadInput.click();
                        PS3XMB.playSelectSound();
                    } else {
                        const videoId = activeItem.dataset.videoId;
                        const videoItem = userVideos.find(v => v.id === videoId);
                        if (videoItem) {
                            playVideo(videoItem);
                        }
                    }
                    e.preventDefault();
                }
            }
        }
    }
    
    // Load videos from localStorage
    function loadVideosFromStorage() {
        const savedVideos = localStorage.getItem('ps3xmb_videos');
        return savedVideos ? JSON.parse(savedVideos).map(video => {
            // Don't attempt to use stored URLs, they won't be valid between sessions
            if (video.url && video.url.startsWith('blob:')) {
                video.needsReupload = true;
                video.url = null;
            }
            return video;
        }) : [];
    }
    
    // Save videos to localStorage
    function saveVideosToStorage() {
        localStorage.setItem('ps3xmb_videos', JSON.stringify(userVideos));
    }
    
    // Initialize uploaded videos from storage
    function initializeVideos() {
        userVideos.forEach(video => {
            addVideoToUI(video);
        });
    }
    
    // Simple hash function for generating colors
    function hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }
    
    // Initialize the video functionality
    setupVideoUpload();
    initializeVideos();
    
    // Export video functionality to window object
    window.VideoSystem = {
        uploadVideo: () => videoUploadInput.click(),
        playVideo: playVideo,
        closeVideo: closeVideoPlayer,
        getVideoById: (id) => userVideos.find(v => v.id === id),
        deleteFile: (id) => {
            const index = userVideos.findIndex(v => v.id === id);
            if (index !== -1) {
                userVideos.splice(index, 1);
                saveVideosToStorage();
            }
        }
    };
});