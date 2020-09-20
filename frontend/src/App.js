import React, { Component } from 'react';

import Main from './components/main';
import NavBar from './NavBar';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			stockName: "AAPL",
			value: "",
			period: "year"
		}
	}

	render() {
		return (
			<div>
				<NavBar
					handleSearch={this.handleSearch}
					handleChange={this.handleChange}
				/>
				<Main stockName={this.state.stockName} period={this.state.period}></Main>
			</div>);
	}

	handleSearch = (event) => {
		this.setState((prevState) => ({
			stockName: prevState.value
		}), () => {
			console.log('Search', this.state.stockName);
		});
		event.preventDefault();
	}

	handleChange = (event) => {
		this.setState({
			value:
			event.target.value.toUpperCase()
		});
	}
}

export default App;