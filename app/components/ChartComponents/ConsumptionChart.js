import React, { useEffect } from "react"

// import { Vessel } from "../../vessel/build/vessel"
import BarVega from "./BarVega"
import D3Chart from "./D3Chart"

function ConsumptionChart(props) {
	console.log(props)

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
			</div>
		</div>
	)
}

export default ConsumptionChart
