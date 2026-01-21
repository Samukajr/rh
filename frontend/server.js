const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Sistema RH Plus rodando em http://localhost:${PORT}`);
});