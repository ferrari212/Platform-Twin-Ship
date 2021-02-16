import React, { useEffect } from "react"
import BarConfig from "./BarConfig.js"
import ReactDOM from "react-dom"
import { Vega } from "react-vega"
import { createClassFromSpec } from "react-vega"

function BarVega() {
	const barData = {
		table: [
			{ category: "A", amount: 28 },
			{ category: "B", amount: 55 },
			{ category: "C", amount: 43 },
			{ category: "D", amount: 91 },
			{ category: "E", amount: 81 },
			{ category: "F", amount: 53 },
			{ category: "G", amount: 19 },
			{ category: "H", amount: 89 }
		]
	}

	function handleHover(...args) {
		console.log(args)
	}
	const signalListeners = { hover: handleHover }

	return <BarConfig data={barData} signalListeners={signalListeners} />
}

export default BarVega
