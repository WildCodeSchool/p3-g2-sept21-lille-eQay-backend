const express = require('express');
const cors = require('cors');
const { db } = require('./config');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/indoor', async (req, res) => {
  const result = [];
  try {
    db.query(
      `SELECT distinct adresses_longitude, adresses_latitude FROM mesures;`
    ).then((data) => {
      data[0].map((row) => {
        return db
          .query(
            `SELECT * FROM mesures WHERE adresses_longitude=? AND adresses_latitude=? ORDER BY timestamp LIMIT 1;`,
            [row.adresses_longitude, row.adresses_latitude]
          )
          .then((data2) => {
            result.push(data2[0]);
            if (result.length === data[0].length) {
              res.status(200).send(result);
            }
          });
      });
    });
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
