document.addEventListener('DOMContentLoaded', () => {
    // Local storage for uploaded photos
    let userPhotos = loadPhotosFromStorage();
    
    // Initialize elements
    const photosList = document.querySelector('.xmb-items[data-category="photos"]');
    const photoUploadInput = document.createElement('input');
    photoUploadInput.type = 'file';
    photoUploadInput.id = 'photoUpload';
    photoUploadInput.accept = 'image/*';
    photoUploadInput.style.display = 'none';
    document.body.appendChild(photoUploadInput);
    
    // Create photo viewer modal
    const photoModal = document.createElement('div');
    photoModal.id = 'photoViewerModal';
    photoModal.className = 'video-modal'; 
    photoModal.innerHTML = `
        <div class="video-modal-content">
            <div class="video-modal-header">
                <h2 id="photoTitle">Photo Title</h2>
                <span class="photo-close-button close-button">&times;</span>
            </div>
            <div class="photo-viewer-container" style="padding: 20px; text-align: center;">
                <img id="photoViewer" style="max-width: 100%; max-height: 70vh; border-radius: 5px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);">
            </div>
        </div>
    `;
    document.body.appendChild(photoModal);
    
    // Initialize upload option in photos tab
    function initializePhotosTab() {
        if (photosList.children.length === 0) {
            const uploadItem = document.createElement('li');
            uploadItem.className = 'item active';
            uploadItem.innerHTML = `
                <div class="photo-icon">
                    <svg viewBox="0 0 24 24" width="64" height="64">
                        <circle cx="12" cy="12" r="10" fill="transparent"/>
                        <path d="M12,7 L12,15 M9,13 L12,16 L15,13 M7,19 L17,19 L17,12 L7,12 Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <span>Upload Photo</span>
            `;
            photosList.appendChild(uploadItem);
        }
        
        userPhotos.forEach(photo => {
            addPhotoToUI(photo);
        });
    }
    
    function setupPhotoUpload() {
        document.addEventListener('click', (e) => {
            const photoItem = e.target.closest('.xmb-items[data-category="photos"] .item');
            if (photoItem && photoItem.classList.contains('active') && 
                photoItem.querySelector('span').textContent === 'Upload Photo') {
                photoUploadInput.click();
                PS3XMB.playSelectSound();
            }
        });
        
        photoUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const photoId = 'photo_' + Date.now();
                    const photoItem = {
                        id: photoId,
                        name: file.name,
                        url: e.target.result, 
                        timestamp: Date.now()
                    };
                    
                    userPhotos.push(photoItem);
                    savePhotosToStorage();
                    
                    addPhotoToUI(photoItem);
                    
                    PS3XMB.showNotification(`Photo "${file.name}" uploaded successfully`);
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    function addPhotoToUI(photoItem) {
        const newPhotoItem = document.createElement('li');
        newPhotoItem.className = 'item';
        newPhotoItem.dataset.photoId = photoItem.id;
        
        const hue = Math.abs(hashCode(photoItem.name) % 360);
        
        newPhotoItem.innerHTML = `
            <div class="photo-icon">
                <svg viewBox="0 0 24 24" width="64" height="64">
                    <rect width="24" height="24" rx="2" fill="hsl(${hue}, 70%, 50%)"/>
                    <path d="M4,8 L20,8 L20,18 L4,18 Z M7,5 L17,5 L17,8 M12,10 L12,16 M9,13 L15,13" stroke="white" stroke-width="0.5" stroke-linecap="round" fill="none"/>
                    <circle cx="12" cy="13" r="4" fill="white" opacity="0.7"/>
                </svg>
            </div>
            <span>${photoItem.name}</span>
        `;
        
        photosList.appendChild(newPhotoItem);
        
        newPhotoItem.addEventListener('click', () => {
            if (newPhotoItem.classList.contains('active')) {
                viewPhoto(photoItem);
            }
        });
    }
    
    function viewPhoto(photoItem) {
        if (photoItem.needsReupload || !photoItem.url) {
            PS3XMB.showNotification(`Cannot view "${photoItem.name}". Please re-upload the file.`);
            return;
        }
        
        const photoViewer = document.getElementById('photoViewer');
        const photoTitle = document.getElementById('photoTitle');
        const photoModal = document.getElementById('photoViewerModal');
        
        photoViewer.src = photoItem.url;
        
        photoTitle.textContent = photoItem.name;
        
        photoModal.style.display = 'block';
        
        PS3XMB.playSelectSound();
    }
    
    function closePhotoViewer() {
        const photoModal = document.getElementById('photoViewerModal');
        photoModal.style.display = 'none';
    }
    
    document.querySelector('.photo-close-button').addEventListener('click', closePhotoViewer);
    
    document.addEventListener('keydown', (e) => {
        const photoModal = document.getElementById('photoViewerModal');
        
        if (photoModal.style.display === 'block') {
            if (e.key === 'Escape' || e.key === 'o' || e.key === 'O') {
                closePhotoViewer();
                e.preventDefault();
            }
        } else if (document.querySelector('.category.active')?.dataset.category === 'photos') {
            if (e.key === 'Enter' || e.key === 'x' || e.key === 'X') {
                const activeItem = document.querySelector('.xmb-items[data-category="photos"] .item.active');
                if (activeItem) {
                    if (activeItem.querySelector('span').textContent === 'Upload Photo') {
                        photoUploadInput.click();
                        PS3XMB.playSelectSound();
                    } else {
                        const photoId = activeItem.dataset.photoId;
                        const photoItem = userPhotos.find(p => p.id === photoId);
                        if (photoItem) {
                            viewPhoto(photoItem);
                        }
                    }
                    e.preventDefault();
                }
            }
        }
    });
    
    function loadPhotosFromStorage() {
        const savedPhotos = localStorage.getItem('ps3xmb_photos');
        return savedPhotos ? JSON.parse(savedPhotos).map(photo => {
            if (photo.url && photo.url.startsWith('blob:')) {
                photo.needsReupload = true;
                photo.url = null;
            }
            return photo;
        }) : [];
    }
    
    function savePhotosToStorage() {
        localStorage.setItem('ps3xmb_photos', JSON.stringify(userPhotos));
    }
    
    function hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }
    
    initializePhotosTab();
    setupPhotoUpload();
    
    window.PhotoSystem = {
        uploadPhoto: () => photoUploadInput.click(),
        viewPhoto: viewPhoto,
        closePhoto: closePhotoViewer,
        getPhotoById: (id) => userPhotos.find(p => p.id === id),
        deleteFile: (id) => {
            const index = userPhotos.findIndex(p => p.id === id);
            if (index !== -1) {
                userPhotos.splice(index, 1);
                savePhotosToStorage();
            }
        }
    };
});