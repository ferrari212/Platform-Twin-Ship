import React from "react"

import { Accordion, Card, Button } from "react-bootstrap"
import Page from "../Page"

import VesselModels from "../../snippets/VesselModels"

import ResistanceModule from "../AnalysisComponent/ResistanceModule"
import HydrostaticModule from "../AnalysisComponent/HydrostaticModule"

function AnalysisChart(props) {
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
									<div>
										<ResistanceModule models={models} />
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
										<HydrostaticModule models={models} />
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
		<Page title="Analyisis" wide={true}>
			{returnAnalysis(props.state.ship)}
		</Page>
	)
}

export default AnalysisChart
