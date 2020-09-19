const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;



app.get('/', (req, res) -> {
  res.send('Hello World')
})


var server = app.listen(PORT, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("SavvyTrader listening at http://%s:%s", host, port);
})
