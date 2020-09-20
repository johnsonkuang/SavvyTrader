import React, { Component } from 'react';
import Container from 'react-bootstrap/esm/Container';
import StockGraph from './StockGraph';
import PredictionForm from './PredictionForm';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from 'react-bootstrap/Table'
import axios from "axios";
import dayjs from "dayjs";

class Home extends Component {
	constructor(props) {
		super(props);
		console.log("INSIDE HOME");
		this.state = {
			points: "",
			energy: "",
			predictionArray: [],
			tableHTML: "",
		};
	}

	componentDidMount() {
		console.log("INSIDE COMPONENT DID MOUNT HOME");
		this.getUserInfo().then((data) => {
			if (!data) {
				return;
			}
			this.setState({
				points: data["points"],
				energy: data["energy"]
			})
		});

		this.setTableHTML();
	}

	componentDidUpdate(prevProps) {
		if (this.props.stockName === prevProps.stockName) {
			return;
		}

		this.setTableHTML();
	}

	async setTableHTML() {
		let data = await this.getUsersPredictions();
		if (!data) {
			return;
		}

		this.setState({
			predictionArray: data,
			tableHTML: data.map(this.renderPrediction)
		});
	}

	async getUserInfo() {
		console.log("INSIDE GET USER INFO");
		try {
			const response = await axios.get('http://localhost:8080/getUserInfo?user=vishal');
			const data = response.data;
			console.log("user data");
			console.log(data);
			return data;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
	async getUsersPredictions() {
		console.log("INSIDE GET USER PREDICTIONS");
		try {
			const predictions = await axios.get('http://localhost:8080/getAllPredictions');
			const data = predictions.data;

			return data.filter((p) => p.stockSymbol === this.props.stockName);
		} catch (error) {
			return null;
		}
	}

	renderPrediction(prediction, index) {
		return (
			<tr key={index}>
				<td>{prediction.currentAmount}</td>
				<td>{prediction.predictedAmount}</td>
				<td>{dayjs.unix(prediction.dateMade._seconds).format("MMM D H:mm A")}</td>
				<td>{dayjs.unix(prediction.dateResult._seconds).format("MMM D H:mm A")}</td>
				<td>{prediction.intervalType}</td>
			</tr>
		)
	}

	render() {
		return (
			<Container>
				<Row>
					<Col md={8}>
						<div>
							<StockGraph
								stockName={this.props.stockName}
								period={this.props.period}
							/>
						</div>
					</Col>
					<Col md={4} className="right-column">
						<Row>
							<Col md={5}>
								<h2 className="user-points">Points:<br />{this.state.points}</h2>
							</Col>
							<Col md={4}>
								<h2 className="user-energy">Energy:<br />{this.state.energy}</h2>
							</Col>
						</Row>
						<Row>
							<Col>
								<PredictionForm stockName={this.props.stockName}></PredictionForm>
							</Col>
						</Row>
						<Row>
							<Col>
								<h2>All user predictions for ${this.props.stockName}</h2>
								<div>
									<Table striped bordered hover variant="dark">
										<thead>
											<tr>
												<th>Initial ($)</th>
												<th>Predicted ($)</th>
												<th>Date Made</th>
												<th>Result Date</th>
												<th>Interval Type</th>
											</tr>
										</thead>
										<tbody>{this.state.tableHTML}</tbody>
									</Table>
								</div>
							</Col>
						</Row>
					</Col>
				</Row>
			</Container>
		)
	}
}

export default Home;
