const admin = require('firebase-admin');

const serviceAccount = require('./savvytrader-30ec3-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const traders = db.collection('traders');
const trades = db.collection('trades');
