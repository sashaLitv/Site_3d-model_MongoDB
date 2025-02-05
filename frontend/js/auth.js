const modal = document.getElementById("auth-modal");

export function isAuthenticated() {
    return localStorage.getItem("userToken") !== null;
}
export  function showAuthModal() {
    modal.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", function () {
    const loginIcon = document.getElementById("login-icon");
    const closeModalButton = document.getElementById("close-modal");
    const authOptions = document.querySelectorAll('.auth-option');
    const authButton = document.getElementById('auth-button');
    const authForm = document.getElementById('auth-form');
    const addField = document.getElementById('add-field');

    let click = 0;
    let isFirstClick = true;

    function toggleIcon() {
        if (isAuthenticated()) {
            loginIcon.classList.remove("fa-door-closed");
            loginIcon.classList.add("fa-door-open");
        } else {
            loginIcon.classList.remove("fa-door-open");
            loginIcon.classList.add("fa-door-closed");
        }
    }

    function closeAuthModal() {
        modal.classList.add("hidden");
        click = 0;
        authForm.reset(); 
    }

    closeModalButton.addEventListener("click", closeAuthModal);

    loginIcon.addEventListener("click", function () {
        if (!isAuthenticated()) {
            click++;
            if (click === 1) {
                showAuthModal();
            } else if (click === 2) {
                closeAuthModal();
                click = 0;
            }
        } else {
            if (isFirstClick) {
                alert("You are already logged in.");
                isFirstClick = false;
            } else {
                localStorage.removeItem("userToken");
                console.log(localStorage.getItem("userToken"));
                alert("You have been logged out.");
                toggleIcon();
                isFirstClick = true;

                if (window.location.pathname === "/planning") {
                    window.location.href = "/";
                }
            }
        }
    });

    authOptions.forEach(option => {
        option.addEventListener('mouseenter', () => {
            const buttonText = option.dataset.text;
            authButton.textContent = buttonText;

            if (buttonText.toLowerCase() === "log in") {
                addField.classList.add("hidden");
            } else {
                addField.classList.remove("hidden");
            }
        });
    });

    authForm.addEventListener("submit", async function (event) {
        event.preventDefault();
    
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const name = document.getElementById("name") ? document.getElementById("name").value.trim() : null;
        const birthday = document.getElementById("birthday") ? document.getElementById("birthday").value.trim() : null;
        const action = authButton.textContent.toLowerCase(); 
    
        if (!username || !password) {
            alert("Please fill in all required fields.");
            return;
        }
    
        const bodyData = { username, password };
        if (name) bodyData.name = name;
        if (birthday) bodyData.date_of_birth = birthday;
    
        const baseUrl = "http://localhost:3000";  
        const endpoint = action === "log in" 
                        ? `${baseUrl}/api/user/login` 
                        : `${baseUrl}/api/user/register`; 
    
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyData)
            });
    
            const data = await response.json();
    
            if (response.ok) {
                localStorage.setItem("userToken", data.token); 
                alert(`${action === "log in" ? "Login" : "Registration"} successful!`);  
                toggleIcon();
                closeAuthModal(); 
            } else {
                alert(data.message || "Something went wrong. Authorization error.");
            }
        } catch (error) {
            console.error("Request error:", error);
            alert("Something went wrong. Please try again.");
        }
    });


    toggleIcon();
});