export default class DataChartStructure {
	// Class returns the object format for Chart.js
	// xLabel: Object containing the label and dataset of the structure

	constructor(xLabel) {
		this.chartData = {
			labels: [],
			datasets: []
		}

		this.xLabel = this.chartData.labels
	}

	pushDataSet = (labelText = "", color = [], hoverColor = []) => {
		this.chartData.datasets.push({
			label: labelText,
			data: [],
			backgroundColor: color,
			hoverBackgroundColor: hoverColor,
			borderColor: color,
			fill: false,
			pointHoverBackgroundColor: "rgba(166, 13, 13, 1)"
		})

		const INDEX = this.chartData.datasets["length"] - 1

		return this.chartData.datasets[INDEX].data
	}

	setLabels(xLabel) {
		if (xLabel && xLabel.length !== 0) {
			xLabel.forEach(e => this.xLabel.push(e))
		} else {
			console.warn("Invalid data type in setLabels() method, probably xLabel === undefined or xLabel.lenght ==== 0")
		}
	}
}
