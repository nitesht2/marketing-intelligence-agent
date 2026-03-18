const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const chatHandler = require('./api/chat');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API route
app.post('/api/chat', (req, res) => chatHandler(req, res));

app.listen(PORT, () => {
  console.log(`\n  Marketing Intelligence Agent`);
  console.log(`  ──────────────────────────────────────────`);
  console.log(`  Running at: http://localhost:${PORT}`);
  console.log(`  API Key: ${process.env.ANTHROPIC_API_KEY ? 'configured' : 'MISSING — add to .env'}\n`);
});
