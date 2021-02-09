import React, { useState, useContext } from "react"
import Axios from "axios"
import DispatchContext from "../DispatchContext"

function HeaderLoggedOut(props) {
	const appDispatch = useContext(DispatchContext)
	const [username, setUsername] = useState()
	const [password, setPassword] = useState()

	async function handeSubmit(e) {
		e.preventDefault()
		const ourRequest = Axios.CancelToken.source()
		try {
			const response = await Axios.post("/login", { username, password })

			if (response.data) {
				const versions = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token })
				debugger
				response.data = { ...response.data, versions: versions.data, shipId: 0 }

				appDispatch({ type: "login", data: response.data })
			} else {
				console.log(username, password)
				console.log("Incorrect username / password", username, password)
			}
		} catch (e) {
			console.log("Error problem:", e)
		}
	}

	function tryIt(e) {
		setUsername("GunnerusTeste")
		setPassword("GunnerusTeste12345")
	}

	return (
		<form onSubmit={handeSubmit} className="mb-0 pt-2 pt-md-0">
			<div className="row align-items-center">
				<div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
					<input onChange={e => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
				</div>
				<div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
					<input onChange={e => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
				</div>
				<div className="col-md-auto">
					<button className="btn btn-success btn-sm">Sign In</button>
				</div>
				<h4 className="text-white m-1">or</h4>
				<div className="col-md-auto">
					<button onClick={tryIt} className="btn btn-success btn-sm">
						Try It
					</button>
				</div>
			</div>
		</form>
	)
}

export default HeaderLoggedOut
