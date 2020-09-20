import React, { Component } from "react";
import dayjs from "dayjs";
import axios from "axios";
import * as d3 from "d3";

const USE_MOCK_DATA = true;

const SERVER_API_URL = 'http://localhost:8080/getCandlesticks';

const mockData = [{"time":"2020-08-19 17:00:00","open":131.63999938965,"close":138.42999267578,"high":139.16999816895,"low":131.22999572754},{"time":"2020-08-20 17:00:00","open":138.66000366211,"close":141.32000732422,"high":142.00999450684,"low":137.79499816895},{"time":"2020-08-23 17:00:00","open":146.55000305176,"close":143.94000244141,"high":147.52000427246,"low":140.52000427246},{"time":"2020-08-24 17:00:00","open":142.94999694824,"close":147.30000305176,"high":147.44000244141,"low":142.08999633789},{"time":"2020-08-25 17:00:00","open":149.27000427246,"close":156.72999572754,"high":157.05000305176,"low":149.16000366211},{"time":"2020-08-26 17:00:00","open":158.21000671387,"close":155.30999755859,"high":159.86000061035,"low":151.58999633789},{"time":"2020-08-27 17:00:00","open":157.28999328613,"close":157.71000671387,"high":158.7299041748,"low":155.14999389648},{"time":"2020-08-30 17:00:00","open":158.60000610352,"close":161.36000061035,"high":164.50999450684,"low":157.86999511719},{"time":"2020-08-31 17:00:00","open":165.9700012207,"close":169.74000549316,"high":169.94000244141,"low":163.08999633789},{"time":"2020-09-01 17:00:00","open":175.38999938965,"close":174.5299987793,"high":175.55000305176,"low":164.72999572754},{"time":"2020-09-02 17:00:00","open":166.55000305176,"close":147.72999572754,"high":167.33999633789,"low":142.83999633789},{"time":"2020-09-03 17:00:00","open":145.38000488281,"close":141.63999938965,"high":150.30000305176,"low":123.86000061035},{"time":"2020-09-07 17:00:00","open":125.06999969482,"close":121.62000274658,"high":133.88999938965,"low":121.19999694824},{"time":"2020-09-08 17:00:00","open":129.0299987793,"close":132.07000732422,"high":135.19999694824,"low":125.73000335693},{"time":"2020-09-09 17:00:00","open":136.58000183105,"close":124.43000030518,"high":138.36000061035,"low":121.81999969482},{"time":"2020-09-10 17:00:00","open":127,"close":121.70999908447,"high":128.19000244141,"low":116.80999755859},{"time":"2020-09-13 17:00:00","open":127.11000061035,"close":127.98000335693,"high":130.77000427246,"low":125.08999633789},{"time":"2020-09-14 17:00:00","open":133.44000244141,"close":133.41999816895,"high":135.41999816895,"low":130.9700012207},{"time":"2020-09-15 17:00:00","open":134.67999267578,"close":127.01000213623,"high":135.30999755859,"low":126.69000244141},{"time":"2020-09-16 17:00:00","open":117.19000244141,"close":121.16000366211,"high":123.94999694824,"low":116.08000183105},{"time":"2020-09-17 17:00:00","open":123.16999816895,"close":116.48000335693,"high":123.34999847412,"low":110.7799987793}];

class StockGraph extends Component {

	componentDidMount() {
		this.getData('AAPL', 'week').then((data) => this.drawBarChart(data));
	}

	async getData(stock, period) {
		// save API requests
		if (USE_MOCK_DATA) {
			return mockData;
		}

		try {
			const response = await axios.get(SERVER_API_URL, {
				params: {
					stock,
					period
				}
			});
			const data = response.data;
			data.forEach((c) => c.time = dayjs(c.time, "YYYY-MM-DD HH:mm:ss"));
			console.log(data);
			return data;
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	calculateStats(data) {
		let minPrice = data[0].low;
		let maxPrice = data[0].high;

		for (const candlestick of data) {
			minPrice = Math.min(minPrice, candlestick.low);
			maxPrice = Math.max(maxPrice, candlestick.high);
		}

		return {
			minPrice,
			maxPrice,
			minDate: data[0].time,
			maxDate: data[data.length - 1].time,
		};
	}

	drawBarChart(data) {
		const width = 700;
		const height = 500;

		const cWidth = width / data.length;
		const cShadowWidth = 3;
		const cSpaceBetween = 1;

		let { minPrice, maxPrice, } = this.calculateStats(data);

		const svg = d3.select(this.refs.canvas)
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", [0, 0, width, height])
			.style("border", "1px solid black");

		let chartBody = svg.append("g")
			.attr("class", "chartBody");

		// candlestick shadows
		chartBody.selectAll(".candle-shadow").data(data).enter()
			.append("rect")
			.attr("width", cShadowWidth)
			.attr("height", (c) => (c.high - c.low) / (maxPrice - minPrice) * height)
			.attr("fill", (c) => "gray")
			.attr("x", (c, i) => i * cWidth + (cWidth - cShadowWidth) / 2)
			.attr("y", (c) => (1 - (c.high - minPrice) / (maxPrice - minPrice)) * height);

		// candlestick real body
		chartBody.selectAll(".candle-body").data(data).enter()
			.append("rect")
			.attr("width", cWidth - cSpaceBetween)
			.attr("height", (c) => Math.abs(c.close - c.open) / (maxPrice - minPrice) * height)
			.attr("fill", (c) => (c.close > c.open) ? "green" : "red")
			.attr("x", (c, i) => i * cWidth + cSpaceBetween / 2)
			.attr("y", (c) => (1 - (Math.max(c.close, c.open) - minPrice) / (maxPrice - minPrice)) * height);
	}

	render() {
		return (
			<div ref="canvas"></div>
		);
	}
}

export default StockGraph;
