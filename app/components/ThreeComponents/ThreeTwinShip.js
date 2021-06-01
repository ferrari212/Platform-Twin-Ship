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
import { renderRayCaster } from "../../vessel/snippets/renderRayCaster"
import { ManoeuvringMovement } from "../../vessel/snippets/ManoeuvringMovement"

// import GunnerusTeste from "../../vessel/specs/Gunnerus.json"
import AnalysisChart from "../ChartComponents/AnalysisChart"
import Pannel from "../GuideComponents/Pannel"
import GuiTwinShip from "../GuideComponents/GuiTwinShip"

class ThreeTwinShip extends Component {
	constructor(props) {
		super(props)

		this.state = { advance: false, taticalDiameter: false }

		console.log("Constructor")
	}

	componentDidMount() {
		// Globals

		//  Later pass the ship object to the switch function
		// The view size may be changed late, this will be passed inside SceneSetup
		var version = new ShipObject(this.props.user)
		this.viewInitialPoint = 1.5 * version.shipObj.obj.designState.calculationParameters["LWL_design"]
		this.twinData = []

		this.setShipDataTemporary(this, version.shipObj)

		this.sceneSetup()

		this.addScenario()

		window.addEventListener("resize", this.handleWindowResize)

		console.log("Component did Mount!")
	}

