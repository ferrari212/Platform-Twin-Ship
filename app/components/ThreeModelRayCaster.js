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

import GunnerusTeste from "../vessel/specs/Gunnerus.json"

var oSize = 512
const skybox = new Skybox(oSize)

class ThreeModelRayCaster extends Component {
	constructor(props) {
		super(props)

		// this.props = props
		console.log(this)

		this.addScenarioStatus = this.props.addScenarioStatus || false
		this.addLifeCycle = this.props.addLifeCycle || false
		this.height = this.props.height
		this.ship = this.props.ship
		this.intersected = undefined
		this.mouse = new THREE.Vector2()

		console.log("Constructor")
	}

	componentDidMount() {
		// Globals
		// this.ship = new Vessel.Ship(GunnerusTeste)

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

	onMouseMove = event => {
		// calculate mouse position in normalized device coordinates
		// (-1 to +1) for both components
		// debugger
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

				await component.setState({ newShip: JSON.parse(response.data[0].ship) })
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
		console.log(deletedShip)
		this.scene.remove(deletedShip)
	}

	startAnimationLoop = () => {
		if (this.addScenarioStatus) {
			this.ocean.water.material.uniforms.time.value += 1 / 60
		}

		this.renderer.render(this.scene, this.camera)
		this.requestID = window.requestAnimationFrame(this.startAnimationLoop)

		// Apply the function RayCaster
		// IMPORTANT: I am using this.scene but the right one would be zUpCount
		this.intersected = renderRayCaster(this.mouse, this.camera, this.scene, this.intersected)

		// Apply the click information function
		if (this.intersected.name === undefined) {
			document.body.style.cursor = "default"
			// document.getElementById("SimulationWindow").onclick = false
		} else {
			// clickedInformation(ship3D, tooltipElement, intersected)
		}

		this.toolTip(this.intersected)
	}

	handleWindowResize = () => {
		const width = this.mount.clientWidth
		const height = this.mount.clientHeight

		this.renderer.setSize(width, height)
		this.camera.aspect = width / height
		this.camera.updateProjectionMatrix()
	}

	// ToolTip function shows the object name when mouse is on @ferrari212
	toolTip = intersected => {
		// console.log(intersected)
		// var textnode = document.createTextNode("Water") // Create a text node
		// this.mount.appendChild(textnode)

		// console.log(this.mount)
		// if (intersected.status) {
		// 	// Inserting tooltip
		// 	tooltip.style.visibility = "visible"
		// 	tooltip.style.left = mouse.clientX + 20
		// 	tooltip.style.top = mouse.clientY + 10
		// 	tooltip.textContent = intersected.name
		// 	zUpCont.remove(zUpCont.getObjectByName(intersected.name))
		// } else {
		// 	// Taking off tool tip
		// 	tooltip.style.visibility = "hidden"
		// }
		var element = document.getElementById("tooltip")

		console.log(element.style.visibility)

		if (intersected) {
			if (intersected.status) {
				// return <p>{intersected.name}</p>
				// var element = document.createElement("p")
				// var textnode = document.createTextNode(intersected.name) // Create a text node
				// this.mount.appendChild(textnode)
				element.style.setProperty("visibility", "visible")
				element.innerText = intersected.name
				element.style.left = `${this.mouse.clientX + 10}px`
				element.style.top = `${this.mouse.clientY + 10}px`
				// element.style.top = this.mouse.clientY + 10
			} else {
				console.log("Teste")
				element.style.setProperty("visibility", "hidden")
			}
		}
	}

	render() {
		return (
			<Page title="Three-js" className="" wide={this.props.wide}>
				<div ref={ref => (this.mount = ref)}>
					<p id="tooltip" />
				</div>
				<table id="free-table" class="table table-dark ">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">First</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">1</th>
							<td>Mark</td>
						</tr>
					</tbody>
				</table>
				{/* <h1>Hello, {this.props.test}</h1> */}
				{this.addLifeCycle ? <LifeCycleBar /> : ""}
			</Page>
		)
	}
}

export default ThreeModelRayCaster