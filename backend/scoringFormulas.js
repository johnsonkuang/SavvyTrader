const { getCurrentPrice, getPriceTarget } = require('./stockData');
const intervalScale =
{
  "hour" : 10,
  "day" : 100,
  "week" : 1000,
  "month" : 10000,
  "year" : 100000
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
  const offScale = Math.abs(actualDifference - predictedDifference);
  // check if the predictedDifference and actualDifference
  // have opposite signs
  if ((predictedDifference >= 0) ^ (actualDifference < 0)) {
    const intervalScaleValue = interval[prediction.intervalType];
    const result = intervalScaleValue / offScale;
    return Math.ceil(result);
  }
  return 0;
}
