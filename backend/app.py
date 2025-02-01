from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
from tensorflow.keras.models import load_model
import requests

app = Flask(__name__)
CORS(app)  # Abilita CORS per consentire richieste dal frontend

# Carica il modello pre-addestrato
model = load_model('model/crypto_model.h5')

# Funzione per ottenere dati in tempo reale da CoinGecko
def get_crypto_data(crypto_id):
    url = f'https://api.coingecko.com/api/v3/simple/price?ids={crypto_id}&vs_currencies=usd'
    response = requests.get(url)
    data = response.json()
    return data[crypto_id]['usd']

# Endpoint per ottenere il prezzo corrente
@app.route('/api/price/<crypto_id>', methods=['GET'])
def get_price(crypto_id):
    price = get_crypto_data(crypto_id)
    return jsonify({'crypto': crypto_id, 'price': price})

# Endpoint per ottenere previsioni
@app.route('/api/predict/<crypto_id>', methods=['GET'])
def predict(crypto_id):
    # Simula dati di input per il modello (adatta in base al tuo modello)
    input_data = np.array([[1, 2, 3, 4, 5]])  # Esempio di dati di input
    prediction = model.predict(input_data)    # Ottieni la previsione
    return jsonify({'crypto': crypto_id, 'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
