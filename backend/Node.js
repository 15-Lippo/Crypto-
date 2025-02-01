app.post('/webhook', async (req, res) => {
  const cripto = req.body.queryResult.parameters.cripto;
  if (!cripto || typeof cripto !== 'string') {
    return res.status(400).json({
      fulfillmentMessages: [{ text: { text: ['Input non valido'] } }]
    });
  }

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
    res.status(500).json({
      fulfillmentMessages: [{ text: { text: ['Si è verificato un errore nel server'] } }]
    });
  }
});
