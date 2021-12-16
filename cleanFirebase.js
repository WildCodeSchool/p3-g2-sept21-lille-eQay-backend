const dbFirebase = require('./batemob-export.json');

const { db } = require('./config');

async function getAllAddressesDb() {
  const firstKey = 'nsq0rZeZizMfPK6iTGGyljmD2nN2';
  const arrayOfKey = Object.keys(dbFirebase.auto[firstKey]);
  arrayOfKey.map(async (key) => {
    const fullCoors = dbFirebase.auto[firstKey][key].coor.split(',');
    const latitude = fullCoors[0];
    const longitude = fullCoors[1];
    await db.query(
      `INSERT INTO adresses (latitude, longitude)
          VALUES (?, ?);
          `,
      [latitude, longitude]
    );
  });
}
getAllAddressesDb();

async function getIdAdresses(lat, long) {
  const result = await db.query(
    `SELECT id FROM adresses WHERE latitude= ? AND longitude= ?`,
    [lat, long]
  );
  return result[0][0].id;
}

function getMesuresDb() {
  const firstKey = 'nsq0rZeZizMfPK6iTGGyljmD2nN2';
  const arrayOfKey = Object.keys(dbFirebase.auto[firstKey]);
  arrayOfKey.map(async (key) => {
    const { mesures } = dbFirebase.auto[firstKey][key];
    const fullCoors = dbFirebase.auto[firstKey][key].coor.split(',');
    const latitude = fullCoors[0];
    const longitude = fullCoors[1];
    await db.query(
      `INSERT INTO mesures (aqi, pm1, pm10, pm25, ppm, humidity, temperature, adresses_latitude, adresses_longitude)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
      [
        typeof mesures.aqi === 'string' ? null : mesures.aqi,
        typeof mesures.pm1 === 'string' ? null : mesures.pm1,
        typeof mesures.pm10 === 'string' ? null : mesures.pm10,
        typeof mesures.pm25 === 'string' ? null : mesures.pm25,
        typeof mesures.ppm === 'string' ? null : mesures.ppm,
        typeof mesures.humidity === 'string' ? null : mesures.humidity,
        typeof mesures.temperature === 'string' ? null : mesures.temperature,
        latitude,
        longitude,
      ]
    );
  });
}
getMesuresDb();

export default getIdAdresses;
