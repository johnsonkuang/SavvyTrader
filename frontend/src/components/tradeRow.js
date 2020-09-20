import React, { Component } from 'react'
import { BsArrowUpShort, BsArrowDownShort } from 'react-icons/bs';

export default class TradeRow extends Component {
	constructor(props) {
		super(props);
		this.state = {
			proximity: true
		};
	}

	componentDidMount() {
		this.setState({
			proximity: Math.abs(this.props.predPrice - this.props.currPrice) / this.props.currPrice <= 0.05
		})
	}

	render() {
		return (
			<tr>
				<td className="text-center">{this.props.symbol}</td>
				<td className="text-center">{this.props.currPrice}</td>
				<td className="text-center" style={{ color: this.state.proximity ? "#28a745" : "#dc3545" }}>
					{this.props.predPrice} {this.state.proximity ? <BsArrowUpShort /> : <BsArrowDownShort />}
				</td>
				<td>{this.props.timePred.replace("(Pacific Daylight Time)", "")}</td>
				<td className="text-center">{this.props.type}</td>
				<td >{this.props.endTime.replace("(Pacific Daylight Time)", "")}</td>
			</tr>
		)
	}
}
