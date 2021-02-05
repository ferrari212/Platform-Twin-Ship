import React, { useContext } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

import ImageFunctions from "../images/functions-black-24dp.svg"
import ImageCompare from "../images/compare_arrows-black-24dp.svg"
import ImageCode from "../images/download-black-24dp.svg"

function LifeCycleBar() {
	const appDispatch = useContext(DispatchContext)
	const appState = useContext(StateContext)

	function dowloadHandle(e) {
		e.preventDefault()

		const ID = appState.user.shipId
		const VERSIONS = appState.user.versions
		const VERSION = VERSIONS[ID]

		var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(VERSION.ship))
		var fileName = VERSION.title + ".json"
		var link = document.createElement("a")
		link.setAttribute("href", dataStr)
		link.setAttribute("download", fileName)

		link.click()
	}

	function startAnlysis(e) {
		e.preventDefault()
		// console.log(e)
		appDispatch({ type: "analyse", command: true })
	}

	function endAnlysis(e) {
		e.preventDefault()
		// console.log(e)
		appDispatch({ type: "analyse", command: false })
	}

	return (
		<div id="free-bar" className="container">
			<div className="row">
				<div className="col-sm"></div>
				<div className="col-sm-7"></div>
				<div className="col-sm">
					<a id="free-button" target="_blank" onClick={startAnlysis} title="View source code for animation / cloth on GitHub">
						<img src={ImageFunctions} />
					</a>
				</div>
				<div className="col-sm">
					<a id="free-button" target="_blank" onClick={endAnlysis} title="View source code for animation / cloth on GitHub">
						<img src={ImageFunctions} />
					</a>
				</div>
				<div className="col-sm">
					<a id="free-button" target="_blank" href="https://github.com/ferrari212/vesseljs/blob/master/examples/Gunnerus_Complete_Example.html" title="View source code for animation / cloth on GitHub">
						<img src={ImageCompare} />
					</a>
				</div>
				<div className="col-sm">
					<a id="free-button" href="" onClick={dowloadHandle} title="View source code for animation / cloth on GitHub">
						<img src={ImageCode} />
					</a>
				</div>
			</div>
		</div>
	)
}

export default LifeCycleBar
