import React, { useState, useEffect } from "react"

import { Vessel } from "../../vessel/build/vessel"
import BarVega from "./BarVega"
import D3Chart from "./D3Chart"
import BarChart from "./BarChart"
import LineChart from "./LineChart"
import PieChart from "./PieChart"
import { None } from "vega"

function AnalysisChart(props) {
	class CreateData {
		constructor() {
			this.chartData = {
				labels: [],
				datasets: []
			}
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
	}

	function resistanceCalulation(params) {
		try {
			var dataResitance = new CreateData()
			var labelsResistance = dataResitance.chartData.labels
			var dataPower = new CreateData()

			var datasetTotal = dataResitance.pushDataSet("Total", "rgba(138, 103, 83, 0.6)")
			var datasetCalmResist = dataResitance.pushDataSet("Calm Water", "rgba(1, 28, 64, 0.6)")
			var datasetViscous = dataResitance.pushDataSet("Viscous", "rgba(115, 69, 41, 0.6)")
			var datasetWave = dataResitance.pushDataSet("Wave", "rgba(41, 85, 115, 0.6)")

			var pieColor = ["rgba(1, 28, 64, 0.6)", "rgba(41, 85, 115, 0.6)", "rgba(166, 13, 13, 0.6)"]
			var hoverPieColor = ["rgba(1, 28, 64, 1)", "rgba(41, 85, 115, 1)", "rgba(166, 13, 13, 1)"]
			var datasetPower = dataPower.pushDataSet("Power percentage", pieColor, hoverPieColor)

			var ship = params
			var shipState = new Vessel.ShipState(ship.designState.getSpecification())

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
			var wave = new Vessel.WaveCreator()

			if (!ship.designState.calculationParameters.speed) {
				var v_proj = 10
			} else {
				var v_proj = ship.designState.calculationParameters.speed
			}

			var hullRes = new Vessel.HullResistance(ship, shipState, propellerSpecification, wave)
			hullRes.setSpeed(v_proj)
			hullRes.writeOutput()

			var propellerInteraction = new Vessel.PropellerInteraction(ship, shipState, propellerSpecification)

			propellerInteraction.setSpeed(v_proj)
			propellerInteraction.writeOutput()

			if (isNaN(hullRes.calmResistance.Rt)) throw "Resistance not possible to be calculated"
			datasetPower.push(((100 * (hullRes.calmResistance.Rw * hullRes.coefficients.speedSI)) / propellerInteraction.resistanceState.Pe).toFixed(2))
			dataPower.chartData.labels.push("Wave")
			datasetPower.push(((100 * (hullRes.calmResistance.Rf * hullRes.coefficients.speedSI)) / propellerInteraction.resistanceState.Pe).toFixed(2))
			dataPower.chartData.labels.push("Frictional")
			datasetPower.push(((100 * (propellerInteraction.resistanceState.Pe - (hullRes.calmResistance.Rf + hullRes.calmResistance.Rw) * hullRes.coefficients.speedSI)) / propellerInteraction.resistanceState.Pe).toFixed(2))
			dataPower.chartData.labels.push("Residual")
			debugger

			for (let v = 0; v <= Math.floor(v_proj * 1.2); v++) {
				hullRes.setSpeed(v)
				hullRes.writeOutput()

				labelsResistance.push(v.toString())
				datasetCalmResist.push(hullRes.calmResistance.Rt.toFixed(2))
				datasetViscous.push(hullRes.calmResistance.Rf.toFixed(2))
				datasetWave.push(hullRes.calmResistance.Rw.toFixed(2))
				datasetTotal.push(hullRes.totalResistance.Rtadd.toFixed(2))
			}

			return (
				<div className="row">
					<div className="col-lg-6  text-center ">
						<LineChart chartData={dataResitance.chartData} textTitle="Resistence by Velocity" xLabel="Ship Speed (Knots)" yLabel="Resistence (N)" />
					</div>
					<div className="col-lg-6  text-center ">
						<PieChart chartData={dataPower.chartData} textTitle="Chart Power" />
					</div>
				</div>
			)
		} catch (e) {
			console.warn("Consumption chart not feed with proper data:", e)
			return ""
		}
	}

	return <div className="container-fluid align-items-center p-3">{resistanceCalulation(props.state.ship)}</div>
}

export default AnalysisChart
