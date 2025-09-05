const express = require('express');
const cors = require('cors');

const app = express();

// فقط پنل اجازه داشته باشه به API وصل شه
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://panel.celexcargo.com';
app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const PORT = 5000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`API listening on http://127.0.0.1:${PORT}`);
});
