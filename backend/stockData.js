const finnhub = require('finnhub');
const dayjs = require('dayjs');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = require('./finnhub-api-key.json').api_key;
const finnhubClient = new finnhub.DefaultApi();

function unixToNormal(unix) {
	return dayjs.unix(unix).format('YYYY-MM-DD HH:mm:ss');
}

function convertData(stockData) {
	const result = [];
	for (let i = 0; i < stockData.t.length; i++) {
		result.push({
			time: unixToNormal(stockData.t[i]),
			open: stockData.o[i],
			close: stockData.c[i],
			high: stockData.h[i],
			low: stockData.l[i],
		});
	}
	return result;
}

function getStockData(stockName, resolution, dateFrom, dateTo) {
	stockName = stockName.toUpperCase();
	resolution = (resolution + '').toUpperCase();

	return new Promise((resolve, reject) => {
		if (!['1', '5', '15', '30', '60', 'D', 'W', 'M'].includes(resolution)) {
			reject('Invalid resolution');
		}

		finnhubClient.stockCandles(stockName, resolution, dateFrom.unix(), dateTo.unix(), {}, (error, data, response) => {
			if (error || data.s === 'no_data') {
				reject('Invalid stock name');
			} else {
				const result = convertData(data);
				resolve(result);
			}
		});
	});
}

module.exports = getStockData;
