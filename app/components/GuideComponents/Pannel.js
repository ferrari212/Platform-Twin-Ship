import React from "react"
// import { Form } from "react-bootstrap"
import styled from "styled-components"

const PannelWrapper = styled.section`
	position: absolute;
	top: 15vh;
	left: 5vw;
	text-align: center;
	z-index: 999;
`

const PlayerWrapper = styled.section`
	display: flex;
	background: #ccc;
	justify-content: center;
	align-items: center;
	height: 100vh;
`

class Pannel extends React.Component {
	constructor(props) {
		super(props)
		this.get = props.get
		this.set = props.set
		this.state = { mvr: undefined }
		console.log(this)
	}

	componentDidMount() {
		this.startAnimationLoop()
		// this.setState(() => {
		// 	return {
		// 		mvr: this.get()
		// 	}
		// })
		// console.log(this.get)
	}

	componentWillUnmount() {
		delete this.startAnimationLoop
		// Delete the keyDown later on @ferrari212
	}

	startAnimationLoop = () => {
		this.setState(() => {
			return {
				mvr: this.get()
			}
		})
		this.requestID = window.requestAnimationFrame(this.startAnimationLoop)
	}

	render() {
		return (
			<div ref={ref => (this.mount = ref)}>
				<PannelWrapper>
					<table className="unselectable">
						<tbody>
							<tr valign="top">
								<td style={{ color: "#fff", backgroundColor: "#000", width: 100, border: "1px solid #fff" }}>
									<p style={{ fontSize: 10 }}>FWD. Speed</p>
									<h2>{Boolean(this.state.mvr) ? (this.state.mvr.V.u * 1.943844).toFixed(1) : 0.0}</h2>
									<p style={{ fontSize: 10 }}>knots</p>
								</td>
								<td style={{ color: "#fff", backgroundColor: "#000", width: 100, border: "1px solid #fff" }}>
									<p style={{ fontSize: 10 }}>Prop. Angle</p>
									<h2>{Boolean(this.state.mvr) ? this.state.mvr.rudderAngle.toFixed(1) : 0.0}</h2>
									<p style={{ fontSize: 10 }}>degree</p>
								</td>
								<td style={{ color: "#fff", backgroundColor: "#000", width: 100, border: "1px solid #fff" }}>
									<p style={{ fontSize: 10 }}>Prop. Rotation</p>
									<h2>{Boolean(this.state.mvr) ? (60 * this.state.mvr.n).toFixed(0) : 0}</h2>
									<p style={{ fontSize: 10 }}>RPM</p>
								</td>
							</tr>
						</tbody>
					</table>
				</PannelWrapper>
			</div>
		)
	}
}

export default Pannel
