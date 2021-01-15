import React, { Component } from "react"
import * as d3 from "d3"

class ConsumptionChart extends Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		const data = [2, 5, 12, 7, 9]

		const w = 600
		const h = 400

		console.log(this.mount)

		this.drawBarChart(data)
	}

	drawBarChart(data) {
		const w = 400
		const h = w
		const scale = 20

		var gridLines = [0, 20, 40, 60, 80, 100]

		const accessToRef = d3.select(this.mount)
		accessToRef.append("svg").attr("width", w).attr("height", h).style("border", "1px solid black").attr("fill", "black")
		accessToRef
			.selectAll("svg")
			.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("width", 40)
			.attr("height", datapoint => datapoint * 20)
			.attr("fill", "orange")
			.attr("x", (datapoint, iteration) => iteration * 45 + 45)
			.attr("y", datapoint => h - datapoint * scale)
			.classed("highlightedBar", function (d) {
				if (d > 5 && d < 10) {
					return true
				}
				return false
			})

		accessToRef
			.selectAll("svg")
			.selectAll("text")
			.data(data)
			.enter()
			.append("text")
			.attr("x", (dataPoint, i) => i * 45 + 55)
			.attr("y", (dataPoint, i) => h - dataPoint * scale - 10)
			.text(dataPoint => dataPoint)

		// create y-axis labels
		accessToRef
			.selectAll("svg")
			.selectAll("text .gridLines")
			.data(gridLines)
			.enter()
			.append("text")
			.text(function (d) {
				return d + "%"
			})
			.attr("text-anchor", "end")
			.attr("x", 45)
			.attr("y", function (d) {
				return 20 + (h * (100 - d)) / 100
			})

		// Create scale
		var scaleAxis = d3
			.scaleLinear()
			.domain([d3.min(data), d3.max(data)])
			.range([10, w - 100])

		// Add scales to axis
		var x_axis = d3.axisBottom().scale(scaleAxis)

		//Append group and insert axis
		accessToRef.selectAll("svg").attr("transform", "translate(50, 10)").append("g").call(x_axis)
	}

	render() {
		return <div ref={ref => (this.mount = ref)} className="col-sm-6  text-center "></div>
	}
}

export default ConsumptionChart
