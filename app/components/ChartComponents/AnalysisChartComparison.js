import React from "react"

import { Accordion, Card, Button } from "react-bootstrap"
import Page from "../Page"

import VesselModels from "../../snippets/VesselModels"
import { Vessel } from "../../vessel/build/vessel"

import ResistanceComparison from "../AnalysisComponent/ResistanceComparison"
import HydrostaticComparison from "../AnalysisComponent/HydrostaticComparison"
import ResponseComparison from "../AnalysisComponent/ResponseComparison"

function AnalysisChartComparison(props) {
	function returnAnalysis(params, newState) {
		try {
			var newParams = JSON.parse(JSON.stringify(params))
			var keys = Object.keys(newState).map(key => key)

			var calculationParameters = newParams.designState.calculationParameters
			var attributes = newParams.structure.hull.attributes

			keys
				.filter(function (prop) {
					if (calculationParameters[prop] === undefined) {
						return false
					}
					return true
				})
				.map(prop => (calculationParameters[prop] = newState[prop]))

			keys
				.filter(function (prop) {
					if (attributes[prop] === undefined) {
						return false
					}
					return true
				})
				.map(prop => (attributes[prop] = newState[prop]))

			var ship = {
				currentState: new Vessel.Ship(params),
				newState: new Vessel.Ship(newParams)
			}

			var models = {
				currentState: new VesselModels(ship.currentState),
				newState: new VesselModels(ship.newState)
			}

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
									<div>
										<ResistanceComparison currentState={models.currentState} newState={models.newState} />
									</div>
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
									<div>
										<HydrostaticComparison currentState={models.currentState} newState={models.newState} />
									</div>
								</Card.Body>
							</Accordion.Collapse>
						</Card>
					</Accordion>
					<Accordion defaultActiveKey="2">
						<Card>
							<Card.Header>
								<Accordion.Toggle as={Button} variant="secondary" eventKey="2">
									RAO
								</Accordion.Toggle>
							</Card.Header>
							<Accordion.Collapse eventKey="2">
								<Card.Body>
									<div>
										<ResponseComparison currentState={models.currentState} newState={models.newState} />
									</div>
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
		<Page title="Analyisis Comparison" wide={true}>
			{/* <h1>This will be a analysis Comparison</h1> */}
			{/* Tak away the .state to pass just the ship @ferrari212 */}
			{returnAnalysis(props.state, props.newState)}
		</Page>
	)
}

export default AnalysisChartComparison
