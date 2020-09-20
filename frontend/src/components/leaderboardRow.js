import React, { Component } from 'react'
import {BsArrowDownShort, BsArrowUpShort} from "react-icons/bs";

export default class LeaderboardRow extends Component {
	constructor(props){
		super(props);

	}

	render() {
		return (
			<tr>

				<td className="text-center" style={{color: this.props.rank === 1 ? "gold" : (this.props.rank === 2 ? "silver" : (this.props.rank === 3 ? "#cd7f32 " : "white")) }}>
					{this.props.rank}
				</td>
				<td className="text-center">{this.props.name}</td>
				<td className="text-center">{this.props.points}</td>

			</tr>
		)
	}
}
