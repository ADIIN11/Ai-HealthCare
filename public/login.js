document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const identifier = document.getElementById('loginIdentifier');
    const password = document.getElementById('loginPassword');
    const idError = document.getElementById('identifierError');
    const passError = document.getElementById('passwordError');

    // Reset UI
    idError.innerText = "";
    passError.innerText = "";
    identifier.classList.remove('invalid');
    password.classList.remove('invalid');

    // 1. Basic Empty Check
    let hasError = false;
    if (!identifier.value.trim()) {
        idError.innerText = "Please enter your Gmail or Username";
        identifier.classList.add('invalid');
        hasError = true;
    }
    if (!password.value.trim()) {
        passError.innerText = "Please enter your password";
        password.classList.add('invalid');
        hasError = true;
    }
    if (hasError) return;

    // 2. Fetch Data from LocalStorage (Simulated database)
    const storedUser = JSON.parse(localStorage.getItem('novaHealthUser'));

    // 3. Validation Logic
    if (!storedUser) {
        idError.innerText = "No account found. Please Sign Up first.";
        identifier.classList.add('invalid');
    } else {
        // Check if identifier matches Email or Username
        const idMatch = (identifier.value.trim() === storedUser.email ||
            identifier.value.trim() === storedUser.username);

        if (!idMatch) {
            idError.innerText = "Username or Gmail does not exist";
            identifier.classList.add('invalid');
        } else if (password.value !== storedUser.password) {
            // Identifier matches, but password doesn't
            passError.innerText = "Incorrect password. Please try again.";
            password.classList.add('invalid');
        } else {
            // SUCCESS
            alert("Login Successful! Welcome to NovaHealth.");
            window.location.href = "index.html"; // Redirect to Dashboard
        }
    }
});