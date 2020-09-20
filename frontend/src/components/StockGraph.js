import React, { Component } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import * as d3 from "d3";
import './StockGraph.css';
dayjs.extend(customParseFormat);

const SERVER_API_URL = 'http://localhost:8080/getCandlesticks';

class StockGraph extends Component {

	constructor(props) {
		super(props);

		this.state = {
			currentPrice: 0,
			changedPrice: 0,
			changedPercentage: 0,
		};
	}

	componentDidMount() {
		this.getData().then((data) => this.drawBarChart(data));
	}

	componentDidUpdate(prevProps) {
		if (this.props.stockName === prevProps.stockName) {
			return;
		}

		console.log("UPDATED");
		console.log(this.props.stockName);

		this.getData().then((data) => {
			if (data) {
				this.drawBarChart(data)
			} else {
				this.setState({
					currentPrice: 0,
					changedPrice: 0,
					changedPercentage: 0,
				});
			}
		}).catch((error) => console.log);
	}

	async getData() {
		let stock = this.props.stockName;
		let period = this.props.period;
		let data = [];

		try {
			const response = await axios.get(SERVER_API_URL, {
				params: {
					stock,
					period
				}
			});
			data = response.data;
		} catch (error) {
			console.error(error);
		}

		for (const c of data) {
			c.time = dayjs(c.time, "YYYY-MM-DD HH:mm:ss")
		}

		const round = (n) => Math.floor(n * 100) / 100;

		this.setState({
			currentPrice: round(data[data.length - 1].close),
			changedPrice: round(data[data.length - 1].close - data[0].open),
			changedPercentage: round(data[data.length - 1].close / data[0].open - 1),
		});

		console.log(data);
		return data;

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
		const padding = 50;

		const cLineWidth = 4;
		const cWidth = width / data.length;
		const cSpaceBetween = cWidth / 3;
		const cShadowWidth = Math.max(2, (cWidth - cSpaceBetween) / 4);

		let { minPrice, maxPrice, } = this.calculateStats(data);

		d3.selectAll("svg").remove();

		const svg = d3.select(this.refs.canvas)
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", [0, 0, width + padding, height + padding * 2])

		svg.append("g")
			.attr("transform", `translate(${padding / 2}, 0)`)
			.call(d3.axisLeft()
				.scale(d3.scaleLinear()
					.domain([minPrice, maxPrice])
					.range([height + padding, padding])
				)
				.tickFormat((d) => `$${d}`)
			);

		let candlestickContainer = svg.append("g")
			.attr("transform", `translate(${padding}, ${padding})`)
			.attr("class", "candlestick-container")

		let simpleContainer = svg.append("g")
			.attr("transform", `translate(${padding}, ${padding})`)
			.attr("class", "simple-container");

		const simpleLine = d3.line()
			.x((c, i) => i * cWidth)
			.y((c, i) => (1 - (((c.open + c.close) / 2 - minPrice) / (maxPrice - minPrice))) * height)
			.curve(d3.curveMonotoneX);

		simpleContainer.append("path")
			.datum(data)
			.attr("class", `stock-line ${(data[data.length - 1].close > data[0].open) ? 'increasing' : 'decreasing'}`)
			.attr("stroke-width", cLineWidth)
			.attr("stroke", "white")
			.attr("fill", "none")
			.attr("d", simpleLine)

		// candlestick shadows
		candlestickContainer.selectAll(".candle-shadow").data(data).enter()
			.append("line")
			.attr("class", "candle-shadow")
			.attr("stroke-width", cShadowWidth)
			.attr("stroke", "gray")
			.attr("y1", (c) => (1 - (c.high - minPrice) / (maxPrice - minPrice)) * height)
			.attr("y2", (c) => (1 - (c.low - minPrice) / (maxPrice - minPrice)) * height)
			.attr("transform", (c, i) => `translate(${i * cWidth}, 0)`);

		// candlestick real body
		candlestickContainer.selectAll(".candle-body").data(data).enter()
			.append("line")
			.attr("class", (c) => `candle-body ${(c.close > c.open) ? "increasing" : "decreasing"}`)
			.attr("stroke-width", cWidth - cSpaceBetween)
			.attr("y1", (c) => (1 - (Math.max(c.close, c.open) - minPrice) / (maxPrice - minPrice)) * height)
			.attr("y2", (c) => (1 - (Math.min(c.close, c.open) - minPrice) / (maxPrice - minPrice)) * height)
			.attr("transform", (c, i) => `translate(${i * cWidth}, 0)`);
	}

	render() {
		let increasing = (this.state.changedPrice >= 0);
		let sign = increasing ? '+' : '-';

		let round = (n) => {
			n = Math.abs(n) + '';
			let dot = n.indexOf('.');
			if (dot < 0) {
				return n + '.00';
			} else if (n.length - dot === 2) {
				return n + '0';
			}
			return n;
		};

		return (
			<div className={"StockGraph " + (increasing ? 'increasing' : 'decreasing')}>
				<h2>{this.props.stockName}</h2>
				<h3>${this.state.currentPrice}</h3>
				<h4>{sign}${round(this.state.changedPrice)} ({sign}{round(this.state.changedPercentage * 100)}%) <span>Past {this.props.period}</span></h4>
				<div ref="canvas"></div>
			</div>
		);
	}
}

export default StockGraph;
