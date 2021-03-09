import React, { useState, useEffect, useContext } from "react"
import Page from "./Page"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import ShipObject from "../snippets/ShipObject"
import extract from "../snippets/extract"

function InsertState() {
	const [title, setTitle] = useState()
	const [description, setDescription] = useState()

	const appDispatch = useContext(DispatchContext)
	const appState = useContext(StateContext)

	var newState = {
		value: {
			LWL_design: 0,
			BWL: 0,
			Draft_design: 0,
			speed: 0
		},
		units: {
			LWL_design: "m",
			BWL: "m",
			Draft_design: "m",
			speed: "knots"
		}
	}

	var keys = Object.keys(newState.value).map(key => key)

	var test = new ShipObject(appState.user)

	var testObj = extract(test.shipObj.designState.calculationParameters, keys)

	newState.value = Object.assign(newState.value, testObj)

	const [state, setState] = useState(newState.value)

	async function handleSubmit(e) {
		e.preventDefault()
		appDispatch({ type: "closeInsertState", data: state })
	}

	async function handleSlider(e, key) {
		e.preventDefault()
		newState.value[key] = parseFloat(e.target.value)
		setState(newState.value)
		e.target.nextElementSibling.innerText = e.target.value
	}

	// function handleAddFields(e) {
	// 	e.preventDefault()
	// }

	useEffect(() => {
		document.addEventListener("keyup", searchKeyPressHandler)

		return () => document.removeEventListener("keyup", searchKeyPressHandler)
	}, [])

	function searchKeyPressHandler(e) {
		if (e.keyCode == 27) {
			appDispatch({ type: "closeInsertState" })
		}
	}

	return (
		// <>
		// 	<div className="search-overlay">
		// 		<div className="search-overlay-top shadow-sm">
		// 			<div className="container container--narrow">
		// 				<label htmlFor="live-search-field" className="search-overlay-icon">
		// 					<i className="fas fa-search"></i>
		// 				</label>
		// 				<input autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
		// 				<span onClick={() => appDispatch({ type: "closeInsertState" })} className="close-live-search">
		// 					<i className="fas fa-times-circle"></i>
		// 				</span>
		// 			</div>
		// 		</div>

		// 		<div className="search-overlay-bottom">
		// 			<div className="container container--narrow py-3">
		// 				<div className="live-search-results live-search-results--visible">
		// 					<div className="list-group shadow-sm">
		// 						<div className="list-group-item active">
		// 							<strong>InsertState Results</strong> (3 items found)
		// 						</div>
		// 						<a href="#" className="list-group-item list-group-item-action">
		// 							<img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #1</strong>
		// 							<span className="text-muted small">by brad on 2/10/2020 </span>
		// 						</a>
		// 						<a href="#" className="list-group-item list-group-item-action">
		// 							<img className="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128" /> <strong>Example Post #2</strong>
		// 							<span className="text-muted small">by barksalot on 2/10/2020 </span>
		// 						</a>
		// 						<a href="#" className="list-group-item list-group-item-action">
		// 							<img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #3</strong>
		// 							<span className="text-muted small">by brad on 2/10/2020 </span>
		// 						</a>
		// 					</div>
		// 				</div>
		// 			</div>
		// 		</div>
		// 	</div>
		// </>
		<Page title="Create New Post">
			<div className="d-flex flex-row-reverse my-1 my-md-0">
				<span onClick={() => appDispatch({ type: "closeInsertState" })} className="close-live-search ">
					<i className="fas fa-times-circle"></i>
				</span>
			</div>

			{/* <div className="search-overlay-top shadow-sm">
				<div className="container container--narrow">
					<label htmlFor="live-search-field" className="search-overlay-icon">
						<i className="fas fa-search"></i>
					</label>
					<input autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
					<span onClick={() => appDispatch({ type: "closeInsertState" })} className="close-live-search">
						<i className="fas fa-times-circle"></i>
					</span>
				</div>
			</div> */}

			{/* <form onSubmit={handleSubmit}> */}
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="post-title" className="text-muted mb-1">
						<small>Title</small>
					</label>
					<input defaultValue={`New state from ${test.version.title}`} onChange={e => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-title" type="text" placeholder="Insert state name based on the project" autoComplete="off" />
				</div>

				{/* Take the object and save with the description of state of tile */}
				{/* <div className="form-group">
					<label htmlFor="post-description" className="text-muted mb-1 d-block">
						<small>Description</small>
					</label>
					<textarea defaultValue={`New state for ${test.version.title}`} onChange={e => setDescription(e.target.value)} name="description" id="post-description" className="description-content small-textarea form-control form-control-sm" type="text"></textarea>
				</div>

				<button onClick={() => handleAddFields()}>Test Button</button> */}

				{Object.keys(newState.value).map((key, index) => {
					var title = key.split("_")
					var value = newState.value[key]
					var max = 1.25 * value
					var min = 0.75 * value
					// debugger

					return (
						<div key={index} className="form-group">
							<label htmlFor="post-description" className="text-muted mb-1 d-block">
								<small>
									{title[0]} ({newState.units[key]})
								</small>
							</label>
							<div className="input-group mb-3 input-sm">
								<span className="input-group-text mr-2" id="basic-addon3">
									{value} :
								</span>
								<input
									key={index}
									onChange={e => {
										handleSlider(e, key)
									}}
									defaultValue={value}
									type="range"
									min={min}
									max={max}
									step="0.05"
									className="form-control bg-light"
									id="basic-url"
									aria-describedby="basic-addon3"
								/>
								<span id="new-state" className="input-group-text ml-2" id="basic-addon3">
									{state[key]}
								</span>
							</div>
						</div>
					)
				})}

				{/* {tanks.map((tank, index) => {
					return (
						<>
							<div key={index} className="form-group form-inline">
								<div className="table-row">
									<div className="col-xs-1 ml-1">
										<label for="ex1">col-xs-2</label>
										<input className="form-control" id="ex1" type="text" />
									</div>
									<div className="col-xs-2 ml-1">
										<label for="ex2">col-xs-3</label>
										<input className="form-control" id="ex2" type="text" />
									</div>
									<div className="col-xs-3 ml-1">
										<label for="ex3">col-xs-4</label>
										<input className="form-control" id="ex3" type="text" />
									</div>
									<div className="col-xs-3 ml-1">
										<label for="ex3">col-xs-4</label>
										<input className="form-control" id="ex3" type="text" />
									</div>
								</div>
								<div className="table-row"></div>
							</div>
						
						</>
					)
				})} */}

				{/* <label for="usr">{tank.referenceState.xCentre}</label>
							<input type="text" className="form-control" id="usr" /> */}

				{/* <div className="form-group">
				<label htmlFor="post-description" className="text-muted mb-1 d-block">
					<small>Insert JSON Ship File</small>
				</label>
				<InputJSON changeShip={changeShip} />
			</div>

			<div className="form-group">{ship ? <ThreeMiniPage ship={ship} height={350} /> : <UpLoadCanvas />}</div>
			<div id="render-json" /> */}

				<button className="btn btn-primary">Create New State</button>
			</form>
		</Page>
	)
}

export default InsertState
