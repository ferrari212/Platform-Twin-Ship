export default class TableInfo {
	// Class that input the element name in the #tooltip
	// mouse: new THREE.Vector2()
	// elementTag: string of the id name
	// intersected: intersected 3D object
	// @ferrari212

	constructor(Ship3D, tableTag = "tableinfo") {
		this.ship = Ship3D.ship
		this.tooltipElement = document.getElementById(tableTag)
		this.tooltipElement.style.visibility = "hidden"
	}

	// Add the table with the informations
	addTable(block, element) {
		// Classes for changing the inner displayed table @ferrari
		class ListMarkup {
			constructor() {
				this.innerHTML = `<table id="free-table" class="table table-dark"><tbody>`
			}

			extendSingleInnerHTML(key, value, unit = "") {
				this.innerHTML += `<tr><td> ${key} </td><td> ${value} ${unit} </td></tr>`
			}

			arrayExtendInnerHTML(object, fromNumber = 0, toEnd = 0, unit = "") {
				var keys = Object.keys(object)

				for (let i = fromNumber; i < keys.length - toEnd; i++) {
					this.innerHTML += `<tr><td> ${keys[i]} </td><td> ${object[keys[i]]} ${unit} </td></tr>`
				}
			}

			closeInnerHTML() {
				this.innerHTML += `</tbody></table>`
			}
		}

		// Invalidate function in case of element undefined
		if (element === undefined) return

		var listMarkup = new ListMarkup()

		// this.tooltipElement.displayingPropTable = true

		if (element.id === undefined) {
			// For structural elements
			var keys = Object.keys(element)

			listMarkup.extendSingleInnerHTML("Group", element.affiliations.group)

			listMarkup.arrayExtendInnerHTML(element, 1)
		} else {
			// For non structural elements
			listMarkup.extendSingleInnerHTML("Id", element.id)

			listMarkup.arrayExtendInnerHTML(element.baseObject.boxDimensions, 0, 0, "m")

			listMarkup.arrayExtendInnerHTML(element.referenceState, 0, 0, "m")
		}

		listMarkup.closeInnerHTML()

		// Inserting tooltip
		block.style.visibility = "visible"
		// block.style.left = mouse.clientX + 20
		// block.style.top = mouse.clientY + 10
		block.innerHTML = listMarkup.innerHTML
		// zUpCont.remove(zUpCont.getObjectByName(element.name))
	}

	upDate(intersected) {
		var name = intersected.name
		var element = this.ship.derivedObjects[name] || this.ship.structure.decks[name] || this.ship.structure.bulkheads[name]
		this.addTable(this.tooltipElement, element)
		// document.getElementById("SimulationWindow").addEventListener("mousemove", this.onMouseMove, false) = () => addTable(this.tooltipElement, element)
	}
}
