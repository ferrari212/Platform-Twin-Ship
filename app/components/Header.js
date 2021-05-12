import React, { useState, useContext } from "react"
import { Link } from "react-router-dom"
import HeaderLoggedOut from "./HeaderLoggedOut"
import HeaderLoggedIn from "./HeaderLoggedIn"
import StateContext from "../StateContext"

function Header(props) {
	console.log(props)
	const appState = useContext(StateContext)
	const headerContent = appState.loggedIn ? <HeaderLoggedIn appState={appState} /> : <HeaderLoggedOut />

	return (
		<header className="header-bar">
			<div className="container d-flex flex-column flex-md-row align-items-center p-3">
				<h4 className="my-0 mr-md-auto font-weight-normal">
					<Link to="/" className="text-white">
						TwinShipPlatform
					</Link>
				</h4>
				{!props.staticEmpity ? headerContent : ""}
			</div>
		</header>
	)
}

export default Header
