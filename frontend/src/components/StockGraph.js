import React, { Component } from "react";
import dayjs from "dayjs";
import * as d3 from "d3";

// AAPL stock data
const mockData = [{"time":"2020-09-17 02:00:00","open":111.08,"close":111.4,"high":111.6,"low":110.76},{"time":"2020-09-17 03:00:00","open":111.45,"close":110.5,"high":111.5,"low":110.47},{"time":"2020-09-17 04:00:00","open":110.67,"close":109.96,"high":111,"low":109.8},{"time":"2020-09-17 05:00:00","open":109.95,"close":109.4601,"high":111,"low":109.27},{"time":"2020-09-17 06:00:00","open":109.5,"close":110.37,"high":110.85,"low":108.65},{"time":"2020-09-17 07:00:00","open":110.36,"close":110.9046,"high":111.525,"low":109.8},{"time":"2020-09-17 08:00:00","open":110.9099,"close":110.3,"high":112.2,"low":110.2},{"time":"2020-09-17 09:00:00","open":110.29,"close":109.75,"high":110.67,"low":108.96},{"time":"2020-09-17 10:00:00","open":109.75,"close":109.9037,"high":110.46,"low":109.37},{"time":"2020-09-17 11:00:00","open":109.9,"close":109.41,"high":110.48,"low":109.1},{"time":"2020-09-17 12:00:00","open":109.41,"close":110.32,"high":110.67,"low":108.96},{"time":"2020-09-17 13:00:00","open":110.34,"close":110.2198,"high":112.13,"low":110.19},{"time":"2020-09-17 14:00:00","open":110.22,"close":110.25,"high":110.34,"low":110.02},{"time":"2020-09-17 15:00:00","open":110.24,"close":110.54,"high":110.58,"low":110.1},{"time":"2020-09-17 16:00:00","open":110.54,"close":110.34,"high":110.68,"low":110.25},{"time":"2020-09-18 01:00:00","open":110.61,"close":111.3,"high":111.61,"low":110.6},{"time":"2020-09-18 02:00:00","open":111.23,"close":111.5,"high":111.9,"low":111.23},{"time":"2020-09-18 03:00:00","open":111.45,"close":111.4,"high":111.7,"low":111.12},{"time":"2020-09-18 04:00:00","open":111.42,"close":110.92,"high":111.55,"low":110.6},{"time":"2020-09-18 05:00:00","open":110.8901,"close":111.0203,"high":111.54,"low":110.067},{"time":"2020-09-18 06:00:00","open":111.05,"close":109.43,"high":111.5,"low":109.02},{"time":"2020-09-18 07:00:00","open":109.43,"close":108.18,"high":110.018,"low":108.06},{"time":"2020-09-18 08:00:00","open":108.18,"close":108.14,"high":108.43,"low":107.2},{"time":"2020-09-18 09:00:00","open":108.14,"close":106.9587,"high":109.7,"low":106.52},{"time":"2020-09-18 10:00:00","open":106.96,"close":107.315,"high":107.39,"low":106.09},{"time":"2020-09-18 11:00:00","open":107.31,"close":107.6,"high":107.74,"low":106.77},{"time":"2020-09-18 12:00:00","open":107.61,"close":106.6,"high":108.36,"low":106.55},{"time":"2020-09-18 13:00:00","open":106.84,"close":107.02,"high":108.8476,"low":106.61},{"time":"2020-09-18 14:00:00","open":107,"close":107,"high":107.04,"low":106.75},{"time":"2020-09-18 15:00:00","open":107,"close":106.91,"high":107,"low":106.88},{"time":"2020-09-18 16:00:00","open":106.91,"close":106.93,"high":107,"low":106.84}];

class StockGraph extends Component {

	componentDidMount() {
		mockData.forEach((c) => {
			c.time = dayjs(c.time, "YYYY-MM-DD HH:mm:ss")
		});
		this.drawBarChart(mockData);
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
		const width = 800;
		const height = 500;

		const cWidth = width / data.length;
		const cShadowWidth = 3;
		const cSpaceBetween = 10;

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
