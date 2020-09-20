const { getCurrentPrice, getPriceTarget } = require('./stockData');
const intervalScale =
{
  "hour" : 1,
  "day" : 10,
  "week" : 100,
  "month" : 1000,
  "year" : 10000
};
async function getPredictionEnergyCost(prediction, stockSymbol) {
  let analyst = (await getPriceTarget(stockSymbol)).median;
  let current = await getCurrentPrice(stockSymbol);
  let priceChange = 1; // TODO: Johnson
  return 1000 * (1 + (Math.abs(analyst - prediction)) / analyst) * ((current - predicted) / priceChange);
}

// TODO: Armand
async function predictionValue(prediction) {
  const currentPrice = await getCurrentPrice(prediction.stockSymbol);
  const predictedDifference = prediction.predictedAmount - prediction.currentAmount;
  const actualDifference = currentPrice - prediction.currentAmount;
  const absActualDifference = Math.abs(actualDifference);
  const offScale = Math.abs(actualDifference - predictedDifference);
  // check if the predictedDifference and actualDifference
  // have opposite signs
  if ( (predictedDifference >= 0) ^ (actualDifference < 0)) {
    return 0;
  }
  const intervalScaleValue = interval[prediction.intervalType];
  const result = intervalScaleValue * absActualDifference / offScale
  return Math.ceil(result);
}
