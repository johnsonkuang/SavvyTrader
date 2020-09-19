const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
// initialize firebase
const serviceAccount = require('./savvytrader-30ec3-firebase-adminsdk.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

router.use(express.json());

// add a new 'trade' prediction to the trades collection
/*
Add all fields for a trade/prediction except dateMade
currentAmount:106.84
dateResult:September 18, 2020 at 6:22:00 PM UTC-7
intervalType:"hour"
predictedAmount:108
stockSymbol:"AAPL"
trader:"vishal"
*/
router.post('/addPrediction', (req, res) => {
  req.body.dateMade = admin.firestore.Timestamp.fromDate(new Date());
  addToCollection(req.body, db, "trades").then(result => {
    console.log('Added document with ID: ', result.id);
    res.sendStatus(200);
  })
  .catch(() => {
    console.log(result);
    console.log('Error adding document/prediction');
    res.sendStatus(500);
  });
});

// add a new 'trader' / user to the traders collection
/*
set field for initial energy and nothing else for nauw UwU
*/

module.exports = router;


async function addToCollection(data, db, col) {
  const queryRef = db.collection(col);
  const result = await queryRef.add(data);
  return result;
}
