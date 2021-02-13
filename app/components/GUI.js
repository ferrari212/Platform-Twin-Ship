import React from "react"
import { Form } from "react-bootstrap"

class GUI extends React.Component {
	constructor(props) {
		super(props)

		this.checked = false
	}

	handleChange = e => {
		e.preventDefault()
		this.checked = !this.checked
		this.props.showGLTF(this.checked)
	}

	render() {
		return (
			<table className="table table-dark dat-gui-style">
				<tbody>
					<tr>
						<td>Show GLTF</td>
						<td>
							<Form.Check type="checkbox" aria-label="option 1" onClick={this.handleChange} />
						</td>
					</tr>
				</tbody>
			</table>
		)
	}
}

export default GUI
