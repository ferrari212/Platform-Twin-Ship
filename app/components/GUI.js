import React from "react"
import { Form } from "react-bootstrap"
import styled from "styled-components"

const Wrapper = styled.section`
	position: absolute;
	top: 15vh;
	right: 5vw;
	background: #212529;
	border-radius: 10px;
`

// 	position: absolute;
// 	top: 15vh;
// 	right: 5vw;
// 	width: 20vw;
// 	background-color: white;
// 	/* border-radius: 5%; */
// 	border-radius: 10px;

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
			<Wrapper>
				<table style={{ marginTop: 10 }} className="table table-dark">
					<tr>
						<td>Show GLTF</td>
						<td>Show GLTF</td>
					</tr>
					<tr>
						<td>Show GLTF</td>
						<td>Show GLTF</td>
					</tr>
				</table>
			</Wrapper>
		)
	}
}

export default GUI
