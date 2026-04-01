// --- CONFIG & STATE ---
let userSignedIn = false; // Change to true to test login state
let totalWater = 0;
const waterGoal = 2.5; 
let totalCalories = 0;
const calorieGoal = 2000;

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    startVitalSim();
});

// --- UI NAVIGATION & AUTH ---
function initUI() {
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const authSec = document.getElementById('authSection');
    const userSec = document.getElementById('userSection');

    menuBtn.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    if (userSignedIn) {
        authSec.classList.add('hidden');
        userSec.classList.remove('hidden');
    }
}

function showSection(section) {
    document.getElementById('dashboard-section').classList.toggle('hidden', section !== 'dashboard');
    document.getElementById('chat-section').classList.toggle('hidden', section !== 'chat');
    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// --- ADD WATER FUNCTION ---
function addWater() {
    const qty = parseFloat(document.getElementById('bottleCount').value);
    const size = parseFloat(document.getElementById('bottleSize').value);
    
    if (qty > 0) {
        totalWater += (qty * size);
        const percent = Math.min((totalWater / waterGoal) * 100, 100);
        
        document.getElementById('waterDisplay').innerText = `You've consumed ${totalWater.toFixed(2)}L today.`;
        document.getElementById('waterProgress').style.width = percent + "%";
        document.getElementById('waterStatus').innerText = `Min Hydration: ${percent.toFixed(0)}% fulfilled`;
    }
}

// --- ADD CALORIES FUNCTION ---
function addCalories() {
    const input = document.getElementById('calInput');
    const val = parseFloat(input.value);

    if (val > 0) {
        totalCalories += val;
        const percent = Math.min((totalCalories / calorieGoal) * 100, 100);
        
        document.getElementById('calDisplay').innerHTML = `${totalCalories} <small>/ ${calorieGoal} kcal</small>`;
        document.getElementById('calProgress').style.width = percent + "%";
        document.getElementById('calStatus').innerText = `${percent.toFixed(0)}% of min requirement fulfilled`;
        input.value = '';
    }
}

// --- MOCK VITALS ---
function startVitalSim() {
    setInterval(() => {
        const hr = Math.floor(Math.random() * (90 - 65 + 1)) + 65;
        const sys = Math.floor(Math.random() * (130 - 110 + 1)) + 110;
        const dia = Math.floor(Math.random() * (85 - 75 + 1)) + 75;

        document.getElementById('heartRate').innerHTML = `${hr} <small>bpm</small>`;
        document.getElementById('bloodPressure').innerHTML = `${sys}/${dia} <small>mmHg</small>`;
    }, 3000);
}

// --- AI CHAT LOGIC ---
async function askAI() {
    const input = document.getElementById('aiInput');
    const chatBox = document.getElementById('chatBox');
    const query = input.value.trim();

    if (!query) return;

    // Show User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'msg user-msg';
    userMsg.innerText = query;
    chatBox.appendChild(userMsg);
    input.value = '';

    // Auth Check
    if (!userSignedIn) {
        const botMsg = document.createElement('div');
        botMsg.className = 'msg ai-msg';
        botMsg.innerText = "Please sign in to access the AI Health Assistant.";
        chatBox.appendChild(botMsg);
        return;
    }

    // Call Backend
    try {
        const response = await fetch(`/ChatBot/Ask?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        const botMsg = document.createElement('div');
        botMsg.className = 'msg ai-msg';
        botMsg.innerText = data.answer || "I'm processing your request.";
        chatBox.appendChild(botMsg);
    } catch (e) {
        // Mock response if backend is offline
        const botMsg = document.createElement('div');
        botMsg.className = 'msg ai-msg';
        botMsg.innerText = "Connecting to AI... (Check console for mock GET status)";
        chatBox.appendChild(botMsg);
        console.log(`GET Request sent to: /ChatBot/Ask?q=${query}`);
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

function askAI() {
    const input = document.getElementById('aiInput');
    const chatBox = document.getElementById('chatBox');
    const val = input.value.trim();

    if (val === "") return;

    // Create User Message
    const userDiv = document.createElement('div');
    userDiv.className = 'msg user-msg';
    userDiv.innerText = val;
    chatBox.appendChild(userDiv);

    input.value = '';

    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simulate AI response (Replace with your actual fetch logic)
    setTimeout(() => {
        const aiDiv = document.createElement('div');
        aiDiv.className = 'msg ai-msg';
        aiDiv.innerText = "I'm analyzing that for you. Please make sure to consult a doctor for a definitive diagnosis.";
        chatBox.appendChild(aiDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
}