// Check if user is already logged in
function checkAuth() {
  const user = localStorage.getItem('user');
  if (user) {
    window.location.href = 'dashboard.html';
  }
}

// Handle login form
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const loginError = document.getElementById('login-error');

    // In a real app, this would make an API call to verify credentials
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem('user', JSON.stringify({ email: user.email }));
      window.location.href = 'dashboard.html';
    } else {
      loginError.textContent = 'Invalid email or password';
      loginError.classList.add('show');
    }
  });
}

// Handle signup form
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const signupError = document.getElementById('signup-error');

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
    localStorage.setItem('user', JSON.stringify({ email }));
    window.location.href = 'dashboard.html';
  });
}

// Check auth status when page loads
checkAuth(); 