import React, { useEffect, useContext } from "react"
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

	// Initial Use of Button: Insert the ship version as reducer
	var setDisplayedShip = e => {
		appDispatch({ type: "changeShip", shipId: e - 1 })
	}

	var displayTitleString = e => {
		const id = e.user.shipId
		const version = e.user.versions[id]
		return version.title
	}

	return (
		<Dropdown>
			<div className="flex-row my-3 my-md-0">
				<Link to={`/profile/${appState.user.username}`} href="#" className="mr-2">
					<img className="small-header-avatar" src={appState.user.avatar} />
				</Link>

				<Dropdown.Toggle size="sm" variant="success" id="dropdown-basic" className="mr-2">
					{displayTitleString(appState)}
				</Dropdown.Toggle>

				<Dropdown.Menu>
					{console.log(appState.user.versions)}

					{appState.user.versions.map(version => {
						return (
							<Dropdown.Item onSelect={setDisplayedShip} eventKey="1">
								{version.title}
							</Dropdown.Item>
						)
					})}
				</Dropdown.Menu>

				<Link className="btn btn-sm btn-success mr-2 success" to="/create-post">
					{/* Create Post */}
					Create Ship Version
				</Link>
				<Link className="btn btn-sm btn-success mr-2" to={`/three-model/${appState.user.username}`}>
					Show 3D
				</Link>
				<Link onClick={handleLogout} to="/" className="btn btn-sm btn-danger" to="/">
					Sign Out
				</Link>
			</div>
		</Dropdown>
	)
}

export default HeaderLoggedIn
