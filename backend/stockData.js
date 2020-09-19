const finnhub = require('finnhub');
const dayjs = require('dayjs');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = require('./finnhub-api-key.json').api_key;
const finnhubClient = new finnhub.DefaultApi();

function unixToNormal(unix) {
	return dayjs.unix(unix).format('YYYY-MM-DD HH:mm:ss');
}

let dateFrom = dayjs().subtract(2, 'day').unix();
let dateTo = dayjs().unix();

function getStockData(stockName, resolution, dateFrom, dateTo) {
	resolution += '';

	return new Promise((resolve, reject) => {
		if (!['1', '5', '15', '30', '60', 'D', 'W', 'M'].includes(resolution)) {
			reject('Invalid resolution');
		}

		finnhubClient.stockCandles(stockName, resolution, dateFrom, dateTo, {}, (error, data, response) => {
			if (error || data.s === 'no_data') {
				reject('Invalid stock name');
			} else {
				data.t = data.t.map(unixToNormal);
				resolve(data);
			}
		});
	});
}

function convertData(stockData) {
	const result = [];
	for (let i = 0; i < stockData.t.length; i++) {
		result.push({
			time: stockData.t[i],
			open: stockData.o[i],
			close: stockData.c[i],
			high: stockData.h[i],
			low: stockData.l[i],
		});
	}
	return result;
}

getStockData('AAPL', 60, dateFrom, dateTo).then((data) => {
	const result = convertData(data);
	console.log(JSON.stringify(result));
});
