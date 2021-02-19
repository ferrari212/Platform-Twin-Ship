import React, { useState, useReducer, useEffect, Component, Suspense } from "react"
import ReactDOM from "react-dom"
import { useImmerReducer } from "use-immer"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import Axios from "axios"

Axios.defaults.baseURL = process.env.BACKENDURL || "https://platform-twin-ship.herokuapp.com"

import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

// My coponents
import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Home from "./components/Home"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
const CreatePost = React.lazy(() => import("./components/CreatePost"))
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"))
const ThreeModelRayCaster = React.lazy(() => import("./components/ThreeComponents/ThreeModelRayCaster"))
import FlashMessages from "./components/FlashMessages"
import Profile from "./components/Profile"
import EditPost from "./components/EditPost"
import NotFound from "./components/NotFound"
import LoadingDotsIcon from "./components/LoadingDotsIcon"

function Main() {
	const initialState = {
		loggedIn: Boolean(localStorage.getItem("complexappToken")),
		flashMessages: [],
		user: {
			token: localStorage.getItem("complexappToken"),
			username: localStorage.getItem("complexappUsername"),
			avatar: localStorage.getItem("complexappAvatar"),
			versions: [],
			shipId: 0,
			lifeCycle: localStorage.getItem("complexappShipLifeCycle"),
			method: localStorage.getItem("complexappShipMethod")
		}
	}

	function ourReducer(draft, action) {
		switch (action.type) {
			case "login":
				draft.loggedIn = true
				draft.user = action.data
				return

			case "logout":
				draft.loggedIn = false
				return

			case "changeShip":
				draft.user.shipId = action.shipId
				return

			case "setVersion":
				draft.user.versions = action.data
				return

			case "flashMessage":
				draft.flashMessages.push(action.value)
				draft.user.versions = action.clearData
				return

			case "setAnalysis":
				if (action.command) {
					draft.user.method = "analyse"
				} else {
					draft.user.method = "simulate"
				}
				return
			default:
				return
		}
	}

	const [state, dispatch] = useImmerReducer(ourReducer, initialState)

	useEffect(() => {
		if (state.loggedIn) {
			localStorage.setItem("complexappToken", state.user.token)
			localStorage.setItem("complexappUsername", state.user.username)
			localStorage.setItem("complexappAvatar", state.user.avatar)
			// localStorage.setItem("complexappVersions", state.user.versions)
			localStorage.setItem("complexappShipIndex", state.user.shipId)
			localStorage.setItem("complexappShipLifeCycle", state.user.lifeCycle)
			localStorage.setItem("complexappShipMethod", state.user.method)

			async function getVersions(component) {
				const ourRequest = Axios.CancelToken.source()

				try {
					const versions = await Axios.get(`/profile/${component.username.toLowerCase()}/posts`, { cancelToken: ourRequest.token })
					// console.log(versions)
					// debugger

					dispatch({ type: "setVersion", data: versions.data })
				} catch (e) {
					console.log("There was a problem.", e)
				}
			}

			if (state.user.versions.length === 0) getVersions(state.user)
		} else {
			localStorage.removeItem("complexappToken")
			localStorage.removeItem("complexappUsername")
			localStorage.removeItem("complexappAvatar")
			// localStorage.removeItem("complexappVersions")
			localStorage.removeItem("complexappShipIndex")
			localStorage.removeItem("complexappShipLifeCycle")
			localStorage.removeItem("complexappShipMethod")
		}
	}, [state.loggedIn, state.user.versions])

	return (
		<StateContext.Provider value={state}>
			<DispatchContext.Provider value={dispatch}>
				<BrowserRouter>
					<FlashMessages messages={state.flashMessages} />
					<Header />
					<Suspense fallback={<LoadingDotsIcon></LoadingDotsIcon>}>
						<Switch>
							<Route path="/three-model/:username">{state.user.versions.length > 0 ? <ThreeModelRayCaster user={state.user} /> : ""}</Route>
							<Route path="/profile/:username">
								<Profile />
							</Route>
							<Route path="/" exact>
								{state.loggedIn ? <Home /> : <HomeGuest />}
							</Route>
							<Route path="/post/:id" exact>
								<ViewSinglePost />
							</Route>
							<Route path="/post/:id/edit" exact>
								<EditPost />
							</Route>
							<Route path="/create-version">
								<CreatePost />
							</Route>
							<Route path="/about-us">
								<About />
							</Route>
							<Route path="/terms">
								<Terms />
							</Route>
							<Route>
								<NotFound />
							</Route>
						</Switch>
					</Suspense>
					<Footer />
				</BrowserRouter>
			</DispatchContext.Provider>
		</StateContext.Provider>
	)
}

ReactDOM.render(<Main />, document.querySelector("#app"))

if (module.hot) {
	module.hot.accept()
}
