const express = require('express');
const app = express();
const admin = require('firebase-admin');
// initialize firebase
const serviceAccount = require('./savvytrader-30ec3-firebase-adminsdk.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const traders = db.collection('traders');
const trades = db.collection('trades');

app.use(express.json());

app.post('/addPrediction', (req, res) => {
  const result = await trades.add(req.body);
  console.log('Added document with ID: ', result.id);
}
