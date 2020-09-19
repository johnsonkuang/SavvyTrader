const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use('/trades', require(path.join(__dirname, 'routes/trades')))

app.use('/leaderboard', require(path.join(__dirname, 'routes/leaderboard')));

app.use('/', require(path.join(__dirname, 'routes/main')));

app.use(function (req, res) {
  res.status(404).render('404');
});


var server = app.listen(PORT, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("SavvyTrader listening at http://%s:%s", host, port);
})
