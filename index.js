const express = require('express');

const app = express();

app.get('/characters', async (req, res) => {
  res.status(404).send('Route not found! ');
});

app.use('/', (req, res) => {
  res.status(404).send('Route not found! ');
});

app.listen(5050, () => {
  console.log('Terra Battle API now available on http://localhost:5050 !');
});
