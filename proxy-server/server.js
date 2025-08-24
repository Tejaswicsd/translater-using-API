import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/translate', async (req, res) => {
  try {
    const response = await axios.post('https://libretranslate.de/translate', req.body, {
      headers: { 'Content-Type': 'application/json' }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.listen(5000, () => console.log('Proxy server running on port 5000'));