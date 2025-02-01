function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;  // Non inviare messaggi vuoti

    // Aggiungi il messaggio dell'utente nella chat
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += `<p><strong>Tu:</strong> ${userInput}</p>`;

    // Pulisci il campo di input
    document.getElementById('user-input').value = '';

    // Fai la richiesta al backend
    fetch(`${apiUrl}/webhook`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            queryResult: {
                parameters: {
                    cripto: userInput.toLowerCase()  // Assumiamo che l'input dell'utente sia il nome della criptovaluta
                }
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        const message = data.fulfillmentMessages[0].text.text[0];
        chatBox.innerHTML += `<p><strong>Bot:</strong> ${message}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;  // Scrolla verso il basso
    })
    .catch(error => {
        console.error('Errore nella comunicazione con il server:', error);
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML += `<p style="color: red;"><strong>Bot:</strong> Si è verificato un errore nella richiesta. Controlla la tua connessione o riprova più tardi.</p>`;
    });
}

