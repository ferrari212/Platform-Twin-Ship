import React, { useEffect, useState, Component } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { ProgressBar } from "react-bootstrap"
import Page from "../Page"
import LifeCycleBar from "../LifeCycleBar"

import { Skybox } from "../../vessel/libs/skybox_from_examples_r118"
import { Ocean } from "../../vessel/libs/Configurable_ocean2"
import { Vessel } from "../../vessel/build/vessel"
import { Ship3D } from "../../vessel/build/Ship3D"
import { ThirdPersonCamera } from "../../vessel/examples/3D_engine/ThirdPersonCamera"

import ShipObject from "../../snippets/ShipObject"
import { ManoeuvringMovement } from "../../vessel/snippets/ManoeuvringMovement"

// import GunnerusTeste from "../../vessel/specs/Gunnerus.json"
import AnalysisChart from "../ChartComponents/AnalysisChart"
import Pannel from "../GuideComponents/Pannel"
import GuiManeuvering from "../GuideComponents/GuiManeuvering"

class ThreeSimulation extends Component {
	constructor(props) {
		super(props)

		this.recorder = false
		this.state = { recorder: false, advance: false, taticalDiameter: false }

	}

	componentDidMount() {
		// Globals

		//  Later pass the ship object to the switch function
		// The view size may be changed late, this will be passed inside SceneSetup
		var version = new ShipObject(this.props.user)
		this.viewInitialPoint = 1.5 * version.shipObj.obj.designState.calculationParameters["LWL_design"]
		this.isoArray = []

		this.setShipDataTemporary(this, version.shipObj)

		this.sceneSetup()

		this.addScenario()

		window.addEventListener("resize", this.handleWindowResize)

		this.clock = new THREE.Clock()
		this.time = this.clock.getElapsedTime()

	}

	componentDidUpdate(prevProps, prevStates) {

		// Use ShipObject class here
		var prevIndex = prevProps.user.shipId
		var prevVersion = prevProps.user.versions[prevIndex].ship

		// Use ShipObject class here
		var newIndex = this.props.user.shipId
		var newVersion = this.props.user.versions[newIndex].ship

		if (prevVersion !== newVersion) {
			this.removeShip()

			this.setShipDataTemporary(this, newVersion)
		} else {
			this.ship = new Vessel.Ship(this.state.newShip)

			if (!this.scene.getObjectByName("Ship3D")) {
				this.addShip()
			}

			if (this.requestID === undefined) {
				this.startAnimationLoop()
			}
		}
	}

	componentWillUnmount() {
		delete this.startAnimationLoop
		document.removeEventListener("keydown", e => {
			this.onDocumentKeyDown(e)
		})
		// Delete the keyDown later on @ferrari212
	}

	sceneSetup = () => {
		// get container dimensions and use them for scene sizing
		const width = this.mount.offsetWidth

		// Modify the inner Height
		const height = this.props.height || window.innerHeight - 151

		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(
			26, // fov = field of view
			width / height, // aspect ratio
			1, // near plane
			10000 // far plane
		)
		// set some distance from a cube that is located at z = 0
		this.camera.position.set(0, 7, 40)

		this.renderer = new THREE.WebGLRenderer({ antialias: true })
		this.renderer.setSize(width, height)

		this.orbitControl = {}
		// this.orbitControl = new THREE.OrbitControl(this.camera, this.renderer.domElement)

		this.mount.appendChild(this.renderer.domElement) // mount using React ref

		this.useZUp = () => {
			const zUpCont = new THREE.Group()
			this.scene.add(zUpCont)
		}
	}

	addScenario = () => {
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
		const sun = new THREE.DirectionalLight(0xffffff, 2)
		this.scene.add(new THREE.AxesHelper(1000))
		sun.position.set(-512, -246, 128)
		this.scene.add(ambientLight, sun)

		this.useZUp()

		const skybox = new Skybox()
		skybox.name = "Skybox"
		this.scene.add(skybox)

		const oSize = 2048

		this.ocean = new Ocean({
			parentGUI: false,
			sunDir: sun.position.clone().normalize(),
			size: oSize,
			segments: 127
		})
		this.ocean.name = "Ocean"
		this.scene.add(this.ocean)
		this.scene.rotation.x = -Math.PI / 2
	}

	setShipDataTemporary = (context, version) => {
		if (version) {
			this.setState(() => {
				return {
					newShip: version.obj,
					ship: new Vessel.Ship(version.obj),
					propeller: version.propeller,
					powerPlant: version.powerPlant,
					man: version.man
				}
			})
		}
	}

