import numeric from "numeric"

// @ferrari212
// This class requires the numeric.js
class ManoeuvringMovement {
	constructor(manoeuvring) {
		if (numeric) {
			console.warn("Manoeuvring requires the numeric.js library.")
		}

		this.mvr = manoeuvring
		this.manoeuvring = manoeuvring.manoeuvring
		this.states = manoeuvring.states
		this.getPropResult = manoeuvring.getPropResult
		this.dt = 0
	}

	// Insert this inside the ship maneuvring function

	setMatrixes(F = [0, 0, 0], yaw = 0) {
		// this.M_RB = numeric.add(this.M, this.I)
		let mvr = this.mvr
		let h = mvr.hydroCoeff
		let u = this.states.V.u

		// In this case the M_A is constant and the value ws left as it is
		const M_A = [
			[0, 0, 0],
			[0, -h.Yvacc, -h.Yracc],
			[0, -h.Yvacc, -h.Nracc]
		]

		const M = numeric.add(mvr.M_RB, M_A)
		// const M = [[ 1.1e5, 0, 0 ],
		// 					[ 0, 1.1e5, 8.4e4 ],
		// 					[ 0, 8.4e4, 5.8e6 ]]
		mvr.INVM = numeric.inv(M)

		// The value of N is in relation with the damping
		// mvr.INVMN = numeric.dot(numeric.neg(mvr.INVM), mvr.N)
		const { Cl, Cll, Clll } = mvr.dn

		const N = this.manoeuvring.N || [
			[0, 0, 0],
			[0, -Cl * h.Yvdn, this.manoeuvring.m * u - Cll * h.Yrdn],
			[0, -h.Yvacc * u - Cll * h.Nvdn, -h.Yracc * u - Clll * h.Nrdn]
		]

		mvr.INVMN = numeric.dot(numeric.neg(mvr.INVM), N)

		mvr.R = this.parseR(yaw)
		mvr.A = this.parseA(mvr.R, mvr.INVMN)
		const INVMF = numeric.dot(mvr.INVM, F)
		mvr.B = this.parseB(INVMF)
	}

	parseA(R, M) {
		var A = []

		for (let i = 0; i < 6; i++) {
			A.push([0, 0, 0, 0, 0, 0])
		}

		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 6; j++) {
				if (j < 3) {
					A[i][j] = 0
				} else {
					A[i][j] = i < 3 ? R[i][j - 3] : M[i - 3][j - 3]
				}
			}
		}
		return A
	}

	parseB(INVMF) {
		return [0, 0, 0, INVMF[0], INVMF[1], INVMF[2]]
	}

	parseR(yaw) {
		var trig = { cos: Math.cos(yaw), sin: Math.sin(yaw) }
		return [
			[trig.cos, -trig.sin, 0],
			[trig.sin, trig.cos, 0],
			[0, 0, 1]
		]
	}

	getDerivatives(V = { u: 0, v: 0, yaw_dot: 0 }) {
		let mvr = this.mvr

		var X = [0, 0, 0, this.states.V.u, this.states.V.v, this.states.V.yaw_dot]

		var X_dot = numeric.add(numeric.dot(mvr.A, X), mvr.B)

		return X_dot
	}

	getDisplacements(dt) {
		let self = this

		// Parse matrix V
		var X = [0, 0, 0, this.states.V.u, this.states.V.v, this.states.V.yaw_dot]

		let sol = numeric
			.dopri(
				0,
				dt,
				X,
				function (t, V) {
					return self.getDerivatives({ u: X[3], v: X[4], yaw_dot: X[5] })
				},
				1e-8,
				100
			)
			.at(dt)

		// Get global coordinates variation (dx, dy, dyaw)
		// Get local velocity (du, dv, dyaw_dot)
		this.states.DX = { x: sol[0], y: sol[1], yaw: sol[2] }
		this.states.V = { u: sol[3], v: sol[4], yaw_dot: sol[5] }
		this.states.yaw += this.states.DX.yaw
	}
}

export { ManoeuvringMovement }
