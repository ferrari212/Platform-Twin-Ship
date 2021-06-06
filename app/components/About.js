import React, { useEffect } from "react"
import Page from "./Page"

function About() {
	useEffect(() => {
		document.title = "About | OpenSim"
		window.scrollTo(0, 0)
	}, [])

	return (
		<Page title="About">
			<h2>About</h2>
			<p className="lead text-muted">The open platform is a free and open source site for vessel analysis and simulation</p>
			<p>
				Here you are invited to share your ship models, having as base the{" "}
				<a href="https://shiplab.github.io/vesseljs/" target="_blank">
					Vessel.js
				</a>{" "}
				notation. All the users have access to the open environment and you can sign up for a free account to have your own ship models. We also invite you to expand the platform by improving the code, reporting bugs and suggesting improvements in the{" "}
				<a href="https://github.com/ferrari212/Platform-Twin-Ship" target="_blank">
					GitHub repository
				</a>
				.
			</p>
		</Page>
	)
}

export default About
