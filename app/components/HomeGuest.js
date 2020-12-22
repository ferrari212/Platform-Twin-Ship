import React, { useState } from "react"
import Page from "./Page"
import Axios from "axios"

import Image1 from "../images/Gunnerus_starboard_su.jpg"
import Image2 from "../images/Gunnerus.jpg"

function HomeGuest() {
	const [username, setUsername] = useState()
	const [email, setEmail] = useState()
	const [password, setPassword] = useState()

	async function handleSubmit(e) {
		e.preventDefault()
		try {
			await Axios.post("/register", { username, email, password })
			console.log("User was successfully created.")
		} catch (e) {
			console.log("User was successfully created.")
			console.log("There was an error.")
		}
	}

	return (
		<Page title="Welcome" wide={true}>
			<div className="row align-items-center">
				<div className="col-lg-7 py-3 py-md-0">
					<h1 className="display-4 text-center ">Life Cycle Platform</h1>
					<div className="position-relative">
						<div className="text-center home-images-transition-1">
							<img src={Image1} className="rounded-lg" alt="" height="300px" width="450px" />
							<p className="lead text-muted">From concept</p>
						</div>
						<div className="text-center home-images-transition-2">
							<img src={Image2} className="rounded-lg" alt="" height="300px" width="450px" />
							<p className="lead text-muted">To design.</p>
						</div>
					</div>
				</div>
				<div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<label htmlFor="username-register" className="text-muted mb-1">
								<small>Username</small>
							</label>
							<input onChange={e => setUsername(e.target.value)} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
						</div>
						<div className="form-group">
							<label htmlFor="email-register" className="text-muted mb-1">
								<small>Email</small>
							</label>
							<input onChange={e => setEmail(e.target.value)} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
						</div>
						<div className="form-group">
							<label htmlFor="password-register" className="text-muted mb-1">
								<small>Password</small>
							</label>
							<input onChange={e => setPassword(e.target.value)} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
						</div>
						<button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
							Sign up htmlFor ComplexApp
						</button>
					</form>
				</div>
			</div>
		</Page>
	)
}

export default HomeGuest