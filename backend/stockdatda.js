const finnhub = require('finnhub');
const dayjs = require('dayjs');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = require('./finnhub-api-key.json').api_key;
const finnhubClient = new finnhub.DefaultApi();

function unixToNormal(unix) {
	return dayjs.unix(unix).format('YYYY-MM-DD HH:mm:ss');
}

let stock = 'AAPL';
let resolution = '60';

let dateFrom = dayjs().subtract(1, 'day').unix();
let dateTo = dayjs().unix();

finnhubClient.stockCandles(stock, resolution, dateFrom, dateTo, {}, (error, data, response) => {
	data.t = data.t.map(unixToNormal);
	console.log(data);
});