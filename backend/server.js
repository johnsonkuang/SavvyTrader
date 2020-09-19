const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
	res.send('Hello World')
});

const server = app.listen(PORT, () => {
	const host = server.address().address;
	const port = server.address().port;
	console.log(`SavvyTrader listening at http://${host}:${port}`);
});
