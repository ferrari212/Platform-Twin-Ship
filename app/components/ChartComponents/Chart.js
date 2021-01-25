import { right } from "@popperjs/core"
import React, { Component } from "react"
import { Bar, Line, Pie } from "react-chartjs-2"

class Chart extends Component {
	constructor(props) {
		super(props)
		this.state = {
			chartData: props.chartData
		}
	}

	static defaultProps = {
		displayTitle: true,
		displayLegend: true,
		legendPosition: "right"
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
								height={500}
								options={{
									title: {
										display: this.props.displayTitle,
										text: "Largest Cities in Massachusssetts",
										fontSize: 25
									},
									legend: {
										display: this.props.displayLegend,
										position: this.props.legendPosition
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

export default Chart
