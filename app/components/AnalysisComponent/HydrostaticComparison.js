import React from "react"

import DataChartStructure from "../../snippets/DataChartStructure"
import extract from "../../snippets/extract"
import LineChart from "../ChartComponents/LineChart"

function HydrostaticModule(prop) {
	function TestComponent() {
		try {
			var models = prop.models
			var dataDisp = new DataChartStructure()
			var dataCenter = new DataChartStructure()
			var dataBuoyancy = new DataChartStructure()
			var dataCoeff = new DataChartStructure()

			var datasetDisp = dataDisp.pushDataSet("Disp", "rgba(138, 103, 83, 0.6)")

			var datasetLCB = dataCenter.pushDataSet("LCB", "rgba(1, 28, 64, 0.6)")
			var datasetLCF = dataCenter.pushDataSet("LCF", "rgba(115, 69, 41, 0.6)")

			var datasetKB = dataBuoyancy.pushDataSet("KB", "rgba(41, 85, 115, 0.6)")
			var datasetBMt = dataBuoyancy.pushDataSet("KMt", "rgba(1, 28, 64, 0.6)")
			var datasetBMl = dataBuoyancy.pushDataSet("0.1 x KMl", "rgba(138, 103, 83, 0.6)")
			var datasetGMt = dataBuoyancy.pushDataSet("GMt", "rgba(166, 13, 13, 0.6)")

			var datasetCb = dataCoeff.pushDataSet("Cb", "rgba(41, 85, 115, 0.6)")
			var datasetCm = dataCoeff.pushDataSet("Cm", "rgba(1, 28, 64, 0.6)")
			var datasetCp = dataCoeff.pushDataSet("Cp", "rgba(138, 103, 83, 0.6)")
			var datasetCWp = dataCoeff.pushDataSet("Cwp", "rgba(166, 13, 13, 0.6)")

			var designDraft = models.shipState.calculationParameters.Draft_design
			var currentResults = models.ship.structure.hull.calculateAttributesAtDraft(designDraft)

			// Filter the values
			var keys = ["Vs", "LCB", "LCF", "KB", "BMt", "BMl", "KB", "Cb", "Cm", "Cp", "Cwp"]
			var units = ["m³", "m", "m", "m", "m", "m", "m", "", "", "", ""]
			var filtered = extract(currentResults, keys)

			var draft = 0.25
			var drafts = []
			var draftVariation = 0.25

			var Weight = models.ship.getWeight(models.shipState)
			var CG = Weight.cg.z

			while (draft <= models.ship.structure.hull.attributes.Depth) {
				drafts.push(draft.toFixed(2))
				var attributes = models.ship.structure.hull.calculateAttributesAtDraft(draft)

				datasetDisp.push(attributes["Vs"].toFixed(2))
				datasetLCB.push(attributes["LCB"].toFixed(2))
				datasetLCF.push(attributes["LCF"].toFixed(2))
				datasetKB.push(attributes["KB"].toFixed(2))
				datasetBMt.push(attributes["BMt"].toFixed(2))
				datasetBMl.push((0.1 * attributes["BMl"]).toFixed(2))
				datasetGMt.push((attributes["KB"] + attributes["BMt"] - CG).toFixed(2))
				datasetCb.push(attributes["Cb"].toFixed(2))
				datasetCm.push(attributes["Cm"].toFixed(2))
				datasetCp.push(attributes["Cp"].toFixed(2))
				datasetCWp.push(attributes["Cwp"].toFixed(2))

				draft = draft + draftVariation
			}

			dataDisp.setLabels(drafts)
			dataCenter.setLabels(drafts)
			dataBuoyancy.setLabels(drafts)
			dataCoeff.setLabels(drafts)

			return (
				<div className="container-fluid align-items-center p-3">
					<div className="row">
						<div className="col-lg-6  text-center ">
							<LineChart chartData={dataDisp.chartData} textTitle="Displacement x Draft" xLabel="Draft (m)" yLabel="Displacement (m^3)" displayLegend="false" />
						</div>
						<div className="col-lg-6  text-center ">
							<LineChart chartData={dataCenter.chartData} textTitle="Longitudinal Centers" xLabel="Draft (m)" yLabel="Value (m)" legendPosition="top" />
						</div>
					</div>
					<div className="row">
						<div className="col-lg-12  text-center ">
							<LineChart chartData={dataBuoyancy.chartData} textTitle={`Vertical Centers, with vertical CG = ${CG.toFixed(2)} m`} xLabel="Draft (m)" yLabel="Displacement (m)" />
						</div>
					</div>
					<div className="row">
						<div className="col-lg-12  text-center ">
							<LineChart chartData={dataCoeff.chartData} textTitle="Adm. Coefficients" xLabel="Draft (m)" yLabel="Displacement (m)" />
						</div>
					</div>
					<br />
					<div className="row align-items-center text-center justify-content-center">
						<h4>Hydrostatic in the design draft = {designDraft.toFixed(2)} m</h4>
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
												<td>{filtered[value].toFixed(2)}</td>
												<td>{units[id]}</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)
		} catch (error) {
			return (
				<div className="container-fluid align-items-center p-3">
					<div>Error found: {error}</div>
				</div>
			)
		}
	}

	return <TestComponent />
}

export default HydrostaticModule
