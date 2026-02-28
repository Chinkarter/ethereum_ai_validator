// static/js/main.js

document.addEventListener('DOMContentLoaded', () => {

    const navDashboardLink = document.getElementById('nav-dashboard-link');
    const navLogoutLink = document.getElementById('nav-logout-link');

    // Handle Firebase Auth State
    auth.onAuthStateChanged((user) => {
        const popupOverlay = document.getElementById('google-popup-overlay');

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

    // Handle Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            auth.signOut().then(() => {
                window.location.href = '/';
            });
        });
    }
});

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
