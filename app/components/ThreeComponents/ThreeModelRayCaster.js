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

import ToolTip from "../../snippets/ToolTip"
import TableInfo from "../../snippets/TableInfo"

import GunnerusTeste from "../../vessel/specs/Gunnerus.json"
import AnalysisChart from "../ChartComponents/AnalysisChart"
import GUI from "../GUI"

var oSize = 512
const skybox = new Skybox(oSize)

class ThreeModelRayCaster extends Component {
	constructor(props) {
		super(props)

		this.addScenarioStatus = true
		this.height = this.props.height
		this.intersected = undefined
		this.mouse = new THREE.Vector2(0.5, 0.5)

		console.log("Constructor")
	}

	componentDidMount() {
		// Globals
		this.toolTip = new ToolTip(this.mouse)

		this.sceneSetup()

		this.addScenario()

		this.mount.addEventListener("mousemove", this.onMouseMove, false)

		var Id = this.props.user.shipId
		var version = this.props.user.versions[Id].ship
		this.setShipDataTemporary(this, version)

		window.addEventListener("resize", this.handleWindowResize)

		console.log("Component did Mount!")
	}

	componentDidUpdate(prevProps, prevStates) {
		console.log("Component did Update!", prevProps, prevStates)

		var prevIndex = prevProps.user.shipId
		var prevVersion = prevProps.user.versions[prevIndex].ship
		var newIndex = this.props.user.shipId
		var newVersion = this.props.user.versions[newIndex].ship

		if (prevVersion !== newVersion) {
			this.removeShip()

			this.setShipDataTemporary(this, newVersion)
		} else {
			this.ship = new Vessel.Ship(this.state.newShip)

			if (!this.scene.getObjectByName("Ship3D")) this.addShip()

			this.tableInfo = new TableInfo(this.ship3D, "tableinfo")

			if (this.requestID === undefined) this.startAnimationLoop()
		}
	}

	sceneSetup = () => {
		// get container dimensions and use them for scene sizing
		const width = this.mount.offsetWidth

		// Modify the inner Height
		const height = this.props.height || window.innerHeight - 151

		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(
			75, // fov = field of view
			width / height, // aspect ratio
			0.01, // near plane
			2000 // far plane
		)

		// set some distance from a cube that is located at z = 0
		this.camera.position.set(oSize * 0.03, oSize * 0.03, oSize * 0.03)

		this.controls = new OrbitControls(this.camera, this.mount)
		this.controls.maxDistance = 200
		this.renderer = new THREE.WebGLRenderer()
		this.renderer.setSize(width, height)
		this.mount.appendChild(this.renderer.domElement) // mount using React ref

		this.useZUp = () => {
			const zUpCont = new THREE.Group()
			this.scene.add(zUpCont)
		}
	}

	addScenario = () => {
		const sun = new THREE.DirectionalLight(0xffffff, 2)
		sun.position.set(-512, -246, 128)
		this.scene.add(sun)

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

	onMouseMove = event => {
		// calculate mouse position in normalized device coordinates
		// (-1 to +1) for both components
		this.mouse.clientX = event.clientX
		this.mouse.clientY = event.clientY

		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
		this.mouse.y = -((event.clientY - 48) / this.mount.clientHeight) * 2 + 1
	}

	setShipDataTemporary = (context, version) => {
		if (version.length !== 0) {
			this.setState(() => {
				var newShip = JSON.parse(version)
				var GLTFPath = newShip.attributes.GLTFUrl
				return {
					newShip: newShip,
					ship: new Vessel.Ship(newShip),
					GLTFPath: GLTFPath
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

		var loaderGLTF = new GLTFLoader()

		if (this.state.GLTFPath) {
			loaderGLTF.load(this.state.GLTFPath, gltf => {
				var shipGLTF = gltf.scene
				shipGLTF.rotation.x = Math.PI / 2
				shipGLTF.rotation.y = -Math.PI / 2
				shipGLTF.position.x = -0.5
				shipGLTF.name = "ModelGLTF"
				shipGLTF.visible = false

				if (shipGLTF.material) {
					shipGLTF.material.side = THREE.DoubleSide
				}

				this.scene.add(shipGLTF)
			})
		}

		if (this.addScenarioStatus) {
			const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
			const mainLight = new THREE.DirectionalLight(0xffffff, 1)
			mainLight.position.set(1, 1, 1)
			this.scene.add(ambientLight, mainLight)

			this.scene.rotation.x = -Math.PI / 2
			this.addScenarioStatus = false
		}
	}

	removeShip = () => {
		var deletedShip = this.scene.getObjectByName("Ship3D")
		var deletedShipGLTF = this.scene.getObjectByName("ModelGLTF")
		this.scene.remove(deletedShip)
		this.scene.remove(deletedShipGLTF)
	}

	// Update current state with changes from controls
	showGLTF = status => {
		try {
			var ship3D = this.scene.getObjectByName("Ship3D")
			var modelGLTF = this.scene.getObjectByName("ModelGLTF")

			ship3D.visible = !status
			modelGLTF.visible = status

			// The ray caster is not working properly when
			// it get multiple objects. @ferrari212
			if (status) {
				modelGLTF.layers.enableAll()
				ship3D.layers.disableAll()
			} else {
				ship3D.layers.enableAll()
				modelGLTF.layers.disableAll()
			}
		} catch (error) {
			console.warn("Model is still being loaded, wait for using the check box")
		}
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

		// Apply the function RayCaster
		this.intersected = renderRayCaster(this.mouse, this.camera, this.scene, this.intersected)

		// Apply the click information function
		if (this.intersected.name !== undefined) {
			this.tableInfo.upDate(this.intersected)
		} else {
			this.tableInfo.tooltipElement.style.visibility = "hidden"
		}

		this.toolTip.upDate(this.intersected)
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

		function showGLTF(self, state) {
			if (Boolean(state)) {
				var GLTFPath = state.GLTFPath

				if (Boolean(GLTFPath)) return <GUI showGLTF={self.showGLTF} />

				return null
			}
			return null
		}

		return (
			<Page title="Three-js" className="" wide={this.props.wide}>
				<div ref={ref => (this.mount = ref)}>
					<p id="tooltip" />
					<div id="tableinfo"></div>
				</div>
				{showGLTF(this, this.state)}
				<LifeCycleBar />
				{switchElement(this.props.user, this.state)}
			</Page>
		)
	}
}

export default ThreeModelRayCaster
