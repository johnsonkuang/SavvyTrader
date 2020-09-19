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
set key for name of user and initial energy and nothing else for nauw UwU
user:"Armand",
energy:9001
*/
router.post('/addUser', (req, res) => {
  req.body.points = 0;
  const username = req.body.user;
  delete req.body.user;
  addToCollectionWithID(req.body, db, "traders", username).then(result => {
    console.log("Added user with name ", username);
    res.sendStatus(200);
  })
  .catch(() => {
    console.log(result);
    console.log('Error adding document/user');
    res.sendStatus(500);
  });
});


// get all of a users predictions/trades
/*
please only send the user name and nothing else for nawuuwuwuwuwuuw
*/
router.get('/getPredictions', (req, res) => {
  getUsersPredictions(req.body.user, db, "trades").then(result => {
    if (result.empty) {
      console.log('No matching predictions');
      return result;
    }
    console.log("Got all trades from user ", req.body.user);
    res.send(result);
  })
  .catch(() => {
    console.log(result);
    console.log('Error getting predictions from user: ', req.body.user);
    res.sendStatus(500);
  });
});
// export router
module.exports = router;

// further implementation of asynchronous parts of firestore queries
async function addToCollection(data, db, col) {
  const queryRef = db.collection(col);
  const result = await queryRef.add(data);
  return result;
}
async function addToCollectionWithID(data, db, col, id) {
  const queryRef = db.collection(col);
  const result = await queryRef.doc(id).set(data);
  return result;
}
async function getUsersPredictions(user, db, col) {
  let result = [];
  const queryRef = db.collection(col);
  const resultRef = await queryRef.where('trader', '==', user).get();
  return resultRef.docs.map(doc => doc.data());
}
