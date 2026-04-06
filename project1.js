// Load project data from localStorage for Project 1
function loadProjectData() {
  const allProjects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
  // Find project with title containing "Project 1" or similar
  const projectData = allProjects.find(p => 
    p.title && (p.title.toLowerCase().includes('project 1') || p.title.toLowerCase().includes('project1'))
  ) || {
    title: 'Project 1',
    description: 'Project description',
    liveLink: 'https://raketero.vercel.app',
    demoLink: 'https://www.youtube.com/embed/4KXI9yYKex0?si=S1v6HGFIvt911Xkc',
    docLink: 'DIREKTA AYUDA APPLICATION FORM.pdf'
  };

  // Update page with project data
  document.getElementById('projectTitle').textContent = projectData.title;
  document.title = projectData.title;
  
  // Handle Live System Link
  const liveSystemLink = document.getElementById('liveSystemLink');
  const liveCard = liveSystemLink.closest('.card');
  
  const liveLink = projectData.liveLink && projectData.liveLink.trim() !== ''
    ? projectData.liveLink.trim()
    : 'https://raketero.vercel.app/';
  liveSystemLink.href = liveLink;
  liveSystemLink.style.display = 'inline-block';
  const notAddedMsg = liveCard.querySelector('p[style*="color: #ccc"]');
  if (notAddedMsg) notAddedMsg.remove();
  
  // Handle Demo Video
  const demoFrame = document.getElementById('demoFrame');
  if (projectData.demoLink && projectData.demoLink.trim() !== '') {
    demoFrame.src = projectData.demoLink;
  } else {
    // Reset to default if no demo link provided
    demoFrame.src = 'https://www.youtube.com/embed/4KXI9yYKex0?si=S1v6HGFIvt911Xkc';
  }
  
  // Handle Documentation Link
  const docLink = document.getElementById('docLink');
  const docUrl = projectData.docLink && projectData.docLink.trim() !== ''
    ? projectData.docLink.trim()
    : 'Requirements.pdf';
  docLink.href = docUrl;
  docLink.style.display = 'inline-block';
}


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
  sessionStorage.setItem('project1_screenshot_' + timestamp, imageData);
}

// Delete image from grid
function deleteImage(elementId) {
  const element = document.getElementById(elementId);
  const timestampMatch = elementId.match(/screenshot-(\d+)/);
  if (timestampMatch) {
    const key = 'project1_screenshot_' + timestampMatch[1];
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  }
  if (element) {
    element.remove();
  }
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
    if (key && key.startsWith('project1_screenshot_')) {
      screenshotKeys.push(key);
    }
  }
  
  // Sort by timestamp to maintain order
  screenshotKeys.sort();
  
  screenshotKeys.forEach(key => {
    const imageData = localStorage.getItem(key);
    const timestamp = key.replace('project1_screenshot_', '');
    
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
    if (key && key.startsWith('project1_screenshot_')) {
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
      localStorage.setItem('project1_screenshot_' + timestamp, imageSrc);
    }
  });

  // Clear session storage after saving
  const keysToDeleteSession = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith('project1_screenshot_')) {
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
  // Load project data
  loadProjectData();

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
