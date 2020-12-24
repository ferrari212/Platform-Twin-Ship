import React, { useEffect, useState, Component } from "react"
import * as THREE from "three"
import Page from "./Page"
import { useParams } from "react-router-dom"
import Axios from "axios"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Skybox } from "../vessel/libs/skybox_from_examples_r118"
import { Ocean } from "../vessel/libs/Configurable_ocean2"
import { Vessel } from "../vessel/build/vessel"
import { Ship3D } from "../vessel/build/Ship3D"

import GunnerusTeste from "../vessel/specs/Gunnerus.json"

var oSize = 512
const skybox = new Skybox(oSize)

class ThreeModel extends Component {
	constructor(props) {
		super(props)

		// this.props = props
		console.log(this)

		this.addScenario = this.props.addScenario

		console.log("Constructor")
	}

	componentDidMount() {
		// Globals
		this.oSize = 2048
		this.ship = new Vessel.Ship(GunnerusTeste)
		// console.log(GunnerusTeste)

		const ourRequest = Axios.CancelToken.source()

		async function fetchPosts(componet) {
			try {
				const response = await Axios.get(`/profile/${componet.props.user.username}/posts`, { cancelToken: ourRequest.token })
				console.log(response.data[0])
				await componet.setState({ newShip: JSON.parse(response.data[0].ship) })
			} catch (e) {
				console.log("There was a problem.", e)
			}
		}
		fetchPosts(this)

		this.sceneSetup()
		// this.addScenario()
		this.startAnimationLoop()

		window.addEventListener("resize", this.handleWindowResize)

		console.log("Component did Mount!")
	}

	componentDidUpdate(prevProps, prevStates) {
		console.log("Component did Update!", prevProps, prevStates)
		console.log(this.state)
		console.log(this.state.newShip)
		// this.ship = new Vessel.Ship(this.state.newShip)
		// this.addScenario()
		this.addShip()
	}

	sceneSetup = () => {
		// get container dimensions and use them for scene sizing
		const width = document.body.clientWidth
		// Modify the inner Height
		const height = window.innerHeight - 151

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

		const skybox = new Skybox(this.oSize)
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
	}

	addShip = () => {
		this.scene.background = new THREE.Color(0xa9cce3)
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
		const mainLight = new THREE.DirectionalLight(0xffffff, 1)
		mainLight.position.set(1, 1, 1)
		this.scene.add(ambientLight, mainLight)

		this.ship3D = new Ship3D(this.ship, {
			// stlPath: "specs/STL files",
			stlPath: "specs/STL files/Gunnerus",
			upperColor: 0x33aa33,
			lowerColor: 0xaa3333,
			hullOpacity: 1,
			deckOpacity: 1,
			objectOpacity: 1
		})

		this.ship3D.name = "Ship3D"
		this.ship3D.show = "on"

		this.scene.add(this.ship3D)

		this.scene.rotation.x = -Math.PI / 2
	}

	startAnimationLoop = () => {
		// this.ocean.water.material.uniforms.time.value += 1 / 60

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
			<Page title="Three-js" className="">
				<div ref={ref => (this.mount = ref)} />
				<h1>Hello, {this.props.test}</h1>
			</Page>
		)
	}
}

export default ThreeModel
