// static/js/main.js

document.addEventListener('DOMContentLoaded', () => {

    const navDashboardLink = document.getElementById('nav-dashboard-link');
    const navLogoutLink = document.getElementById('nav-logout-link');

    // Global Frontend Auth Logic
    const appWrapper = document.getElementById('app-wrapper');
    const authOverlay = document.getElementById('global-auth-overlay');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const authUsernameInput = document.getElementById('auth-username');
    const authPasswordInput = document.getElementById('auth-password');
    const authError = document.getElementById('auth-error');

    // Check if already authenticated for the session
    if (sessionStorage.getItem('siteAuth') === 'true') {
        if (appWrapper) appWrapper.classList.remove('blurred');
        if (authOverlay) authOverlay.style.display = 'none';
    } else {
        if (appWrapper) appWrapper.classList.add('blurred');
        if (authOverlay) authOverlay.style.display = 'flex';
    }

    if (authSubmitBtn) {
        authSubmitBtn.addEventListener('click', () => {
            if (authUsernameInput.value === 'ETHAIVALIDATORS' && authPasswordInput.value === 'ty%6783ghd7$@de') {
                sessionStorage.setItem('siteAuth', 'true');
                appWrapper.classList.remove('blurred');
                authOverlay.style.display = 'none';
                authError.style.display = 'none';
            } else {
                authError.style.display = 'block';
                authUsernameInput.value = '';
                authPasswordInput.value = '';
            }
        });
    }

    // Handle Firebase Auth State
    auth.onAuthStateChanged((user) => {
        const popupOverlay = document.getElementById('google-popup-overlay');
        window.currentUser = user; // Export for other scripts

        if (user) {
            // User is signed in.
            if (navDashboardLink) navDashboardLink.style.display = 'block';
            if (navLogoutLink) navLogoutLink.style.display = 'block';

            // Close popup if it's open on index page
            closeGooglePopup();
        } else {
            // No user is signed in.
            if (navDashboardLink) navDashboardLink.style.display = 'none';
            if (navLogoutLink) navLogoutLink.style.display = 'none';

            // Redirect to home if on dashboard
            if (window.location.pathname === '/dashboard') {
                window.location.href = '/';
            }

            // Show popup if on index page
            if (popupOverlay && window.location.pathname === '/') {
                setTimeout(() => {
                    popupOverlay.style.display = 'flex';
                    void popupOverlay.offsetWidth;
                    popupOverlay.style.opacity = '1';
                    popupOverlay.querySelector('.google-popup').classList.add('show');

                    setTimeout(() => {
                        closeGooglePopup();
                    }, 8000);
                }, 1000);
            }
        }
    });

    // Handle "Sign in with Google" click
    const googleBtn = document.getElementById('google-signin-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            auth.signInWithPopup(provider).then((result) => {
                window.location.href = '/dashboard';
            }).catch((error) => {
                console.error("SignIn Error:", error);
                alert("Sign in failed: " + error.message);
            });
        });
    }

    // Handle My Account Modal and Logout
    const myAccountBtn = document.getElementById('my-account-btn');
    const accountModal = document.getElementById('account-modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalLogoutBtn = document.getElementById('modal-logout-btn');

    if (myAccountBtn && accountModal) {
        myAccountBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            accountModal.style.display = 'flex';

            // Populate data if available
            if (window.currentUser) {
                document.getElementById('modal-account-email').innerText = window.currentUser.email;

                // Fetch latest from firestore to be sure
                const userRef = db.collection("users").doc(window.currentUser.uid);
                const doc = await userRef.get();
                if (doc.exists) {
                    const data = doc.data();
                    document.getElementById('modal-account-balance').innerText = (data.ethBalance || 0).toFixed(8) + " ETH";
                    document.getElementById('modal-account-device').innerText = data.deviceDetails || "Not Checked Yet";
                }
            }
        });
    }

    if (modalCloseBtn && accountModal) {
        modalCloseBtn.addEventListener('click', () => {
            accountModal.style.display = 'none';
        });
    }

    if (modalLogoutBtn) {
        modalLogoutBtn.addEventListener('click', () => {
            auth.signOut().then(() => {
                window.location.href = '/';
            });
        });
    }
});

function showLoginPopup(e) {
    e.preventDefault();
    if (window.currentUser) {
        window.location.href = '/dashboard';
        return;
    }
    const popupOverlay = document.getElementById('google-popup-overlay');
    if (popupOverlay) {
        popupOverlay.style.display = 'flex';
        void popupOverlay.offsetWidth; // trigger reflow
        popupOverlay.style.opacity = '1';
        popupOverlay.querySelector('.google-popup').classList.add('show');
    }
}

function closeGooglePopup() {
    const popupOverlay = document.getElementById('google-popup-overlay');
    if (popupOverlay) {
        popupOverlay.style.opacity = '0';
        popupOverlay.querySelector('.google-popup').classList.remove('show');
        setTimeout(() => {
            popupOverlay.style.display = 'none';
        }, 500); // Wait for transition
    }
}
