// Configurazione di Chart.js per il grafico delle previsioni
const ctx = document.getElementById('predictionChart').getContext('2d');
const predictionChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu'],
        datasets: [{
            label: 'Prezzo Bitcoin (Previsto)',
            data: [30000, 32000, 31000, 33000, 34000, 35000],
            borderColor: '#6200ea',
            fill: false,
        }]
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

// Funzione per ottenere dati in tempo reale da un'API crypto (es. CoinGecko)
async function fetchCryptoData() {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
    try {
        const response = await fetch(url);
        const data = await response.json();
        const bitcoinPrice = data.bitcoin.usd;
        document.getElementById('data-container').innerHTML = `
            <p>Prezzo Bitcoin (USD): <strong>$${bitcoinPrice}</strong></p>
        `;
    } catch (error) {
        console.error('Errore nel recupero dei dati:', error);
    }
}

// Aggiorna i dati ogni 60 secondi
fetchCryptoData();
setInterval(fetchCryptoData, 60000);
