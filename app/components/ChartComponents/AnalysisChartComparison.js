import React from "react"

import { Accordion, Card, Button } from "react-bootstrap"
import Page from "../Page"

import VesselModels from "../../snippets/VesselModels"
import { Vessel } from "../../vessel/build/vessel"

import ResistanceModule from "../AnalysisComponent/ResistanceModule"
import HydrostaticModule from "../AnalysisComponent/HydrostaticModule"
import ResponseModule from "../AnalysisComponent/ResponseModule"

function AnalysisChartComparison(props) {
	debugger
	function returnAnalysis(params, newState) {
		try {
			var newParams = JSON.parse(JSON.stringify(params))
			Object.assign(newParams.designState.calculationParameters, newState)

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
										<ResistanceModule models={models.currentState} />
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
										<HydrostaticModule models={models.currentState} />
									</div>
								</Card.Body>
							</Accordion.Collapse>
						</Card>
					</Accordion>
					<Accordion defaultActiveKey="2">
						<Card>
							<Card.Header>
								<Accordion.Toggle as={Button} variant="secondary" eventKey="2">
									Test Response
								</Accordion.Toggle>
							</Card.Header>
							<Accordion.Collapse eventKey="2">
								<Card.Body>
									<div>
										<ResponseModule models={models.currentState} />
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
			<h1>This will be a analysis Comparison</h1>
			{/* Get out of .state pass just the ship */}
			{returnAnalysis(props.state, props.newState)}
		</Page>
	)
}

export default AnalysisChartComparison
