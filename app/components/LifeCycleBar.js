import React, { useContext } from "react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import ReactTooltip from "react-tooltip"
import * as Scroll from "react-scroll"

import ImageFunctions from "../images/functions-black-24dp.svg"
import ImageClose from "../images/close-black-24dp.svg"
import ImageCompare from "../images/code-24px.svg"
import ImageCode from "../images/download-black-24dp.svg"
import ImagePrint from "../images/print-black-24dp.svg"

import ShipObject from "../snippets/ShipObject"

function LifeCycleBar() {
	const appDispatch = useContext(DispatchContext)
	const appState = useContext(StateContext)

	function dowloadHandle(e) {
		e.preventDefault()

		var ship = new ShipObject(appState.user)

		var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ship.version))
		var fileName = ship.version.title + ".json"
		var link = document.createElement("a")
		link.setAttribute("href", dataStr)
		link.setAttribute("download", fileName)

		link.click()
	}

	function startAnlysis(e) {
		e.preventDefault()
		appDispatch({ type: "setAnalysis", command: true })
		Scroll.animateScroll.scrollTo(window.innerHeight, {
			delay: 100,
			smooth: true
		})
	}

	function endAnlysis(e) {
		e.preventDefault()
		appDispatch({ type: "setAnalysis", command: false })
	}

	// function printContentButton() {
	// 	if (appState.user.method === "analyse") {
	// 		return (
	// 			<div className="p-3 bd-highlight">
	// 				<a id="free-button" href="" onClick={endAnlysis} data-tip="Print Analysis" data-for="print">
	// 					<img src={ImagePrint} />
	// 				</a>
	// 				<ReactTooltip id="print" className="custom-tooptip" />{" "}
	// 			</div>
	// 		)
	// 	} else {
	// 		return ""
	// 	}
	// }

	function setButtons() {
		if (appState.user.method === "analyse") {
			return (
				<div className="p-3 bd-highlight">
					<a id="free-button" href="" onClick={endAnlysis} data-tip="Close Analysis" data-for="close">
						<img src={ImageClose} />
					</a>
					<ReactTooltip id="close" className="custom-tooptip" />{" "}
				</div>
			)
		} else {
			return (
				<div className="p-3 bd-highlight">
					<a id="free-button" href="" onClick={startAnlysis} data-tip="Create Analysis" data-for="analysis">
						<img src={ImageFunctions} />
					</a>
					<ReactTooltip id="analysis" className="custom-tooptip" />{" "}
				</div>
			)
		}
	}

	return (
		<div id="free-bar" className="container">
			<div className="d-flex flex-row-reverse bd-highlight">
				<div className="p-3 bd-highlight">
					<a id="free-button" target="_blank" href="https://github.com/ferrari212/vesseljs/blob/master/examples/Gunnerus_Complete_Example.html" data-tip="Code" data-for="code">
						<img src={ImageCompare} />
					</a>
					<ReactTooltip id="code" className="custom-tooptip" />{" "}
				</div>
				<div className="p-3 bd-highlight">
					<a id="free-button" href="" onClick={dowloadHandle} data-tip="Dowload" data-for="dowload">
						<img src={ImageCode} />
					</a>
					<ReactTooltip id="dowload" className="custom-tooptip" />{" "}
				</div>
				{/* {appState.user ? printContentButton() : ""} */}
				{appState.user ? setButtons() : ""}
			</div>
		</div>
	)
}

export default LifeCycleBar
