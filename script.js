const apiUrl = 'http://localhost:5000';  // URL del backend

function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();
    if (!userInput) {
        alert("Per favore, inserisci una criptovaluta.");
        return;
    }

    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += `<p><strong>Tu:</strong> ${userInput}</p>`;
    document.getElementById('user-input').value = '';

    fetch(`${apiUrl}/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            queryResult: {
                parameters: {
                    cripto: userInput.toLowerCase()
                }
            }
        })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
        return response.json();
    })
    .then(data => {
        const message = data.fulfillmentMessages[0].text.text[0];
        chatBox.innerHTML += `<p><strong>Bot:</strong> ${message}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
        console.error('Errore:', error);
        chatBox.innerHTML += `<p style="color: red;"><strong>Bot:</strong> Si è verificato un errore. Riprova più tardi.</p>`;
    });
}
