import React, { useEffect, useContext } from "react"
import Page from "./Page"
import StateContext from "../StateContext"

function Home() {
	const appState = useContext(StateContext)

	return (
		<Page title="Your Feed">
			<h2 className="text-center">
				Hello <strong>{appState.user.username}</strong>, you have no ship versions on your own.
			</h2>
			<p className="lead text-muted text-center">
				Your feed displays the ship projects you have. You can use the &ldquo;Create Ship Version&rdquo; feature in the top menu bar to upload a ship version in{" "}
				<a href="https://shiplab.github.io/vesseljs/" target="_blank">
					Vessel.js
				</a>{" "}
				format. If you do not know how to use the library we suggest you to read the{" "}
				<a href="https://github.com/shiplab/vesseljs/wiki" target="_blank">
					documentation
				</a>{" "}
				and follow the tutorial &ldquo;
				<a href="https://observablehq.com/@ferrari212/from-the-hull-to-simulation-a-vessel-js-tutorial" target="_blank">
					From Concept to Simulation
				</a>
				&rdquo;.
			</p>
		</Page>
	)
}

export default Home
