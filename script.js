const cryptoIds = ['bitcoin', 'ethereum', 'ripple'];  // Esempio di criptovalute supportate
const apiUrl = 'http://127.0.0.1:5000';  // URL del backend Flask

// Configurazione di Chart.js per il grafico delle previsioni
const ctx = document.getElementById('predictionChart').getContext('2d');
const predictionChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu'],
        datasets: []
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});

// Funzione per ottenere dati in tempo reale
async function fetchCryptoData() {
    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = '';  // Pulisci il contenitore

    for (const cryptoId of cryptoIds) {
        const response = await fetch(`${apiUrl}/api/price/${cryptoId}`);
        const data = await response.json();
        dataContainer.innerHTML += `
            <p>Prezzo ${cryptoId} (USD): <strong>$${data.price}</strong></p>
        `;
    }
}

// Funzione per ottenere previsioni
async function fetchPredictions() {
    for (const cryptoId of cryptoIds) {
        const response = await fetch(`${apiUrl}/api/predict/${cryptoId}`);
        const data = await response.json();
        console.log(`Previsioni per ${cryptoId}:`, data.prediction);

        // Aggiungi i dati al grafico
        predictionChart.data.datasets.push({
            label: `Prezzo ${cryptoId} (Previsto)`,
            data: data.prediction[0],  // Usa i dati della previsione
            borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,  // Colore casuale
            fill: false,
        });
    }
    predictionChart.update();  // Aggiorna il grafico
}

// Aggiorna i dati ogni 60 secondi
fetchCryptoData();
fetchPredictions();
setInterval(fetchCryptoData, 60000);
async function fetchCryptoData() {
    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = '';  // Pulisci il contenitore

    try {
        for (const cryptoId of cryptoIds) {
            const response = await fetch(`${apiUrl}/api/price/${cryptoId}`);
            if (!response.ok) throw new Error(`Errore nella richiesta per ${cryptoId}`);
            const data = await response.json();
            dataContainer.innerHTML += `
                <p>Prezzo ${cryptoId} (USD): <strong>$${data.price}</strong></p>
            `;
        }
    } catch (error) {
        console.error('Errore nel recupero dei dati:', error);
        dataContainer.innerHTML = `<p style="color: red;">Errore nel caricamento dei dati.</p>`;
    }
}function sendMessage() {
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
        chatBox.innerHTML += `<p><strong>Bot:</strong> Si è verificato un errore nella richiesta.</p>`;
    });
}



