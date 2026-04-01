document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevents the default submit event from occurring

    // 1. Select all inputs and button
    const email = document.getElementById('email');
    const username = document.getElementById('username');
    const bloodGroup = document.getElementById('bloodGroup');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const submitBtn = document.querySelector('.signup-btn');

    // Reset errors
    document.querySelectorAll('.error-msg').forEach(el => el.innerText = "");
    document.querySelectorAll('input, select').forEach(el => el.classList.remove('invalid'));

    let isValid = true;

    // Helper function to show error on specific fields
    const showError = (field, msg) => {
        document.getElementById(`${field.id}Error`).innerText = msg;
        field.classList.add('invalid');
        isValid = false;
    };

    // --- FRONTEND VALIDATION ---
    
    // Required Field Checks
    if (!email.value.trim()) showError(email, "Email is required");
    if (!username.value.trim()) showError(username, "Username is required");
    if (!bloodGroup.value) showError(bloodGroup, "Please select a blood group");
    if (!password.value) showError(password, "Password is required");

    // Email Format Check
    if (email.value && !email.value.includes('@')) {
        showError(email, "Please enter a valid email address");
    }

    // Password Complexity Validation
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

    // Confirm Password Check
    if (password.value && confirmPassword.value !== password.value) {
        showError(confirmPassword, "Passwords do not match");
    } else if (!confirmPassword.value) {
        showError(confirmPassword, "Please confirm your password");
    }

    // Stop execution if frontend validation fails
    if (!isValid) return;

    // --- BACKEND SUBMISSION ---

    // Prepare payload for the database
    
    let userData = {
        username: username.value.trim(),
        email: email.value.trim(),
        password: password.value,
        bloodGroup: bloodGroup.value, // Added from your form
        createdAt: new Date().toDateString(),
        verification: false, 
        profileImg: null,
        profileImgPubId: null,
        reviewsWritten:[],
        address: null,
        role: "customerAccount",
        reviewsWritten:null
    };

    try {
        // Change button state to loading
        submitBtn.innerText = "Signing up...";
        submitBtn.disabled = true;

        const res = await axios.post("/Auth/Sign_Up", userData);
        console.log("Server Response:", res.data);

        // Handle custom backend responses
        if (res.data.exists === 1) {   
            showError(username, "Username already taken");
            console.log("Username already taken");
        } 
        else if (res.data.exists === 2) {
            showError(email, "Account already exists, Please Sign in");   
            console.log("Account already exists");
        } 
        else {
            // Success!
            alert("Account Created Successfully! Redirecting to login...");
            console.log("Account Created Successfully");
            document.getElementById('signupForm').reset();
            window.location.href = "/Auth/Sign_In"; // Redirect user
        }

    } catch (err) {
        console.error("Error:", err); 
        alert("Something went wrong with the server. Please try again.");
    } finally {
        // Reset button state regardless of success or failure
        submitBtn.innerText = "Sign Up";
        submitBtn.disabled = false;
    }
});