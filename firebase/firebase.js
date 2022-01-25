import { writeFile } from 'fs';
import { initializeApp } from 'firebase/app';
import { onValue, ref, getDatabase } from 'firebase/database';
import { FIREBASE_API_KEY } from '../config';

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
const db = getDatabase(app);

onValue(ref(db, 'auto'), (snapshot) => {
  const data = snapshot.val();
  const dataJson = JSON.stringify(data);
  console.log(typeof dataJson);
  writeFile('./dataInt/mesures.json', dataJson, (err) => {
    if (err) {
      console.error(err);
    }
  });
});
