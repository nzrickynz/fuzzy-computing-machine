// Auth elements
const authContainer = document.getElementById('auth-container');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');

// Login form elements
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');

// Signup form elements
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const signupConfirmPassword = document.getElementById('signup-confirm-password');

// User menu elements
const userMenuButton = document.getElementById('user-menu-button');
const userMenuDropdown = document.getElementById('user-menu-dropdown');
const userEmailDisplay = document.getElementById('user-email');
const settingsButton = document.getElementById('settings-button');
const logoutButton = document.getElementById('logout-button');

// Settings modal elements
const settingsModal = document.getElementById('settings-modal');
const settingsEmail = document.getElementById('settings-email');
const settingsPassword = document.getElementById('settings-password');
const settingsSave = document.getElementById('settings-save');
const settingsCancel = document.getElementById('settings-cancel');

// Main app elements
const app = document.getElementById('app');
const stashList = document.getElementById('stash-list');
const form = document.querySelector('#stash-form');
const filterList = document.getElementById('filter-list');
const projectList = document.getElementById('project-list');
const resultList = document.getElementById('result-list');
const textarea = document.querySelector('#stash-text');

// Create pill containers
const filterPillContainer = document.createElement('div');
filterPillContainer.className = 'pill-container';
filterList.appendChild(filterPillContainer);

const projectPillContainer = document.createElement('div');
projectPillContainer.className = 'pill-container';
projectList.appendChild(projectPillContainer);

let currentUser = null;
let stashes = [];
const filters = new Map();

// Auth state management
function checkAuth() {
  const user = localStorage.getItem('user');
  if (user) {
    currentUser = JSON.parse(user);
    showApp();
  } else {
    showAuth();
  }
}

function showAuth() {
  authContainer.style.display = 'flex';
  loginForm.style.display = 'block';
  signupForm.style.display = 'none';
  app.style.display = 'none';
  loginForm.reset();
  signupForm.reset();
  loginError.textContent = '';
  loginError.classList.remove('show');
  signupError.textContent = '';
  signupError.classList.remove('show');
}

function showApp() {
  authContainer.style.display = 'none';
  app.style.display = 'grid';
  userEmailDisplay.textContent = currentUser.email;
  loadUserData();
}

// Auth form handling
showSignupLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
  signupForm.reset();
  loginError.textContent = '';
  loginError.classList.remove('show');
  signupError.textContent = '';
  signupError.classList.remove('show');
});

showLoginLink.addEventListener('click', (e) => {
  e.preventDefault();
  signupForm.style.display = 'none';
  loginForm.style.display = 'block';
  loginForm.reset();
  loginError.textContent = '';
  loginError.classList.remove('show');
  signupError.textContent = '';
  signupError.classList.remove('show');
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginEmail.value;
  const password = loginPassword.value;

  // In a real app, this would make an API call to verify credentials
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    currentUser = { email: user.email };
    localStorage.setItem('user', JSON.stringify(currentUser));
    showApp();
  } else {
    loginError.textContent = 'Invalid email or password';
    loginError.classList.add('show');
  }
});

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = signupEmail.value;
  const password = signupPassword.value;
  const confirmPassword = signupConfirmPassword.value;

  // Validate passwords match
  if (password !== confirmPassword) {
    signupError.textContent = 'Passwords do not match';
    signupError.classList.add('show');
    return;
  }

  // Validate password length
  if (password.length < 6) {
    signupError.textContent = 'Password must be at least 6 characters long';
    signupError.classList.add('show');
    return;
  }

  // In a real app, this would make an API call to create the account
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.some(u => u.email === email)) {
    signupError.textContent = 'Email already exists';
    signupError.classList.add('show');
    return;
  }

  // Create new user
  users.push({ email, password });
  localStorage.setItem('users', JSON.stringify(users));
  
  // Log in the new user
  currentUser = { email };
  localStorage.setItem('user', JSON.stringify(currentUser));
  showApp();
});

// User menu handling
userMenuButton.addEventListener('click', () => {
  userMenuDropdown.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!userMenuButton.contains(e.target) && !userMenuDropdown.contains(e.target)) {
    userMenuDropdown.classList.remove('active');
  }
});

settingsButton.addEventListener('click', () => {
  settingsEmail.value = currentUser.email;
  settingsPassword.value = '';
  settingsModal.style.display = 'flex';
  userMenuDropdown.classList.remove('active');
});

settingsCancel.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

settingsSave.addEventListener('click', () => {
  const newEmail = settingsEmail.value;
  const newPassword = settingsPassword.value;

  // In a real app, this would make an API call to update the user
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.email === currentUser.email);
  
  if (userIndex !== -1) {
    users[userIndex].email = newEmail;
    if (newPassword) {
      users[userIndex].password = newPassword;
    }
    localStorage.setItem('users', JSON.stringify(users));
    currentUser.email = newEmail;
    localStorage.setItem('user', JSON.stringify(currentUser));
    userEmailDisplay.textContent = newEmail;
  }

  settingsModal.style.display = 'none';
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('user');
  currentUser = null;
  stashes = [];
  filters.clear();
  showAuth();
});

// Data management
function loadUserData() {
  // In a real app, this would make an API call to load user's stashes
  const userStashes = JSON.parse(localStorage.getItem(`stashes_${currentUser.email}`) || '[]');
  stashes = userStashes;
  filters.clear();
  updateResultList();
}

