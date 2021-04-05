import React, { useEffect, useState, Component } from "react"
import * as THREE from "three"
import Page from "../Page"
import LifeCycleBar from "../LifeCycleBar"
import * as Scroll from "react-scroll"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Skybox } from "../../vessel/libs/skybox_from_examples_r118"
import { Vessel } from "../../vessel/build/vessel"
import { Ship3D } from "../../vessel/build/Ship3D"
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

class ThreeModelGLB extends Component {
	constructor(props) {
		super(props)

		this.addScenarioStatus = true
		this.intersected = undefined
		this.mouse = new THREE.Vector2(0.5, 0.5)
		this.map = {}

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

		//  Later pass the ship object to the switch function
		var version = new ShipObject(this.props.user)
		this.setShipDataTemporary(this, version.shipObj)

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

			if (!this.scene.getObjectByName("ModelGLTF")) {
				this.addShip()
			}
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
		this.renderer = new THREE.WebGLRenderer({ antialias: true })
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

		this.scene.background = new THREE.Color(0xa9cce3)
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
		const mainLight = new THREE.DirectionalLight(0xffffff, 1)
		mainLight.position.set(100, 100, 100)
		this.scene.add(ambientLight, mainLight)

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
		if (version) {
			this.setState(() => {
				return {
					newShip: version,
					ship: new Vessel.Ship(version),
					GLTFPath: version.attributes.GLTFUrl
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

		// Unnable each of the parts
		this.ship3D.decks.children.forEach(e => e.layers.disable(0))
		this.ship3D.hull3D.children.forEach(e => e.layers.disable(0))
		this.ship3D.blocks.children.forEach(e => e.layers.disable(0))

		var loaderGLTF = new GLTFLoader()

		// Temporarilly the GLB is in the folder to reduce the time for getting the model
		// The code bellow allows the user to
		// access the git hub url: @ferrari212
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

				var root = this.scene.getObjectByName("RootNode")

				Object.assign(this.map, this.setUpMap(root))
				// this.map = this.setUpMap(root)
				// root.getObjectByName("Hull_0").material.side = THREE.DoubleSide
				// root.getObjectByName("Hull_1").material.side = THREE.DoubleSide
				// root.getObjectByName("Hull_2").material.side = THREE.DoubleSide
				// root.getObjectByName("Hull_3").material.side = THREE.DoubleSide

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

	setUpMap = root => {
		var map = {
			//50 hangar
			111.1: ["decks", 2, "Deck"],
			111.2: ["bulkheads", 2, "AB", "B23", "FB"],
			111.41: ["hull side", 2, "Hull_0", "Hull_1", "Hull_3"],
			111.71: ["hull bottom", 2, "Hull_2"],
			112: ["superstructure", 2],
			// 331.11: ["frame", 2, "SH_GROUP_A_FRAME_ROV_HANGAR"],
			//"331.11": ["crane", 2, [1, 4, 49]],
			// 411.1: ["engines", 2, "NOGVA_Scania_bk_l", "NOGVA_Scania_bk_c", "NOGVA_Scania_bk_r"],
			413.1: ["propeller", 2, "PTS_Propeller", "PTS_PropellerFrame", "STB_PropellerFrame", "STB_Propeller"],
			433.1: ["thruster", 2, "Thruster_Front"]
		}

		root.getObjectByName("Hull_0").material.side = THREE.DoubleSide
		root.getObjectByName("Hull_1").material.side = THREE.DoubleSide
		root.getObjectByName("Hull_2").material.side = THREE.DoubleSide
		root.getObjectByName("Hull_3").material.side = THREE.DoubleSide

		// This supStructObj should merge in map, the reason that obstruct
		// the complete integration is there is some of elements who had children
		// which the toggle function is not able to map @ferrai212
		var supStructObj = {
			Decals: ["112"],
			vesselShared_bridge_2: ["112"],
			VesselGlass: ["111.41"],
			bridgeGlass: ["112"],
			WhitePaint: ["112"],
			bridgeInside: ["112"],
			WindowCover: ["112"],
			BluePaint: ["112"],
			bridgeBlue: ["112"],
			bridge: ["112"],
			radar: ["112", "112"],
			safeRing: ["112", "112"],
			Stairs: ["112", "112"],
			vesselShared: ["112"],
			vesselShared_bridge: ["112", "112", "112"],
			Exhaust: ["112"],
			Railing: ["111.41"]
		}

		root.children.forEach((e, i) => {
			var objectName = e.name
			var keyName = supStructObj[objectName]

			if (!keyName) {
				return
			}

			if (keyName.length === 1) {
				map[keyName[0]].push(objectName)
			} else {
				for (let i = 0; i < e.children.length; i++) {
					const name = e.children[i].name
					map[keyName[0]].push(name)
				}
			}
		})

		return map
	}

	callBackMap = name => {
		console.log("Returned here ", name)
		debugger

		var object = this.scene.getObjectByName(name)

		// It is necessary to check if the element is inside
		// and in case it is not just do nothing. This is
		// necessary due
		if (object) {
			object.layers.toggle()
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
		// if (this.ocean.name) {
		// 	this.ocean.water.material.uniforms.time.value += 1 / 60
		// }

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
						return (
							<>
								<AnalysisChart state={state} />
								{Scroll.animateScroll.scrollTo(window.innerHeight, {
									delay: 100,
									duration: 2000,
									smooth: true
								})}
							</>
						)

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
					<Tree map={this.map} callBackMap={this.callBackMap} />
					{console.log(this)}
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
				{switchElement(this.props.user, this.state)}
			</Page>
		)
	}
}

export default ThreeModelGLB
