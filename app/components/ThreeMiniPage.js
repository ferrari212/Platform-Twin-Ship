import React, { useEffect, useState, Component } from "react"
import * as THREE from "three"
import Page from "./Page"
import Axios from "axios"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Skybox } from "../vessel/libs/skybox_from_examples_r118"
import { Ocean } from "../vessel/libs/Configurable_ocean2"
import { Vessel } from "../vessel/build/vessel"
import { Ship3D } from "../vessel/build/Ship3D"

import GunnerusTeste from "../vessel/specs/Gunnerus.json"

var oSize = 512
const skybox = new Skybox(oSize)

class ThreeMiniPage extends Component {
	constructor(props) {
		super(props)

		this.addScenarioStatus = this.props.addScenarioStatus || false
		this.addLifeCycle = this.props.addLifeCycle || false
		this.height = this.props.height
		this.ship = this.props.ship

		console.log("Constructor")
	}

	componentDidMount() {
		// Globals
		this.getData(this)
		this.sceneSetup()

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
		console.log(this.ocean)
		this.scene.add(this.ocean)
		this.scene.rotation.x = -Math.PI / 2
	}

	getData = context => {
		const ourRequest = Axios.CancelToken.source()

		async function fetchPosts(component) {
			try {
				await component.setState({ newShip: JSON.parse(component.ship) })
			} catch (e) {
				console.log("There was a problem.", e)
			}
		}

		fetchPosts(context)
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
		console.log(deletedShip)
		this.scene.remove(deletedShip)
	}

	startAnimationLoop = () => {
		if (this.addScenarioStatus) {
			this.ocean.water.material.uniforms.time.value += 1 / 60
		}

		this.renderer.render(this.scene, this.camera)
		this.requestID = window.requestAnimationFrame(this.startAnimationLoop)
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
				<div ref={ref => (this.mount = ref)} />
			</Page>
		)
	}
}

export default ThreeMiniPage
