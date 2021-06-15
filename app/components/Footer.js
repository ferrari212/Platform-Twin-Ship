import React from "react"
import { Link } from "react-router-dom"

function Footer() {
	return (
		<footer className="border-top text-center small text-muted py-3">
			<p>
				<Link to="/" className="mx-1">
					Home
				</Link>{" "}
				|{" "}
				<Link className="mx-1" to="/about-us">
					About Us
				</Link>{" "}
				|{" "}
				<Link className="mx-1" to="/terms">
					Terms
				</Link>
			</p>
			<p className="m-0">
				MIT License - 2020{" "}
				<a href="/" className="text-muted">
					OpenSim
				</a>
				. Author:{" "}
				<a href="http://shiptodata.com/" className="text-muted">
					Felipe Ferrari.
				</a>
			</p>
		</footer>
	)
}

export default Footer
