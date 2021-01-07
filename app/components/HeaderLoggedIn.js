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
	var Teste = e => {
		appState.user.shipId = e
		console.log(appState.user.shipId)

		console.log(e)
	}

	return (
		<Dropdown>
			<div className="flex-row my-3 my-md-0">
				<Link to={`/profile/${appState.user.username}`} href="#" className="mr-2">
					<img className="small-header-avatar" src={appState.user.avatar} />
				</Link>

				<Dropdown.Toggle size="sm" variant="success" id="dropdown-basic" className="mr-2">
					{console.log(appState)}
				</Dropdown.Toggle>

				<Dropdown.Menu>
					<Dropdown.Item onSelect={Teste} eventKey="1">
						Action
					</Dropdown.Item>
					<Dropdown.Item onSelect={Teste} eventKey="2">
						Another action
					</Dropdown.Item>
					<Dropdown.Item onSelect={Teste} eventKey="3">
						Something else
					</Dropdown.Item>
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
