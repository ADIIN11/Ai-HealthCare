let userSignedIn = true; // Set to true so you can actually test the bot!

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

    if(menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if(overlay) overlay.addEventListener('click', toggleMenu);

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
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto scroll to bottom
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

        // 3. Send POST request to our new OpenAI Backend
        try {
            // Show a "typing..." state
            const loadingId = "loading-" + Date.now();
            const loadingDiv = document.createElement('div');
            loadingDiv.id = loadingId;
            loadingDiv.classList.add('message', 'bot-message');
            loadingDiv.innerHTML = `
                <div class="msg-icon"><i class="fa-solid fa-robot"></i></div>
                <div class="msg-text">Thinking...</div>
            `;
            chatMessages.appendChild(loadingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Call the Express backend we just built!
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: query })
            });

            const data = await response.json();

            // Remove loading indicator
            document.getElementById(loadingId).remove();

            if (data.reply) {
                // Add the actual AI response
                addMessage(data.reply, 'bot');
            } else {
                addMessage("Sorry, I received an invalid response from the server.", "bot");
            }

        } catch (error) {
            console.error("Chat Error:", error);
            // Remove loading indicator if it fails
            const loader = document.getElementById(loadingId);
            if(loader) loader.remove();
            
            addMessage("I'm having trouble connecting to the server right now. Is your backend running?", "bot");
        }
    }

    // Event Listeners for sending messages
    sendBtn?.addEventListener('click', handleChat);
    userInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });
});