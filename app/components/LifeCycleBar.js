import React, { useContext } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import ReactTooltip from "react-tooltip"

import ImageFunctions from "../images/functions-black-24dp.svg"
import ImageSimulate from "../images/waves-24px.svg"
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
		appDispatch({ type: "setAnalysis", command: true })
	}

	function endAnlysis(e) {
		e.preventDefault()
		appDispatch({ type: "setAnalysis", command: false })
	}

	return (
		<div id="free-bar" className="container">
			<div className="row">
				<div className="col-sm"></div>
				<div className="col-sm-7"></div>
				<div className="col-sm">
					<a id="free-button" href="" onClick={startAnlysis} data-tip="Analysis" data-for="analysis">
						<img src={ImageFunctions} />
					</a>
					<ReactTooltip id="analysis" className="custom-tooptip" />{" "}
				</div>
				<div className="col-sm">
					<a id="free-button" href="" onClick={endAnlysis} data-tip="Simulation" data-for="simulation">
						<img src={ImageSimulate} />
					</a>
					<ReactTooltip id="simulation" className="custom-tooptip" />{" "}
				</div>
				<div className="col-sm">
					<a id="free-button" target="_blank" href="https://github.com/ferrari212/vesseljs/blob/master/examples/Gunnerus_Complete_Example.html" data-tip="Code" data-for="code">
						<img src={ImageCompare} />
					</a>
					<ReactTooltip id="code" className="custom-tooptip" />{" "}
				</div>
				<div className="col-sm">
					<a id="free-button" href="" onClick={dowloadHandle} data-tip="Dowload" data-for="dowload">
						<img src={ImageCode} />
					</a>
					<ReactTooltip id="dowload" className="custom-tooptip" />{" "}
				</div>
			</div>
		</div>
	)
}

export default LifeCycleBar