	addShip = () => {
		this.ship3D = new Ship3D(this.ship, {
			stlPath: "specs/STL files/Gunnerus",
			upperColor: 0x33aa33,
			lowerColor: 0xaa3333,
			hullOpacity: 1,
			deckOpacity: 1,
			objectOpacity: 1
		})

		// Pass later on with the value of the title
		this.ship3D.name = "Ship3D"
		this.ship3D.show = "on"
		this.ship3D.rotation.z = -Math.PI / 2
		this.scene.add(this.ship3D)

		this.thrirdPersonCamera = new ThirdPersonCamera({
			camera: this.camera,
			object: this.ship3D
		})

		// this.OrbitCamera = new

		this.shipState = new Vessel.ShipState(this.ship.designState.getSpecification())

		this.usePropSpec(this.state.propeller, "rolls_royce_500_azipod.json")
		this.usePowSpec(this.state.powerPlant, "gunnerus_power_plant.json")

		this.manoeuvring = new Vessel.Manoeuvring(this.ship, this.shipState, this.hullRes, this.propellerInteraction, this.fuelCons, this.state.man)
		this.manoeuvringMovement = new ManoeuvringMovement(this.manoeuvring)

		this.interateLoop()

		this.setInitial()

		document.addEventListener("keydown", e => {
			this.onDocumentKeyDown(e)
		})
	}

	removeShip = () => {
		var deletedShip = this.scene.getObjectByName("Ship3D")
		this.scene.remove(deletedShip)
	}

	handleWindowResize = () => {
		const width = this.mount.clientWidth
		const height = this.mount.clientHeight

		this.renderer.setSize(width, height)
		this.camera.aspect = width / height
		this.camera.updateProjectionMatrix()
	}

	setRecorderView = () => {
		this.setInitial()
		this.time = this.clock.getElapsedTime()
		this.recorder = !this.recorder
		this.setState(() => {
			return { recorder: this.recorder }
		})
		if (this.recorder) {
			this.orbitControl = new OrbitControls(this.camera, this.mount)
			this.orbitControl.target = new THREE.Vector3(40, 7, 40)
		} else {
			this.orbitControl.dispose()
			this.orbitControl.update()
		}
	}

