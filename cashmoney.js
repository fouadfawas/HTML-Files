document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('cashForm');
    const message = document.getElementById('message');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const amount = document.getElementById('amount').value;

        let isValid = true;

        if (!name) {
            displayError('name', 'Please enter your name.');
            isValid = false;
        } else {
            clearError('name');
        }

        if (!amount || amount <= 0) {
            displayError('amount', 'Please enter a valid amount.');
            isValid = false;
        } else {
            clearError('amount');
        }

        if (isValid) {
            message.textContent = `Thank you, ${name}, for sending $${amount}!`;
            form.reset();
        } else {
            message.textContent = '';
        }
    });

    function displayError(field, message) {
        const errorElement = document.getElementById(`${field}Error`);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function clearError(field) {
        const errorElement = document.getElementById(`${field}Error`);
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
});
