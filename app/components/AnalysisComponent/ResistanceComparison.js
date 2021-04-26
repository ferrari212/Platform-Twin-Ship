import React from "react"

import DataChartStructure from "../../snippets/DataChartStructure"
import extract from "../../snippets/extract"

import LineChart from "../ChartComponents/LineChart"
import RadarChart from "../ChartComponents/RadarChart"

function ResistanceComparison(prop) {
	function TestComponent() {
		try {
			var currentState = prop.currentState
			var newState = prop.newState

			var v_proj = currentState.v_proj

			var dataResitance = new DataChartStructure()
			var dataPower = new DataChartStructure()

			var datasetResistance = dataResitance.pushDataSet("Current State", "rgba(138, 103, 83, 0.6)")
			var datasetNewResistance = dataResitance.pushDataSet("New State", "rgba(41, 85, 115, 0.6)")

			var pieColor = ["rgba(1, 28, 64, 0.6)", "rgba(166, 13, 13, 0.6)"]
			var hoverPieColor = ["rgba(1, 28, 64, 1)", "rgba(166, 13, 13, 1)"]
			var datasetPower = dataPower.pushDataSet("Current State", pieColor[0], hoverPieColor[0])
			var newDatasetPower = dataPower.pushDataSet("New State", pieColor[1], hoverPieColor[1])

			if (isNaN(currentState.hullRes.calmResistance.Rt)) throw "Resistance not possible to be calculated, possible main dimensions out of allowed range"

			for (let type of Object.keys(currentState.percentages)) {
				datasetPower.push(currentState.percentages[type].toFixed(2))
				newDatasetPower.push(newState.percentages[type].toFixed(2))
				dataPower.xLabel.push(type)
			}

			// This is just to clear out data
			currentState.hullRes.setSpeed(1)
			currentState.hullRes.writeOutput()
			newState.hullRes.setSpeed(1)
			newState.hullRes.writeOutput()

			for (let v = 0; v <= Math.floor(v_proj * 1.2); v++) {
				currentState.hullRes.setSpeed(v)
				newState.hullRes.setSpeed(v)

				dataResitance.xLabel.push(v.toFixed(0))
				datasetNewResistance.push(v ? newState.hullRes.totalResistance.Rtadd.toFixed(2) : "0")
				datasetResistance.push(v ? currentState.hullRes.totalResistance.Rtadd.toFixed(2) : "0")
			}

			// Filter the values
			var keys = ["Rf", "Rt", "Rw", "t", "w", "etah", "Pe", "Rtadd"]
			var units = ["N", "N", "N", "", "", "", "W", "N"]
			var precision = [0, 0, 0, 2, 2, 2, 0, 0]
			currentState.hullRes.setSpeed(v_proj)
			newState.hullRes.setSpeed(v_proj)
			var filteredCurrentState = {}
			var filteredNewState = {}
			Object.assign(filteredCurrentState, extract(currentState.hullRes.calmResistance, keys))
			Object.assign(filteredCurrentState, extract(currentState.hullRes.efficiency, keys))
			Object.assign(filteredCurrentState, extract(currentState.hullRes.totalResistance, keys))
			Object.assign(filteredNewState, extract(newState.hullRes.calmResistance, keys))
			Object.assign(filteredNewState, extract(newState.hullRes.efficiency, keys))
			Object.assign(filteredNewState, extract(newState.hullRes.totalResistance, keys))

			return (
				<>
					<div className="row">
						<div className="col-lg-6  text-center ">
							<LineChart chartData={dataResitance.chartData} textTitle="Resistence X Velocity" xLabel="Ship Speed (Knots)" yLabel="Resistence (N)" legendPosition="top" />
						</div>
						<div className="col-lg-6  text-center ">
							<RadarChart chartData={dataPower.chartData} textTitle={`Power % for ${v_proj} knots`} />
						</div>
					</div>
					<br />
					<div className="row align-items-center text-center justify-content-center">
						<h4>Resistance comparison in the design speed = {v_proj.toFixed(2)} knots </h4>
					</div>
					<div className="row align-items-center text-center justify-content-center">
						<div className="col-lg-6 ">
							<table className="table table-hover">
								<thead className="thead-dark">
									<tr>
										<th scope="col">Variable</th>
										<th scope="col">Preview Value</th>
										<th scope="col">New Value</th>
										<th scope="col">Unit</th>
										<th scope="col">Variation</th>
									</tr>
								</thead>
								<tbody>
									{keys.map((value, id) => {
										return (
											<tr key={id}>
												<td>{value}</td>
												<td>{filteredCurrentState[value].toFixed(precision[id])}</td>
												<td>{filteredNewState[value].toFixed(precision[id])}</td>
												<td>{units[id]}</td>
												<td style={{ color: filteredNewState[value] < filteredCurrentState[value] ? "#295773" : "#A60D0D" }}>{((100 * (filteredNewState[value] - filteredCurrentState[value])) / filteredCurrentState[value]).toFixed(2)}%</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				</>
			)
		} catch (error) {
			return <div>Error found: {error}</div>
		}
	}

	return (
		<div className="container-fluid align-items-center p-3">
			<TestComponent />
		</div>
	)
}

export default ResistanceComparison
