import React from "react"

import DataChartStructure from "../../snippets/DataChartStructure"
import LineChart from "../ChartComponents/LineChart"
import PieChart from "../ChartComponents/PieChart"

function ResistanceModule(prop) {
	var models = prop.models
	var dataResitance = new DataChartStructure()
	var dataPower = new DataChartStructure()

	var datasetTotal = dataResitance.pushDataSet("Total", "rgba(138, 103, 83, 0.6)")
	var datasetCalmResist = dataResitance.pushDataSet("Calm Water", "rgba(1, 28, 64, 0.6)")
	var datasetViscous = dataResitance.pushDataSet("Viscous", "rgba(115, 69, 41, 0.6)")
	var datasetWave = dataResitance.pushDataSet("Wave", "rgba(41, 85, 115, 0.6)")

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
		datasetCalmResist.push(models.hullRes.calmResistance.Rt.toFixed(2))
		datasetViscous.push(models.hullRes.calmResistance.Rf.toFixed(2))
		datasetWave.push(models.hullRes.calmResistance.Rw.toFixed(2))
		datasetTotal.push(models.hullRes.totalResistance.Rtadd.toFixed(2))
	}

	return (
		<div className="container-fluid align-items-center p-3">
			<div className="row">
				<div className="col-lg-6  text-center ">
					<LineChart chartData={dataResitance.chartData} textTitle="Resistence by Velocity" xLabel="Ship Speed (Knots)" yLabel="Resistence (N)" legendPosition="top" />
				</div>
				<div className="col-lg-6  text-center ">
					<PieChart chartData={dataPower.chartData} textTitle={`Power % for ${models.v_proj} knots`} />
				</div>
			</div>
		</div>
	)
}

export default ResistanceModule
