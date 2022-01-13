const { load } = require('csv-load-sync');
const axios = require('axios');
const fs = require('fs');
const fspromise = require('fs/promises');

const { db } = require('./config');

const typeOfMesure = 'Ext';
let mesures;

function getMesuresDb() {
  const arrayOfFirstKeys = Object.keys(mesures);
  console.log(arrayOfFirstKeys);
  arrayOfFirstKeys.map((key) => {
    db.query(
      `SELECT * FROM eQAI.mesures Where adresses_latitude=? AND adresses_longitude =? AND timestamp=? ;`,
      [
        parseFloat(mesures[key].lat),
        parseFloat(mesures[key].lng),
        mesures[key].datetime,
      ]
    ).then((data) => {
      if (!data[0].length) {
        console.log('data not fount in DB you can push');
        try {
          db.query(
            `INSERT INTO adresses (latitude,longitude)
                      VALUES (?, ?)
                      `,
            [mesures[key].lat, mesures[key].lng]
          );
        } catch (error) {
          console.log(error);
        }
        try {
          db.query(
            `INSERT INTO mesures (adresses_latitude, adresses_longitude, timestamp,no,no2,o3,pm10,type )
                      VALUES (?, ?, ?, ?, ?, ?, ?,? )
                      `,
            [
              parseFloat(mesures[key].lat),
              parseFloat(mesures[key].lng),
              mesures[key].datetime,
              mesures[key].polluants.NO,
              mesures[key].polluants.NO2,
              mesures[key].polluants.O3,
              mesures[key].polluants.PM10 === ''
                ? null
                : mesures[key].polluants.PM10,
              typeOfMesure,
            ]
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log('Same value found in DB');
      }
    });
    return null;
  });
}

const getGouvMesure = async () => {
  if (fs.existsSync('./dataExt/mesures.csv')) {
    fs.unlinkSync('./dataExt/mesures.csv');
  }

  // LINK FOR GET FILE : https://www.lcsqa.org/system/files/media/documents/Liste%20points%20de%20mesures%202020%20pour%20site%20LCSQA_221292021.xlsx
  // -------------------------------------- SITES
  const rawSites = load('./dataExt/stations.csv');
  const sites = rawSites.reduce((accu, currSite) => {
    const newAccu = JSON.parse(JSON.stringify(accu));
    newAccu[currSite['Code station']] = {
      lat: currSite.Latitude.replace(',', '.'),
      lng: currSite.Longitude.replace(',', '.'),
    };
    return newAccu;
  }, {});

  try {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(1 + now.getMonth()).padStart(2, '0');
    const year = now.getFullYear();
    const path = `https://files.data.gouv.fr/lcsqa/concentrations-de-polluants-atmospheriques-reglementes/temps-reel/${year}/FR_E2_${year}-${month}-${day}.csv`;
    const resp = await axios.get(path);
    const mesureCSV = resp.data.replace(/;/g, ',');
    fspromise
      .writeFile('./dataExt/mesures.csv', mesureCSV, (err) => {
        if (err) {
          console.error(err);
        }
      })
      .then(() => {
        // -------------------------------------- MESURES
        const rawMesures = load('./dataExt/mesures.csv');
        mesures = rawMesures.reduce((accu, curr, i) => {
          if (i % 100 === 1) console.log(`Key #${i}`);

          const site = curr['code site'];
          const datetime = curr['Date de début'];
          const key = `${site} ${datetime}`;

          if (!sites[site]) {
            console.log(`Site inconnu: ${site}`);
            return accu;
          }

          const { lat, lng } = sites[site];

          const newAccu = JSON.parse(JSON.stringify(accu));
          if (!newAccu[key]) {
            newAccu[key] = {
              lat,
              lng,
              datetime,
              polluants: {
                [curr.Polluant]: curr['valeur brute'],
              },
            };
          } else {
            newAccu[key] = {
              ...accu[key],
              polluants: {
                ...accu[key].polluants,
                [curr.Polluant]: curr['valeur brute'],
              },
            };
          }
          return newAccu;
        }, {});
        getMesuresDb();
      });
  } catch (err) {
    console.error(err);
  }
};
getGouvMesure();
