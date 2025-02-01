const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
  const cripto = req.body.queryResult.parameters.cripto;
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${cripto}&vs_currencies=usd`);
    const price = response.data[cripto]?.usd;
    if (price) {
      res.json({
        fulfillmentMessages: [{ text: { text: [`Il prezzo di ${cripto} è $${price}`] } }]
      });
    } else {
       res.json({
        fulfillmentMessages: [{ text: { text: [`Non ho trovato informazioni per ${cripto}`] } }]
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      fulfillmentMessages: [{ text: { text: [`Si è verificato un errore`] } }]
    });
  }
});

app.listen(3000, () => console.log('Server listening on port 3000'));
