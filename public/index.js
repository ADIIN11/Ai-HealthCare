// --- GLOBAL STATE ---
let userSignedIn = false;
let totalWater = 0;
let totalCalories = 0;

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    checkAuthStatus(); // <--- Check login status immediately
    startVitalSim();
});

// --- AUTH & PROFILE LOGIC ---
async function checkAuthStatus() {
    const token = localStorage.getItem("token");
    const authSection = document.getElementById('authSection');
    const userSection = document.getElementById('userSection');
    const signOutBtn = document.getElementById('signOutBtn');

    if (!token) {
        userSignedIn = false;
        return;
    }

    try {
        // Hitting your Token Verification route
        const res = await axios.post("/Token_Verification", { token: token });
        
        if (res.data.tokenVerified) {
            userSignedIn = true;
            
            // Update UI with User Data
            document.getElementById('userName').innerText = res.data.username || "User";
            document.getElementById('userAvatar').innerText = (res.data.username || "U").charAt(0).toUpperCase();
            
            // Toggle Visibility
            authSection.classList.add('hidden');
            userSection.classList.remove('hidden');
            signOutBtn.classList.remove('hidden');
            
            console.log("Welcome back, " + res.data.username);
        } else {
            signOut(); // Token invalid, clear everything
        }
    } catch (err) {
        console.error("Auth Check Failed:", err);
        userSignedIn = false;
    }
}

function signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUserId");
    window.location.reload();
}

// --- NAVIGATION ---
function showSection(section) {
    document.getElementById('dashboard-section').classList.toggle('hidden', section !== 'dashboard');
    document.getElementById('chat-section').classList.toggle('hidden', section !== 'chat');
    
    // Update active nav style
    const links = document.querySelectorAll('.nav-links li');
    links.forEach(li => li.classList.remove('active-nav'));
    event.currentTarget.classList.add('active-nav');

    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// --- TRACKER LOGIC ---
function addWater() {
    const qty = parseFloat(document.getElementById('bottleCount').value);
    const size = parseFloat(document.getElementById('bottleSize').value);
    totalWater += (qty * size);
    const percent = Math.min((totalWater / 2.5) * 100, 100);
    document.getElementById('waterDisplay').innerText = `You've consumed ${totalWater.toFixed(2)}L today.`;
    document.getElementById('waterProgress').style.width = percent + "%";
    document.getElementById('waterStatus').innerText = `Min Hydration: ${percent.toFixed(0)}% fulfilled`;
}

function addCalories() {
    const input = document.getElementById('calInput');
    const val = parseFloat(input.value);
    if (val > 0) {
        totalCalories += val;
        const percent = Math.min((totalCalories / 2000) * 100, 100);
        document.getElementById('calDisplay').innerHTML = `${totalCalories} <small>/ 2000 kcal</small>`;
        document.getElementById('calProgress').style.width = percent + "%";
        input.value = '';
    }
}

// --- AI CHATBOT LOGIC ---
async function askAI() {
    const input = document.getElementById('aiInput');
    const chatBox = document.getElementById('chatBox');
    const query = input.value.trim();
    if (!query) return;

    // Add User Bubble
    const userDiv = document.createElement('div');
    userDiv.className = 'msg user-msg';
    userDiv.innerText = query;
    chatBox.appendChild(userDiv);
    input.value = '';

    if (!userSignedIn) {
        const botDiv = document.createElement('div');
        botDiv.className = 'msg ai-msg';
        botDiv.innerText = "Please Sign In to ask medical questions.";
        chatBox.appendChild(botDiv);
        return;
    }

    try {
        const response = await fetch(`/ChatBot/Ask?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        const botDiv = document.createElement('div');
        botDiv.className = 'msg ai-msg';
        botDiv.innerText = data.answer || "Processing...";
        chatBox.appendChild(botDiv);
    } catch (e) {
        // Mock response for development
        setTimeout(() => {
            const botDiv = document.createElement('div');
            botDiv.className = 'msg ai-msg';
            botDiv.innerText = "Simulated Response: You should drink more water based on your activity.";
            chatBox.appendChild(botDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 1000);
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

// --- SIDEBAR UI ---
function initUI() {
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    menuBtn.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
}

function startVitalSim() {
    setInterval(() => {
        const hr = Math.floor(Math.random() * (90 - 65 + 1)) + 65;
        const sys = Math.floor(Math.random() * (130 - 110 + 1)) + 110;
        const dia = Math.floor(Math.random() * (85 - 75 + 1)) + 75;
        document.getElementById('heartRate').innerHTML = `${hr} <small>bpm</small>`;
        document.getElementById('bloodPressure').innerHTML = `${sys}/${dia} <small>mmHg</small>`;
    }, 3000);
}