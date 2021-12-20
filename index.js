const express = require('express');
const cors = require('cors');
const { db } = require('./config');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/characters', async (req, res) => {
  res.status(404).send('Route not found! ');
});

app.get('/indoor', async (req, res) => {
  try {
    const rows = await db.query(`SELECT * FROM mesures;`);
    await res.status(200).send(rows);
  } catch (error) {
    console.log(error);
  }
});

app.use('/', (req, res) => {
  res.status(404).send('Route not found! ');
});

app.listen(5050, () => {
  console.log('Terra Battle API now available on http://localhost:5050 !');
});
