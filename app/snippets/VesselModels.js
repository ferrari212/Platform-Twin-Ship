import { Vessel } from "../vessel/build/vessel"

export default class VesselModels {
	// Set up for the main Vessel.js models
	// params: JSON object containing the vessel container

	constructor(params) {
		this.ship = params
		this.shipState = new Vessel.ShipState(this.ship.designState.getSpecification())
		this.propellerSpecification = new Object({
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

		// This is the wave created
		this.wave = new Vessel.WaveCreator()

		if (!this.ship.designState.calculationParameters.speed) {
			this.v_proj = 10
		} else {
			this.v_proj = this.ship.designState.calculationParameters.speed
		}

		this.hullRes = new Vessel.HullResistance(this.ship, this.shipState, this.propellerSpecification, this.wave)
		this.hullRes.writeOutput()
		this.propellerInteraction = new Vessel.PropellerInteraction(this.ship, this.shipState, this.propellerSpecification)

		this.setSpeed(this.v_proj)
		this.setPowerPercentages()

		this.wavMo = new Vessel.WaveMotion(this.ship, this.shipState, this.wave)
		this.wavMo.output.push("rollAmp")
		this.wavMo.writeOutput()
		debugger
		// this.getWaveResponse(1, 1, 0)
		// debugger
	}

	setSpeed(speed) {
		this.hullRes.setSpeed(speed)
		this.hullRes.writeOutput()
		this.propellerInteraction.setSpeed(speed)
		this.propellerInteraction.writeOutput()
	}

	setPowerPercentages() {
		var PPw = (100 * (this.hullRes.calmResistance.Rw * this.hullRes.coefficients.speedSI)) / this.propellerInteraction.resistanceState.Pe
		var PPf = (100 * (this.hullRes.calmResistance.Rf * this.hullRes.coefficients.speedSI)) / this.propellerInteraction.resistanceState.Pe
		var PPr = (100 * this.propellerInteraction.resistanceState.Pe) / this.propellerInteraction.resistanceState.Pe - PPw - PPf

		this.percentages = new Object({
			Wave: PPw,
			Frictional: PPf,
			Residual: PPr
		})
	}

	getWaveResponse(freq, amp, head) {
		// freq: angular frequency Hz
		// amp: wave amplitude in meters
		// head: heading from 0 to 360 degrees. 180 degrees corresponds to head seas
		this.wave.setWaveDef(freq, amp, head)
		return { ...this.wavMo.verticalMotion, rollAmp: this.wavMo.rollAmp }
	}
}
