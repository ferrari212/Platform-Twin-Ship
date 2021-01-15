import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import { Vega } from "react-vega/esm"

function GraphicVega() {
	const spec = {
		width: 400,
		height: 200,
		data: [{ name: "table" }],
		signals: [
			{
				name: "tooltip",
				value: {},
				on: [
					{ events: "rect:mouseover", update: "datum" },
					{ events: "rect:mouseout", update: "{}" }
				]
			}
		]
	}

	const barData = {
		table: []
	}

	function handleHover(...args) {
		console.log(args)
	}

	const signalListeners = { hover: handleHover }

	return <Vega spec={spec} data={barData} signalListeners={signalListeners} />
}

export default GraphicVega