	interateLoop = () => {
		var t = 0
		var dt = 0.01
		this.manoeuvring.states.V.u = 10 / 1.96
		this.manoeuvring.setSpeed(this.manoeuvring.states.V.u)

		this.isoArray.push({ x: 0, y: 0, yaw: 0 })

		const material = new THREE.LineBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.4 })
		var points = []

		this.advance = false
		this.taticalDiameter = false

		do {
			const i = this.isoArray.length - 1

			points.push(new THREE.Vector3(this.isoArray[i].x, this.isoArray[i].y, 2))

			if (Math.cos(this.isoArray[i].yaw) < 0 && !this.advance) {
				this.advance = this.isoArray[i].x
			}

			if (Math.cos(this.isoArray[i].yaw / 2) < 0 && !this.taticalDiameter) {
				this.taticalDiameter = this.isoArray[i].y
			}

			const MAN = this.manoeuvringMovement.manoeuvring

			if (this.manoeuvring.states.rudderAngle < 35) {
				this.manoeuvring.states.rudderAngle += MAN.rudderRate * dt
			}

			this.isoArray.push(this.calculateISO(this.manoeuvring, this.manoeuvringMovement, this.manoeuvring.states.rudderAngle, this.isoArray[i], dt))

			t = t + dt
		} while (t < 600 && !this.taticalDiameter)

		this.setState(() => {
			return { advance: this.advance, taticalDiameter: this.taticalDiameter }
		})

		const geometry = new THREE.BufferGeometry().setFromPoints(points)
		const line = new THREE.Line(geometry, material)
		line.name = "line"
		line.opacity = 0

		this.scene.add(line)
	}

	setInitial = () => {
		this.manoeuvring.setSpeed(0)
		this.manoeuvringMovement.states.x = 0
		this.manoeuvringMovement.states.y = 0
		this.manoeuvringMovement.states.yaw = 0
		this.manoeuvringMovement.states.DX.x = 0
		this.manoeuvringMovement.states.DX.y = 0
		this.manoeuvringMovement.states.DX.yaw = 0
		this.manoeuvringMovement.states.V.u = 0
		this.manoeuvringMovement.states.V.v = 0
		this.manoeuvringMovement.states.V.yaw_dot = 0
		this.manoeuvring.states.rudderAngle = 0
		this.manoeuvring.states.n = 0
		this.ship3D.position.x = 0
		this.ship3D.position.y = 0
		this.ship3D.rotation.z = 0
	}

	calculateISO = (manoeuvring, manoeuvringMovement, angle, position, dt) => {
		manoeuvring.setSpeed(manoeuvring.states.V.u * 1.96)
		var propellerAngle = (angle * Math.PI) / 180
		var cos = Math.cos(propellerAngle)
		var sin = Math.sin(propellerAngle)

		const DIST = this.manoeuvringMovement.manoeuvring.distHel
		const MAXRPM = manoeuvringMovement.manoeuvring.maxPropRot

		var rotationStates = manoeuvring.getPropResult(MAXRPM / 60)

		var Rt = manoeuvring.getRes(manoeuvring.states.V.u)

		var forceVector = [rotationStates.Fp * cos - Rt, rotationStates.Fp * sin, rotationStates.Fp * sin * DIST]
		manoeuvringMovement.setMatrixes(forceVector, position.yaw)
		manoeuvringMovement.getDisplacements(dt)

		var x = position.x + manoeuvringMovement.states.DX.x
		var y = position.y + manoeuvringMovement.states.DX.y
		var yaw = position.yaw + manoeuvringMovement.states.DX.yaw

		return { x: x, y: y, yaw: yaw }
	}

	startAnimationLoop = () => {
		if (this.ocean.name) {
			this.ocean.water.material.uniforms.time.value += 1 / 60
		}

		if (!this.recorder) {
			// make this inside the Vessel.js
			this.manoeuvring.setSpeed(this.manoeuvring.states.V.u * 1.96)
			var propellerAngle = (this.manoeuvring.states.rudderAngle * Math.PI) / 180
			var cos = Math.cos(propellerAngle)
			var sin = Math.sin(propellerAngle)

			var rotationStates = this.manoeuvring.getPropResult(this.manoeuvring.states.n)

			var Rt = this.manoeuvring.getRes(this.manoeuvring.states.V.u)

			const DIST = this.manoeuvringMovement.manoeuvring.distHel

			var forceVector = [rotationStates.Fp * cos - Rt, rotationStates.Fp * sin, rotationStates.Fp * sin * DIST]

			this.manoeuvringMovement.dt = this.clock.getElapsedTime() - this.time
			const dt = this.manoeuvringMovement.dt

			this.manoeuvringMovement.setMatrixes(forceVector, this.ship3D.rotation.z)
			this.manoeuvringMovement.getDisplacements(dt)

			this.ship3D.position.x += this.manoeuvringMovement.states.DX.x
			this.ship3D.position.y += this.manoeuvringMovement.states.DX.y
			this.ship3D.rotation.z = -this.manoeuvringMovement.states.yaw

			this.thrirdPersonCamera.Update(dt)
			this.time = this.clock.getElapsedTime()
		} else {
			// console.log(this.clock.getElapsedTime() - this.time)
			let i = Math.floor((this.clock.getElapsedTime() - this.time) * 100)

			if (i > this.isoArray.length - 1) {
				i = 0
				this.time = this.clock.getElapsedTime()
			}
			this.ship3D.position.x = this.isoArray[i].x
			this.ship3D.position.y = this.isoArray[i].y
			this.ship3D.rotation.z = this.isoArray[i].yaw
		}

		this.renderer.render(this.scene, this.camera)
		this.requestID = window.requestAnimationFrame(this.startAnimationLoop)
	}

	onDocumentKeyDown = event => {
		var keyCode = event.which
		var n = this.manoeuvringMovement.states.n
		const DT = this.manoeuvringMovement.dt
		const MAN = this.manoeuvringMovement.manoeuvring
		const F = MAN.maxPropRot / 60
		const T = MAN.maxTorque
		const L = this.manoeuvringMovement.states.load
		const LT = Math.abs(n * T)

		switch (keyCode) {
			case 87:
				if (n <= F) {
					if (L > 1 || LT < L) {
						break
					}

					this.manoeuvringMovement.states.n += MAN.helRate * DT
					// rotationText.innerText = (60 * this.manoeuvringMovement.states.n).toFixed(0)
				}

				break
			case 83:
				if (n >= -F) {
					if (L > 1 || LT < L) {
						break
					}

					this.manoeuvringMovement.states.n -= MAN.helRate * DT
				}

				break
			case 65:
				this.manoeuvringMovement.states.rudderAngle -= MAN.rudderRate * DT
				break
			case 68:
				this.manoeuvringMovement.states.rudderAngle += MAN.rudderRate * DT
				break
			default:
				break
		}
	}

	getShipState = () => {
		const manoeuvringMovement = this.manoeuvringMovement
		return Boolean(manoeuvringMovement) ? this.manoeuvringMovement.states : undefined
	}

	setShipPosition = (x, y, z) => {
		this.ship3D.position.x = x
		this.ship3D.position.y = y
		this.ship3D.rotation.z = z
	}

	usePropSpec = (propeller, name) => {
		var propellers = {}
		propellers[name.substring(0, name.length - 5)] = propeller

		const WAVE = new Vessel.WaveCreator()

		this.hullRes = new Vessel.HullResistance(this.ship, this.shipState, propeller, WAVE)
		this.hullRes.writeOutput()

		for (var propProp in propellers) {
			var wagProp = propellers[propProp]
			this.propellerInteraction = new Vessel.PropellerInteraction(this.ship, this.shipState, wagProp)
			this.propellerInteraction.writeOutput()
		}

		// -------------------------- //
		// This is for the checkpoint //
		// -------------------------- //
		// const BOUNDS = [
		// 	[-500.0, -500.0],
		// 	[500.0, 500.0]
		// ]
		// const RADIUS = 5
		// // const RADIUS = ship.structure.hull.attributes.BOA
		// const DIVISIONS = [200, 200]
		// grid = new SpatialHashGrid(BOUNDS, DIVISIONS)

		// var keyResults = []
		// keyResults.push({ position: { x: 50, y: 0.0 }, radius: RADIUS, name: "A" })
		// keyResults.push({ position: { x: 0, y: 186.52 }, radius: RADIUS, name: "B" })
		// keyResults.push({ position: { x: 0, y: -200 }, radius: RADIUS, name: "C" })
		// keyResults.push({ position: { x: 400, y: 400 }, radius: RADIUS, name: "D" })

		// var checkPoint = []

		// for (let i = 0; i < keyResults.length; i++) {
		// 	const POS = keyResults[i].position
		// 	const R = keyResults[i].radius
		// 	const N = keyResults[i].name

		// 	checkPoint.push(new CheckPoint("Test", POS, R))
		// 	const client = grid.NewClient(POS, { w: R, h: R }, N)

		// 	zUpCont.add(checkPoint[i].mesh)
		// 	zUpCont.add(checkPoint[i].light)
		// }

		// ------------------------- //
		// Insert Line Chart outside //
		// ------------------------- //

		// var labelObj1 = {
		// 	xkey: "x",
		// 	xlabel: "Position X (m)",
		// 	ykey: "y",
		// 	ylabel: "Position Y (m)"
		// }
		// lineChart = new PositionGraph(
		// 	"lineChart1",
		// 	keyResults.map(e => e.position),
		// 	labelObj1,
		// 	"lineChart-positon"
		// )

		// var labelObj2 = {
		// 	xkey: "x",
		// 	xlabel: "Rotation (%)",
		// 	ykey: "y",
		// 	ylabel: "MCR (%)"
		// }
		// lineChart2 = new ConsGraph(
		// 	"lineChart2",
		// 	keyResults.map(e => e.position),
		// 	labelObj2,
		// 	"lineChart-eff"
		// )
		// lineChart2.drawLineGeneric(0, 0, manoeuvringMovement.states.propeller)
	}

	usePowSpec = (powerPlant, name) => {
		var powerPlants = {}
		powerPlants[name.substring(0, name.length - 5)] = powerPlant

		for (var powProp in powerPlants) {
			var plant = powerPlants[powProp]
			this.fuelCons = new Vessel.FuelConsumption(this.ship, this.shipState, plant)
			this.fuelCons.writeOutput()
		}
	}

	render() {
		return (
			<Page title="Three-js" className="" wide={this.props.wide}>
				<div ref={ref => (this.mount = ref)}>
					{this.state.recorder ? "" : <Pannel get={this.getShipState} />}
					<GuiManeuvering taticalDiameter={this.state.taticalDiameter} advance={this.state.advance} setRecorderView={this.setRecorderView} self={this} />
					{/* <ProgressBar now={this.state.i / this.state.maxLen} /> */}
				</div>
				<LifeCycleBar />
			</Page>
		)
	}
}

export default ThreeSimulation
