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
import { renderRayCaster } from "../../vessel/snippets/renderRayCaster"

import ShipObject from "../../snippets/ShipObject"

import GunnerusTeste from "../../vessel/specs/Gunnerus.json"
import AnalysisChart from "../ChartComponents/AnalysisChart"
import GUI from "../GUI"

var oSize = 512
const skybox = new Skybox(oSize)

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

			if (!this.scene.getObjectByName("Ship3D")) this.addShip()

			if (this.requestID === undefined) this.startAnimationLoop()
		}
	}

	componentWillUnmount() {
		delete this.startAnimationLoop
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
		this.camera.position.set(this.viewInitialPoint, this.viewInitialPoint, this.viewInitialPoint)

		this.controls = new OrbitControls(this.camera, this.mount)
		this.controls.maxDistance = 200
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
		sun.position.set(-512, -246, 128)
		this.scene.add(ambientLight, sun)

		this.useZUp()

		const skybox = new Skybox()
		skybox.name = "Skybox"
		this.scene.add(skybox)

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
		this.scene.add(this.ship3D)
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

		this.renderer.render(this.scene, this.camera)
		this.requestID = window.requestAnimationFrame(this.startAnimationLoop)
	}

	render() {
		function switchElement(prop, state) {
			if (Boolean(state) && Boolean(prop)) {
				var teste = prop.method
				console.log(prop, state)

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
				<div ref={ref => (this.mount = ref)}></div>
				{/* <h1>YOU ARE IN A SIMULATION EXAMPLE</h1> */}
				<LifeCycleBar />
				{switchElement(this.props.user, this.state)}
			</Page>
		)
	}
}

export default ThreeSimulation
