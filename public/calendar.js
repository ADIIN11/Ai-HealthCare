let currentDate = new Date();
let remindersData = {}; 
let activeDateKey = "";
let currentUserId = null;
let userSignedIn = false;

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    checkAuthStatus(); // This will trigger fetchReminders and renderCalendar
});

// --- AUTH LOGIC (From Index) ---
async function checkAuthStatus() {
    const token = localStorage.getItem("token");
    const authSection = document.getElementById('authSection');
    const userSection = document.getElementById('userSection');
    const signOutBtn = document.getElementById('signOutBtn');

    if (!token) {
        userSignedIn = false;
        renderCalendar(); // Render empty calendar anyway
        return;
    }

    try {
        const res = await axios.post("/Token_Verification", { token: token });
        if (res.data.tokenVerified) {
            userSignedIn = true;
            currentUserId = res.data.id;
            
            document.getElementById('userName').innerText = res.data.username || "User";
            document.getElementById('userAvatar').innerText = (res.data.username || "U").charAt(0).toUpperCase();
            
            authSection.classList.add('hidden');
            userSection.classList.remove('hidden');
            signOutBtn.classList.remove('hidden');
            
            await fetchRemindersFromDB();
            renderCalendar();
        } else {
            signOut();
        }
    } catch (err) {
        console.error("Auth Check Failed:", err);
        renderCalendar();
    }
}

function signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUserId");
    window.location.reload();
}

// --- BACKEND API ---
async function fetchRemindersFromDB() {
    try {
        const res = await axios.post("/Calendar/Get-Reminders", { userId: currentUserId });
        const flatList = res.data.reminders || [];
        remindersData = {};
        flatList.forEach(item => {
            if (!remindersData[item.date]) remindersData[item.date] = [];
            remindersData[item.date].push(item);
        });
    } catch (err) {
        console.error("Error fetching reminders:", err);
    }
}

// --- CALENDAR RENDER LOGIC ---
function renderCalendar() {
    const calendarGrid = document.getElementById('calendarDays');
    const monthYearText = document.getElementById('currentMonthYear');
    if(!calendarGrid) return;

    calendarGrid.innerHTML = "";
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    
    monthYearText.innerText = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let x = 0; x < firstDay; x++) {
        calendarGrid.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.classList.add('day');
        dayEl.innerText = day;
        const dateKey = `${year}-${month + 1}-${day}`;

        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayEl.classList.add('today');
        }

        if (remindersData[dateKey] && remindersData[dateKey].length > 0) {
            dayEl.classList.add('has-event');
        }

        dayEl.onclick = () => selectDay(dateKey, dayEl);
        calendarGrid.appendChild(dayEl);
    }
}

// --- REMINDER LOGIC ---
async function saveReminder() {
    if(!userSignedIn) return alert("Please Sign In first!");
    
    const title = document.getElementById('reminderInput').value;
    const rawTime = document.getElementById('timeInput').value;
    if (!title || !rawTime) return alert("Fill all fields!");

    const reminderObj = {
        title: title,
        date: activeDateKey,
        rawTime: rawTime,
        displayTime: formatTime12h(rawTime)
    };

    try {
        await axios.post("/Calendar/Add-Reminder", { 
            userId: currentUserId, 
            reminderObj: reminderObj 
        });
        await fetchRemindersFromDB();
        closeModal();
        renderCalendar();
        refreshReminders();
    } catch (err) {
        alert("Failed to save reminder");
    }
}

async function removeReminder(idx) {
    const reminderToDelete = remindersData[activeDateKey][idx];
    try {
        await axios.post("/Calendar/Delete-Reminder", {
            userId: currentUserId,
            reminderObj: reminderToDelete
        });
        await fetchRemindersFromDB();
        renderCalendar();
        refreshReminders();
    } catch (err) {
        alert("Failed to delete");
    }
}

function selectDay(key, el) {
    activeDateKey = key;
    document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
    refreshReminders();
}

function refreshReminders() {
    const container = document.getElementById('reminderListContainer');
    const dayData = remindersData[activeDateKey] || [];

    if (dayData.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>No reminders for this day.</p><button onclick="openModal()" class="btn-save">+ Add IST Reminder</button></div>`;
        return;
    }

    dayData.sort((a, b) => a.rawTime.localeCompare(b.rawTime));

    let html = dayData.map((rem, idx) => `
        <div class="reminder-item">
            <div class="rem-time">${rem.displayTime}</div>
            <div class="rem-text">${rem.title}</div>
            <button class="btn-del" onclick="removeReminder(${idx})"><i class="fa-solid fa-trash-can"></i></button>
        </div>
    `).join('');
    container.innerHTML = html + `<button onclick="openModal()" class="btn-save" style="width: 100%; margin-top: 15px;">+ Add New</button>`;
}

// --- UTILS ---
function formatTime12h(time24) {
    const [hours, minutes] = time24.split(':');
    let h = parseInt(hours);
    const suffix = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h.toString().padStart(2, '0')}:${minutes} ${suffix}`;
}

function changeMonth(dir) {
    currentDate.setMonth(currentDate.getMonth() + dir);
    renderCalendar();
}

function openModal() { 
    if(!activeDateKey) return alert("Select a date first!");
    document.getElementById('reminderModal').classList.add('active'); 
}
function closeModal() { document.getElementById('reminderModal').classList.remove('active'); }

function initSidebar() {
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if(menuBtn) menuBtn.onclick = () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
    if(overlay) overlay.onclick = () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}