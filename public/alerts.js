/**
 * Crates an alert element.
 * @param {String} type either success or error 
 * @returns {Promise} resolves the alert element
 */
function createAlert(type, message) {
    return new Promise((resolve, reject) => {
        let alert = document.createElement("div");
        alert.classList.add("alert", `alert-${type}`);

        let messageContainer = document.createElement("div");
        messageContainer.classList.add("alert-message");

        let messageText = document.createElement("div");
        messageText.classList.add("text");
        messageText.innerText = message;
        messageContainer.appendChild(messageText);

        let buttonContainer = document.createElement("div");
        buttonContainer.classList.add("alert-button");

        let button = new Image();
        button.src = "pics/close.png";
        button.classList.add("close-button");
        button.addEventListener("click", alertCloseHandler);

        buttonContainer.appendChild(button);

        alert.appendChild(messageContainer);
        alert.appendChild(buttonContainer);

        resolve(alert);
    });
}

/**
 * Removes the alert from the screen.
 * @param {Event} obj event from the x button being clicked 
 */
function alertCloseHandler(obj) {
    obj.target.parentElement.parentElement.parentElement.removeChild(obj.target.parentElement.parentElement);
}