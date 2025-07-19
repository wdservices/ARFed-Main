// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccount.json'); // path to your downloaded JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;