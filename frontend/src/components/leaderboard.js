import React, {Component } from 'react';
import LeaderboardRow from './leaderboardRow';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table'
import axios from 'axios';

const SERVER_API_URL = 'http://localhost:8080/getLeaderboard';

class Leaderboard extends Component {

	leaderboardList = () => {
		console.log("leaderboard");

		console.log(this.state.leaderboard);
		const leaderboardList = this.state.leaderboard.map((leaderboard, index) =>
			<LeaderboardRow
				rank={index + 1}
				name={leaderboard["name"]}
				points={leaderboard["points"]}
			/>
		);

		return(
			<tbody>
			{leaderboardList}
			</tbody>
		)
	};

	constructor(props){
		super(props);

		this.state = {
			leaderboard : []
		}
	}

	componentDidMount(){
		this.getLeaderboard().then((data) =>
			{
				this.setState({
					leaderboard : data
				})}
		);
	}
	async getLeaderboard(){
		try {
			const response = await axios.get(SERVER_API_URL);
			const data = response.data;
			console.log("data");
			console.log(data);
			return data;
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	render(){
		return(
			<Container>
				<Row>
					<Col md={12}>
						<h1>Leaderboard</h1>
						<div>
							<Table striped bordered hover variant="dark">
								<thead>
								<tr>
									<th className="text-center">Ranking</th>
									<th className="text-center">Name</th>
									<th className="text-center">Points</th>
								</tr>
								</thead>
								{this.leaderboardList()}
							</Table>
						</div>
					</Col>
				</Row>
			</Container>
		)
	}
}

export default Leaderboard;