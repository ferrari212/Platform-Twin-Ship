import React from "react"

import DataChartStructure from "../../snippets/DataChartStructure"
import extract from "../../snippets/extract"

import LineChart from "../ChartComponents/LineChart"
import PieChart from "../ChartComponents/PieChart"

function ResistanceModule(prop) {
	function TestComponent() {
		try {
			var models = prop.models
			var dataResitance = new DataChartStructure()
			var dataPower = new DataChartStructure()

			var datasetCalmResist = dataResitance.pushDataSet("Calm Water", "rgba(1, 28, 64, 0.6)")
			var datasetViscous = dataResitance.pushDataSet("Viscous", "rgba(115, 69, 41, 0.6)")
			var datasetWave = dataResitance.pushDataSet("Wave", "rgba(41, 85, 115, 0.6)")
			var datasetTotal = dataResitance.pushDataSet("Total", "rgba(138, 103, 83, 0.6)")

			var pieColor = ["rgba(1, 28, 64, 0.6)", "rgba(41, 85, 115, 0.6)", "rgba(166, 13, 13, 0.6)"]
			var hoverPieColor = ["rgba(1, 28, 64, 1)", "rgba(41, 85, 115, 1)", "rgba(166, 13, 13, 1)"]
			var datasetPower = dataPower.pushDataSet("Power percentage", pieColor, hoverPieColor)

			if (isNaN(models.hullRes.calmResistance.Rt)) throw "Resistance not possible to be calculated"

			for (let type of Object.keys(models.percentages)) {
				datasetPower.push(models.percentages[type].toFixed(2))
				dataPower.xLabel.push(type)
			}

			for (let v = 0; v <= Math.floor(models.v_proj * 1.2); v++) {
				models.hullRes.setSpeed(v)

				dataResitance.xLabel.push(v.toFixed(0))
				datasetCalmResist.push(v ? models.hullRes.calmResistance.Rt.toFixed(2) : "0")
				datasetViscous.push(v ? models.hullRes.calmResistance.Rf.toFixed(2) : "0")
				datasetWave.push(v ? models.hullRes.calmResistance.Rw.toFixed(2) : "0")
				datasetTotal.push(v ? models.hullRes.totalResistance.Rtadd.toFixed(2) : "0")
			}

			// Filter the values
			var keys = ["Rf", "Rt", "Rw", "t", "w", "etah", "Pe", "Rtadd"]
			var units = ["N", "N", "N", "", "", "", "W", "N"]
			var precision = [0, 0, 0, 2, 2, 2, 0, 0]
			models.hullRes.setSpeed(models.v_proj)
			var filtered = {}
			Object.assign(filtered, extract(models.hullRes.calmResistance, keys))
			Object.assign(filtered, extract(models.hullRes.efficiency, keys))
			Object.assign(filtered, extract(models.hullRes.totalResistance, keys))

			return (
				<>
					<div className="row">
						<div className="col-lg-6  text-center ">
							<LineChart chartData={dataResitance.chartData} textTitle="Resistence X Velocity" xLabel="Ship Speed (Knots)" yLabel="Resistence (N)" legendPosition="top" />
						</div>
						<div className="col-lg-6  text-center ">
							<PieChart chartData={dataPower.chartData} textTitle={`Power % for ${models.v_proj} knots`} />
						</div>
					</div>
					<br />
					<div className="row align-items-center text-center justify-content-center">
						<h4>Resistance in the design speed = {models.v_proj.toFixed(2)} m/s </h4>
					</div>
					<div className="row align-items-center text-center justify-content-center">
						<div className="col-lg-6 ">
							<table className="table">
								<thead className="thead-dark">
									<tr>
										<th scope="col">Variable</th>
										<th scope="col">Value</th>
										<th scope="col">Unit</th>
									</tr>
								</thead>
								<tbody>
									{keys.map((value, id) => {
										return (
											<tr key={id}>
												<td>{value}</td>
												<td>{filtered[value].toFixed(precision[id])}</td>
												<td>{units[id]}</td>
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

		return <h1>Tese</h1>
	}

	return (
		<div className="container-fluid align-items-center p-3">
			<TestComponent />
		</div>
	)
}

export default ResistanceModule
