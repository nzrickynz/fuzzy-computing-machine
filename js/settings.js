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

// Initialize form elements
const settingsEmail = document.getElementById('settings-email');
const settingsPassword = document.getElementById('settings-password');
const settingsSave = document.getElementById('settings-save');
const settingsCancel = document.getElementById('settings-cancel');
const settingsError = document.getElementById('settings-error');

// Load current user data
settingsEmail.value = currentUser.email;

// Handle save button click
settingsSave.addEventListener('click', () => {
  const newEmail = settingsEmail.value;
  const newPassword = settingsPassword.value;

  // Validate email
  if (!newEmail) {
    settingsError.textContent = 'Email is required';
    settingsError.classList.add('show');
    return;
  }

  // In a real app, this would make an API call to update the user
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.email === currentUser.email);
  
  if (userIndex !== -1) {
    // Check if new email already exists (if changed)
    if (newEmail !== currentUser.email && users.some(u => u.email === newEmail)) {
      settingsError.textContent = 'Email already exists';
      settingsError.classList.add('show');
      return;
    }

    // Update user data
    users[userIndex].email = newEmail;
    if (newPassword) {
      if (newPassword.length < 6) {
        settingsError.textContent = 'Password must be at least 6 characters long';
        settingsError.classList.add('show');
        return;
      }
      users[userIndex].password = newPassword;
    }

    // Save changes
    localStorage.setItem('users', JSON.stringify(users));
    currentUser.email = newEmail;
    localStorage.setItem('user', JSON.stringify(currentUser));

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
  }
});

// Handle cancel button click
settingsCancel.addEventListener('click', () => {
  window.location.href = 'dashboard.html';
}); 