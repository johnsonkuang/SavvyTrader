const dayjs = require('dayjs');
const { getUserInfo, setUserPoints, getAllPredictions } = require('./FirestoreQueries');
const { getPredictionValue } = require('./scoringFormulas');

module.exports = class {
	constructor(db) {
		this.db = db;
	}

	async start() {
		const activePredictions = await getAllPredictions(this.db, "trades");

		for (let prediction of activePredictions) {
			// only consider predictions after now
			if (dayjs.unix(prediction.dateResult._seconds).isAfter(dayjs())) {
				this.loadPrediction(prediction);
			}
		}
	}

	loadPrediction(prediction) {
		let expiration = dayjs.unix(prediction.dateResult._seconds);

		const diffMs = expiration.diff(dayjs());
		if (diffMs > 0) {
			setTimeout(() => {
				this._onPredictionExpire(prediction);
			}, diffMs);
		} else { // expire immediately
			this._onPredictionExpire(prediction);
		}
	}

	async _onPredictionExpire(prediction) {
		const user = prediction.trader;

		const payoff = await getPredictionValue(prediction);

		console.log(`Trade by user ${user} for ${prediction.stockSymbol} @ $${prediction.predictedAmount} has expired with payoff ${payoff}`);

		if (payoff) {
			const userInfo = await getUserInfo(user, this.db, "traders");
			await setUserPoints(user, userInfo.points + payoff, this.db, "traders");
			console.log(`Points of ${user} have increased from ${userInfo.points} to ${userInfo.points + payoff}`);
		}
	}
}
