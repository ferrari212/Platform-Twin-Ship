import { right } from "@popperjs/core"
import React, { Component } from "react"
import { Bar } from "react-chartjs-2"
import { withRouter } from "react-router-dom"

class BarChart extends Component {
	constructor(props) {
		super(props)
		this.state = {
			chartData: props.chartData
		}
	}

	static defaultProps = {
		displayTitle: true,
		displayLegend: true,
		textTitle: "Bar Chart",
		legendPosition: "right",
		legendAlign: "center"
	}

	render() {
		return (
			<div className="chart">
				<div className="container">
					<div className="row">
						<div className="col-sm"></div>
						<div className="col-sm-9">
							<Bar
								data={this.state.chartData}
								width={100}
								height={300}
								options={{
									title: {
										display: this.props.displayTitle,
										text: this.props.textTitle,
										fontSize: 16
									},
									legend: {
										display: this.props.displayLegend,
										position: this.props.legendPosition,
										align: this.props.legendAlign
									},
									maintainAspectRatio: false
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
