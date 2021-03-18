import React, { useState, useReducer, useEffect, Component, Suspense } from "react"
import ReactDOM from "react-dom"
import { useImmerReducer } from "use-immer"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import { CSSTransition } from "react-transition-group"
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
import ThreeSwitch from "./components/ThreeComponents/ThreeSwitch"
import FlashMessages from "./components/FlashMessages"
import Profile from "./components/Profile"
import InsertState from "./components/InsertState"
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
			newState: "",
			shipId: 0,
			lifeCycle: localStorage.getItem("complexappShipLifeCycle"),
			method: localStorage.getItem("complexappShipMethod")
		},
		isInsertStateOpen: false
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
				draft.user.method = "undefined"
				draft.user.newState = ""
				return

			case "setVersion":
				draft.user.versions = action.data
				return

			case "flashMessage":
				draft.flashMessages.push(action.value)
				draft.user.versions = action.clearData
				return

			// Get away with the set analysis and simulation
			// case "setAnalysis":
			// 	debugger
			// 	if (action.status) {
			// 		draft.user.method = "analyse"
			// 	} else {
			// 		// The simulate version must be done
			// 		// draft.user.method = "simulate"
			// 		draft.user.method = "undefined"
			// 	}
			// 	return

			// case "setSimulation":
			// 	if (action.status) {
			// 		draft.user.method = "simulate"
			// 	} else {
			// 		// The simulate version must be done
			// 		// draft.user.method = "simulate"
			// 		draft.user.method = "undefined"
			// 	}
			// 	return

			case "openInsertState":
				draft.isInsertStateOpen = true
				return

			case "closeInsertState":
				draft.user.newState = action.data
				draft.isInsertStateOpen = false
				return

			default:
			case "handleCalculation":
				switch (action.status) {
					case "setAnalysis":
						draft.user.method = "analyse"
						break

					case "setSimulation":
						draft.user.method = "simulate"
						break

					case "closeAnalysis":
						draft.user.method = "undefined"
						break

					default:
						break
				}
		}
	}

	const [state, dispatch] = useImmerReducer(ourReducer, initialState)

	useEffect(() => {
		if (state.loggedIn) {
			localStorage.setItem("complexappToken", state.user.token)
			localStorage.setItem("complexappUsername", state.user.username)
			localStorage.setItem("complexappAvatar", state.user.avatar)
			localStorage.setItem("complexappShipIndex", state.user.shipId)
			localStorage.setItem("complexappShipLifeCycle", state.user.lifeCycle)
			localStorage.setItem("complexappShipMethod", state.user.method)

			async function getVersions(component) {
				const ourRequest = Axios.CancelToken.source()

				try {
					const versions = await Axios.get(`/profile/${component.username.toLowerCase()}/posts`, { cancelToken: ourRequest.token })

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
							<Route path="/three-model/:username">{state.user.versions.length > 0 ? <ThreeSwitch user={state.user} /> : ""}</Route>
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
						<CSSTransition timeout={330} in={state.isInsertStateOpen} classNames="search-overlay" unmountOnExit>
							<div className="search-overlay">
								<Suspense fallback="">
									<InsertState />
								</Suspense>
							</div>
						</CSSTransition>
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
