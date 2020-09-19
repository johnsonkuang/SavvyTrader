const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
	res.send('Hello World')
});

app.use('/', require('./FirestoreQueries.js'));

const server = app.listen(PORT, () => {
	const host = server.address().address;
	const port = server.address().port;
	console.log(`SavvyTrader listening at http://${host}:${port}`);
});