	componentDidUpdate(prevProps, prevStates) {
		console.log("Component did Update!", prevProps, prevStates)

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

			if (!this.scene.getObjectByName("ShipTwin")) {
				this.addShip()
			}

			if (this.requestID === undefined) {
				this.clock = new THREE.Clock()
				this.time = this.clock.getElapsedTime()
				this.startAnimationLoop()
			}
		}
	}

	componentWillUnmount() {
		delete this.startAnimationLoop
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
			100000 // far plane
		)
		// set some distance from a cube that is located at z = 0
		this.camera.position.set(40, 40, 40)

		this.renderer = new THREE.WebGLRenderer({ antialias: true })
		this.renderer.setSize(width, height)

		this.mount.appendChild(this.renderer.domElement) // mount using React ref

		this.orbitControl = new OrbitControls(this.camera, this.mount)
		// this.orbitControl.target = new THREE.Vector3(40, 40, 40)

		// this.orbitControl = new THREE.OrbitControl(this.camera, this.renderer.domElement)

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
					man: version.man,
					data: version.data
				}
			})
		}
	}

	addShip = () => {
		this.twinShip = new Ship3D(this.ship, {
			stlPath: "specs/STL files/Gunnerus",
			upperColor: 0x33aa33,
			lowerColor: 0xaa3333,
			hullOpacity: 1,
			deckOpacity: 1,
			objectOpacity: 1
		})

		this.realShip = new Ship3D(this.ship, {
			stlPath: "specs/STL files/Gunnerus",
			upperColor: 0x33aa33,
			lowerColor: 0xaa3333,
			hullOpacity: 1,
			deckOpacity: 1,
			objectOpacity: 0.5
		})

		// Pass later on with the value of the title
		this.twinShip.name = "ShipTwin"
		this.twinShip.show = "on"
		this.twinShip.rotation.z = -Math.PI / 2
		this.scene.add(this.twinShip)

		this.realShip.name = "RealShip"
		this.realShip.show = "on"
		this.realShip.rotation.z = -Math.PI / 2
		this.scene.add(this.realShip)

		this.shipState = new Vessel.ShipState(this.ship.designState.getSpecification())

		this.usePropSpec(this.state.propeller, "rolls_royce_500_azipod.json")
		this.usePowSpec(this.state.powerPlant, "gunnerus_power_plant.json")

		this.manoeuvring = new Vessel.Manoeuvring(this.ship, this.shipState, this.hullRes, this.propellerInteraction, this.fuelCons, this.state.man)
		this.manoeuvringMovement = new ManoeuvringMovement(this.manoeuvring)

		this.realData = this.state.data

		this.interateLoop()

		this.setInitial()

		// Ther is no key down in digital twin ship
		// document.addEventListener("keydown", e => {
		// 	this.onDocumentKeyDown(e)
		// })
	}

	removeShip = () => {
		var deletedShip = this.scene.getObjectByName("ShipTwin")
		this.scene.remove(deletedShip)
	}

	handleWindowResize = () => {
		const width = this.mount.clientWidth
		const height = this.mount.clientHeight

		this.renderer.setSize(width, height)
		this.camera.aspect = width / height
		this.camera.updateProjectionMatrix()
	}

	interateLoop = () => {
		var t = [0]
		var tin = this.realData[0].t
		this.twinData.push({
			x: this.realData[0].x,
			y: this.realData[0].y,
			u: this.realData[0].u,
			v: this.realData[0].v,
			yaw: (this.realData[0].yaw * Math.PI) / 180 + Math.PI / 2,
			RPMO: this.realData[0].RPMO,
			Azimuth: this.realData[0].Azimuth
		})

		this.manoeuvring.states.V.u = this.realData[0].u / 1.96
		this.manoeuvring.setSpeed(this.manoeuvring.states.V.u)

		const materialRealData = new THREE.LineBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.4 })
		const materialTwinData = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 })
		var pointsRealData = []
		var pointsTwinData = []

		for (let i = 1; i < this.realData.length - 2; i++) {
			pointsRealData.push(new THREE.Vector3(-0.1 * this.realData[i].x, 0.1 * this.realData[i].y, 2))

			let input = this.realData[i]
			let position = { x: this.twinData[i - 1].x, y: this.twinData[i - 1].y, yaw: this.twinData[i - 1].yaw }
			t.push(input.t - tin)
			let dt = (this.realData[i + 1].t - input.t) * 0.001
			this.twinData.push(this.calculateEstimation(this.manoeuvring, this.manoeuvringMovement, input, position, dt))

			pointsTwinData.push(new THREE.Vector3(0.1 * this.twinData[i].x, 0.1 * this.twinData[i].y, 2))
		}

		// do {
		// 	const i = this.twinData.length - 1

		// 	pointsRealData.push(new THREE.Vector3(this.twinData[i].x, this.twinData[i].y, 2))

		// 	if (Math.cos(this.twinData[i].yaw) < 0 && !this.advance) {
		// 		this.advance = this.twinData[i].x
		// 	}

		// 	if (Math.cos(this.twinData[i].yaw / 2) < 0 && !this.taticalDiameter) {
		// 		this.taticalDiameter = this.twinData[i].y
		// 	}

		// 	const MAN = this.manoeuvringMovement.manoeuvring

		// 	if (this.manoeuvring.states.rudderAngle < 35) {
		// 		this.manoeuvring.states.rudderAngle += MAN.rudderRate * dt
		// 	}

		// 	this.twinData.push(this.calculateEstimation(this.manoeuvring, this.manoeuvringMovement, this.manoeuvring.states.rudderAngle, this.twinData[i], dt))

		// 	t = t + dt
		// } while (t < 60)

		this.setState(() => {
			return { advance: this.advance, taticalDiameter: this.taticalDiameter }
		})

		const geometryRealData = new THREE.BufferGeometry().setFromPoints(pointsRealData)
		const lineRealData = new THREE.Line(geometryRealData, materialRealData)
		lineRealData.name = "lineRealData"
		this.scene.add(lineRealData)

		const geometryTwinData = new THREE.BufferGeometry().setFromPoints(pointsTwinData)
		const lineTwinData = new THREE.Line(geometryTwinData, materialTwinData)
		lineTwinData.name = "lineTwinData"
		this.scene.add(lineTwinData)
	}

	setInitial = input => {
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
	}

	calculateEstimation = (manoeuvring, manoeuvringMovement, input, position, dt) => {
		manoeuvring.setSpeed(manoeuvring.states.V.u * 1.96)
		var propellerAngle = (input.Azimuth * Math.PI) / 180
		var cos = Math.cos(propellerAngle)
		var sin = Math.sin(propellerAngle)

		const MAXRPM = manoeuvringMovement.manoeuvring.maxPropRot

		var rotationStates = manoeuvring.getPropResult((MAXRPM * input.RPMO) / (60 * 100))

		var Rt = manoeuvring.getRes(manoeuvring.states.V.u)

		const DIST = this.manoeuvringMovement.manoeuvring.distHel

		var forceVector = [rotationStates.Fp * cos - Rt, rotationStates.Fp * sin, rotationStates.Fp * sin * DIST]
		manoeuvringMovement.setMatrixes(forceVector, position.yaw)
		manoeuvringMovement.getDisplacements(dt)

		var x = position.x + manoeuvringMovement.states.DX.x
		var y = position.y + manoeuvringMovement.states.DX.y
		var yaw = position.yaw + manoeuvringMovement.states.DX.yaw

		return { x: x, y: y, yaw: yaw, u: manoeuvringMovement.states.V.u, v: manoeuvringMovement.states.V.v, RPMO: input.RPMO, Azimuth: input.Azimuth }
	}

	startAnimationLoop = () => {
		if (this.ocean.name) {
			this.ocean.water.material.uniforms.time.value += 1 / 60
		}

		let i = Math.floor((this.clock.getElapsedTime() - this.time) * 100)

		if (i > this.twinData.length - 1) {
			i = 0
			this.time = this.clock.getElapsedTime()
		}

		this.twinShip.position.x = 0.1 * this.twinData[i].x
		this.twinShip.position.y = 0.1 * this.twinData[i].y
		this.twinShip.rotation.z = this.twinData[i].yaw
		// Math.PI / 180

		this.realShip.position.x = -0.1 * this.realData[i].x
		this.realShip.position.y = 0.1 * this.realData[i].y
		this.realShip.rotation.z = (this.realData[i].yaw * Math.PI) / 180 + Math.PI / 2

		this.renderer.render(this.scene, this.camera)
		this.requestID = window.requestAnimationFrame(this.startAnimationLoop)
	}

	getShipState = () => {
		const manoeuvringMovement = this.manoeuvringMovement
		return Boolean(manoeuvringMovement) ? this.manoeuvringMovement.states : undefined
	}

	setShipPosition = (x, y, z) => {
		this.twinShip.position.x = x
		this.twinShip.position.y = y
		this.twinShip.rotation.z = z
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
					{/* The GUITwinShip will be for the next version */}
					<GuiTwinShip />
					{/* <ProgressBar now={this.state.i / this.state.maxLen} /> */}
				</div>
				<LifeCycleBar />
			</Page>
		)
	}
}

export default ThreeTwinShip
