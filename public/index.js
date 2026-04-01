let userSignedIn = false; 





document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    // Function to toggle sidebar
    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    // Event Listeners
    menuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Hover effect for glass cards
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.02)';
            card.style.transition = '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });

    // Close sidebar when clicking a nav link (mobile behavior)
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (sidebar.classList.contains('active')) {
                toggleMenu();
            }

            // UI update for active state
            navLinks.forEach(l => l.classList.remove('active-nav'));
            link.classList.add('active-nav');
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // 1. SIMULATED SIGN-IN VALUE
    // Change this to 'true' to see the buttons disappear and name appear
    

    // 2. Auth Toggle Logic
    const authSection = document.getElementById('authSection');
    const userSection = document.getElementById('userSection');

    if (userSignedIn) {
        authSection.classList.add('hidden');
        userSection.classList.remove('hidden');
    } else {
        authSection.classList.remove('hidden');
        userSection.classList.add('hidden');
    }

    // --- Rest of your existing Sidebar logic ---
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    menuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    
    // ... (keep the rest of your code)
});