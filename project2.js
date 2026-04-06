// Tab switching functionality
function setupTabs() {
  const tabLinks = document.querySelectorAll('.tab-link');
  const tabContents = document.querySelectorAll('.tab-content');

  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Remove active class from all tabs
      tabLinks.forEach(tab => tab.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked tab
      link.classList.add('active');
      const targetId = link.getAttribute('href').slice(1);
      document.getElementById(targetId).classList.add('active');
    });
  });
}

// Add image to grid
function addImageToGrid(imageData) {
  const grid = document.getElementById('screenshotsGrid');
  const timestamp = Date.now();
  
  const screenshotItem = document.createElement('div');
  screenshotItem.className = 'screenshot-item';
  screenshotItem.id = 'screenshot-' + timestamp;
  screenshotItem.innerHTML = `
    <div class="image-container">
      <img src="${imageData}" alt="Screenshot" class="screenshot-image">
      <button class="delete-btn" onclick="deleteImage('screenshot-${timestamp}')">🗑️ Delete</button>
    </div>
  `;
  
  grid.appendChild(screenshotItem);
  
  // Store temporarily in session storage
  sessionStorage.setItem('project2_screenshot_' + timestamp, imageData);
}

// Delete image from grid
function deleteImage(elementId) {
  const element = document.getElementById(elementId);
  const timestampMatch = elementId.match(/screenshot-(\d+)/);
  if (timestampMatch) {
    sessionStorage.removeItem('project2_screenshot_' + timestampMatch[1]);
  }
  element.remove();
}

// Setup upload functionality
function setupImageUpload() {
  const uploadInput = document.getElementById('uploadInput');
  const saveSection = document.getElementById('saveSectionBtn');

  uploadInput.addEventListener('change', function(event) {
    const files = event.target.files;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
          addImageToGrid(e.target.result);
          // Show save button when images are uploaded
          saveSection.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    }
    
    // Reset input for next upload
    uploadInput.value = '';
  });
}

// Load saved images from localStorage
function loadSavedImages() {
  const grid = document.getElementById('screenshotsGrid');
  const allItems = localStorage;
  
  const screenshotKeys = [];
  for (let i = 0; i < allItems.length; i++) {
    const key = allItems.key(i);
    if (key && key.startsWith('project2_screenshot_')) {
      screenshotKeys.push(key);
    }
  }
  
  // Sort by timestamp to maintain order
  screenshotKeys.sort();
  
  screenshotKeys.forEach(key => {
    const imageData = localStorage.getItem(key);
    const timestamp = key.replace('project2_screenshot_', '');
    
    const screenshotItem = document.createElement('div');
    screenshotItem.className = 'screenshot-item';
    screenshotItem.id = 'screenshot-' + timestamp;
    screenshotItem.innerHTML = `
      <div class="image-container">
        <img src="${imageData}" alt="Screenshot" class="screenshot-image">
        <button class="delete-btn" onclick="deleteImage('screenshot-${timestamp}')">🗑️ Delete</button>
      </div>
    `;
    
    grid.appendChild(screenshotItem);
  });
}

// Save current images to localStorage
function saveImages() {
  const grid = document.getElementById('screenshotsGrid');
  const items = grid.querySelectorAll('.screenshot-item');
  
  // Clear all existing screenshots in localStorage
  const keysToDelete = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('project2_screenshot_')) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach(key => localStorage.removeItem(key));
  
  // Save new screenshots
  items.forEach(item => {
    const img = item.querySelector('img');
    const timestamp = item.id.replace('screenshot-', '');
    const imageSrc = img.src;
    
    if (imageSrc.startsWith('data:')) {
      localStorage.setItem('project2_screenshot_' + timestamp, imageSrc);
    }
  });

  // Clear session storage after saving
  const keysToDeleteSession = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith('project2_screenshot_')) {
      keysToDeleteSession.push(key);
    }
  }
  keysToDeleteSession.forEach(key => sessionStorage.removeItem(key));

  // Show success message
  alert('Images saved successfully!');
  
  // Refresh the page to show saved images only
  setTimeout(() => {
    location.reload();
  }, 500);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Setup tabs
  setupTabs();

  // Setup upload functionality
  setupImageUpload();

  // Load saved images on page load
  loadSavedImages();

  // Setup save button
  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveImages);
  }
});