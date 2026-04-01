// 1. SIMULATED SIGN-IN VALUE
// Change this to true to see the buttons disappear and name appear
let userSignedIn = false; 

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DOM Elements ---
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const authSection = document.getElementById('authSection');
    const userSection = document.getElementById('userSection');
    const cards = document.querySelectorAll('.glass-card');
    const navLinks = document.querySelectorAll('.nav-links li');

    // --- 2. Auth Toggle Logic ---
    // Ensure the elements exist before trying to modify them
    if (authSection && userSection) {
        if (userSignedIn) {
            authSection.classList.add('hidden');
            userSection.classList.remove('hidden');
        } else {
            authSection.classList.remove('hidden');
            userSection.classList.add('hidden');
        }
    }

    // --- 3. Sidebar Toggle Logic ---
    function toggleMenu() {
        // Double check elements exist to prevent errors
        if(sidebar && overlay) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }
    }

    // Attach listeners exactly ONCE
    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    // --- 4. Hover Effect for Glass Cards ---
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.02)';
            card.style.transition = '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });

    // --- 5. Mobile Navigation Behavior ---
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Close sidebar if it's open
            if (sidebar && sidebar.classList.contains('active')) {
                toggleMenu();
            }

            // UI update for active state
            navLinks.forEach(l => l.classList.remove('active-nav'));
            link.classList.add('active-nav');
        });
    });
});