import React, { useEffect, useState, useContext } from "react"
import { useParams, Link, withRouter } from "react-router-dom"
import Axios from "axios"
import Page from "./Page"
import ThreeMiniPage from "./ThreeComponents/ThreeMiniPage"
import Renderjson from "renderjson"
import LoadingDotsIcon from "./LoadingDotsIcon"
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function ViewSinglePost(props) {
	const appState = useContext(StateContext)
	const appDispatch = useContext(DispatchContext)
	const { id } = useParams()
	const [isLoading, setIsLoading] = useState(true)
	const [post, setPost] = useState()

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source()

		async function fetchPost() {
			try {
				const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
				setPost(response.data)

				setIsLoading(false)

				return response.data
			} catch (e) {
				console.log("There was a problem or the request was cancelled.")
			}
		}
		fetchPost().then(post => {
			var fileCont = document.getElementById("render-json")
			fileCont.innerHTML = ""
			Renderjson.set_show_to_level(2)

			fileCont.appendChild(Renderjson(JSON.parse(post.ship)))
		})
		return () => {
			ourRequest.cancel()
		}
	}, [])

	if (isLoading)
		return (
			<Page title="...">
				<LoadingDotsIcon />
			</Page>
		)

	const date = new Date(post.createdDate)
	const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

	function isOwner() {
		if (appState.loggedIn) {
			return appState.user.username == post.author.username
		}
		return false
	}

	async function deleteHandler(e) {
		e.preventDefault()
		const areYouSure = window.confirm("Do you really want to delete this ship version?")
		if (areYouSure) {
			try {
				const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } })
				if (response.data == "Success") {
					// 1. Display flash message
					appDispatch({ type: "flashMessage", value: "Version was successfully deleted", clearData: [] })

					// 2. Redirec back to the user main page
					props.history.push(`/profile/${appState.user.username}`)
				}
			} catch (e) {
				console.warn("There was a error:", e)
			}
		}
	}

	return (
		<Page title={post.title}>
			<div className="d-flex justify-content-between">
				<h2>{post.title}</h2>
				{isOwner() && (
					<span className="pt-2">
						<Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
							<i className="fas fa-edit"></i>
						</Link>
						<ReactTooltip id="edit" className="custom-tooptip" />{" "}
						<a onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
							<i className="fas fa-trash"></i>
						</a>
						<ReactTooltip id="delete" className="custom-tooptip" />
					</span>
				)}
			</div>

			<p className="text-muted small mb-4">
				<Link to={`/profile/${post.author.username}`}>
					<img className="avatar-tiny" src={post.author.avatar} />
				</Link>
				Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
			</p>

			<div className="description-content">
				<ReactMarkdown source={post.description} allowedTypes={["paragraph", "strong", "emphasis", "text", "heading", "list", "listItem"]} />
				<ThreeMiniPage ship={post.ship} height={350} />
				<div id="render-json" />
			</div>
		</Page>
	)
}

export default withRouter(ViewSinglePost)
