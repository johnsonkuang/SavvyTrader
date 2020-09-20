import React, { Component } from 'react';
import TradeRow from './tradeRow';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table'
import axios from 'axios';
import dayjs from 'dayjs';

const SERVER_API_URL = 'http://localhost:8080/getPredictions';

class Trades extends Component {

	tradeList = () => {
		console.log(this.state.trades);
		const tradeList = this.state.trades.map((trade, index) =>
			<TradeRow
				key={index}
				symbol={trade["stockSymbol"]}
				currPrice={trade["currentAmount"]}
				predPrice={trade["predictedAmount"]}
				timePred={dayjs(trade["dateMade"]).format("MMM D @ H:mm A")}
				type={trade["intervalType"]}
				endTime={dayjs(trade["endDate"]).format("MMM D @ H:mm A")}
			/>
		);

		return (
			<tbody>
				{tradeList}
			</tbody>
		)
	};

	constructor(props) {
		super(props);

		this.state = {
			trades: []
		}
	}

	componentDidMount() {
		this.getPredictions("vishal").then((data) => {
			this.setState({
				trades: data
			})
		});
	}

	async getPredictions(user) {
		try {
			const response = await axios.get(SERVER_API_URL, {
				params: {
					user
				}
			});
			const data = response.data;
			data.forEach((c) => {
				c.dateMade = new Date(c.dateMade._seconds * 1000);
				c.endDate = new Date(c.dateMade);
				if (c.intervalType === "hour") {
					if (c.endDate.getHours() === 12) {
						c.endDate.setDate(c.endDate.getDate() + 1);
					}
					c.endDate.setHours(c.endDate.getHours() + 1);
				} else if (c.intervalType === "day") { //can change to set type
					c.endDate.setDate(c.endDate.getDate() + 1);
				} else {
					c.endDate.setDate(c.endDate.getDate() + 7); //try not to make week predictions
				}
			});
			console.log(data);
			return data;
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	render() {
		return (
			<Container>
				<Row>
					<Col md={12}>
						<h1>My Trades</h1>
						<div>
							<Table striped bordered hover variant="dark">
								<thead>
									<tr>
										<th>Stock</th>
										<th>Current Price ($)</th>
										<th>Predicted Price ($)</th>
										<th>Time Predicted</th>
										<th>Prediction Type</th>
										<th>Prediction End Time</th>
									</tr>
								</thead>
								{this.tradeList()}
							</Table>
						</div>
					</Col>
				</Row>
			</Container>
		)
	}
}

export default Trades;