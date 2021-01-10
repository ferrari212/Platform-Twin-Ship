import React, { useEffect, useState, Component } from "react"
import * as THREE from "three"
import Page from "./Page"
import LifeCycleBar from "./LifeCycleBar"
import { useParams } from "react-router-dom"
import Axios from "axios"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Skybox } from "../vessel/libs/skybox_from_examples_r118"
import { Ocean } from "../vessel/libs/Configurable_ocean2"
import { Vessel } from "../vessel/build/vessel"
import { Ship3D } from "../vessel/build/Ship3D"
import { renderRayCaster } from "../vessel/snippets/renderRayCaster"

import ToolTip from "../snippets/ToolTip"
import TableInfo from "../snippets/TableInfo"

import GunnerusTeste from "../vessel/specs/Gunnerus.json"

var oSize = 512
const skybox = new Skybox(oSize)

class ThreeModelRayCaster extends Component {
	constructor(props) {
		super(props)

		// this.props = props
		// console.log(this)

		this.addScenarioStatus = this.props.addScenarioStatus || false
		this.addLifeCycle = this.props.addLifeCycle || false
		this.height = this.props.height
		this.ship = this.props.ship
		this.intersected = undefined
		this.mouse = new THREE.Vector2(0.5, 0.5)
		console.log(this.mouse)
		// this.mouse.set()s

		console.log("Constructor")
	}

	componentDidMount() {
		// Globals
		// this.ship = new Vessel.Ship(GunnerusTeste)

		this.toolTip = new ToolTip(this.mouse)

		this.getData(this)
		this.sceneSetup()

		this.mount.addEventListener("mousemove", this.onMouseMove, false)

		window.addEventListener("resize", this.handleWindowResize)

		console.log("Component did Mount!")
	}

	componentDidUpdate(prevProps, prevStates) {
		console.log("Component did Update!", prevProps, prevStates)

		// Make the if else of the posting or notF
		if (prevProps.ship !== this.props.ship) {
			this.removeShip()
			this.setState({ newShip: JSON.parse(this.props.ship) })
		} else {
			this.ship = new Vessel.Ship(this.state.newShip)
			if (this.addScenarioStatus) this.addScenario()
			this.addShip()
			this.tableInfo = new TableInfo(this.ship3D, "tableinfo")
			this.startAnimationLoop()
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

	getData = context => {
		const ourRequest = Axios.CancelToken.source()

		async function fetchPosts(component) {
			try {
				const response = await Axios.get(`/profile/${component.props.user.username}/posts`, { cancelToken: ourRequest.token })
				var index = component.props.user.shipId
				console.log(component.props.user)
				await component.setState({ newShip: JSON.parse(response.data[index].ship) })
			} catch (e) {
				if (component.props.user === undefined && component.ship) {
					await component.setState({ newShip: JSON.parse(component.ship) })
				} else {
					console.log("There was a problem.", e)
				}
			}
		}

		fetchPosts(context)
	}

	addShip = () => {
		this.ship3D = new Ship3D(this.ship, {
			// stlPath: "specs/STL files",
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

		if (this.addScenario) {
			this.scene.background = new THREE.Color(0xa9cce3)
			const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
			const mainLight = new THREE.DirectionalLight(0xffffff, 1)
			mainLight.position.set(1, 1, 1)
			this.scene.add(ambientLight, mainLight)

			this.scene.rotation.x = -Math.PI / 2
			this.addScenario = false
		}
	}

	removeShip = () => {
		// const INDEX = this.scene.children.findIndex(element => element.name === "Ship3D")
		var deletedShip = this.scene.getObjectByName("Ship3D")
		// console.log(deletedShip)
		this.scene.remove(deletedShip)
	}

	startAnimationLoop = () => {
		if (this.addScenarioStatus) {
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

	handleWindowResize = () => {
		const width = this.mount.clientWidth
		const height = this.mount.clientHeight

		this.renderer.setSize(width, height)
		this.camera.aspect = width / height
		this.camera.updateProjectionMatrix()
	}

	render() {
		return (
			<Page title="Three-js" className="" wide={this.props.wide}>
				<div ref={ref => (this.mount = ref)}>
					<p id="tooltip" />
				</div>
				<div id="tableinfo"></div>
				{this.addLifeCycle ? <LifeCycleBar /> : ""}
			</Page>
		)
	}
}

export default ThreeModelRayCaster
