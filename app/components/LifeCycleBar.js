import React, { useEffect } from "react"

import Image from "../images/code-24px.svg"

function LifeCycleBar() {
	return (
		<div id="free-bar" className="container">
			<div className="row">
				<div className="col-sm"></div>
				<div className="col-sm-9"></div>
				<div className="col-sm">
					<a id="free-button" target="_blank" href="https://github.com/ferrari212/vesseljs/blob/master/examples/Gunnerus_Complete_Example.html" title="View source code for animation / cloth on GitHub">
						<img src={Image} />
					</a>
				</div>
				<div className="col-sm">
					<a id="free-button" target="_blank" href="https://github.com/ferrari212/vesseljs/blob/master/examples/Gunnerus_Complete_Example.html" title="View source code for animation / cloth on GitHub">
						<img src={Image} />
					</a>
				</div>
			</div>
		</div>
	)
}

export default LifeCycleBar
