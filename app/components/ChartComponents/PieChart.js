import { right } from "@popperjs/core"
import React, { Component } from "react"
import { Pie } from "react-chartjs-2"

class BarChart extends Component {
	constructor(props) {
		super(props)
		this.state = {
			chartData: props.chartData
		}
	}

	static defaultProps = {
		height: 400,
		displayTitle: true,
		displayLegend: true,
		textTitle: "Pie Chart",
		legendPosition: "top",
		legendAlign: "center"
	}

	render() {
		return (
			<div className="chart">
				<div className="container">
					<div className="row">
						<div className="col-sm"></div>
						<div className="col-sm-9">
							<Pie
								data={this.state.chartData}
								height={this.props.height}
								options={{
									title: {
										display: this.props.displayTitle,
										text: this.props.textTitle,
										fontSize: 18
									},
									legend: {
										display: this.props.displayLegend,
										position: this.props.legendPosition,
										align: this.props.legendAlign
									},
									maintainAspectRatio: false,
									fill: true
								}}
							/>
						</div>
						<div className="col-sm"></div>
					</div>
				</div>
			</div>
		)
	}
}

export default BarChart
