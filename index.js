const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { db, backPort } = require('./config');
require('dotenv').config();

const { API_EXT_TOKEN } = process.env;

const app = express();
app.use(express.json());
app.use(cors());

let BDDflashIndoor;
let BDDflashOutdoor;

function UpdateFlashIndoor() {
  const result = [];
  try {
    db.query(
      `SELECT distinct adresses_longitude, adresses_latitude FROM mesures;`
    ).then((data) => {
      data[0].map((row) => {
        return db
          .query(
            `SELECT * FROM mesures WHERE adresses_longitude=? AND adresses_latitude=? AND type="Int" ORDER BY timestamp desc LIMIT 1;`,
            [row.adresses_longitude, row.adresses_latitude]
          )
          .then((data2) => {
            result.push(data2[0]);
            if (result.length === data[0].length) {
              BDDflashIndoor = result;
              console.log('Update indoor value');
            }
          });
      });
    });
  } catch (error) {
    console.log(error);
  }
}
function UpdateFlashOutdoor() {
  const result = [];
  try {
    db.query(
      `SELECT distinct adresses_longitude, adresses_latitude FROM mesures;`
    ).then((data) => {
      data[0].map((row) => {
        return db
          .query(
            `SELECT * FROM mesures WHERE adresses_longitude=? AND adresses_latitude=? AND type="Ext" ORDER BY timestamp desc LIMIT 1;`,
            [row.adresses_longitude, row.adresses_latitude]
          )
          .then((data2) => {
            result.push(data2[0]);
            if (result.length === data[0].length) {
              BDDflashOutdoor = result;
              console.log('Update outdoor value');
            }
          });
      });
    });
  } catch (error) {
    console.log(error);
  }
}

UpdateFlashIndoor();
UpdateFlashOutdoor();

setInterval(() => {
  UpdateFlashIndoor();
  UpdateFlashOutdoor();
}, 250000);

app.get('/indoor/flash', async (req, res) => {
  try {
    res.status(200).send(BDDflashIndoor);
  } catch (error) {
    console.log(error);
  }
});

app.get('/outdoor/flash', async (req, res) => {
  try {
    res.status(200).send(BDDflashOutdoor);
  } catch (error) {
    console.log(error);
  }
});

app.get('/outdoor/:lat&:lng', (req, res) => {
  const { lat, lng } = req.params;
  try {
    axios
      .get(
        `http://api.waqi.info/feed/geo:${lat};${lng}/?token=${API_EXT_TOKEN}`
      )
      .then((response) => {
        const apiResponse = response.data;
        const information = {
          coords: {
            lat: apiResponse.data.city.geo[0],
            lng: apiResponse.data.city.geo[1],
          },
          aqi: apiResponse.data.aqi,
          no2: apiResponse.data.iaqi.no2.v,
          o3: apiResponse.data.iaqi.o3.v,
          pm10: apiResponse.data.iaqi.pm10.v,
          temp: apiResponse.data.iaqi.t.v,
          pressure: apiResponse.data.iaqi.h.v,
          humidity: apiResponse.data.iaqi.h.v,
          wind: apiResponse.data.iaqi.wg.v,
        };
        res.status(200).send(information);
      });
  } catch (error) {
    console.error(error);
  }
});

app.use('/', (req, res) => {
  res.status(404).send('Route not found! ');
});

app.listen(backPort, () => {
  console.log('Bienvenue sur eQAI !');
});
