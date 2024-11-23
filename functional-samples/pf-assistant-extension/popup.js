document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const successMessage = document.getElementById('successMessage');
    const loginButton = document.getElementById('loginButton');

    // Check if token exists in chrome.storage
    chrome.storage.local.get(['token'], result => {
        if (result.token) {
            // Token exists, show success message
            loginForm.classList.add('hidden');
            successMessage.classList.remove('hidden');
        } else {
            // Token does not exist, show login form
            loginForm.classList.remove('hidden');
            successMessage.classList.add('hidden');
        }
    });

    loginButton.addEventListener('click', () => {
        const spinner = document.getElementById('spinner');
        spinner.classList.remove('hidden'); // Show spinner
        loginButton.classList.add('hidden'); // Disable login button

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Send POST request to the API
        fetch('https://api.privatefulfillment.com/v1/secret', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: username,
                password: password
            })
        })
            .then(response => response.text())
            .then(data => {
                spinner.classList.add('hidden'); // Hide spinner
                loginButton.classList.remove('hidden');
                if (data) {
                    // Store the token in chrome.storage
                    chrome.storage.local.set({ token: data }, () => {
                        loginForm.classList.add('hidden');
                        successMessage.classList.remove('hidden');
                    });
                } else {
                    alert('Invalid credentials');
                }
            })
            .catch(error => {
                spinner.classList.add('hidden'); // Hide spinner
                loginButton.classList.remove('hidden');
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
    });
});
