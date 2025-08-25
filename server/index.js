require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const EXTERNAL_URL = process.env.EXTERNAL_EMAIL_URL || 'https://wservices.casavision.com/ApiWebHub/api/Email/send';

app.post('/api/send-quote', async (req, res) => {
  try {
    const body = req.body;
    // Basic validation
    if (!body || !body.to || !body.subject || !body.htmlBody || !body.from) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const resp = await axios.post(EXTERNAL_URL, body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    });

    return res.status(resp.status).json(resp.data);
  } catch (err) {
    console.error(err?.response?.data || err.message || err);
    return res.status(502).json({ error: 'Proxy request failed' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Proxy server listening on ${port}`));
