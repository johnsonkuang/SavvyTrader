const dayjs = require('dayjs');
const express = require('express');
const app = express();
const queries = require('./FirestoreQueries')
const getStockData = require('./stockData');

const PORT = process.env.PORT || 8080;
const admin = require('firebase-admin');
// initialize firebase
const serviceAccount = require('./savvytrader-30ec3-firebase-adminsdk.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(express.json());

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
app.post('/addPrediction', (req, res) => {
  user = req.body.trader;
	console.log(user);
  queries.getUserInfo(user, db, "traders").then(result => {
    console.log(result);
    if (result != null && result.energy > 10) {
      queries.setUserEnergy(user, result.energy - 10, db, "traders").then(uer => {
        console.log("reduced energy for user: ", req.body.user);
      })
      .catch(() => {
        console.log(uer);
        res.sendStatus(500);
        return;
      })
      req.body.dateMade = admin.firestore.Timestamp.fromDate(new Date());
      queries.addToCollection(req.body, db, "trades").then(result => {
        console.log('Added document with ID: ', result.id);
        res.sendStatus(200);
      })
      .catch(() => {
        console.log(result);
        console.log('Error adding document/prediction');
        res.sendStatus(500);
      })
    }
    else {
      console.log('Not enough energy');
      res.sendStatus(200);
    }
  });
});

// add a new 'trader' / user to the traders collection
/*
set key for name of user and initial energy and nothing else for nauw UwU
user:"Armand",
energy:9001
*/
app.post('/addUser', (req, res) => {
  req.body.points = 0;
  const username = req.body.user;
  delete req.body.user;
  queries.addToCollectionWithID(req.body, db, "traders", username).then(result => {
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
app.get('/getPredictions', (req, res) => {
  queries.getUsersPredictions(req.body.user, db, "trades").then(result => {
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

// get the top 10 users from the firestore based on points
app.get('/getLeaderboard', (req, res) => {
  queries.getLeaderBoard(db, "traders").then(result => {
    if (result.empty) {
      console.log('No matching users');
      return result;
    }
    console.log("Got all top users");
    res.send(result);
  })
  .catch(() => {
    console.log(result);
    console.log('Error getting predictions from user: ', req.body.user);
    res.sendStatus(500);
  });
});

// get a specific users infofrom username
app.get('/getUserInfo', (req, res) => {
  queries.getUserInfo(req.body.user, db, "traders").then(result => {
    if (result == null) {
      console.log('No matching users');
      return result;
    }
    console.log("Got user info");
    res.send(result);
  })
  .catch(() => {
    console.log(result);
    console.log('Error getting user: ', req.body.user);
    res.sendStatus(500);
  });
});
app.get('/', (req, res) => {
	res.send('Hello World')
});

app.get('/getCandlesticks', async (req, res) => {
	let period = (req.query.period || '').toLowerCase();

	if (!req.query.stock || !['day', 'week', 'month', 'year'].includes(period)) {
		res.status(400).send('Invalid period or missing stock name');
		return;
	}

	const stock = req.query.stock;
	const dateFrom = dayjs().subtract(1, period);
	const dateTo = dayjs();
	const resolution = {
		day: '30',
		week: '60',
		month: 'D',
		year: 'W',
  }[period];

  let candlesticks;

  try {
    candlesticks = await getStockData(stock, resolution, dateFrom, dateTo);
  } catch (error) {
    res.status(400).send('Invalid stock name');
    return;
  }

	res.send(candlesticks);
});

const server = app.listen(PORT, () => {
	const host = server.address().address;
	const port = server.address().port;
	console.log(`SavvyTrader listening at http://${host}:${port}`);
});
