import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Servir les fichiers statiques construits par Vite
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy pour l'API Tara Money
app.post('/api/tara/paymentlinks', async (req, res) => {
  try {
    const response = await fetch('https://www.dklo.co/api/tara/paymentlinks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Erreur Proxy Tara:', error);
    res.status(500).json({ status: 'error', message: 'Erreur de proxy vers Tara API' });
  }
});

// Toutes les autres requêtes retournent l'index.html (pour le routing React)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
