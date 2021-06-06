import React from "react"
import Tree from "@widgetjs/tree"
import { createUseStyles } from "react-jss"

class TreeComponent extends React.Component {
	constructor(props) {
		super(props)
		this.map = props.map
		this.callBackMap = props.callBackMap

		// The ship itself must be imported

		// this.ship = props.ship

		// const useStyles = createUseStyles({
		// 	whiteBackGround: {
		// 		color: "green"
		// 	}
		// })

		// this.styles = useStyles()

		this.data = [
			{
				id: "110",
				text: "110 Ship structure",
				children: [
					{
						id: "111",
						text: "111 Ship hull structure",
						children: [
							{ id: "111.1", text: "111.1 Decks" },
							{ id: "111.2", text: "111.2 Transverse bulkheads" },
							{ id: "111.41", text: "111.41 Single skin sides" },
							{ id: "111.71", text: "111.71 Single bottom" }
						]
					},
					{ id: "112", text: "112 Superstructure" }
				]
			},
			// { id: "331", text: "331 Cranes", children: [{ id: "331.1", text: "331.1 Shipboard cranes", children: [{ id: "331.11", text: "331.11 Shipboard crane" }] }] },
			{
				id: "400",
				text: "400 Propulsion and steering arrangements",
				children: [
					// { id: "411", text: "411 Propulsion driver arrangements", children: [{ id: "411.1", text: "411.1 Propulsion engine" }] },
					{ id: "413", text: "413 Propeller arrangements", children: [{ id: "413.1", text: "413.1 Propeller" }] },
					{ id: "430", text: "430 Propulsion and steering thruster arrangements", children: [{ id: "433", text: "433 Propulsion thruster arrangement", children: [{ id: "433.1", text: "433.1 Propulsion thruster" }] }] }
				]
			}
		]

		// this.data = [
		// 	{
		// 		id: "0",
		// 		text: "node-0",
		// 		children: [
		// 			{
		// 				id: "0-0",
		// 				text: "node-0-0",
		// 				children: [
		// 					{ id: "0-0-0", text: "node-0-0-0" },
		// 					{ id: "0-0-1", text: "node-0-0-1" },
		// 					{ id: "0-0-2", text: "node-0-0-2" }
		// 				]
		// 			},
		// 			{ id: "0-1", text: "node-0-1" }
		// 		]
		// 	},
		// 	{
		// 		id: "1",
		// 		text: "node-1",
		// 		children: [
		// 			{ id: "1-0", text: "node-1-0" },
		// 			{ id: "1-1", text: "node-1-1" }
		// 		]
		// 	}
		// ]

		// this.map = {
		// 	//50 hangar
		// 	111.1: ["decks", 2],
		// 	111.2: ["bulkheads", 2, [1, 0], [1, 1], [1, 2]],
		// 	111.41: ["hull side", 2],
		// 	111.71: ["hull bottom", 2],
		// 	112: ["superstructure", 2],
		// 	331.11: ["frame", 2, [1, 50]],
		// 	//"331.11": ["crane", 2, [1, 4, 49]],
		// 	411.1: ["engines", 2, [1, 51], [1, 52], [1, 53]],
		// 	413.1: ["propeller", 2],
		// 	433.1: ["thruster", 2]
		// }
	}

	componentDidMount() {
		this.tree = new Tree(".hierarchy", {
			data: [{ id: "-1", text: "Functions", children: this.data }],
			values: ["-1"],
			closeDepth: 3,
			onChange: this.threeToggle
		})

		Object.assign(this.tree, { map: this.map, callBackMap: this.callBackMap })
	}

	threeToggle = () => {
		for (let prop in this.map) {
			// Maybe it is necessary to use the getObjectByName
			let treeStatus = this.tree.leafNodesById[prop].status
			let mapStatus = this.map[prop][1]

			if (treeStatus !== mapStatus) {
				for (let i = 2; i < this.map[prop].length; i++) {
					var name = this.map[prop][i]
					this.callBackMap(name)
				}
				this.map[prop][1] = treeStatus
			}
		}
	}

	render() {
		return <div ref={ref => (this.mount = ref)} className="hierarchy dat-gui-style"></div>
	}
}

export default TreeComponent
