const dbFirebase = require('./batemob-export.json');

const { db } = require('./config');

async function getAllAddressesDb() {
  const arrayOfFirstKeys = Object.keys(dbFirebase.auto);
  arrayOfFirstKeys.map(async (key1) => {
    const arrayOfKeys = Object.keys(dbFirebase.auto[key1]);
    arrayOfKeys.map(async (key2) => {
      const fullCoors = dbFirebase.auto[key1][key2].coor.split(',');
      const latitude = fullCoors[0];
      const longitude = fullCoors[1];
      await db.query(
        `INSERT INTO adresses (latitude, longitude)
            VALUES (?, ?);
            `,
        [latitude, longitude]
      );
    });
  });
}

function getMesuresDb() {
  const arrayOfFirstKeys = Object.keys(dbFirebase.auto);
  arrayOfFirstKeys.map((key1) => {
    const arrayOfSecondeKeys = Object.keys(dbFirebase.auto[key1]);
    return arrayOfSecondeKeys.map(async (key2) => {
      const { mesures } = dbFirebase.auto[key1][key2];
      const timestamp = key2;
      const fullCoors = dbFirebase.auto[key1][key2].coor.split(',');
      const latitude = fullCoors[0];
      const longitude = fullCoors[1];
      db.query(
        `SELECT * FROM eQAI.mesures Where adresses_latitude=? AND adresses_longitude =? AND timestamp=FROM_UNIXTIME(?) ;`,
        [latitude, longitude, parseInt(timestamp / 1000, 10)]
      ).then((data) => {
        if (!data[0].length) {
          console.log('data not fount in DB you can push');
          try {
            db.query(
              `INSERT INTO mesures (aqi, pm1, pm10, pm25, ppm, humidity, temperature, adresses_latitude, adresses_longitude, timestamp)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?))
              `,
              [
                typeof mesures.aqi === 'string' ? null : mesures.aqi,
                typeof mesures.pm1 === 'string' ? null : mesures.pm1,
                typeof mesures.pm10 === 'string' ? null : mesures.pm10,
                typeof mesures.pm25 === 'string' ? null : mesures.pm25,
                typeof mesures.ppm === 'string' ? null : mesures.ppm,
                typeof mesures.humidity === 'string' ? null : mesures.humidity,
                typeof mesures.temperature === 'string'
                  ? null
                  : mesures.temperature,
                latitude,
                longitude,
                parseInt(timestamp / 1000, 10),
              ]
            );
          } catch (error) {
            console.log(`Error with you INSERT : `, error);
          }
        } else {
          console.log('Same value found in DB');
        }
      });
    });
  });
}

module.exports = { getAllAddressesDb, getMesuresDb };
