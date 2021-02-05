import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { Dropdown } from "react-bootstrap"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function HeaderLoggedIn(props) {
	const appDispatch = useContext(DispatchContext)
	const appState = useContext(StateContext)

	function handleLogout() {
		appDispatch({ type: "logout" })
	}

	function ReturnVersionButton() {
		if (appState.user.versions.length) {
			return (
				<Dropdown.Toggle size="sm" variant="success" id="dropdown-basic" className="mr-2">
					{displayTitleString(appState)}
				</Dropdown.Toggle>
			)
		}
		return ""
	}

	function Ship3DButton() {
		if (appState.user.versions.length) {
			return (
				<Link className="btn btn-sm btn-success mr-2" to={`/three-model/${appState.user.username}`}>
					Show 3D
				</Link>
			)
		}
		return ""
	}

	// Initial Use of Button: Insert the ship version as reducer
	var setDisplayedShip = e => {
		appDispatch({ type: "changeShip", shipId: e })
	}

	var displayTitleString = e => {
		const id = e.user.shipId
		const version = e.user.versions[id]
		return version ? version.title : ""
	}

	var titles = []

	if (typeof appState.user.versions === "object") {
		titles = appState.user.versions.map(x => x.title)
	}

	console.log(titles)

	return (
		<Dropdown>
			<div className="flex-row my-3 my-md-0">
				<Link to={`/profile/${appState.user.username}`} href="#" className="mr-2">
					<img className="small-header-avatar" src={appState.user.avatar} />
				</Link>

				<ReturnVersionButton />

				<Dropdown.Menu>
					{console.log(appState.user.versions)}

					{appState.user.versions.map((version, id) => {
						return (
							<Dropdown.Item key={id} onSelect={setDisplayedShip} eventKey={id}>
								{version.title}
							</Dropdown.Item>
						)
					})}
				</Dropdown.Menu>

				<Link className="btn btn-sm btn-success mr-2 success" to="/create-post">
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
