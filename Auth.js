class Auth {
    constructor() {
        this.registrationModal = document.getElementById('registrationModal');
        this.signInModal = document.getElementById('signInModal');
        this.registerLink = document.getElementById('registerLink');
        this.signInLink = document.getElementById('signInLink');
        this.signOutLink = document.getElementById('signOutLink');
        this.switchToSignIn = document.getElementById('switchToSignIn');
        this.switchToRegister = document.getElementById('switchToRegister');
        this.closeButtons = document.querySelectorAll('.close');
        
        this.initializeEventListeners();
        this.checkAuthStatus();
    }

    initializeEventListeners() {
        
        if (this.registerLink) {
            this.registerLink.addEventListener('click', (e) => this.showModal(e, this.registrationModal));
        }
        
        if (this.signInLink) {
            this.signInLink.addEventListener('click', (e) => this.showModal(e, this.signInModal));
        }
        
        if (this.switchToSignIn) {
            this.switchToSignIn.addEventListener('click', (e) => this.switchModals(e, this.registrationModal, this.signInModal));
        }
        
        if (this.switchToRegister) {
            this.switchToRegister.addEventListener('click', (e) => this.switchModals(e, this.signInModal, this.registrationModal));
        }

        this.closeButtons.forEach(button => {
            button.addEventListener('click', () => this.closeModals());
        });

        window.addEventListener('click', (e) => {
            if (e.target === this.registrationModal || e.target === this.signInModal) {
                this.closeModals();
            }
        });

        const registrationForm = document.getElementById('registrationForm');
        if (registrationForm) {
            registrationForm.addEventListener('submit', (e) => this.handleRegistration(e));
        }
        
        const signInForm = document.getElementById('signInForm');
        if (signInForm) {
            signInForm.addEventListener('submit', (e) => this.handleSignIn(e));
        }

        if (this.signOutLink) {
            this.signOutLink.addEventListener('click', (e) => this.handleSignOut(e));
        }
    }

    showModal(e, modal) {
        e.preventDefault();
        this.closeModals(); 
        if (modal) {
            modal.style.display = 'block';
        }
    }

    switchModals(e, fromModal, toModal) {
        e.preventDefault();
        if (fromModal) fromModal.style.display = 'none';
        if (toModal) toModal.style.display = 'block';
    }

    closeModals() {
        if (this.registrationModal) this.registrationModal.style.display = 'none';
        if (this.signInModal) this.signInModal.style.display = 'none';
    }

    checkAuthStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            this.updateUIForLoggedInUser();
        } else {
            this.updateUIForLoggedOutUser();
        }
    }

    updateUIForLoggedInUser() {
        if (this.signInLink) this.signInLink.style.display = 'none';
        if (this.registerLink) this.registerLink.style.display = 'none';
        if (this.signOutLink) this.signOutLink.style.display = 'block';
    }

    updateUIForLoggedOutUser() {
        if (this.signInLink) this.signInLink.style.display = 'block';
        if (this.registerLink) this.registerLink.style.display = 'block';
        if (this.signOutLink) this.signOutLink.style.display = 'none';
    }

    validatePassword(password) {
        return password.length >= 8;
    }

    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    async handleRegistration(e) {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        if (!this.validatePassword(password)) {
            alert('Password must be at least 8 characters long');
            return;
        }

        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            if (users.some(user => user.email === email)) {
                alert('Email already registered. Please sign in.');
                return;
            }

            const hashedPassword = await this.hashPassword(password);
            users.push({ name, email, password: hashedPassword });
            localStorage.setItem('users', JSON.stringify(users));

            alert('Registration successful! Please sign in.');
            this.closeModals();
            this.signInModal.style.display = 'block';
            e.target.reset();
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration. Please try again.');
        }
    }

    async handleSignIn(e) {
        e.preventDefault();
        const email = document.getElementById('signInEmail').value;
        const password = document.getElementById('signInPassword').value;

        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const hashedPassword = await this.hashPassword(password);
            const user = users.find(u => u.email === email && u.password === hashedPassword);

            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify({
                    name: user.name,
                    email: user.email
                }));
                
                alert('Sign in successful!');
                this.closeModals();
                this.checkAuthStatus();
                e.target.reset();
            } else {
                alert('Invalid email or password.');
            }
        } catch (error) {
            console.error('Sign in error:', error);
            alert('An error occurred during sign in. Please try again.');
        }
    }

    handleSignOut(e) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        this.checkAuthStatus();
        alert('You have been signed out.');
    }
}