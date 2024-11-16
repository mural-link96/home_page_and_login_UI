document.addEventListener('DOMContentLoaded', (event) => {
    // Login page functionality
    const showLoginFormBtn = document.getElementById('showLoginForm');
    const showSignupFormBtn = document.getElementById('showSignupForm');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (showLoginFormBtn && showSignupFormBtn) {
        showLoginFormBtn.addEventListener('click', () => {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        });

        showSignupFormBtn.addEventListener('click', () => {
            signupForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Send login request to server
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
            }).then(response => {
                if (response.ok) {
                    window.location.href = '/app';
                } else {
                    alert('Invalid credentials');
                }
            });
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            
            // Send signup request to server
            fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            }).then(response => {
                if (response.ok) {
                    alert('Sign up successful! Please log in.');
                    showLoginFormBtn.click(); // Switch to login form
                } else {
                    alert('Sign up failed. Please try again.');
                }
            });
        });
    }

    // Landing page functionality
    const productButton = document.getElementById('productButton');
    const productDropdown = document.getElementById('productDropdown');
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenu = document.getElementById('mobileMenu');

    // Product dropdown functionality
    if (productButton && productDropdown) {
        productButton.addEventListener('mouseenter', () => {
            productDropdown.classList.remove('hidden');
        });

        productButton.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!productDropdown.matches(':hover')) {
                    productDropdown.classList.add('hidden');
                }
            }, 100);
        });

        productDropdown.addEventListener('mouseleave', () => {
            productDropdown.classList.add('hidden');
        });
    }

    // Mobile menu functionality
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
        });
    }

    if (closeMobileMenu && mobileMenu) {
        closeMobileMenu.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    }
});