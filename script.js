let sendBtn = document.querySelector('.send-icon');
let userInput = document.querySelector('#user-input');
let chatInitHeight = userInput.scrollHeight;
let chatbox = document.querySelector('.chatbox');
let API_KEY = 'AIzaSyDM9w1qKLBlPNqWCGym796rbie49IImyNY';

function generateResponse(incomingLi) {
    let API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
    let msgElement = incomingLi.querySelector('p');

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                role: "user",
                parts: [{ text: userMessage }]
            }]
        }),
    };

    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            // Parse and format the response content
            let responseText = data.candidates[0].content.parts[0].text;

            // Replace **text** with <b>text</b> for bold
            responseText = responseText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

            // Replace * text with <li>text</li> for list items
            responseText = responseText.replace(/^\* (.*$)/gim, '<li>$1</li>');

            // Replace new lines with line breaks
            responseText = responseText.replace(/\n/g, '<br>');

            // Set the formatted response text
            msgElement.innerHTML = responseText;
        })
        .catch(error => {
            msgElement.innerText = 'Oops! Something went wrong. Please try again.';
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

function handleChat() {
    userMessage = userInput.value.trim();
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    userInput.style.height = `${chatInitHeight}px`;
    chatbox.scrollTo(0, chatbox.scrollHeight);

    let incomingLi = createChatLi("....", "incoming");
    setTimeout(() => {
        chatbox.appendChild(incomingLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingLi);
        userInput.value = "";
    }, 600);
}

function createChatLi(message, className) {
    let chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let liContent = className === "outgoing" ? `<p></p>` : `<img src="robot.svg" alt="chatbot"><p></p>`
    chatLi.innerHTML = liContent;
    chatLi.querySelector('p').innerText = message;
    return chatLi;
}

userInput.addEventListener("input", () => {
    userInput.style.height = `${userInput.scrollHeight}px`;
})

userInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
})

sendBtn.addEventListener("click", handleChat);