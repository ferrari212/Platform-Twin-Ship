import React, { useEffect } from "react"

import ShipObject from "../../snippets/ShipObject"
import AnalysisChartComparison from "../ChartComponents/AnalysisChartComparison"

const ThreeModelRayCaster = React.lazy(() => import("./ThreeModelRayCaster"))
const ThreeModelGLB = React.lazy(() => import("./ThreeModelGLB"))
const ThreeSimulation = React.lazy(() => import("./ThreeSimulation"))
const ThreeTwinShip = React.lazy(() => import("./ThreeTwinShip"))

function ThreeSwitch(props) {
	var ship = new ShipObject(props.user)

	var logicalProcess = ship => {
		if (typeof ship.version.ship === "string") {
			if (Boolean(ship.shipObj.obj.attributes.GLTFUrl)) return "GLB"
			return "RayCaster"
		}

		return null
	}

	function ChooseModel() {
		if (props.user.method === "simulate") {
			return <ThreeSimulation user={props.user} />
		}

		if (props.user.method === "digitalTwin") {
			return <ThreeTwinShip user={props.user} />
		}

		if (props.user.newState) {
			return <AnalysisChartComparison state={ship.shipObj} newState={props.user.newState} />
		}

		// Checking Status this way is deprecated @ferrari212
		// function checkStatus(user) {
		// 	if (user.newState) {
		// 		return <AnalysisChartComparison state={ship.shipObj} newState={user.newState} />
		// 	}
		// 	return <>{user.method === "simulate" ? <ThreeSimulation user={props.user} /> : <ThreeModelRayCaster user={props.user} />}</>
		// }

		var key = logicalProcess(ship)

		switch (key) {
			case "RayCaster":
				return <ThreeModelRayCaster user={props.user} />

			case "GLB":
				return <ThreeModelGLB user={props.user} />

			default:
				return null
		}
	}

	return <ChooseModel />
}

export default ThreeSwitch
