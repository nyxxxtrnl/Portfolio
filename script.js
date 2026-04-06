const faders = document.querySelectorAll('.fade-in');
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('section');

// Project counter for new projects
let projectCounter = 2;

function normalizeUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : 'https://' + trimmed;
}

function normalizeDemoUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('youtube.com/watch')) {
    const match = trimmed.match(/[?&]v=([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : trimmed;
  }
  if (trimmed.includes('youtu.be/')) {
    const id = trimmed.split('youtu.be/')[1].split(/[?&]/)[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  return trimmed;
}

// Add new project dynamically
function addNewProject() {
  projectCounter++;
  const container = document.getElementById('projectsContainer');
  
  const newProject = document.createElement('div');
  newProject.className = 'card';
  newProject.innerHTML = `
    <h3>Project ${projectCounter}</h3>
    <input type="text" class="project-title-input" placeholder="Enter project title" value="Project ${projectCounter}">
    <textarea class="project-desc-input" placeholder="Enter project description" rows="3">Short description</textarea>
    <div class="project-actions">
      <input type="text" class="project-link-input" placeholder="Enter live system URL">
      <input type="text" class="project-demo-input" placeholder="Enter demo video URL">
      <input type="text" class="project-doc-input" placeholder="Enter documentation file path">
      <button class="save-project-btn" onclick="saveProject(this)">Save</button>
      <button class="delete-project-btn" onclick="deleteProject(this)">Delete</button>
    </div>
  `;
  
  container.appendChild(newProject);
  
  // Save to localStorage
  saveProjectsToStorage();
}

// Save project changes
function saveProject(button) {
  const projectCard = button.closest('.card');
  const titleInput = projectCard.querySelector('.project-title-input');
  const descInput = projectCard.querySelector('.project-desc-input');
  const linkInput = projectCard.querySelector('.project-link-input');
  const demoInput = projectCard.querySelector('.project-demo-input');
  const docInput = projectCard.querySelector('.project-doc-input');
  
  if (!titleInput.value) {
    alert('Please enter a project title');
    return;
  }
  
  if (!linkInput.value) {
    alert('Please enter the live system URL (e.g., "your-live-site.com)');
    return;
  }
  
  const existingId = projectCard.dataset.projectId || projectCard.querySelector('a[href*="projectTemplate.html"]')?.getAttribute('href')?.match(/id=(.+?)(?:$|&)/)?.[1];
  const projectId = existingId || 'project_' + Date.now();
  const liveLink = normalizeUrl(linkInput.value);
  const demoLink = normalizeDemoUrl(demoInput.value);
  const docLink = docInput.value.trim();
  
  // Remove input fields and create view mode
  projectCard.innerHTML = `
    <h3>${titleInput.value}</h3>
    <p>${descInput.value}</p>
    <a href="projectTemplate.html?id=${projectId}" target="_blank" class="btn">View</a>
    <button class="edit-project-btn" onclick="editProject(this)">Edit</button>
    <button class="delete-project-btn" onclick="deleteProject(this)">Delete</button>
  `;
  projectCard.dataset.projectId = projectId;
  
  // Store or update project data
  const allProjects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
  const existingIndex = allProjects.findIndex(p => p.id === projectId);
  const projectData = {
    id: projectId,
    title: titleInput.value,
    description: descInput.value,
    liveLink: liveLink,
    demoLink: demoLink,
    docLink: docLink
  };
  
  if (existingIndex >= 0) {
    allProjects[existingIndex] = projectData;
  } else {
    allProjects.push(projectData);
  }
  localStorage.setItem('portfolioProjects', JSON.stringify(allProjects));
  
  saveProjectsToStorage();
}

// Edit project
function editProject(button) {
  const projectCard = button.closest('.card');
  const h3 = projectCard.querySelector('h3');
  const p = projectCard.querySelector('p');
  const viewLink = projectCard.querySelector('a[href*="projectTemplate.html"]');
  
  const href = viewLink?.getAttribute('href');
  const projectId = projectCard.dataset.projectId || href?.match(/id=(.+?)(?:$|&)/)?.[1];
  
  const allProjects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
  const projectData = allProjects.find(proj => proj.id === projectId) || {};
  
  projectCard.innerHTML = `
    <h3>${h3.textContent}</h3>
    <input type="text" class="project-title-input" placeholder="Enter project title" value="${h3.textContent}">
    <textarea class="project-desc-input" placeholder="Enter project description" rows="3">${p.textContent}</textarea>
    <div class="project-actions">
      <input type="text" class="project-link-input" placeholder="Enter live system URL" value="${projectData.liveLink || ''}">
      <input type="text" class="project-demo-input" placeholder="Enter demo video URL" value="${projectData.demoLink || ''}">
      <input type="text" class="project-doc-input" placeholder="Enter documentation file path" value="${projectData.docLink || ''}">
      <button class="save-project-btn" onclick="saveProject(this)">Save</button>
      <button class="cancel-project-btn" onclick="cancelEdit(this)">Cancel</button>
    </div>
  `;
  if (projectId) {
    projectCard.dataset.projectId = projectId;
  }
}

// Cancel edit
function cancelEdit(button) {
  location.reload();
}

// Delete project
function deleteProject(button) {
  if (confirm('Are you sure you want to delete this project?')) {
    button.closest('.card').remove();
    saveProjectsToStorage();
  }
}

// Save projects to localStorage
function saveProjectsToStorage() {
  const container = document.getElementById('projectsContainer');
  const savedProjects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
  const projects = [];
  
  container.querySelectorAll('.card').forEach(card => {
    const h3 = card.querySelector('h3');
    const p = card.querySelector('p');
    const link = card.querySelector('a[href*="projectTemplate.html"]');
    const projectId = card.dataset.projectId || link?.getAttribute('href')?.match(/id=(.+?)(?:$|&)/)?.[1];
    
    if (projectId) {
      const existingProject = savedProjects.find(proj => proj.id === projectId);
      if (existingProject) {
        projects.push(existingProject);
      } else if (h3 && p) {
        projects.push({
          id: projectId,
          title: h3.textContent,
          description: p.textContent,
          liveLink: 'https://your-live-site.com',
          demoLink: 'https://www.youtube.com/embed/YxcTBB6_bws?si=v74rIPLfb45vGMN4',
          docLink: 'docs/project.pdf'
        });
      }
    }
  });
  
  localStorage.setItem('portfolioProjects', JSON.stringify(projects));
}

// Load projects from localStorage
function loadProjectsFromStorage() {
  const saved = localStorage.getItem('portfolioProjects');
  if (saved) {
    const projects = JSON.parse(saved);
    const container = document.getElementById('projectsContainer');
    container.innerHTML = '';
    
    projects.forEach((project, index) => {
      const projectCard = document.createElement('div');
      projectCard.className = 'card';
      projectCard.dataset.projectId = project.id;
      projectCard.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <a href="projectTemplate.html?id=${project.id}" target="_blank" class="btn">View</a>
        <button class="edit-project-btn" onclick="editProject(this)">Edit</button>
        <button class="delete-project-btn" onclick="deleteProject(this)">Delete</button>
      `;
      container.appendChild(projectCard);
      projectCounter = Math.max(projectCounter, index + 1);
    });
  }
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        sections.forEach(sec => sec.style.display = 'none');
        document.getElementById(targetId).style.display = 'block';
        window.scrollTo(0, 0);
    });
});

window.addEventListener('scroll', () => {
    faders.forEach(el => {
        const top = el.getBoundingClientRect().top;

        if (top < window.innerHeight - 100) {
            el.classList.add('show');
        }
    });

    let current = '';
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Load projects when page loads
window.addEventListener('DOMContentLoaded', loadProjectsFromStorage);