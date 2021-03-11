import React, { useEffect } from "react"

import ShipObject from "../../snippets/ShipObject"

const ThreeModelRayCaster = React.lazy(() => import("./ThreeModelRayCaster"))
const ThreeModelGLB = React.lazy(() => import("./ThreeModelGLB"))
const ThreeSimulation = React.lazy(() => import("./ThreeSimulation"))

function ThreeSwitch(props) {
	var logicalProcess = () => {
		// Maybe insert later a switch function to decide for every simulation
		// switch (props.user.method) {
		// 	case value:

		// 		break;
		// 	case "simulate":

		// 		break;

		// 	default:
		// 		return;
		// }

		var ship = new ShipObject(props.user)

		if (typeof ship.version.ship === "string") {
			if (Boolean(ship.shipObj.attributes.GLTFUrl)) return "GLB"
			return "RayCaster"
		}

		return undefined
	}

	function ChooseModel() {
		if (props.user.method === "simulate") return <ThreeSimulation user={props.user} />

		var key = logicalProcess()

		switch (key) {
			case "RayCaster":
				return (
					<>
						{props.user.method === "simulate" ? <ThreeSimulation user={props.user} /> : <ThreeModelRayCaster user={props.user} />}
						{props.user.newState ? <div>There is a new state to be inserted</div> : ""}
					</>
				)

			case "GLB":
				return <ThreeModelGLB user={props.user} />

			default:
				return ""
		}
	}

	return <ChooseModel />
}

export default ThreeSwitch
