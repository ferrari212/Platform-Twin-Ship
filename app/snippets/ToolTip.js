export default class ToolTip {
	// Class that input the element name in the #tooltip
	// mouse: new THREE.Vector2()
	// elementTag: string of the id name
	// intersected: intersected 3D object
	// @ferrari212

	constructor(mouse, elementTag = "tooltip") {
		this.mouse = mouse
		this.element = document.getElementById(elementTag)
	}

	upDate(intersected) {
		if (intersected) {
			if (intersected.status) {
				this.element.style.setProperty("visibility", "visible")
				this.element.innerText = intersected.name
				this.element.style.left = `${this.mouse.clientX + 10}px`
				this.element.style.top = `${this.mouse.clientY + 10}px`
			} else {
				this.element.style.setProperty("visibility", "hidden")
			}
		}
	}
}
