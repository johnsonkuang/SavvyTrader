import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from "axios";
import dayjs from "dayjs";

const ADD_PREDICTION_URL = "http://localhost:8080/addPrediction";
const GET_CURRENT_PRICE_URL = "http://localhost:8080/getCurrentPrice";

class PredictionForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
			predictedStockPrice: null,
			endTime: 'hour',
		};
	}

	componentDidUpdate(prevProps) {
		if (this.props.stockName === prevProps.stockName) {
			return;
		}

		// reset form
		this.setState({
			predictedStockPrice: null
		});
		document.getElementById("formGuessStockPrice").value = '';
	}

	async addPrediction() {
		if (!this.state.predictedStockPrice) {
			alert('Error: no stock price predicted.')
			return;
		}

		try {
			console.log(this.props.stockName);
			const currentPrice = await axios.get(GET_CURRENT_PRICE_URL, {
				params: {
					stock: this.props.stockName
				}
			});

			const dateResult = dayjs().add(1, this.state.endTime).unix();

			axios.post(ADD_PREDICTION_URL, {
				params: {
					dateResult,
					currentAmount: currentPrice,
					intervalType: this.state.endTime,
					predictedAmount: this.state.predictedStockPrice,
					stockSymbol: this.props.stockName,
					trader: 'vishal',
				}
			});

			alert('Sent!');
		} catch (error) {
			console.error(error);
		}
	}

	onPriceChange = (event) => {
		const value = parseFloat(event.target.value);
		this.setState({
			predictedStockPrice: value
		});
	}

	onTimeChange = (event) => {
		const value = {
			'Next Hour': 'hour',
			'Next Day': 'day',
			'Next Week': 'week',
		}[event.target.value];

		this.setState({
			endTime: value
		});
	}

	handleFormSubmit = (event) => {
		console.log("FORM SUBMITTED");
		this.addPrediction();
		event.preventDefault();
	}

	render() {
		return (
			<div>
				<div>
					Compete against other traders in predicting the stock price of ${this.props.stockName} at the next hour, day, or week!
				</div>
				<Form onSubmit={this.handleFormSubmit}>
					<Form.Group controlId="formGuessStockPrice">
						<Form.Label>Stock Price Prediction</Form.Label>
						<Form.Control type="Stock Price" placeholder="Enter Stock Price" onChange={this.onPriceChange} />
					</Form.Group>
					<Form.Group controlId="formEndTime">
						<Form.Label>End Time</Form.Label>
						<Form.Control as="select" onChange={this.onTimeChange}>
							<option>Next Hour</option>
							<option>Next Day</option>
							<option>Next Week</option>
						</Form.Control>
					</Form.Group>
					<Button variant="primary" type="submit">
						Submit
					</Button>
				</Form>
			</div>
		);
	}
}

export default PredictionForm;