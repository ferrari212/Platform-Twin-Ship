import React, { useEffect } from "react"

import ShipObject from "../../snippets/ShipObject"

const ThreeModelRayCaster = React.lazy(() => import("./ThreeModelRayCaster"))
const ThreeModelGLB = React.lazy(() => import("./ThreeModelGLB"))

function ThreeSwitch(props) {
	var logicalProcess = () => {
		var ship = new ShipObject(props.user)

		if (typeof ship.version.ship === "string") {
			if (Boolean(ship.shipObj.attributes.GLTFUrl)) return "GLB"
			return "RayCaster"
		}

		return undefined
	}

	function ChooseModel() {
		var key = logicalProcess()

		switch (key) {
			case "RayCaster":
				return (
					<>
						<ThreeModelRayCaster user={props.user} />
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
