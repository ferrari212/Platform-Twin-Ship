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

const BoxYellow = styled.section`
	height: 20px;
	width: 20px;
	margin-bottom: 15px;
	border: 1px solid black;
	background-color: yellow;
`

const BoxRed = styled.section`
	height: 20px;
	width: 20px;
	margin-bottom: 15px;
	border: 1px solid black;
	background-color: white;
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
		// this.taticalDiameter = props.taticalDiameter
		// this.advance = props.advance
		// this.state = {
		// 	recorder: false,
		// 	taticalDiameter: props.taticalDiameter,
		// 	advance: props.advance
		// }
	}

	// componentDidMount() {}

	// shouldComponentUpdate(nextProps, nextState) {
	// 	if (!nextState) {
	// 		return false
	// 	}
	// 	return nextProps.taticalDiameter !== this.state.taticalDiameter
	// }

	// componentDidUpdate(nextProps, nextState) {
	// 	this.setState(() => {
	// 		return {
	// 			taticalDiameter: nextProps.taticalDiameter,
	// 			advance: nextProps.advance
	// 		}
	// 	})
	// }

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
						<tr>
							<td>Scale Dist.</td>
							<td>1:10</td>
						</tr>
						<tr>
							<td>Scale Time</td>
							<td>100x</td>
						</tr>
						<tr>
							<td>Real Track</td>
							<td>
								<BoxYellow></BoxYellow>
							</td>
						</tr>
						<tr>
							<td>Calc. Track</td>
							<td>
								<BoxRed></BoxRed>
							</td>
						</tr>
					</tbody>
				</table>
			</Wrapper>
		)
	}
}

export default GuiTwinShip
