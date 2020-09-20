import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './home';
import Leaderboard from "./leaderboard";
import Trades from "./trades";


export default class Main extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Switch>
				<Route exact path = "/" render={(props)=>(
					<Home {...this.props} />
				)}/>
				<Route path = "/leaderboard" render={(props)=>(
					<Leaderboard {...props} />
				)}/>
				<Route path = "/trades" render={(props)=>(
					<Trades {...props} />
				)}/>
			</Switch>
		);
	}
}