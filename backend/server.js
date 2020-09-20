const dayjs = require('dayjs');
const express = require('express');
const cors = require('cors');
const app = express();
const queries = require('./FirestoreQueries')
const { getStockData, getCurrentPrice, getPriceTarget } = require('./stockData');


const PORT = process.env.PORT || 8080;
const admin = require('firebase-admin');
// initialize firebase
const serviceAccount = require('./savvytrader-30ec3-firebase-adminsdk.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000'
}));

// add a new 'trade' prediction to the trades collection
/*
use request body
Add all fields for a trade/prediction except dateMade
ex.
currentAmount:106.84
dateResult:September 18, 2020 at 6:22:00 PM UTC-7
intervalType:"hour"
predictedAmount:108
stockSymbol:"AAPL"
trader:"vishal"
*/
app.post('/addPrediction', (req, res) => {
  if (!req.body.currentAmount) {
    res.status(400);
    res.send('Invalid or missing value for currentAmount (price of stock)');
    return;
  }
  if (!req.body.dateResult) {
    res.status(400);
    res.send('Invalid or missing date for target result date of stock');
    return;
  }
  if (!req.body.intervalType) {
    res.status(400).send('Invalid or missing value for intervalType');
    return;
  }
  if (!req.body.predictedAmount) {
    res.status(400);
    res.send('Invalid or missing value for predictedAmount (price of stock)');
    return;
  }
  if (!req.body.stockSymbol) {
    res.status(400).send('Invalid or missing stockSymbol');
    return;
  }
  if (!req.body.trader) {
    res.status(400).send('Invalid or missing trader value (username)');
    return;
  }
  user = req.body.trader;
  queries.getUserInfo(user, db, "traders").then(result => {
    if (result != null && result.energy > 10) {
      queries.setUserEnergy(user, result.energy - 10, db, "traders")
      .catch((error) => {
        console.log(error);
        res.status(500).send('Internal error setting users energy');
        return;
      })
      req.body.dateMade = admin.firestore.Timestamp.fromDate(new Date());
      queries.addToCollection(req.body, db, "trades").then(result => {
        res.status(200).send('Added document with ID: '+ result.id);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Internal error adding document/prediction');
      })
    }
    else {
      res.status(400).send("Not enough energy for user or user does not exist");
    }
  });
});

// add a new 'trader' / user to the traders collection
/*
set key for name of user and initial energy and nothing else for nauw UwU
use request body
user:"Armand",
energy:9001
*/
app.post('/addUser', (req, res) => {
  if (!req.body.user) {
    res.status(400).send('Invalid or missing user value');
    return;
  }
  if (!req.body.energy) {
    res.status(400).send('Invalid or missing energy value');
    return;
  }
  req.body.points = 0;
  const username = req.body.user;
  exists = false;
  delete req.body.user;
  queries.getUserInfo(username, db, "traders")
	.then(result => {
    if (result != null) {
      res.status(400).send('User exists');
      return;
    }
    else {
      queries.addToCollectionWithID(req.body, db, "traders", username)
    	.then(result => {
        res.status(200).send("Added user with name " + username);
        return;
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error adding document/user');
        return;
      });
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Internal error getting user: ' + req.query.user);
    return;
  });
});

// add energy for a specific trader
/*
use request body
set values for keys user and energy to add like...
user:"vishal",
energy"50"
*/
app.post('/addEnergyToUser', (req, res) => {
  if (!req.body.user) {
    res.status(400).send('Invalid or missing user');
    return;
  }
  if (!req.body.energy) {
    res.status(400).send('Invalid or missing energy value');
    return;
  }
	user = req.body.user;
	deltaEnergy = req.body.energy;
  queries.getUserInfo(user, db, "traders")
  .then(result => {
    if (result == null) {
      res.status(400).send('Invalid or missing user');
      return;
    }
    else {
      queries.getUserInfo(user, db, "traders")
    	  .then(userInfo =>
    			queries.setUserEnergy(user, userInfo.energy + deltaEnergy, db, "traders"))
    		.then(result => {
    			res.status(200).send("added energy "+ deltaEnergy);
          return;
    		})
    		.catch((err) => {
          console.log(err);
          return;
    		});
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Internal error getting user: ' + req.query.user);
  });
})

//add points for a traders
/*
use request body
{
user: "armand",
points: 10
}
*/
app.post('/addPointsToUser', (req, res) => {
  if (!req.body.user) {
    res.status(400).send('Invalid or missing user');
    return;
  }
  if (!req.body.points) {
    res.status(400).send('Invalid or missing points value');
    return;
  }
	user = req.body.user;
	deltaPoints = req.body.points;
  queries.getUserInfo(user, db, "traders")
  .then(result => {
    if (result == null) {
      res.status(400).send('Invalid or missing user');
      return;
    }
    else {
      queries.getUserInfo(user, db, "traders")
    	  .then(userInfo =>
    			queries.setUserPoints(user, userInfo.points + deltaPoints, db, "traders"))
    		.then(result => {
    			res.status(200).send("added points "+ deltaPoints);
          return;
    		})
    		.catch((err) => {
          console.log(err);
    			res.status(500).send("Internal error adding points");
          return;
    		});
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Internal error getting user: ' + req.query.user);
  });
})

// get all of a users predictions/trades
/*
please only send the user name and nothing else for nawuuwuwuwuwuuw
requires
{
user: value
}
*/
// user request query
app.get('/getPredictions', (req, res) => {
  if (!req.query.user) {
    res.status(400).send('Invalid or missing user');
    return;
  }
  queries.getUsersPredictions(req.query.user, db, "trades")
	.then(result => {
    res.send(result);
  })
  .catch((err) => {
    console.log(err);
    res.status(500);
    res.send('Internal error getting predictions from user: ' + req.query.user);
  });
});

// get the top 10 users from the firestore based on points
// does not need any params
app.get('/getLeaderboard', (req, res) => {
  queries.getLeaderBoard(db, "traders")
	.then(result => {
    res.send(result);
  })
  .catch((err) => {
		console.log(err);
    res.status(500).send('Internal error getting leaderboard');
  });
});

// get a specific users info from username
// use request query
// requires {user: value}
app.get('/getUserInfo', (req, res) => {
  if (!req.query.user) {
    res.status(400).send('Invalid or missing user');
    return;
  }
  queries.getUserInfo(req.query.user, db, "traders")
	.then(result => {
    if (result == null) {
      res.status(400).send('Invalid or missing user');
      return;
    }
    res.send(result);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Internal error getting user: ' + req.query.user);
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

app.get('/getCurrentPrice', async (req, res) => {
  const stock = req.query.stock;

  if (!stock) {
    res.status(400).send('Missing stock parameter');
    return;
  }

  let price;
  try {
    price = await getCurrentPrice(stock);
  } catch (error) {
    res.status(400).send('Invalid stock name');
  }

  res.send(price);
});

const server = app.listen(PORT, () => {
	const host = server.address().address;
	const port = server.address().port;
	console.log(`SavvyTrader listening at http://${host}:${port}`);
});