function saveUserData() {
  // In a real app, this would make an API call to save user's stashes
  localStorage.setItem(`stashes_${currentUser.email}`, JSON.stringify(stashes));
}

// Existing functionality
form.addEventListener('submit', handleFormSubmit);

textarea.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleFormSubmit(event);
  }
});

function handleFormSubmit(event) {
  event.preventDefault();

  const text = textarea.value;
  textarea.value = '';

  const stashHashtags = text.match(/#[\w-]+/g) || [];
  const stashProjects = text.match(/@[\w-]+/g) || [];

  if (stashHashtags.length === 0 && stashProjects.length === 0) {
    const errorMessage = document.getElementById('error-message') || document.createElement('div');
    errorMessage.id = 'error-message';
    errorMessage.classList.add('error-message');
    errorMessage.textContent = 'You must enter at least one #hashtag or @project';
    if (!document.getElementById('error-message')) {
      form.prepend(errorMessage);
    }
    return;
  }

  const errorMessage = document.getElementById('error-message');
  if (errorMessage) {
    errorMessage.textContent = '';
  }

  stashes.push({
    stash: text,
    hashtags: stashHashtags,
    projects: stashProjects,
    timestamp: new Date().toISOString()
  });

  saveUserData();
  updateFilterList(stashHashtags);
  updateProjectsList(stashProjects);
  updateResultList();
}

function updateFilterList(hashtags) {
  hashtags.forEach(hashtag => {
    if (!filters.has(hashtag)) {
      filters.set(hashtag, { selected: false, results: [] });
    }
    const filter = filters.get(hashtag);
    let pill = filterPillContainer.querySelector(`[data-value="${hashtag}"]`);
    if (!pill) {
      pill = document.createElement("div");
      pill.className = "filter-pill";
      pill.setAttribute("data-value", hashtag);
      pill.textContent = hashtag;
      pill.addEventListener("click", () => {
        filter.selected = !filter.selected;
        pill.classList.toggle("active", filter.selected);
        updateResultList();
      });
      filterPillContainer.appendChild(pill);
    } else {
      pill.classList.toggle("active", filter.selected);
    }
  });
}

function updateProjectsList(projects) {
  projects.forEach(project => {
    if (!filters.has(project)) {
      filters.set(project, { selected: false, results: [] });
    }
    const filter = filters.get(project);
    let pill = projectPillContainer.querySelector(`[data-value="${project}"]`);
    if (!pill) {
      pill = document.createElement("div");
      pill.className = "project-pill";
      pill.setAttribute("data-value", project);
      pill.textContent = project;
      pill.addEventListener("click", () => {
        filter.selected = !filter.selected;
        pill.classList.toggle("active", filter.selected);
        updateResultList();
      });
      projectPillContainer.appendChild(pill);
    } else {
      pill.classList.toggle("active", filter.selected);
    }
  });
}

function updateResultList() {
  resultList.innerHTML = "";

  const selectedFilters = [...filters.keys()]
    .filter(filterName => filters.get(filterName).selected);

  stashes.forEach((stash, index) => {
    if (selectedFilters.length === 0 || 
        selectedFilters.every(filterName => stash.hashtags.concat(stash.projects).includes(filterName))) {
      const resultEl = document.createElement("div");
      resultEl.classList.add("stash-item");
      if (stash.used) {
        resultEl.classList.add("used");
      }
      
      const contentWrapper = document.createElement("div");
      contentWrapper.classList.add("stash-content");
      
      const stashText = document.createElement("div");
      stashText.classList.add("stash-text");
      
      // Process the text to add pill styling
      let processedText = stash.stash;
      
      // Style hashtags
      processedText = processedText.replace(/#[\w-]+/g, match => 
        `<span class="hashtag">${match}</span>`
      );
      
      // Style projects
      processedText = processedText.replace(/@[\w-]+/g, match => 
        `<span class="project">${match}</span>`
      );
      
      stashText.innerHTML = processedText;
      
      const timestamp = document.createElement("div");
      const date = new Date(stash.timestamp);
      timestamp.textContent = date.toLocaleString();
      timestamp.classList.add("stash-timestamp");
      
      contentWrapper.appendChild(stashText);
      contentWrapper.appendChild(timestamp);
      
      if (stash.used) {
        const usedTimestamp = document.createElement("div");
        usedTimestamp.textContent = `Drop used: ${new Date(stash.usedTimestamp).toLocaleString()}`;
        usedTimestamp.classList.add("used-timestamp");
        contentWrapper.appendChild(usedTimestamp);
      }
      
      const useButton = document.createElement("button");
      useButton.classList.add("use-button");
      if (stash.used) {
        useButton.disabled = true;
      }
      useButton.addEventListener("click", () => {
        if (!stash.used) {
          stash.used = true;
          stash.usedTimestamp = new Date().toISOString();
          resultEl.classList.add("used");
          useButton.disabled = true;
          updateResultList(); // Refresh the list to show the used timestamp
        }
      });
      
      resultEl.appendChild(contentWrapper);
      resultEl.appendChild(useButton);
      resultList.appendChild(resultEl);
    }
  });
}

// Initialize
checkAuth();
  
