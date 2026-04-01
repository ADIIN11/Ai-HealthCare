document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    // Sidebar logic
    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    menuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Category Filter switching
    const filterSpans = document.querySelectorAll('.filter-btns span');
    filterSpans.forEach(span => {
        span.addEventListener('click', () => {
            filterSpans.forEach(s => s.classList.remove('active'));
            span.classList.add('active');

            // Logic to filter cards would go here
            console.log("Filtering by: " + span.innerText);
        });
    });

    // Mock download action
    const downloadBtns = document.querySelectorAll('.action-btn:not(.disabled)');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const reportName = btn.closest('.report-card').querySelector('h4').innerText;
            alert("Starting download for: " + reportName);
        });
    });
});