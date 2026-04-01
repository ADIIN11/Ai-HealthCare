const msgPara = document.getElementById("msg-id");
const passwordInpt = document.getElementById("password-inpt");
const nameEmailInpt = document.getElementById("username-email-inpt");
const captchaInpt = document.getElementById("captcha-inpt");
const form = document.getElementById("form-id");

form.addEventListener("submit", submit);

async function submit(event) {
    event.preventDefault(); // Prevents default form submission

    // Default style reset
    msgPara.style.color = "#777";

    // 1. Basic Validation
    if (!nameEmailInpt.value || (!passwordInpt.value && !captchaInpt.value)) {
        msgPara.textContent = "Fill all the boxes";
        msgPara.style.color = "var(--rose-kiss)";
        return;
    } 
    else if (nameEmailInpt.value && passwordInpt.value && !captchaInpt.value) {
        msgPara.textContent = "Pls Fill Captcha";
        msgPara.style.color = "var(--rose-kiss)";
        return;
    } 
    else {
        let userData = {
            usernameEmail: nameEmailInpt.value,
            password: passwordInpt.value,
        };

        try {
            // 2. Axios Request to Backend
            const res = await axios.post("/Auth/Sign_In", userData);

            if (!res.data.exists) {
                msgPara.textContent = "Account Does Not Exist, Pls Sign-Up";
                msgPara.style.color = "var(--rose-kiss)";
                return;
            } 
            else if (!res.data.passwordCorrect) {
                msgPara.textContent = "Password Incorrect";
                msgPara.style.color = "var(--rose-kiss)";
                return;
            } 
            else {
                console.log(res.data);
                
                // 3. Save Token and Verify
                localStorage.setItem("token", res.data.token);
                msgPara.textContent = "Signed In Successfully";
                msgPara.style.color = "#27ae60"; // Success Green

                verifyToken();

                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            }
            form.reset();
        } catch (err) {
            console.error("Error:", err);
            msgPara.textContent = "Something went wrong, try again";
            msgPara.style.color = "var(--rose-kiss)";
        }
    }
}

async function verifyToken() {
    const token = localStorage.getItem("token");
    const tokenObj = { token: token };

    try {
        const res = await axios.post("/Token_Verification", tokenObj);
        if (res.data.tokenVerified) {
            const id = res.data.id;
            localStorage.setItem("currentUserId", id);
            console.log("Token Verified");
        } else {
            console.log("Token expired pls login again");
        }
    } catch (err) {
        console.error("Error:", err);
    }
}