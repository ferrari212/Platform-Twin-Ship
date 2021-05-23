import React from "react"
import { Button } from "react-bootstrap"
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

class GuiTwinShip extends React.Component {
	constructor(props) {
		super(props)
		this.taticalDiameter = props.taticalDiameter
		this.advance = props.advance
		this.state = {
			recorder: false,
			taticalDiameter: props.taticalDiameter,
			advance: props.advance
		}
	}

	componentDidMount() {}

	shouldComponentUpdate(nextProps, nextState) {
		if (!nextState) {
			return false
		}
		return nextProps.taticalDiameter !== this.state.taticalDiameter
	}

	componentDidUpdate(nextProps, nextState) {
		this.setState(() => {
			return {
				taticalDiameter: nextProps.taticalDiameter,
				advance: nextProps.advance
			}
		})
	}

	// handleChange = e => {
	// 	e.preventDefault()
	// 	this.recorder = !this.recorder
	// 	this.setState(() => {
	// 		return {
	// 			recorder: this.recorder
	// 		}
	// 	})
	// 	this.props.setRecorderView()
	// 	// this.props.showGLTF(this.recorder)
	// }

	render() {
		return (
			<Wrapper>
				<table style={{ marginTop: 10 }} className="table table-dark">
					<tbody>
						{/* <tr>
							<td>Display IMO</td>
							<td colSpan={2}>
								<Button variant="btn btn-sm btn-success mr-2 success" onClick={this.handleChange}>
									{this.state.recorder ? "Playing…" : "Show Recorder"}
								</Button>
							</td>
						</tr> */}
						<tr>
							<td>Tatical Diameter</td>
							<td>{parseFloat(this.state.taticalDiameter).toFixed(2)}</td>
							<td>m</td>
						</tr>
						<tr>
							<td>Advance</td>
							<td>{parseFloat(this.state.advance).toFixed(2)}</td>
							<td>m</td>
						</tr>
					</tbody>
				</table>
			</Wrapper>
		)
	}
}

export default GuiTwinShip
