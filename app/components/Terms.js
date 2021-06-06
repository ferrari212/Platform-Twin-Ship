import React from "react"
import Page from "./Page"

function Terms() {
	return (
		<Page title="Terms and Conditions">
			<h2>Terms &amp; Conditions</h2>
			<p className="lead text-muted">
				All the platform is licensed under{" "}
				<a href="https://shiplab.github.io/vesseljs/" target="_blank">
					MIT
				</a>
			</p>
			<p>This means that the use of code source does not imply in limitation rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software without warranty of any kind. The MIT copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. It is a good practice to attribute the credits of the authors from the source code as much as possible and reference the divulgate original work.</p>
		</Page>
	)
}

export default Terms
