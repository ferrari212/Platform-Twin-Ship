import React, { useEffect, useState, Component } from "react"
import * as THREE from "three"
import Page from "../Page"
import LifeCycleBar from "../LifeCycleBar"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Skybox } from "../../vessel/libs/skybox_from_examples_r118"
import { Ocean } from "../../vessel/libs/Configurable_ocean2"
import { Vessel } from "../../vessel/build/vessel"
import { renderRayCaster } from "../../vessel/snippets/renderRayCaster"

import ToolTip from "../../snippets/ToolTip"
import ShipObject from "../../snippets/ShipObject"

// import GunnerusTeste from "../../vessel/specs/Gunnerus.json"
import GunnerusTeste from "../../vessel/specs/Gunnerus.gltf"
import AnalysisChart from "../ChartComponents/AnalysisChart"
import GUI from "../GUI"
import Tree from "../Tree"

var oSize = 512
const skybox = new Skybox(oSize)

class ThreeModelRayCaster extends Component {
	constructor(props) {
		super(props)

		this.addScenarioStatus = true
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
		this.height = this.mount.clientHeight
		this.top = this.mount.offsetTop

		// Add ShipObject class here -> Later pass it to the switch
		var Id = this.props.user.shipId
		var version = this.props.user.versions[Id].ship
		this.setShipDataTemporary(this, version)

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
			if (!this.scene.getObjectByName("ModelGLTF")) this.addShip()
			// if (this.requestID === undefined) this.startAnimationLoop()
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
		var loaderGLTF = new GLTFLoader()

		// Temporarilly the GLB is in the folder
		// the code bellow allows the user to
		// access the git hub url.
		// var url = this.state.GLTFPath;
		var url = GunnerusTeste
		var fadeTarget = document.getElementById("loader-wrapper")
		var textTarget = fadeTarget.getElementsByClassName("loader-wrap-text")[0]

		loaderGLTF.load(
			url,
			gltf => {
				this.shipGLTF = gltf.scene
				this.shipGLTF.rotation.x = Math.PI / 2
				this.shipGLTF.rotation.y = -Math.PI / 2
				this.shipGLTF.position.x = -0.5
				this.shipGLTF.name = "ModelGLTF"
				this.shipGLTF.visible = true

				if (this.shipGLTF.material) {
					this.shipGLTF.material.side = THREE.DoubleSide
				}

				this.scene.add(this.shipGLTF)

				this.startAnimationLoop()

				var fadeEffect = setInterval(function () {
					if (!fadeTarget.style.opacity) {
						fadeTarget.style.opacity = 1
					}
					if (fadeTarget.style.opacity > 0) {
						fadeTarget.style.opacity -= 0.05
					} else {
						clearInterval(fadeEffect)
						fadeTarget.remove()
					}
				}, 50)
			},
			xhr => {
				var percentage = "Loading: " + ((xhr.loaded / xhr.total) * 100).toFixed(1) + "%"
				textTarget.innerHTML = percentage
			},
			error => {
				console.error(error)
			}
		)

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
		var deletedShipGLTF = this.scene.getObjectByName("ModelGLTF")
		this.scene.remove(deletedShipGLTF)
	}

	// Update current state with changes from controls
	showGLTF = status => {
		try {
			var modelGLTF = this.scene.getObjectByName("ModelGLTF")

			modelGLTF.visible = status

			// The ray caster is not working properly when
			// it get multiple objects. @ferrari212
			if (status) {
				modelGLTF.layers.enableAll()
			} else {
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

		return (
			<Page title="Three-js" className="" wide={this.props.wide}>
				<div ref={ref => (this.mount = ref)}>
					<p id="tooltip" />
				</div>
				<LifeCycleBar />

				<div id="loader-wrapper" style={{ top: this.top, height: this.height, fontStyle: "italic" }}>
					<div>
						<h1 className="loader-wrapper-content">
							<div className="loader-wrap-text">Loading </div>
							<div className="dots-loading">
								<div></div>
							</div>
						</h1>
					</div>
				</div>
				<Tree />
				{switchElement(this.props.user, this.state)}
			</Page>
		)
	}
}

export default ThreeModelRayCaster
