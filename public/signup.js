document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Select all inputs
    const email = document.getElementById('email');
    const username = document.getElementById('username');
    const bloodGroup = document.getElementById('bloodGroup');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    // Reset errors
    document.querySelectorAll('.error-msg').forEach(el => el.innerText = "");
    document.querySelectorAll('input, select').forEach(el => el.classList.remove('invalid'));

    let isValid = true;

    // Helper function to show error
    const showError = (field, msg) => {
        document.getElementById(`${field.id}Error`).innerText = msg;
        field.classList.add('invalid');
        isValid = false;
    };

    // 1. Required Field Checks
    if (!email.value.trim()) showError(email, "Email is required");
    if (!username.value.trim()) showError(username, "Username is required");
    if (!bloodGroup.value) showError(bloodGroup, "Please select a blood group");
    if (!password.value) showError(password, "Password is required");

    // 2. Email Format Check (Basic)
    if (email.value && !email.value.includes('@')) {
        showError(email, "Please enter a valid Gmail address");
    }

    // 3. Password Complexity Validation
    if (password.value) {
        const passVal = password.value;
        const hasUpper = /[A-Z]/.test(passVal);
        const hasLower = /[a-z]/.test(passVal);
        const hasNumber = /[0-9]/.test(passVal);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(passVal);
        const isLongEnough = passVal.length >= 8;

        if (!isLongEnough || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
            showError(password, "Must be 8+ chars, with Uppercase, Lowercase, Number & Special char");
        }
    }

    // 4. Confirm Password Check
    if (password.value && confirmPassword.value !== password.value) {
        showError(confirmPassword, "Passwords do not match");
    } else if (!confirmPassword.value) {
        showError(confirmPassword, "Please confirm your password");
    }

    // Success Action
    if (isValid) {
        alert("Account created successfully! Redirecting to dashboard...");
        // window.location.href = "index.html"; // Uncomment to redirect
    }
});