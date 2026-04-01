let userSignedIn = false; // Toggle this to true/false to test

document.addEventListener('DOMContentLoaded', () => {
    // --- SIDEBAR & AUTH LOGIC ---
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const authSection = document.getElementById('authSection');
    const userSection = document.getElementById('userSection');

    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    menuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    if (userSignedIn) {
        authSection?.classList.add('hidden');
        userSection?.classList.remove('hidden');
    }

    // --- CHATBOT LOGIC ---
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', `${sender}-message`);
        
        const icon = sender === 'bot' ? 'fa-robot' : 'fa-user';
        
        msgDiv.innerHTML = `
            <div class="msg-icon"><i class="fa-solid ${icon}"></i></div>
            <div class="msg-text">${text}</div>
        `;
        
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto scroll
    }

    async function handleChat() {
        const query = userInput.value.trim();
        if (!query) return;

        // 1. Add User Message to screen
        addMessage(query, 'user');
        userInput.value = '';

        // 2. Auth Check
        if (!userSignedIn) {
            setTimeout(() => {
                addMessage("Please sign in to use the AI Health Assistant.", "bot");
            }, 500);
            return;
        }

        // 3. Send GET request to Backend
        try {
            // Show a "typing" state
            const loadingId = "loading-" + Date.now();
            const loadingDiv = document.createElement('div');
            loadingDiv.id = loadingId;
            loadingDiv.classList.add('message', 'bot-message');
            loadingDiv.innerHTML = `<div class="msg-text">...</div>`;
            chatMessages.appendChild(loadingDiv);

            const response = await fetch(`/ChatBot/Ask?q=${encodeURIComponent(query)}`);
            const data = await response.json(); // Assuming backend returns { "answer": "text" }

            // Remove loading and add actual response
            document.getElementById(loadingId).remove();
            addMessage(data.answer, 'bot');

        } catch (error) {
            console.error("Chat Error:", error);
            // Fallback for demo if your backend isn't live yet:
            // addMessage("I'm having trouble connecting to the server.", "bot");
        }
    }

    sendBtn?.addEventListener('click', handleChat);
    userInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });
});