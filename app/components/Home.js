import React, { useEffect, useContext } from "react"
import Page from "./Page"
import StateContext from "../StateContext"

function Home() {
	const appState = useContext(StateContext)

	return (
		<Page title="Your Feed">
			<h2 className="text-center">
				Hello <strong>{appState.user.username}</strong> user, this is a preliminary version of the TwinShip platform.
			</h2>
			<p className="lead text-muted text-center">
				Your feed displays the ship projects you have. You can use the &ldquo;Show 3D&rdquo; button to visualize your selected version or the &ldquo;Create Ship Version&rdquo; button featured in the top menu bar to upload a ship version according to{" "}
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
