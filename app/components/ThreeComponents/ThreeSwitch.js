import React, { useEffect } from "react"

const ThreeModelRayCaster = React.lazy(() => import("./ThreeModelRayCaster"))
const ThreeModelGLB = React.lazy(() => import("./ThreeModelGLB"))

function ThreeSwitch(props) {
	var logicalProcess = () => {
		var Id = props.user.shipId
		var version = props.user.versions[Id].ship

		if (typeof version === "string") {
			var ship = JSON.parse(version)
			if (Boolean(ship.attributes.GLTFUrl)) return "GLB"
			return "RayCaster"
		}

		return undefined
	}

	function ChooseModel() {
		var key = logicalProcess()

		switch (key) {
			case "RayCaster":
				return <ThreeModelRayCaster user={props.user} />

			case "GLB":
				return <ThreeModelGLB user={props.user} />

			default:
				return ""
		}
	}

	return <ChooseModel />
}

export default ThreeSwitch
