const { writeFile } = require('fs');
const { initializeApp } = require('firebase/app');
const { onValue, ref, getDatabase } = require('firebase/database');
const { db, FIREBASE_API_KEY } = require('./config');
const dbFirebaseJson = require('./dataInt/mesures.json');

async function getMesuresDb() {
  const arrayOfFirstKeys = Object.keys(dbFirebaseJson);
  arrayOfFirstKeys.map((key1) => {
    const arrayOfSecondeKeys = Object.keys(dbFirebaseJson[key1]);
    return arrayOfSecondeKeys.map(async (key2) => {
      if (dbFirebaseJson[key1][key2].coor) {
        const { mesures } = dbFirebaseJson[key1][key2];
        const timestamp = key2;
        const fullCoors = dbFirebaseJson[key1][key2].coor.split(',');
        const latitude = fullCoors[0];
        const longitude = fullCoors[1];
        db.query(
          `SELECT * FROM eQAI.mesures Where adresses_latitude=? AND adresses_longitude =? AND timestamp=FROM_UNIXTIME(?) ;`,
          [latitude, longitude, parseInt(timestamp / 1000, 10)]
        ).then((data) => {
          if (!data[0].length) {
            try {
              const test = db.query(
                `INSERT INTO mesures (aqi, pm1, pm10, pm25, ppm, humidity, temperature, adresses_latitude, adresses_longitude, timestamp, type)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?),?)
              `,
                [
                  typeof mesures.aqi === 'string' ? null : mesures.aqi,
                  typeof mesures.pm1 === 'string' ? null : mesures.pm1,
                  typeof mesures.pm10 === 'string' ? null : mesures.pm10,
                  typeof mesures.pm25 === 'string' ? null : mesures.pm25,
                  typeof mesures.ppm === 'string' ? null : mesures.ppm,
                  typeof mesures.humidity === 'string'
                    ? null
                    : mesures.humidity,
                  typeof mesures.temperature === 'string'
                    ? null
                    : mesures.temperature,
                  latitude,
                  longitude,
                  parseInt(timestamp / 1000, 10),
                  'Int',
                ]
              );
              console.log(test.id);
            } catch (error) {
              console.log(error);
            }
          }
        });
      }
    });
  });
}
async function getAllAddressesDb() {
  const arrayOfFirstKeys = Object.keys(dbFirebaseJson);
  arrayOfFirstKeys.map(async (key1) => {
    const arrayOfKeys = Object.keys(dbFirebaseJson[key1]);
    arrayOfKeys.map(async (key2, id) => {
      if (dbFirebaseJson[key1][key2].coor) {
        const fullCoors = dbFirebaseJson[key1][key2].coor.split(',');
        const latitude = fullCoors[0];
        const longitude = fullCoors[1];
        try {
          await db.query(
            `INSERT INTO adresses (latitude, longitude)
                VALUES (?, ?);
                `,
            [latitude, longitude]
          );
        } catch (error) {
          console.log(`ID : ${id} Error : Existing values in DB `);
        }
      }
    });
    getMesuresDb();
  });
}
async function jsonFirebase() {
  const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: 'batemob.firebaseapp.com',
    databaseURL: 'https://batemob.firebaseio.com',
    projectId: 'batemob',
    storageBucket: 'batemob.appspot.com',
    messagingSenderId: '43693612341',
    appId: '1:43693612341:web:76db884e55b797397a807c',
    measurementId: 'G-NJ84TZT5YP',
  };
  const app = initializeApp(firebaseConfig);
  const dbFirebaseLink = getDatabase(app);
  onValue(ref(dbFirebaseLink, 'auto'), (snapshot) => {
    const data = snapshot.val();
    const dataJson = JSON.stringify(data);
    writeFile('./dataInt/mesures.json', dataJson, (err) => {
      if (err) {
        console.error(err);
      }
      console.log('JSON Create');
    });
    getAllAddressesDb();
  });
}
jsonFirebase();
