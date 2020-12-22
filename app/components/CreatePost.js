import React, { useEffect, useState, useContext } from "react"
import Page from "./Page"
import Axios from "axios"
import { withRouter } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
// import { response } from "express"

function CreatePost(props) {
	const [title, setTitle] = useState()
	const [body, setBody] = useState()
	const appDispatch = useContext(DispatchContext)
	const appState = useContext(StateContext)

	async function handleSubmit(e) {
		e.preventDefault()
		try {
			const response = await Axios.post("/create-post", { title, body, token: appState.user.token })

			// Redirect to new post url
			appDispatch({ type: "flashMessage", value: "Congrats, you created a new post." })
			props.history.push(`post/${response.data}`)
			console.log("New post was created")
		} catch (e) {
			console.log("There was a problem.")
			console.warn(e)
		}
	}

	// read file from user
	function readSingleFile(e) {
		var file = e.target.files[0]
		if (!file) {
			return
		}

		var reader = new FileReader()
		reader.onload = function (e) {
			var contents = e.target.result
			//call common function for user files and server files
			useFileData(contents)
		}
		reader.readAsText(file)

		console.log(e)
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
					<label htmlFor="post-body" className="text-muted mb-1 d-block">
						<small>Body Content</small>
					</label>
					<textarea onChange={e => setBody(e)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
				</div>

				<div className="input-group mb-3 text-left">
					<label onChange={e => readSingleFile(e.target.value)} className="input-group-text col-md-12 " htmlFor="file-input">
						<input type="file" className="form-control pb-5" id="file-input"></input>
					</label>
				</div>

				<button className="btn btn-primary">Create New Version</button>
			</form>
		</Page>
	)
}

export default withRouter(CreatePost)
