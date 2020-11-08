import React, { useEffect, Component } from "react"
import * as THREE from "three"
import Page from "./Page"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Skybox } from "../vessel/libs/skybox_from_examples_r118"
import { Ocean } from "../vessel/libs/Configurable_ocean2"
import { Vessel } from "../vessel/build/vessel"
import { Ship3D } from "../vessel/build/Ship3D"

import GunnerusTeste from "../vessel/specs/Gunnerus.json"

var oSize = 512
const skybox = new Skybox(oSize)

class ThreeModel extends Component {
	componentDidMount() {
		// Globals
		this.oSize = 2048

		this.sceneSetup()
		this.addCustomSceneObjects()
		this.startAnimationLoop()

		window.addEventListener("resize", this.handleWindowResize)
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
			1, // near plane
			1000 // far plane
		)

		// set some distance from a cube that is located at z = 0
		this.camera.position.set(oSize * 0.03, oSize * 0.03, oSize * 0.03)

		this.controls = new OrbitControls(this.camera, this.mount)
		this.renderer = new THREE.WebGLRenderer()
		this.renderer.setSize(width, height)
		this.mount.appendChild(this.renderer.domElement) // mount using React ref

		this.useZUp = () => {
			// THREE.Object3D.DefaultUp.set(0, 0, 1)
			const zUpCont = new THREE.Group()
			this.scene.add(zUpCont)

			// this.camera.up.set(0, 1, 0)
			// this.camera.lookAt(zUpCont.position)

			// Maybe use zUpCont
			// return zUpCont
		}
	}

	addCustomSceneObjects = () => {
		// const geometry = new THREE.BoxGeometry(2, 2, 2)
		// const material = new THREE.MeshPhongMaterial({
		// 	color: 0x156289,
		// 	emissive: 0x072534,
		// 	side: THREE.DoubleSide,
		// 	flatShading: true
		// })
		// this.cube = new THREE.Mesh(geometry, material)
		// this.scene.add(this.cube)

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
		this.scene.rotation.x = -Math.PI / 2

		var ship = new Vessel.Ship(GunnerusTeste)

		this.ship3D = new Ship3D(ship, {
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

		// Vessel.loadShip(GunnerusTeste, function (ship) {
		// 	this.ship3D = new Ship3D(ship, {
		// 		// stlPath: "specs/STL files",
		// 		stlPath: "specs/STL files/Gunnerus",
		// 		upperColor: 0x33aa33,
		// 		lowerColor: 0xaa3333,
		// 		hullOpacity: 1,
		// 		deckOpacity: 1,
		// 		objectOpacity: 1
		// 	})
		// 	this.ship3D.name = "Ship3D"
		// 	this.ship3D.show = "on"
		// 	this.scene.add(ship3D)

		// 	// Take the hydrostatics informations
		// 	var ship = this.ship3D.ship
		// 	var draftDesign = ship.designState.calculationParameters.Draft_design
		// 	var hull = ship.structure.hull

		// 	// hydrostatics = hull.calculateAttributesAtDraft(draftDesign)
		// 	// ship3D.shipState
		// 	// ship3D.ship.calculateStability()
		// 	// Maybe take KMt or KMl to the vessel.js
		// 	// hydrostatics.KMt = hydrostatics.BMt + hydrostatics.KB
		// 	// hydrostatics.KMl = hydrostatics.BMl + hydrostatics.KB
		// })
	}

	startAnimationLoop = () => {
		this.ocean.water.material.uniforms.time.value += 1 / 60

		// this.cube.rotation.x += 0.01
		// this.cube.rotation.y += 0.01

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
			</Page>
		)
	}
}

export default ThreeModel
