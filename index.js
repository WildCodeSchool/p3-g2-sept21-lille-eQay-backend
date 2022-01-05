const express = require('express');
const cors = require('cors');
const axios = require('axios');
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

app.get('/outdoor/:lat&:lng', (req, res) => {
  const { lat, lng } = req.params;
  try {
    axios
      .get(
        `http://api.waqi.info/feed/geo:${lat};${lng}/?token=ef1671322695b4ceecbbe02ececa1c69ae2ee31f`
      )
      .then((response) => {
        const apiResponse = response.data;
        const information = {
          aqi: '',
          no2: '',
          so2: '',
          o3: '',
          pm10: '',
          pm25: '',
        };
        information.aqi = apiResponse.data.aqi;
        information.no2 = apiResponse.data.iaqi.no2.v;
        information.so2 = apiResponse.data.aqi;
        information.o3 = apiResponse.data.aqi;
        const { pm10 } = apiResponse.data.forecast.daily;
        information.pm10 = pm10;
        information.pm25 = apiResponse.data.forecast.daily.pm25;
        res.status(200).send(information);
      });
  } catch (error) {
    console.error(error, lat);
  }
});

// http://api.waqi.info/feed/geo:49.28897858;1.80860305/?token=ef1671322695b4ceecbbe02ececa1c69ae2ee31f
// http://api.waqi.info//map/bounds/?token=ef1671322695b4ceecbbe02ececa1c69ae2ee31f&latlng=49.28897858;1.80860305
// https://api.waqi.info/feed/paris/?token=ef1671322695b4ceecbbe02ececa1c69ae2ee31f

app.use('/', (req, res) => {
  res.status(404).send('Route not found! ');
});

app.listen(5050, () => {
  console.log('Terra Battle API now available on http://localhost:5050 !');
});
