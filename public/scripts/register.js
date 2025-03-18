const inputs = document.querySelectorAll(".input");
const form = document.querySelector("#register-form");
const passwordInput = document.querySelector("#password");
const passwordError = document.querySelector("#password-error");

function addcl() {
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
}

function remcl() {
    let parent = this.parentNode.parentNode;
    if (this.value == "") {
        parent.classList.remove("focus");
    }
}

inputs.forEach((input) => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
});

// Password validation function
function validatePassword(password) {
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Check for at least one symbol
    const hasDigit = /\d/.test(password); // Check for at least one digit
    const hasUppercase = /[A-Z]/.test(password); // Check for at least one uppercase letter
    return hasSymbol && hasDigit && hasUppercase;
}

// Real-time password validation on input
passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;
    if (password === "") {
        passwordError.textContent = "";
        return;
    }
    if (!validatePassword(password)) {
        passwordError.textContent = "Password must contain at least one symbol, one digit, and one uppercase letter.";
    } else {
        passwordError.textContent = "";
    }
});

// Prevent form submission if password validation fails
form.addEventListener("submit", (e) => {
    const password = passwordInput.value;
    if (!validatePassword(password)) {
        e.preventDefault(); // Prevent form submission
        passwordError.textContent = "Password must contain at least one symbol, one digit, and one uppercase letter.";
    }
});