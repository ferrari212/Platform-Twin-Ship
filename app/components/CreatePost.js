import React, { useState, useContext } from "react"
import ReactTooltip from "react-tooltip"

import UpLoadCanvas from "./UpLoadCanvas"
import Page from "./Page"
import ThreeMiniPage from "./ThreeComponents/ThreeMiniPage"
import Axios from "axios"
import Renderjson from "renderjson"
import { withRouter } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
// import { response } from "express"

import InputJSON from "./InputJSON"

function CreatePost(props) {
	const [title, setTitle] = useState()
	const [description, setDescription] = useState()
	const [obj, setObj] = useState()
	const [propeller, setPropeller] = useState({
		noProps: 2,
		noBlades: 4,
		D: 1.9,
		P: 1.2,
		AeAo: 0.55,
		beta1: 0.57,
		beta2: 0.44,
		gamma1: 0.105,
		gamma2: 0.077
	})
	const [powerPlant, setPowerPlant] = useState({
		main: {
			noSys: 1,
			etas: 0.99,
			etag: 0.95,
			engines: [
				{
					MCR: 500,
					rpmSpeed: 239,
					weight: 1900,
					a: 8.64,
					b: -23.76,
					c: 228.96,
					polOrder: 2
				},
				{
					MCR: 500,
					rpmSpeed: 239,
					weight: 1900,
					a: 8.64,
					b: -23.76,
					c: 228.96,
					polOrder: 2
				}
			]
		}
	})
	const [man, setMan] = useState({
		distHel: 15,
		m: null,
		I: null,
		initial_yaw: 0,
		initial_angle: 0,
		M: null,
		N: [
			[0, 0, 0],
			[0, 5.5e4, 6.4e4],
			[0, 6.4e4, 1.2e7]
		],
		helRate: 0.5, // [Hz/s]
		rudderRate: 5, // [degree/s]
		maxPropRot: 210, // [RPM]
		maxTorque: 400 // [N.m]
	})
	const appDispatch = useContext(DispatchContext)
	const appState = useContext(StateContext)

	async function handleSubmit(e) {
		e.preventDefault()
		try {
			const ship = JSON.stringify({ obj: obj, propeller: propeller, powerPlant: powerPlant, man: man, data: {} })
			const response = await Axios.post("/create-version", { title, description, ship, token: appState.user.token })

			// Redirect to new post url
			appDispatch({ type: "flashMessage", value: "You created a new ship version.", clearData: [] })
			props.history.push(`post/${response.data}`)
			console.log("New post was created")
		} catch (e) {
			console.log("There was a problem.", e)
		}
	}

	var changeFunc = (newObj, jsonClass) => {
		var chooseFunc = {
			obj: () => {
				setObj(JSON.parse(newObj))
			},
			propeller: () => {
				setPropeller(JSON.parse(newObj))
			},
			powerPlant: () => {
				setPowerPlant(JSON.parse(newObj))
			},
			man: () => {
				setMan(JSON.parse(newObj))
			}
		}

		var str = jsonClass.split("-")
		str = str[1]

		chooseFunc[str]()
		console.log(obj, propeller, powerPlant, man)
		console.log(chooseFunc[str])

		var fileCont = document.getElementById(jsonClass)
		fileCont.innerHTML = ""
		Renderjson.set_show_to_level(1)

		fileCont.appendChild(Renderjson(JSON.parse(newObj)))
	}

	function InsertedObj(prop) {
		console.log(prop)
		return (
			<>
				<ThreeMiniPage ship={obj} height={350} />
				<div className="form-group">
					<div className="row g-3">
						<div className="col-md-4">
							<label htmlFor="post-description" className="text-muted mb-1 d-block">
								<small>Insert Propeller</small>{" "}
								<a href="https://github.com/ferrari212/Platform-Twin-Ship" target="_blank" data-tip="The propeller must be inserted in <br> a JSON Vessel.js format." data-for="helpInfo">
									<i className="fa fa-question-circle"></i>
								</a>
							</label>
							<InputJSON changeFunc={prop.changeFunc} jsonClass={"render-propeller"} />
						</div>
						<div className="col-md-4">
							<label htmlFor="post-description" className="text-muted mb-1 d-block">
								<small>Insert Power Plant</small>{" "}
								<a href="https://github.com/ferrari212/Platform-Twin-Ship" target="_blank" data-tip="The power plant must be inserted in <br> a JSON Vessel.js format." data-for="helpInfo">
									<i className="fa fa-question-circle"></i>
								</a>
							</label>
							<InputJSON changeFunc={prop.changeFunc} jsonClass={"render-powerPlant"} />
						</div>
						<div className="col-md-4">
							<label htmlFor="post-description" className="text-muted mb-1 d-block">
								<small>Insert Maneuvering File</small>{" "}
								<a href="https://github.com/ferrari212/Platform-Twin-Ship" target="_blank" data-tip="The power plant must be inserted in <br> a JSON Vessel.js format." data-for="helpInfo">
									<i className="fa fa-question-circle"></i>
								</a>
							</label>
							<InputJSON changeFunc={prop.changeFunc} jsonClass={"render-man"} />
						</div>
					</div>
				</div>
				<ReactTooltip id="helpInfo" effect="solid" type="info" className="custom-tooptip" multiline={true} />
			</>
		)
	}

	return (
		<Page title="Create New Post">
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="post-title" className="text-muted mb-1">
						<small>Title</small>
					</label>
					<input onChange={e => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="Insert project name" autoComplete="off" />
				</div>

				<div className="form-group">
					<label htmlFor="post-description" className="text-muted mb-1 d-block">
						<small>Description</small>
					</label>
					<textarea onChange={e => setDescription(e.target.value)} name="description" id="post-description" className="description-content tall-textarea form-control form-control-sm" type="text" placeholder="Insert project description"></textarea>
				</div>

				<div className="form-group">
					<label htmlFor="post-description" className="text-muted mb-1 d-block">
						<small>Insert Obj model JSON Ship File</small>
					</label>
					<InputJSON changeFunc={changeFunc} jsonClass={"render-obj"} />
				</div>

				<div id="render-obj" />

				<div className="form-group">{obj ? <InsertedObj changeFunc={changeFunc} /> : <UpLoadCanvas />}</div>

				<div className="row g-3">
					<div className="col-md-4">
						<div id="render-propeller" />
					</div>
					<div className="col-md-4">
						<div id="render-powerPlant" />
					</div>
					<div className="col-md-4">
						<div id="render-man" />
					</div>
				</div>

				<button className="btn btn-primary">Create New Version</button>
			</form>
		</Page>
	)
}

export default withRouter(CreatePost)
