import React, { useState } from "react"
import Page from "./Page"
import Axios from "axios"

import Image1 from "../images/picture1.jpg"
import Image2 from "../images/picture2.jpg"
import Image3 from "../images/picture3.jpg"

function HomeGuest() {
	const [username, setUsername] = useState()
	const [email, setEmail] = useState()
	const [password, setPassword] = useState()

	async function handleSubmit(e) {
		e.preventDefault()
		try {
			await Axios.post("/register", { username, email, password })
			console.log(`User ${username} was successfully created.`)
		} catch (e) {
			console.log(`There was an error creating user ${username}.`)
		}
	}

	return (
		<Page title="Welcome" wide={true}>
			<div className="row align-items-center">
				<div className="col-lg-7 py-3 py-md-0">
					<h1 className="display-4 text-center ">Life Cycle Platform</h1>
					<div className="position-relative">
						<div className="text-center home-images-transition-1">
							<img src={Image1} className="rounded border border-dark" alt="" height="300px" width="550px" />
							<p className="lead text-muted">Through concept....</p>
						</div>
						<div className="text-center home-images-transition-2">
							<img src={Image2} className="rounded border border-dark" alt="" height="300px" width="550px" />
							<p className="lead text-muted">...to simulation...</p>
						</div>
						<div className="text-center home-images-transition-3">
							<img src={Image3} className="rounded border border-dark" alt="" height="300px" width="550px" />
							<p className="lead text-muted">...and real life.</p>
						</div>
					</div>
				</div>
				<div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<label htmlFor="username-register" className="text-muted mb-1">
								<small>Username</small>
							</label>
							<input onChange={e => setUsername(e.target.value)} id="username-register" name="username" className="form-control" type="text" placeholder="Username" autoComplete="off" />
						</div>
						<div className="form-group">
							<label htmlFor="email-register" className="text-muted mb-1">
								<small>Email</small>
							</label>
							<input onChange={e => setEmail(e.target.value)} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
						</div>
						<div className="form-group">
							<label htmlFor="password-register" className="text-muted mb-1">
								<small>Password (capital letter and number included)</small>
							</label>
							<input onChange={e => setPassword(e.target.value)} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
						</div>
						<button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
							Sign up for TwinShipPlatform
						</button>
					</form>
				</div>
			</div>
		</Page>
	)
}

export default HomeGuest
