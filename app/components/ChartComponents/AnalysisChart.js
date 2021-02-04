import React, { useState, useEffect } from "react"

import { Vessel } from "../../vessel/build/vessel"
import LineChart from "./LineChart"
import PieChart from "./PieChart"
import { Accordion, Card, Button } from "react-bootstrap"
import Page from "../Page"

function AnalysisChart(props) {
	class DataStructure {
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

	class VesselModels {
		constructor(params) {
			this.ship = params
			this.shipState = new Vessel.ShipState(this.ship.designState.getSpecification())
			this.propellerSpecification = new Object({
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

			this.wave = new Vessel.WaveCreator()

			if (!this.ship.designState.calculationParameters.speed) {
				this.v_proj = 10
			} else {
				this.v_proj = this.ship.designState.calculationParameters.speed
			}

			this.hullRes = new Vessel.HullResistance(this.ship, this.shipState, this.propellerSpecification, this.wave)
			this.hullRes.writeOutput()
			this.propellerInteraction = new Vessel.PropellerInteraction(this.ship, this.shipState, this.propellerSpecification)

			this.setSpeed(this.v_proj)
			this.setPowerPercentages()
		}

		setSpeed(speed) {
			this.hullRes.setSpeed(speed)
			this.hullRes.writeOutput()
			this.propellerInteraction.setSpeed(speed)
			this.propellerInteraction.writeOutput()
		}

		setPowerPercentages() {
			var PPw = (100 * (this.hullRes.calmResistance.Rw * this.hullRes.coefficients.speedSI)) / this.propellerInteraction.resistanceState.Pe
			var PPf = (100 * (this.hullRes.calmResistance.Rf * this.hullRes.coefficients.speedSI)) / this.propellerInteraction.resistanceState.Pe
			var PPr = (100 * this.propellerInteraction.resistanceState.Pe) / this.propellerInteraction.resistanceState.Pe - PPw - PPf

			this.percentages = new Object({
				Wave: PPw,
				Frictional: PPf,
				Residual: PPr
			})
		}
	}

	function parseResistenceData(models) {
		var dataResitance = new DataStructure()
		var dataPower = new DataStructure()

		var datasetTotal = dataResitance.pushDataSet("Total", "rgba(138, 103, 83, 0.6)")
		var datasetCalmResist = dataResitance.pushDataSet("Calm Water", "rgba(1, 28, 64, 0.6)")
		var datasetViscous = dataResitance.pushDataSet("Viscous", "rgba(115, 69, 41, 0.6)")
		var datasetWave = dataResitance.pushDataSet("Wave", "rgba(41, 85, 115, 0.6)")

		var pieColor = ["rgba(1, 28, 64, 0.6)", "rgba(41, 85, 115, 0.6)", "rgba(166, 13, 13, 0.6)"]
		var hoverPieColor = ["rgba(1, 28, 64, 1)", "rgba(41, 85, 115, 1)", "rgba(166, 13, 13, 1)"]
		var datasetPower = dataPower.pushDataSet("Power percentage", pieColor, hoverPieColor)

		if (isNaN(models.hullRes.calmResistance.Rt)) throw "Resistance not possible to be calculated"

		for (let type of Object.keys(models.percentages)) {
			console.log(models.percentages[type], type, typeof type)
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
						<LineChart chartData={dataResitance.chartData} textTitle="Resistence by Velocity" xLabel="Ship Speed (Knots)" yLabel="Resistence (N)" />
					</div>
					<div className="col-lg-6  text-center ">
						<PieChart chartData={dataPower.chartData} textTitle={`Power % for ${models.v_proj} knots`} />
					</div>
				</div>
			</div>
		)
	}

	function parseHydrostaticData(models) {
		var dataDisp = new DataStructure()
		var dataCenter = new DataStructure()
		var dataBuoyancy = new DataStructure()
		var dataCoeff = new DataStructure()

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

		var draft = 0.25
		var drafts = []
		var draftVariation = 0.25

		var CG = models.ship.getWeight(models.shipState)
		console.log(CG)
		console.log(models)

		while (draft <= models.ship.structure.hull.attributes.Depth) {
			drafts.push(draft.toFixed(2))
			var attributes = models.ship.structure.hull.calculateAttributesAtDraft(draft)
			console.log(attributes)

			datasetDisp.push(attributes["Vs"].toFixed(2))
			datasetLCB.push(attributes["LCB"].toFixed(2))
			datasetLCF.push(attributes["LCF"].toFixed(2))
			datasetKB.push(attributes["KB"].toFixed(2))
			datasetBMt.push(attributes["BMt"].toFixed(2))
			datasetBMl.push((0.1 * attributes["BMl"]).toFixed(2))
			datasetGMt.push(attributes["BMt"].toFixed(2))
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
						<LineChart chartData={dataDisp.chartData} textTitle="Displacement x Draft" xLabel="Draft (m)" yLabel="Displacement (m^3)" />
					</div>
					<div className="col-lg-6  text-center ">
						<LineChart chartData={dataCenter.chartData} textTitle="Longitudinal Centers" xLabel="Draft (m)" yLabel="Value (m)" />
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12  text-center ">
						<LineChart chartData={dataBuoyancy.chartData} textTitle={`Vertical Centers, with vertical CG = ${CG.cg.z.toFixed(2)} m`} xLabel="Draft (m)" yLabel="Displacement (m)" />
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12  text-center ">
						<LineChart chartData={dataCoeff.chartData} textTitle="Adm. Coefficients" xLabel="Draft (m)" yLabel="Displacement (m)" />
					</div>
				</div>
			</div>
		)
	}

	function returnAnalysis(params) {
		try {
			var models = new VesselModels(params)

			return (
				<div>
					<Accordion defaultActiveKey="0">
						<Card>
							<Card.Header>
								<Accordion.Toggle as={Button} variant="secondary" eventKey="0">
									Resistance
								</Accordion.Toggle>
							</Card.Header>
							<Accordion.Collapse eventKey="0">
								<Card.Body>
									<div>{parseResistenceData(models)}</div>
								</Card.Body>
							</Accordion.Collapse>
						</Card>
					</Accordion>
					<Accordion defaultActiveKey="1">
						<Card>
							<Card.Header>
								<Accordion.Toggle as={Button} variant="secondary" eventKey="1">
									Hydrostatic
								</Accordion.Toggle>
							</Card.Header>
							<Accordion.Collapse eventKey="1">
								<Card.Body>
									<div> {parseHydrostaticData(models)}</div>
								</Card.Body>
							</Accordion.Collapse>
						</Card>
					</Accordion>
				</div>
			)
		} catch (e) {
			console.warn("Chart not feed with proper data:", e)
			return ""
		}
	}

	return (
		<Page title="Analyisis" wide={true}>
			{returnAnalysis(props.state.ship)}
		</Page>
	)
}

export default AnalysisChart
