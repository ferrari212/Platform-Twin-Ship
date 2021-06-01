import React, { useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { Dropdown, Badge } from "react-bootstrap"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

import ShipObject from "../snippets/ShipObject"

function HeaderLoggedIn(props) {
	const appDispatch = useContext(DispatchContext)
	var appState = props.appState

	var ship = new ShipObject(appState.user)

	function handleLogout() {
		appDispatch({ type: "logout" })
	}

	function ReturnVersionButton() {
		if (ship.version) {
			return (
				<Dropdown.Toggle size="sm" variant="success" id="dropdown-basic" className="mr-2">
					{ship.version.title}
				</Dropdown.Toggle>
			)
		}
		return ""
	}

	function ReturnDropdown() {
		if (appState.user.versions.length) {
			var titles = appState.user.versions.map(x => x.title)

			return (
				<Dropdown.Menu>
					{titles.map((version, id) => {
						return (
							<Dropdown.Item key={id} onSelect={setDisplayedShip} eventKey={id}>
								{version}
							</Dropdown.Item>
						)
					})}
				</Dropdown.Menu>
			)
		}
		return ""
	}

	function Ship3DButton() {
		if (appState.user.versions.length) {
			debugger
			var shipObj = ship.shipObj
			var GLTFUrl = shipObj.obj.attributes.GLTFUrl || undefined
			var lifeCyclePhase

			// Insert the verification for the operation fase
			if (!Boolean(ship.shipObj.data[0])) {
				lifeCyclePhase = GLTFUrl ? "Detailing" : "Initial Design"
			} else {
				lifeCyclePhase = "Operation"
			}

			return (
				<Link className="btn btn-sm btn-success mr-2" to={`/three-model/${appState.user.username}`}>
					Show 3D &nbsp;{" "}
					<Badge pill variant="light">
						{lifeCyclePhase}
					</Badge>
				</Link>
			)
		}
		return ""
	}

	// Initial Use of Button: Insert the ship version as reducer
	var setDisplayedShip = e => {
		appDispatch({ type: "changeShip", shipId: e })
	}

	return (
		<Dropdown>
			<div className="flex-row my-3 my-md-0">
				<Link to={`/profile/${appState.user.username}`} href="#" className="mr-2">
					<img className="small-header-avatar" src={appState.user.avatar} />
				</Link>

				<ReturnVersionButton />
				<ReturnDropdown />

				<Link className="btn btn-sm btn-success mr-2 success" to="/create-version">
					Create Ship Version
				</Link>

				<Ship3DButton />

				<Link onClick={handleLogout} to="/" className="btn btn-sm btn-danger" to="/">
					Sign Out
				</Link>
			</div>
		</Dropdown>
	)
}

export default HeaderLoggedIn
