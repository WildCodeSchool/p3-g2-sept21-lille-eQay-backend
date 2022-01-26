const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { db } = require('./config');
require('dotenv').config();

const { API_EXT_TOKEN } = process.env;

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
            `SELECT * FROM mesures WHERE adresses_longitude=? AND adresses_latitude=? ORDER BY timestamp desc LIMIT 1;`,
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

app.listen(5050, () => {
  console.log('Terra Battle API now available on http://localhost:5050 !');
});
