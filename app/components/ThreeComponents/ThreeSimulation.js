import React, { useEffect, useState, Component } from "react"
import * as THREE from "three"
import Page from "../Page"
import LifeCycleBar from "../LifeCycleBar"
import { useParams } from "react-router-dom"
import Axios from "axios"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Skybox } from "../../vessel/libs/skybox_from_examples_r118"
import { Ocean } from "../../vessel/libs/Configurable_ocean2"
import { Vessel } from "../../vessel/build/vessel"
import { Ship3D } from "../../vessel/build/Ship3D"
import { ThirdPersonCamera } from "../../vessel/examples/3D_engine/ThirdPersonCamera"

import ShipObject from "../../snippets/ShipObject"
import { renderRayCaster } from "../../vessel/snippets/renderRayCaster"
import { ManoeuvringMovement } from "../../vessel/snippets/ManoeuvringMovement"

import GunnerusTeste from "../../vessel/specs/Gunnerus.json"
import AnalysisChart from "../ChartComponents/AnalysisChart"
import Pannel from "../GuideComponents/Pannel"
// const Pannel = React.lazy(() => import("../GuideComponents/Pannel"))
import GUI from "../GUI"

class ThreeSimulation extends Component {
	constructor(props) {
		super(props)

		console.log("Constructor")
	}

