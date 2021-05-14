import React from "react"
import { Button, ProgressBar } from "react-bootstrap"
import styled from "styled-components"

const Wrapper = styled.section`
	position: absolute;
	top: 15vh;
	right: 5vw;
	width: 300px;
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
		this.recorder = false
	}

	componentDidMount() {
		// this.now = 60
	}

	// componentDidUpdate(prevProps, prevStates) {
	// 	console.log(prevStates)
	// 	this.setState(() => {
	// 		return {
	// 			recorder: this.recorder
	// 		}
	// 	})
	// }

	handleChange = e => {
		e.preventDefault()
		this.recorder = !this.recorder
		console.log(this)
		this.setState(() => {
			return {
				recorder: this.recorder
			}
		})
		this.props.setRecorderView()
		// this.props.showGLTF(this.recorder)
	}

	progressInstance = () => {
		return <ProgressBar now={this.now} label={`${this.now}%`} />
	}

	render() {
		return (
			<Wrapper>
				<table style={{ marginTop: 10 }} className="table table-dark">
					<tbody>
						<tr>
							<td>Display IMO</td>
							<td>
								{
									<Button variant="btn btn-sm btn-success mr-2 success" onClick={this.handleChange}>
										{this.recorder ? "Playing…" : "Show Recorder"}
										{console.log(this)}
									</Button>
								}
							</td>
						</tr>
						<tr>
							<td colSpan="2">
								<ProgressBar now={this.props.i / this.props.maxLen} />
							</td>
						</tr>
					</tbody>
				</table>
			</Wrapper>
		)
	}
}

export default GUI
