import React, { Component } from "react"

class InputJSON extends Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		// Read file from user
		this.handleChangeFile = file => {
			var handleFile = e => {
				const content = e.target.result

				// You can set content in state and show it in render.
				this.props.changeFunc(content, this.props.jsonClass)
			}

			if (file != undefined) {
				let fileData = new FileReader()
				fileData.onloadend = handleFile

				fileData.readAsText(file)
			}
		}
	}

	render() {
		return (
			<div className="input-group mb-3 text-left">
				<label className="input-group-text col-md-12 " htmlFor="file-input">
					<input type="file" className="form-control pb-5" accept=".json" onChange={e => this.handleChangeFile(e.target.files[0])} />
				</label>
			</div>
		)
	}
}

export default InputJSON
