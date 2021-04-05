import React from "react"

import DataChartStructure from "../../snippets/DataChartStructure"
import extract from "../../snippets/extract"
import LineChart from "../ChartComponents/LineChart"

function HydrostaticComparison(prop) {
	function TestComponent() {
		try {
			var currentState = prop.currentState
			var newState = prop.newState

			var dataDisp = new DataChartStructure()
			var dataCenter = new DataChartStructure()
			var dataBuoyancy = new DataChartStructure()
			var dataCoeffVolume = new DataChartStructure()

			var datasetDisp = dataDisp.pushDataSet("Current", "rgba(1, 28, 64, 0.6)")
			var datasetDispNew = dataDisp.pushDataSet("New", "rgba(138, 103, 83, 0.6)")

			var datasetBMtCurrent = dataBuoyancy.pushDataSet("Current BMt", "rgba(41, 85, 115, 0.6)")
			var datasetBMtNew = dataBuoyancy.pushDataSet("New BMt", "rgba(166, 13, 13, 0.6)")
			var datasetBMlCurrent = dataBuoyancy.pushDataSet("0.1 x KMl", "rgba(1, 28, 64, 0.6)")
			var datasetBMlNew = dataBuoyancy.pushDataSet("0.1 x KMl", "rgba(138, 103, 83, 0.6)")

			var datasetLCBCurrent = dataCoeffVolume.pushDataSet("Current LCB", "rgba(41, 85, 115, 0.6)")
			var datasetLCBNew = dataCoeffVolume.pushDataSet("New LCB", "rgba(166, 13, 13, 0.6)")
			var datasetLCFCurrent = dataCoeffVolume.pushDataSet("Current LCF", "rgba(1, 28, 64, 0.6)")
			var datasetLCFNew = dataCoeffVolume.pushDataSet("New LCF", "rgba(138, 103, 83, 0.6)")

			var currentDesignDraft = currentState.shipState.calculationParameters.Draft_design
			var currentResults = currentState.ship.structure.hull.calculateAttributesAtDraft(currentDesignDraft)
			var newDesignDraft = newState.shipState.calculationParameters.Draft_design
			var newResults = newState.ship.structure.hull.calculateAttributesAtDraft(newDesignDraft)

			// Filter the values
			var keys = ["Vs", "LCB", "LCF", "KB", "BMt", "BMl", "KB", "Cb", "Cm", "Cp", "Cwp"]
			var units = ["m³", "m", "m", "m", "m", "m", "m", "", "", "", ""]
			var filteredCurrentState = extract(currentResults, keys)
			var filteredNewState = extract(newResults, keys)

			var draft = 0.25
			var drafts = []
			var draftVariation = 0.25

			var Weight = currentState.ship.getWeight(currentState.shipState)
			var CG = Weight.cg.z

			while (draft <= currentState.ship.structure.hull.attributes.Depth) {
				drafts.push(draft.toFixed(2))
				var attributes = currentState.ship.structure.hull.calculateAttributesAtDraft(draft)
				var newAttributes = newState.ship.structure.hull.calculateAttributesAtDraft(draft)

				datasetDisp.push(attributes["Vs"].toFixed(2))
				datasetBMtCurrent.push(attributes["BMt"].toFixed(2))
				datasetBMlCurrent.push((0.1 * attributes["BMl"]).toFixed(2))
				datasetLCBCurrent.push(attributes["LCB"].toFixed(2))
				datasetLCFCurrent.push(attributes["LCF"].toFixed(2))

				datasetDispNew.push(newAttributes["Vs"].toFixed(2))
				datasetBMtNew.push(newAttributes["BMt"].toFixed(2))
				datasetBMlNew.push((0.1 * newAttributes["BMl"]).toFixed(2))
				datasetLCBNew.push(newAttributes["LCB"].toFixed(2))
				datasetLCFNew.push(newAttributes["LCF"].toFixed(2))

				draft = draft + draftVariation
			}

			dataDisp.setLabels(drafts)
			dataCenter.setLabels(drafts)
			dataBuoyancy.setLabels(drafts)
			dataCoeffVolume.setLabels(drafts)

			function chooseSymbol(currentValue, newValue) {
				var variation = ((100 * (newValue - currentValue)) / currentValue).toFixed(1) + "%"

				if (currentValue.toFixed(2) !== newValue.toFixed(2)) {
					if (currentValue < newValue) {
						return (
							<td style={{ color: "#295773" }}>
								{variation}
								<i className="fas fa-arrow-up"></i>
							</td>
						)
					}
					return (
						<td style={{ color: "#A60D0D" }}>
							{variation}
							<i className="fas fa-arrow-down"></i>
						</td>
					)
				} else {
					return <td>=</td>
				}
			}

			return (
				<div className="container-fluid align-items-center p-3">
					<div className="row">
						<div className="col-lg-12  text-center ">
							<LineChart chartData={dataDisp.chartData} textTitle="Displacement x Draft" xLabel="Draft (m)" yLabel="Displacement (m^3)" legendPosition="top" />
						</div>
					</div>
					<div className="row">
						<div className="col-lg-12  text-center ">
							<LineChart chartData={dataBuoyancy.chartData} textTitle={`Vertical Centers, with vertical CG = ${CG.toFixed(2)} m`} xLabel="Draft (m)" yLabel="Displacement (m)" legendPosition="top" />
						</div>
					</div>
					<div className="row">
						<div className="col-lg-12  text-center ">
							<LineChart chartData={dataCoeffVolume.chartData} textTitle="Adm. Coefficients" xLabel="Draft (m)" yLabel="" legendPosition="top" />
						</div>
					</div>
					<br />
					<div className="row align-items-center text-center justify-content-center">
						<h4>
							Comparison for current state in the draft = {currentDesignDraft.toFixed(2)} m,
							<br />
							and new state in the draft = {newDesignDraft.toFixed(2)} m.
						</h4>
					</div>
					<div className="row align-items-center text-center justify-content-center">
						<div className="col-lg-6 ">
							<table className="table">
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
												<td>{filteredCurrentState[value].toFixed(2)}</td>
												<td>{filteredNewState[value].toFixed(2)}</td>
												<td>{units[id]}</td>
												{chooseSymbol(filteredCurrentState[value], filteredNewState[value])}
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

export default HydrostaticComparison
