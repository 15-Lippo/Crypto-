from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
from tensorflow.keras.models import load_model
import requests
import logging

app = Flask(__name__)
CORS(app, origins=["http://localhost"])  # Limita CORS al frontend
logging.basicConfig(level=logging.INFO)

# Carica il modello pre-addestrato
model = load_model('model/crypto_model.h5')

# Funzione per ottenere dati storici (esempio)
def get_historical_data(crypto_id):
    url = f'https://api.coingecko.com/api/v3/coins/{crypto_id}/market_chart?vs_currency=usd&days=5'
    response = requests.get(url)
    data = response.json()
    return data['prices']  # Restituisce una lista di prezzi storici

# Endpoint per ottenere il prezzo corrente
@app.route('/api/price/<crypto_id>', methods=['GET'])
def get_price(crypto_id):
    try:
        url = f'https://api.coingecko.com/api/v3/simple/price?ids={crypto_id}&vs_currencies=usd'
        response = requests.get(url)
        data = response.json()
        price = data[crypto_id]['usd']
        return jsonify({'crypto': crypto_id, 'price': price})
    except Exception as e:
        logging.error(f"Errore: {e}")
        return jsonify({'error': 'Errore nel recupero del prezzo'}), 500

# Endpoint per ottenere previsioni
@app.route('/api/predict/<crypto_id>', methods=['GET'])
def predict(crypto_id):
    try:
        # Ottieni dati storici
        historical_data = get_historical_data(crypto_id)
        if not historical_data:
            return jsonify({'error': 'Dati storici non disponibili'}), 404

        # Prepara i dati di input per il modello
        input_data = np.array([historical_data[-5:]])  # Usa gli ultimi 5 prezzi
        prediction = model.predict(input_data)
        return jsonify({'crypto': crypto_id, 'prediction': prediction.tolist()})
    except Exception as e:
        logging.error(f"Errore: {e}")
        return jsonify({'error': 'Errore nella previsione'}), 500

# Webhook per il chatbot
@app.route('/webhook', methods=['POST'])
def webhook():
    try:
        data = request.json
        cripto = data.get('queryResult', {}).get('parameters', {}).get('cripto', '')
        if not cripto:
            return jsonify({'fulfillmentMessages': [{'text': {'text': ['Input non valido']}}]})

        # Ottieni il prezzo corrente
        url = f'https://api.coingecko.com/api/v3/simple/price?ids={cripto}&vs_currencies=usd'
        response = requests.get(url)
        if response.status_code != 200:
            return jsonify({'fulfillmentMessages': [{'text': {'text': ['Errore nel recupero dei dati']}}]})

        price = response.json().get(cripto, {}).get('usd')
        if price:
            return jsonify({'fulfillmentMessages': [{'text': {'text': [f'Il prezzo di {cripto} è ${price}']}}]})
        else:
            return jsonify({'fulfillmentMessages': [{'text': {'text': [f'Non ho trovato informazioni per {cripto}']}}]})
    except Exception as e:
        logging.error(f"Errore: {e}")
        return jsonify({'fulfillmentMessages': [{'text': {'text': ['Errore nel server']}}]}), 500

if __name__ == '__main__':
    app.run(debug=True)
