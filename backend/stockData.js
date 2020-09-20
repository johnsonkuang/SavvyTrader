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

/**
 * Returns a Promise for a list of candlesticks for the given stock and time period
 *
 * @param {string} stockName ticker symbol
 * @param {'1'|'5'|'15'|'30'|'60'|'D'|'W'|'M'} resolution Resolution of data
 * @param {dayjs.Dayjs} dateFrom Starting date
 * @param {dayjs.Dayjs} dateTo Ending date
 * @returns {Promise<object[]>} List of candlesticks
 */
function getStockData(stockName, resolution, dateFrom, dateTo) {
	stockName = stockName.toUpperCase();
	resolution = (resolution + '').toUpperCase();

	return new Promise((resolve, reject) => {
		if (!['1', '5', '15', '30', '60', 'D', 'W', 'M'].includes(resolution)) {
			reject('Invalid resolution');
		}

		console.log(`Getting stock data for ${stockName} from ${dateFrom.format('YYYY-MM-DD')} to ${dateTo.format('YYYY-MM-DD')} with resolution ${resolution}`);

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

/**
 * Returns a Promise for the current price of the given stock
 * @param {string} stockName ticker symbol
 * @returns {Promise<number>} price in $
 */
function getCurrentPrice(stockName) {
	stockName = stockName.toUpperCase();

	return new Promise((resolve, reject) => {
		console.log(`Getting current price for ${stockName}`);

		finnhubClient.quote(stockName, (error, data, response) => {
			if (error || data.s === 'no_data') {
				reject('Invalid stock name');
			} else {
				resolve(data.c);
			}
		});
	});
}

/**
 * Returns a Promise with some data about analyst predictions.
 * @param {symbol} stockName ticker symbol
 * @returns {Promise<object>} prediction data
 */
function getPriceTarget(stockName) {
	stockName = stockName.toUpperCase();

	return new Promise((resolve, reject) => {
		console.log(`Getting price target for ${stockName}`);

		finnhubClient.priceTarget(stockName, (error, data, response) => {
			if (error || data.s === 'no_data') {
				reject('Invalid stock name');
			} else {
				if (data.symbol) {
					resolve({
						high: data.targetHigh,
						low: data.targetLow,
						average: data.targetMean,
						median: data.targetMedian,
						lastUpdated: unixToNormal(dayjs(data.lastUpdated).unix()),
					});
				} else { // no data, so just use current price
					getCurrentPrice(stockName).then((current) => {
						resolve({
							noData: true,
							high: current,
							low: current,
							average: current,
							median: current,
							lastUpdated: unixToNormal(dayjs().unix()),
						});
					});
				}
			}
		});
	});
}

module.exports.getStockData = getStockData;
module.exports.getCurrentPrice = getCurrentPrice;
module.exports.getPriceTarget = getPriceTarget;
