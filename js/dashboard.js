// Check if user is logged in
function checkAuth() {
  const user = localStorage.getItem('user');
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  return JSON.parse(user);
}

// Initialize user data
const currentUser = checkAuth();
if (!currentUser) return;

// Setup user menu
const userEmailDisplay = document.getElementById('user-email');
const userMenuButton = document.getElementById('user-menu-button');
const userMenuDropdown = document.getElementById('user-menu-dropdown');
const settingsButton = document.getElementById('settings-button');
const logoutButton = document.getElementById('logout-button');

userEmailDisplay.textContent = currentUser.email;

userMenuButton.addEventListener('click', () => {
  userMenuDropdown.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!userMenuButton.contains(e.target) && !userMenuDropdown.contains(e.target)) {
    userMenuDropdown.classList.remove('active');
  }
});

settingsButton.addEventListener('click', () => {
  window.location.href = 'settings.html';
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('user');
  window.location.href = 'login.html';
});

// Initialize app elements
const form = document.querySelector('#stash-form');
const textarea = document.querySelector('#stash-text');
const resultList = document.getElementById('result-list');
const filterList = document.getElementById('filters');
const projectList = document.getElementById('projects');

// Create pill containers
const filterPillContainer = document.createElement('div');
filterPillContainer.className = 'pill-container';
filterList.appendChild(filterPillContainer);

const projectPillContainer = document.createElement('div');
projectPillContainer.className = 'pill-container';
projectList.appendChild(projectPillContainer);

let stashes = [];
const filters = new Map();

// Load user data
function loadUserData() {
  const userStashes = JSON.parse(localStorage.getItem(`stashes_${currentUser.email}`) || '[]');
  stashes = userStashes;
  filters.clear();
  updateResultList();
}

function saveUserData() {
  localStorage.setItem(`stashes_${currentUser.email}`, JSON.stringify(stashes));
}

// Handle form submission
form.addEventListener('submit', handleFormSubmit);

// Add return key handling
textarea.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    form.dispatchEvent(new Event('submit'));
  }
});

function handleFormSubmit(event) {
  event.preventDefault();
  const text = textarea.value.trim();
  
  if (!text) return;

  const stashHashtags = text.match(/#[\w-]+/g) || [];
  const stashProjects = text.match(/@[\w-]+/g) || [];

  if (stashHashtags.length === 0 && stashProjects.length === 0) {
    const errorMessage = document.getElementById('error-message') || document.createElement('div');
    errorMessage.id = 'error-message';
    errorMessage.textContent = 'You must enter at least one #hashtag or @project';
    if (!document.getElementById('error-message')) {
      form.prepend(errorMessage);
    }
    return;
  }

  const errorMessage = document.getElementById('error-message');
  if (errorMessage) {
    errorMessage.remove();
  }

  const newStash = {
    id: Date.now(),
    stash: text,
    hashtags: stashHashtags,
    projects: stashProjects,
    timestamp: new Date().toISOString(),
    used: false
  };

  stashes.unshift(newStash); // Add to beginning of array
  saveUserData();
  
  // Clear textarea
  textarea.value = '';
  
  // Update UI
  updateFilterList(stashHashtags);
  updateProjectsList(stashProjects);
  updateResultList();
}

// Update UI elements
function updateFilterList(hashtags) {
  if (!Array.isArray(hashtags)) return;
  
  hashtags.forEach(hashtag => {
    if (!filters.has(hashtag)) {
      filters.set(hashtag, { selected: false });
      
      const pill = document.createElement('div');
      pill.className = 'filter-pill';
      pill.textContent = hashtag;
      pill.addEventListener('click', () => {
        const filter = filters.get(hashtag);
        filter.selected = !filter.selected;
        pill.classList.toggle('active', filter.selected);
        updateResultList();
      });
      
      filterPillContainer.appendChild(pill);
    }
  });
}

function updateProjectsList(projects) {
  if (!Array.isArray(projects)) return;
  
  projects.forEach(project => {
    if (!filters.has(project)) {
      filters.set(project, { selected: false });
      
      const pill = document.createElement('div');
      pill.className = 'project-pill';
      pill.textContent = project;
      pill.addEventListener('click', () => {
        const filter = filters.get(project);
        filter.selected = !filter.selected;
        pill.classList.toggle('active', filter.selected);
        updateResultList();
      });
      
      projectPillContainer.appendChild(pill);
    }
  });
}

function updateResultList() {
  resultList.innerHTML = '';
  
  const selectedFilters = Array.from(filters.entries())
    .filter(([_, filter]) => filter.selected)
    .map(([name]) => name);

  stashes.forEach(stash => {
    const matchesFilters = selectedFilters.length === 0 || 
      selectedFilters.every(filter => 
        stash.hashtags.includes(filter) || stash.projects.includes(filter)
      );

    if (matchesFilters) {
      const resultEl = document.createElement('div');
      resultEl.className = 'stash-item';
      if (stash.used) {
        resultEl.classList.add('used');
      }

      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'stash-content';

      const stashText = document.createElement('div');
      stashText.className = 'stash-text';
      
      // Process text to highlight hashtags and projects
      let processedText = stash.stash
        .replace(/#[\w-]+/g, match => `<span class="hashtag">${match}</span>`)
        .replace(/@[\w-]+/g, match => `<span class="project">${match}</span>`);
      
      stashText.innerHTML = processedText;

      const timestamp = document.createElement('div');
      timestamp.className = 'stash-timestamp';
      timestamp.textContent = new Date(stash.timestamp).toLocaleString();

      contentWrapper.appendChild(stashText);
      contentWrapper.appendChild(timestamp);

      const useButton = document.createElement('button');
      useButton.className = 'use-button';
      useButton.disabled = stash.used;

      useButton.addEventListener('click', () => {
        if (!stash.used) {
          stash.used = true;
          stash.usedTimestamp = new Date().toISOString();
          resultEl.classList.add('used');
          useButton.disabled = true;
          saveUserData();
        }
      });

      resultEl.appendChild(contentWrapper);
      resultEl.appendChild(useButton);
      resultList.appendChild(resultEl);
    }
  });
}

// Initialize the app
loadUserData(); 