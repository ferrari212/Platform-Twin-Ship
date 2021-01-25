import React, { useState, useEffect } from "react"

// import { Vessel } from "../../vessel/build/vessel"
import BarVega from "./BarVega"
import D3Chart from "./D3Chart"
import Chart from "./Chart"

function ConsumptionChart(props) {
	console.log(props)

	const [state, setState] = useState({
		chartData: {
			labels: ["Boston", "Worcester", "Springfield", "Lowell", "Cambridge", "New Bedford"],
			datasets: [
				{
					label: "Population",
					data: [617594, 181045, 153060, 106519, 105162, 95072],
					backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)", "rgba(255, 159, 64, 0.6)", "rgba(255, 99, 132, 0.6)"]
				}
			]
		}
	})

	try {
		this.ship = props.state.ship
		this.shipState = new props.Vessel.ShipState(this.ship.designState.getSpecification())
		this.propeller = new Object({
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
		this.wave = new props.Vessel.WaveCreator()

		this.hullRes = new Vessel.HullResistance(this.ship, this.shipState, this.propeller, this.wave)
		hullRes.writeOutput()

		// var resistanceModules = props.Vessel["HullResistance"]
	} catch (e) {
		console.warn("Consumption chart not feed with proper data:", e)
	}

	return (
		<div className="container-fluid align-items-center p-3">
			Teste
			<div className="row">
				<div className="col-lg-6  text-center ">
					<D3Chart key="5" />
				</div>
				<div className="col-lg-6  text-center ">
					<BarVega key="2" />
				</div>
				<div className="col-lg-6  text-center ">{state ? <Chart chartData={state.chartData} legendPosition="bottom" /> : ""}</div>
			</div>
		</div>
	)
}

export default ConsumptionChart