	componentDidMount() {
		// Globals

		//  Later pass the ship object to the switch function
		// The view size may be changed late, this will be passed inside SceneSetup
		var version = new ShipObject(this.props.user)
		this.viewInitialPoint = 1.5 * version.shipObj.designState.calculationParameters["LWL_design"]
		this.setShipDataTemporary(this, version.shipObj)
		// debugger

		this.sceneSetup()

		this.addScenario()

		window.addEventListener("resize", this.handleWindowResize)

		this.clock = new THREE.Clock()
		this.time = this.clock.getElapsedTime()

		document.addEventListener("keydown", e => {
			this.onDocumentKeyDown(e)
		})

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
		// this.camera.position.set(this.viewInitialPoint, this.viewInitialPoint, this.viewInitialPoint)
		this.camera.position.set(0, 7, 40)

		// this.controls = new OrbitControls(this.camera, this.mount)
		// this.controls.maxDistance = 200

		this.renderer = new THREE.WebGLRenderer({ antialias: true })
		this.renderer.setSize(width, height)
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
					newShip: version,
					ship: new Vessel.Ship(version)
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
		// shipGLTF.rotation.y = - Math.PI / 2;

		this.thrirdPersonCamera = new ThirdPersonCamera({
			camera: this.camera,
			object: this.ship3D
		})

		this.shipState = new Vessel.ShipState(this.ship.designState.getSpecification())

		// preload propeller specification
		// var propReq = new XMLHttpRequest();
		// propReq.open( "GET", "specs/propeller_specifications/rolls_royce_500_azipod.json", true );
		// propReq.addEventListener( "load", function ( event ) {

		// 	var response = event.target.response;
		// 	var propeller = JSON.parse( response );
		// 	usePropSpec( propeller, "rolls_royce_500_azipod.json" );
		// 	// usePropSpec( propeller, "wag_4b_0.55a_1.2p.json" );

		// } );
		// propReq.send( null );

		var propeller = {
			noProps: 2,
			noBlades: 4,
			D: 1.9,
			P: 1.2,
			AeAo: 0.55,
			beta1: 0.57,
			beta2: 0.44,
			gamma1: 0.105,
			gamma2: 0.077,
			maxRot: 239
		}
		this.usePropSpec(propeller, "rolls_royce_500_azipod.json")

		// document.addEventListener("keydown", onDocumentKeyDown, false)
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

	startAnimationLoop = () => {
		if (this.ocean.name) {
			this.ocean.water.material.uniforms.time.value += 1 / 60
		}

		// make this inside the Vessel.js
		this.manoeuvring.setSpeed(this.manoeuvringMovement.mvr.V.u * 1.96)
		var propellerAngle = (this.manoeuvringMovement.mvr.rudderAngle * Math.PI) / 180
		var cos = Math.cos(propellerAngle)
		var sin = Math.sin(propellerAngle)

		var rotationStates = this.manoeuvring.getPropResult(this.manoeuvringMovement.mvr.n)

		var Rt = this.manoeuvring.getRes(this.manoeuvringMovement.mvr.V.u)

		var forceVector = [rotationStates.Fp * cos - Rt, rotationStates.Fp * sin, rotationStates.Fp * sin * 40]

		var dt = this.clock.getElapsedTime() - this.time

		this.manoeuvringMovement.setMatrixes(forceVector, this.ship3D.rotation.z)
		this.manoeuvringMovement.getDisplacements(dt)

		this.ship3D.position.x += this.manoeuvringMovement.mvr.DX.x
		this.ship3D.position.y += this.manoeuvringMovement.mvr.DX.y
		this.ship3D.rotation.z = -this.manoeuvringMovement.mvr.yaw

		// console.log(`Position: x = ${this.ship3D.position.x}; y = ${this.ship3D.position.y};  y = ${this.ship3D.rotation.y}`)
		// console.log(forceVector)

		this.thrirdPersonCamera.Update(dt)

		this.time = this.clock.getElapsedTime()

		this.renderer.render(this.scene, this.camera)
		this.requestID = window.requestAnimationFrame(this.startAnimationLoop)
	}

	// debugger
	onDocumentKeyDown = event => {
		var keyCode = event.which
		var n = this.manoeuvringMovement.mvr.n
		// console.log(this.manoeuvringMovement.mvr)

		switch (keyCode) {
			case 87:
				if (n <= 4) {
					this.manoeuvringMovement.mvr.n += 0.1
					// rotationText.innerText = (60 * this.manoeuvringMovement.mvr.n).toFixed(0)
				}
				break
			case 83:
				if (n >= -4) {
					this.manoeuvringMovement.mvr.n -= 0.1
					// rotationText.innerText = (60 * this.manoeuvringMovement.mvr.n).toFixed(0)
				}
				break
			case 65:
				this.manoeuvringMovement.mvr.rudderAngle -= 0.5
				// angleText.innerText = this.manoeuvringMovement.mvr.rudderAngle.toFixed(1)
				break
			case 68:
				this.manoeuvringMovement.mvr.rudderAngle += 0.5
				// angleText.innerText = this.manoeuvringMovement.mvr.rudderAngle.toFixed(1)
				break
			default:
				break
		}
	}

	getShipState = () => {
		const manoeuvringMovement = this.manoeuvringMovement
		return Boolean(manoeuvringMovement) ? this.manoeuvringMovement.mvr : undefined
	}

	usePropSpec = (propeller, name) => {
		var propellers = {}
		propellers[name.substring(0, name.length - 5)] = propeller

		const WAVE = new Vessel.WaveCreator()

		var hullRes = new Vessel.HullResistance(this.ship, this.shipState, propeller, WAVE)
		hullRes.writeOutput()

		for (var propProp in propellers) {
			var wagProp = propellers[propProp]
			this.propellerInteraction = new Vessel.PropellerInteraction(this.ship, this.shipState, wagProp)
			this.propellerInteraction.writeOutput()
		}

		this.manoeuvring = new Vessel.Manoeuvring(this.ship, this.shipState, hullRes, this.propellerInteraction)

		const N = [
			[0, 0, 0],
			[0, 5.5e4, 6.4e4],
			[0, 6.4e4, 1.2e7]
		]

		this.manoeuvringMovement = new ManoeuvringMovement(this.manoeuvring, N)

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
		// lineChart2.drawLineGeneric(0, 0, manoeuvringMovement.mvr.propeller)
	}

	render() {
		function switchElement(prop, state) {
			if (Boolean(state) && Boolean(prop)) {
				var teste = prop.method
				// console.log(prop, states)

				switch (teste) {
					case "analyse":
						return <AnalysisChart state={state} />

					default:
						return null
				}
			}
			return null
		}

		return (
			<Page title="Three-js" className="" wide={this.props.wide}>
				<div ref={ref => (this.mount = ref)}>
					<Pannel set={this.getShipState} />
					{/* The GUI will be for the next version */}
					{/* <GUI /> */}
				</div>
				<LifeCycleBar />
				{switchElement(this.props.user, this.state)}
			</Page>
		)
	}
}

export default ThreeSimulation
