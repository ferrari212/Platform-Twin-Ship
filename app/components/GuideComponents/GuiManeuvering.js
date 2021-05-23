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

class GuiManeuvering extends React.Component {
	constructor(props) {
		super(props)
		this.taticalDiameter = props.taticalDiameter
		this.advance = props.advance
		this.state = {
			recorder: false,
			taticalDiameter: props.taticalDiameter,
			advance: props.advance,
			len: 1
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
				advance: nextProps.advance,
				len: nextProps.self.ship.structure.hull.attributes.LOA
			}
		})
		debugger
	}

	handleChange = e => {
		e.preventDefault()
		this.recorder = !this.recorder
		this.setState(() => {
			return {
				recorder: this.recorder
			}
		})
		this.props.setRecorderView()
		// this.props.showGLTF(this.recorder)
	}

	render() {
		return (
			<Wrapper>
				<table style={{ marginTop: 10 }} className="table table-dark">
					<tbody>
						<tr>
							<td>Display IMO</td>
							<td colSpan={2}>
								<Button variant="btn btn-sm btn-success mr-2 success" onClick={this.handleChange}>
									{this.state.recorder ? "Playing…" : "Show Recorder"}
								</Button>
							</td>
						</tr>
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
						<tr>
							<td colSpan={2}>Tatical Diameter - Crit.</td>
							<td> {this.state.len * 5 > this.state.taticalDiameter ? <div class="alert-success p-1">Passed</div> : <div class="alert-fail">Fail</div>} </td>
						</tr>
						<tr>
							<td colSpan={2}>Advance - Crit.</td>
							<td> {this.state.len * 4.5 > this.state.advance ? <div class="alert-success p-1">Passed</div> : <div class="alert-fail">Fail</div>} </td>
						</tr>
					</tbody>
				</table>
			</Wrapper>
		)
	}
}

export default GuiManeuvering
