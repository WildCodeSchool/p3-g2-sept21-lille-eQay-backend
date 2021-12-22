const axios = require('axios');
const { db } = require('./config');

async function updateAdresses() {
  const [coordinates] = await db.query(
    `SELECT latitude, longitude FROM adresses WHERE ville IS NULL AND region IS NULL`
  );

  for (let i = 0; i < coordinates.length; i += 1) {
    const { longitude } = coordinates[i];
    const { latitude } = coordinates[i];

    axios
      .get(
        `https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${latitude}`
      )
      .then((response) => {
        const adresses = response.data;
        const { city } = adresses.features[0].properties;
        const { context } = adresses.features[0].properties;
        const newcontext = context.split(', ');
        const region = newcontext[2];
        const update = db.query(
          `UPDATE eQAI.adresses
          SET ville="${city}", region="${region}"
          WHERE latitude=${latitude} AND longitude=${longitude}`
        );
        return update;
      })
      .catch((error) => console.error(error));
  }
}
updateAdresses();
module.exports = { updateAdresses };
