import React, { useEffect, useContext } from "react"
import DispatchContext from "../DispatchContext"

function InsertState() {
	const appDispatch = useContext(DispatchContext)

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
		<>
			<div className="search-overlay">
				<div className="search-overlay-top shadow-sm">
					<div className="container container--narrow">
						<label htmlFor="live-search-field" className="search-overlay-icon">
							<i className="fas fa-search"></i>
						</label>
						<input autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
						<span onClick={() => appDispatch({ type: "closeInsertState" })} className="close-live-search">
							<i className="fas fa-times-circle"></i>
						</span>
					</div>
				</div>

				<div className="search-overlay-bottom">
					<div className="container container--narrow py-3">
						<div className="live-search-results live-search-results--visible">
							<div className="list-group shadow-sm">
								<div className="list-group-item active">
									<strong>InsertState Results</strong> (3 items found)
								</div>
								<a href="#" className="list-group-item list-group-item-action">
									<img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #1</strong>
									<span className="text-muted small">by brad on 2/10/2020 </span>
								</a>
								<a href="#" className="list-group-item list-group-item-action">
									<img className="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128" /> <strong>Example Post #2</strong>
									<span className="text-muted small">by barksalot on 2/10/2020 </span>
								</a>
								<a href="#" className="list-group-item list-group-item-action">
									<img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #3</strong>
									<span className="text-muted small">by brad on 2/10/2020 </span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default InsertState
