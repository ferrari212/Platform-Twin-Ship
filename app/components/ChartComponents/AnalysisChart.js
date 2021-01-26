import React, { useState, useEffect } from "react"

import { Vessel } from "../../vessel/build/vessel"
import BarVega from "./BarVega"
import D3Chart from "./D3Chart"
import BarChart from "./BarChart"
import LineChart from "./LineChart"
import PieChart from "./PieChart"

function AnalysisChart(props) {
	console.log(props)

	var dataChart = {
		chartData: {
			labels: ["Boston", "Worcester", "Springfield", "Lowell", "Cambridge", "New Bedford"],
			datasets: [
				{
					label: "Population",
					data: [617594, 181045, 153060, 106519, 105162, 95072],
					backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)", "rgba(255, 159, 64, 0.6)", "rgba(255, 99, 132, 0.6)"],
					hoverBackgroundColor: ["rgba(255, 255, 132, 1)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)", "rgba(255, 159, 64, 0.6)", "rgba(255, 99, 132, 0.6)"]
				}
			]
		}
	}

	function resistanceCalulation(params) {
		try {
			var ship = params
			var shipState = new props.Vessel.ShipState(ship.designState.getSpecification())

			var propeller = {}
			var propellerSpecification = new Object({
				AeAo: 0.55,
				D: 3,
				P: 1.2,
				beta1: 0.57,
				beta2: 0.44,
				gamma1: 0.105,
				gamma2: 0.077,
				noBlades: 4,
				noProps: 2
			})
			propeller["wag_4b_0.55a_1.2p"] = propellerSpecification
			var wave = new props.Vessel.WaveCreator()

			var hullRes = new Vessel.HullResistance(ship, shipState, propeller, wave)

			var labels = []

			var data = []

			for (let v = 0; v < 10; v++) {
				hullRes.setSpeed(v)
				hullRes.writeOutput()
				if (isNaN(hullRes.calmResistance)) throw "Resistance not possible to be calculated"

				labels.push(v.toString())
				// Maybe parse to float
				data.push(hullRes.calmResistance.toFixed(2))
			}

			// var resistanceModules = props.Vessel["HullResistance"]
			debugger

			dataChart.chartData.labels = labels
			dataChart.chartData.datasets[0].data = data
			return <LineChart chartData={dataChart.chartData} textTitle="Total Resistence" legendAlign="start" />
		} catch (e) {
			console.warn("Consumption chart not feed with proper data:", e)
			return ""
		}
	}

	return (
		<div className="container-fluid align-items-center p-3">
			<div className="row">
				<div className="col-lg-6  text-center ">{resistanceCalulation(props.state.ship)}</div>
				<div className="col-lg-6  text-center "></div>
			</div>
		</div>
	)
}

export default AnalysisChart
