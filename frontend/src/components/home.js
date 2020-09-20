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
      predictionArray: []
		}
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
    this.getUsersPredictions().then((data) => {
      if (!data) {
        return;
      }
      this.setState({
        predictionArray: data
      })
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
			console.log("user predictions");
			console.log(data);
			return data;
    } catch (error) {
      return null;
    }
  }
  renderPrediction(prediction, index) {
  return (
    <tr key={index}>
      <td>{prediction.currentAmount}</td>
      <td>{prediction.predictedAmount}</td>
      <td>{dayjs.unix(prediction.dateMade._seconds).format("YYYY-MM-DD HH:mm:ss")}</td>
      <td>{dayjs.unix(prediction.dateResult._seconds).format("YYYY-MM-DD HH:mm:ss")}</td>
      <td>{prediction.intervalType}</td>
    </tr>
  )
  }
  convertDate(predictionDate) {

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
							<Col md={4}>
								<p className="user-points"> Points: {this.state.points}</p>
							</Col>
							<Col md={8}>
								<p className="user-energy"> Energy: {this.state.energy}</p>
							</Col>
						</Row>
						<Row>
							<Col>
								<PredictionForm stockName={this.props.stockName}></PredictionForm>
							</Col>
						</Row>
						<Row>
							<Col>
								<h2>All User Predictions for [Stock]</h2>
								<div>
									<Table striped bordered hover variant="dark">
										<thead>
											<tr>
												<th>Starting Price</th>
                        <th>Predicted Price</th>
                        <th>Date Made</th>
												<th>Result Date</th>
                        <th>Interval Type</th>
											</tr>
										</thead>
										<tbody>
											{this.state.predictionArray.map(this.renderPrediction)}
										</tbody>
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
