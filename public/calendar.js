let currentDate = new Date();
let reminders = JSON.parse(localStorage.getItem('novaHealthSchedule')) || {};
let activeDateKey = "";

function renderCalendar() {
    const monthYearText = document.getElementById('currentMonthYear');
    const calendarGrid = document.getElementById('calendarDays');
    calendarGrid.innerHTML = "";

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    monthYearText.innerText = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Fill blank spaces
    for (let x = 0; x < firstDay; x++) {
        calendarGrid.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.classList.add('day');
        dayEl.innerText = day;

        const dateKey = `${year}-${month + 1}-${day}`;

        // Highlight Today
        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayEl.classList.add('today');
        }

        // Dot for reminders
        if (reminders[dateKey] && reminders[dateKey].length > 0) {
            dayEl.classList.add('has-event');
        }

        dayEl.onclick = () => selectDay(dateKey, dayEl);
        calendarGrid.appendChild(dayEl);
    }
}

// Convert 24h format from input to 12h AM/PM IST style
function formatTime12h(time24) {
    const [hours, minutes] = time24.split(':');
    let h = parseInt(hours);
    const suffix = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h.toString().padStart(2, '0')}:${minutes} ${suffix}`;
}

function selectDay(key, el) {
    activeDateKey = key;
    document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
    refreshReminders();
}

function refreshReminders() {
    const container = document.getElementById('reminderListContainer');
    const dayData = reminders[activeDateKey] || [];

    if (dayData.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No reminders for this day.</p>
                <button onclick="openModal()" style="background: none; border:none; color: var(--cool-sky); font-weight:700; cursor:pointer; text-decoration: underline;">+ Add IST Reminder</button>
            </div>`;
        return;
    }

    // Sort chronologically by the raw 24h time
    dayData.sort((a, b) => a.rawTime.localeCompare(b.rawTime));

    let html = dayData.map((rem, idx) => `
        <div class="reminder-item">
            <div class="rem-time">${rem.displayTime}</div>
            <div class="rem-text">${rem.title}</div>
            <button class="btn-del" onclick="removeReminder(${idx})"><i class="fa-solid fa-trash-can"></i></button>
        </div>
    `).join('');

    container.innerHTML = html + `<button onclick="openModal()" class="btn-save" style="width: 100%; margin-top: 15px;">+ Add New Reminder</button>`;
}

function openModal() {
    if (!activeDateKey) return alert("Please select a date first!");
    document.getElementById('reminderModal').classList.add('active');
}

function closeModal() {
    document.getElementById('reminderModal').classList.remove('active');
    document.getElementById('reminderInput').value = "";
    document.getElementById('timeInput').value = "";
}

function saveReminder() {
    const title = document.getElementById('reminderInput').value;
    const rawTime = document.getElementById('timeInput').value;

    if (!title || !rawTime) return alert("Fill all fields!");

    const displayTime = formatTime12h(rawTime);

    if (!reminders[activeDateKey]) reminders[activeDateKey] = [];
    reminders[activeDateKey].push({ title, rawTime, displayTime });

    localStorage.setItem('novaHealthSchedule', JSON.stringify(reminders));
    closeModal();
    renderCalendar();
    refreshReminders();
}

function removeReminder(idx) {
    reminders[activeDateKey].splice(idx, 1);
    localStorage.setItem('novaHealthSchedule', JSON.stringify(reminders));
    renderCalendar();
    refreshReminders();
}

function changeMonth(dir) {
    currentDate.setMonth(currentDate.getMonth() + dir);
    renderCalendar();
}

// Sidebar logic
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

menuBtn.onclick = () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}
overlay.onclick = () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

renderCalendar();