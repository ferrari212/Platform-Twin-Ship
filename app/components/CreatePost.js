import React, { useEffect, useState, useContext } from "react"
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
	const [ship, setShip] = useState()
	const appDispatch = useContext(DispatchContext)
	const appState = useContext(StateContext)

	async function handleSubmit(e) {
		e.preventDefault()
		try {
			// const response = await Axios.post("/create-post", { title, body, token: appState.user.token })
			const response = await Axios.post("/create-post", { title, description, ship, token: appState.user.token })

			// Redirect to new post url
			appDispatch({ type: "flashMessage", value: "You created a new ship version.", clearData: [] })
			props.history.push(`post/${response.data}`)
			console.log("New post was created")
		} catch (e) {
			console.log("There was a problem.", e)
		}
	}

	var changeShip = newShip => {
		setShip(newShip)

		var fileCont = document.getElementById("render-json")
		fileCont.innerHTML = ""
		Renderjson.set_show_to_level(1)

		fileCont.appendChild(Renderjson(JSON.parse(newShip)))
	}

	return (
		<Page title="Create New Post">
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="post-title" className="text-muted mb-1">
						<small>Title</small>
					</label>
					<input onChange={e => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
				</div>

				<div className="form-group">
					<label htmlFor="post-description" className="text-muted mb-1 d-block">
						<small>Description</small>
					</label>
					<textarea onChange={e => setDescription(e.target.value)} name="description" id="post-description" className="description-content tall-textarea form-control form-control-sm" type="text"></textarea>
				</div>

				<div className="form-group">
					<label htmlFor="post-description" className="text-muted mb-1 d-block">
						<small>Insert JSON Ship File</small>
					</label>
					<InputJSON changeShip={changeShip} />
				</div>

				<div className="form-group">{ship ? <ThreeMiniPage ship={ship} height={350} /> : <UpLoadCanvas />}</div>
				<div id="render-json" />

				<button className="btn btn-primary">Create New Version</button>
			</form>
		</Page>
	)
}

export default withRouter(CreatePost)
