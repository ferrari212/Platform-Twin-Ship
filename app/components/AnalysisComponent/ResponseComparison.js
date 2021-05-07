import React from "react"

import DataChartStructure from "../../snippets/DataChartStructure"
import LineChart from "../ChartComponents/LineChart"

function ResponseComparison(prop) {
	function TestComponent() {
		try {
			// Define Models
			var currentState = prop.currentState
			var newState = prop.newState

			var dataHeave = new DataChartStructure()
			var dataRoll = new DataChartStructure()
			var dataPitch = new DataChartStructure()
			var dataHeaveACC = new DataChartStructure()
			var dataRollACC = new DataChartStructure()
			var dataPitchACC = new DataChartStructure()

			var dataSetHeave, dataSetRoll, dataSetPitch, dataSetHeaveACC, dataSetRollACC, dataSetPitchACC
			dataSetHeave = []
			dataSetRoll = []
			dataSetPitch = []
			dataSetHeaveACC = []
			dataSetRollACC = []
			dataSetPitchACC = []

			// Vessel.js indexes
			const VESSELIND = ["heaveAmp", "rollAmp", "pitchAmp", "heaveAcc", "pitchAcc"]

			var maxObj = {
				current: {
					heaveAmp: { angle: "undefined", value: 0, frequency: "undefined" },
					rollAmp: { angle: "undefined", value: 0, frequency: "undefined" },
					pitchAmp: { angle: "undefined", value: 0, frequency: "undefined" },
					heaveAcc: { angle: "undefined", value: 0, frequency: "undefined" },
					pitchAcc: { angle: "undefined", value: 0, frequency: "undefined" }
				},
				newState: {
					heaveAmp: { angle: "undefined", value: 0, frequency: "undefined" },
					rollAmp: { angle: "undefined", value: 0, frequency: "undefined" },
					pitchAmp: { angle: "undefined", value: 0, frequency: "undefined" },
					heaveAcc: { angle: "undefined", value: 0, frequency: "undefined" },
					pitchAcc: { angle: "undefined", value: 0, frequency: "undefined" }
				}
			}

			currentState.wavMo.setSpeed(0)
			currentState.wave.setWaveDef(1, 1, 1)
			newState.wavMo.setSpeed(0)
			newState.wave.setWaveDef(1, 1, 1)

			var freq = 0.2
			var maxFreq = 3
			var frequencies = []
			var freqVariation = 0.1

			do {
				frequencies.push(freq)
				freq = freq + freqVariation
			} while (freq <= maxFreq)

			// Define the wave angles 90 is side waves and 180 is head waves
			var colors = ["rgba(41, 85, 115, 0.6)", "rgba(1, 28, 64, 0.6)", "rgba(115, 69, 41, 0.6)", "rgba(166, 13, 13, 0.6)", "rgba(138, 103, 83, 0.6)", "rgba(166, 13, 13, 0.6)", "rgba(205, 135, 68, 0.6)"]

			dataSetHeave.push(dataHeave.pushDataSet(`Current 90°`, colors[0]))
			dataSetHeave.push(dataHeave.pushDataSet(`Current 180°`, colors[1]))
			dataSetRoll.push(dataRoll.pushDataSet(`Current 90°`, colors[0]))
			dataSetPitch.push(dataPitch.pushDataSet(`Current 180`, colors[1]))
			dataSetHeaveACC.push(dataHeaveACC.pushDataSet(`Current 90°`, colors[0]))
			dataSetHeaveACC.push(dataHeaveACC.pushDataSet(`Current 180°`, colors[1]))
			dataSetRollACC.push(dataRollACC.pushDataSet(`Current 90°`, colors[0]))
			dataSetPitchACC.push(dataPitchACC.pushDataSet(`Current 90°`, colors[0]))

			dataSetHeave.push(dataHeave.pushDataSet(`New 90°`, colors[2]))
			dataSetHeave.push(dataHeave.pushDataSet(`New 180°`, colors[3]))
			dataSetRoll.push(dataRoll.pushDataSet(`New 90°`, colors[2]))
			dataSetPitch.push(dataPitch.pushDataSet(`New 180°`, colors[3]))
			dataSetHeaveACC.push(dataHeaveACC.pushDataSet(`New 90°`, colors[2]))
			dataSetHeaveACC.push(dataHeaveACC.pushDataSet(`New 180°`, colors[3]))
			dataSetRollACC.push(dataRollACC.pushDataSet(`New 90°`, colors[2]))
			dataSetPitchACC.push(dataPitchACC.pushDataSet(`New 90°`, colors[2]))

			function setMaxValue(max, resp, i, fq, an) {
				if (resp[i] > max[i].value) {
					max[i].value = resp[[i]]
					max[i].angle = an
					max[i].frequency = fq
				}
			}

			frequencies.forEach(freq => {
				var currentResponse90 = currentState.getWaveResponse(freq, 1, 90)
				var newResponse90 = newState.getWaveResponse(freq, 1, 90)
				var currentResponse180 = currentState.getWaveResponse(freq, 1, 180)
				var newResponse180 = newState.getWaveResponse(freq, 1, 180)

				VESSELIND.forEach(i => {
					setMaxValue(maxObj.current, currentResponse90, i, freq, 90)
					setMaxValue(maxObj.current, currentResponse180, i, freq, 180)
					setMaxValue(maxObj.newState, newResponse90, i, freq, 90)
					setMaxValue(maxObj.newState, newResponse180, i, freq, 180)
				})

				dataSetHeave[0].push(currentResponse90["heaveAmp"].toFixed(3))
				dataSetHeave[1].push(currentResponse180["heaveAmp"].toFixed(3))
				dataSetHeave[2].push(newResponse90["heaveAmp"].toFixed(3))
				dataSetHeave[3].push(newResponse180["heaveAmp"].toFixed(3))

				dataSetRoll[0].push(currentResponse90["rollAmp"].toFixed(3))
				dataSetRoll[1].push(newResponse90["rollAmp"].toFixed(3))

				dataSetPitch[0].push(currentResponse180["pitchAmp"].toFixed(4))
				dataSetPitch[1].push(newResponse180["pitchAmp"].toFixed(4))

				dataSetHeaveACC[0].push(currentResponse90["heaveAcc"].toFixed(3))
				dataSetHeaveACC[1].push(currentResponse180["heaveAcc"].toFixed(3))
				dataSetHeaveACC[2].push(newResponse90["heaveAcc"].toFixed(3))
				dataSetHeaveACC[3].push(newResponse180["heaveAcc"].toFixed(3))

				dataSetRollACC[0].push(currentResponse90["rollAmp"].toFixed(3))
				dataSetRollACC[1].push(newResponse90["rollAmp"].toFixed(3))

				dataSetPitchACC[0].push(currentResponse180["pitchAcc"].toFixed(3))
				dataSetPitchACC[1].push(newResponse180["pitchAcc"].toFixed(3))
			})

			frequencies = frequencies.map(freq => freq.toFixed(2))
			dataHeave.setLabels(frequencies)
			dataRoll.setLabels(frequencies)
			dataPitch.setLabels(frequencies)
			dataHeaveACC.setLabels(frequencies)
			dataRollACC.setLabels(frequencies)
			dataPitchACC.setLabels(frequencies)

			console.log(maxObj)

			return (
				<div className="container-fluid align-items-center p-3">
					<div className="row">
						<div className="col-lg-12  text-center ">
							<LineChart chartData={dataHeave.chartData} textTitle="Heave Amplitude" xLabel="Frequency (Hz)" yLabel="|A|/(wave amplitude)" legendPosition="top" />
						</div>
					</div>
					<div className="row">
						<div className="col-lg-12  text-center ">
							<LineChart chartData={dataRoll.chartData} textTitle="Roll Amplitude" xLabel="Frequency (Hz)" yLabel="|A|/(wave amplitude)" legendPosition="top" />
						</div>
					</div>
					<div className="row">
						<div className="col-lg-12  text-center ">
							<LineChart chartData={dataPitch.chartData} textTitle="Pitch Amplitude" xLabel="Frequency (Hz)" yLabel="|A|/(wave amplitude)" legendPosition="top" />
						</div>
					</div>
					<div className="row">
						<div className="col-lg-12  text-center ">
							<LineChart chartData={dataHeaveACC.chartData} textTitle="Heave Acc. Amplitude" xLabel="Frequency (Hz)" yLabel="|A|/(wave amplitude)" legendPosition="top" />
						</div>
					</div>
					<div className="row">
						<div className="col-lg-12  text-center ">
							<LineChart chartData={dataRollACC.chartData} textTitle="Roll Acc. Amplitude" xLabel="Frequency (Hz)" yLabel="|A|/(wave amplitude)" legendPosition="top" />
						</div>
					</div>
					<div className="row">
						<div className="col-lg-12  text-center ">
							<LineChart chartData={dataPitchACC.chartData} textTitle="Pitch Acc. Amplitude" xLabel="Frequency (Hz)" yLabel="|A|/(wave amplitude)" legendPosition="top" />
						</div>
					</div>
					<br />
					<div className="row align-items-center text-center justify-content-center">
						<h4>Response comparison</h4>
					</div>
					<div className="row align-items-center text-center justify-content-center">
						<div className="col-lg-8 ">
							<table className="table table-hover">
								<thead className="thead-dark">
									<tr>
										<th scope="col">Variation</th>
										<th scope="col">Current max Angle.</th>
										<th scope="col">Current Frequency (hz)</th>
										<th scope="col">Current Value</th>
										<th scope="col">New Angle Cons.</th>
										<th scope="col">New Frequency (hz)</th>
										<th scope="col">New Value</th>
										<th scope="col">Variation</th>
									</tr>
								</thead>
								<tbody>
									<tr key={1}>
										<td className="align-middle">Heave Amp.</td>
										<td className="align-middle">{maxObj.current.heaveAmp.angle.toFixed(0)}&#176;</td>
										<td className="align-middle">{maxObj.current.heaveAmp.frequency.toFixed(2)}</td>
										<td className="align-middle">{maxObj.current.heaveAmp.value.toFixed(2)}</td>
										<td className="align-middle">{maxObj.newState.heaveAmp.angle.toFixed(0)}&#176;</td>
										<td className="align-middle">{maxObj.newState.heaveAmp.frequency.toFixed(2)}</td>
										<td className="align-middle">{maxObj.newState.heaveAmp.value.toFixed(2)}</td>
										<td className="align-middle" style={{ color: maxObj.newState.heaveAmp.value < maxObj.current.heaveAmp.value ? "#295773" : "#A60D0D" }}>
											{((100 * (maxObj.newState.heaveAmp.value - maxObj.current.heaveAmp.value)) / maxObj.current.heaveAmp.value).toFixed(2)}%
										</td>
									</tr>
									<tr key={2}>
										<td className="align-middle">Roll Amp.</td>
										<td className="align-middle">{maxObj.current.rollAmp.angle.toFixed(0)}&#176;</td>
										<td className="align-middle">{maxObj.current.rollAmp.frequency.toFixed(2)}</td>
										<td className="align-middle">{maxObj.current.rollAmp.value.toFixed(2)}</td>
										<td className="align-middle">{maxObj.newState.rollAmp.angle.toFixed(0)}&#176;</td>
										<td className="align-middle">{maxObj.newState.rollAmp.frequency.toFixed(2)}</td>
										<td className="align-middle">{maxObj.newState.rollAmp.value.toFixed(2)}</td>
										<td className="align-middle" style={{ color: maxObj.newState.rollAmp.value < maxObj.current.rollAmp.value ? "#295773" : "#A60D0D" }}>
											{((100 * (maxObj.newState.rollAmp.value - maxObj.current.rollAmp.value)) / maxObj.current.rollAmp.value).toFixed(2)}%
										</td>
									</tr>
									<tr key={3}>
										<td className="align-middle">Pitch Amp.</td>
										<td className="align-middle">{maxObj.current.pitchAmp.angle.toFixed(0)}&#176;</td>
										<td className="align-middle">{maxObj.current.pitchAmp.frequency.toFixed(2)}</td>
										<td className="align-middle">{maxObj.current.pitchAmp.value.toFixed(2)}</td>
										<td className="align-middle">{maxObj.newState.pitchAmp.angle.toFixed(0)}&#176;</td>
										<td className="align-middle">{maxObj.newState.pitchAmp.frequency.toFixed(2)}</td>
										<td className="align-middle">{maxObj.newState.pitchAmp.value.toFixed(2)}</td>
										<td className="align-middle" style={{ color: maxObj.newState.pitchAmp.value < maxObj.current.pitchAmp.value ? "#295773" : "#A60D0D" }}>
											{((100 * (maxObj.newState.pitchAmp.value - maxObj.current.pitchAmp.value)) / maxObj.current.pitchAmp.value).toFixed(2)}%
										</td>
									</tr>
									<tr key={4}>
										<td className="align-middle">Heave Acc.</td>
										<td className="align-middle">{maxObj.current.heaveAcc.angle.toFixed(0)}&#176;</td>
										<td className="align-middle">{maxObj.current.heaveAcc.frequency.toFixed(2)}</td>
										<td className="align-middle">{maxObj.current.heaveAcc.value.toFixed(2)}</td>
										<td className="align-middle">{maxObj.newState.heaveAcc.angle.toFixed(0)}&#176;</td>
										<td className="align-middle">{maxObj.newState.heaveAcc.frequency.toFixed(2)}</td>
										<td className="align-middle">{maxObj.newState.heaveAcc.value.toFixed(2)}</td>
										<td className="align-middle" style={{ color: maxObj.newState.heaveAcc.value < maxObj.current.heaveAcc.value ? "#295773" : "#A60D0D" }}>
											{((100 * (maxObj.newState.heaveAcc.value - maxObj.current.heaveAcc.value)) / maxObj.current.heaveAcc.value).toFixed(2)}%
										</td>
									</tr>
									<tr key={5}>
										<td className="align-middle">Pitch Acc.</td>
										<td className="align-middle">{maxObj.current.pitchAcc.angle.toFixed(0)}&#176;</td>
										<td className="align-middle">{maxObj.current.pitchAcc.frequency.toFixed(2)}</td>
										<td className="align-middle">{maxObj.current.pitchAcc.value.toFixed(2)}</td>
										<td className="align-middle">{maxObj.newState.pitchAcc.angle.toFixed(0)}&#176;</td>
										<td className="align-middle">{maxObj.newState.pitchAcc.frequency.toFixed(2)}</td>
										<td className="align-middle">{maxObj.newState.pitchAcc.value.toFixed(2)}</td>
										<td className="align-middle" style={{ color: maxObj.newState.pitchAcc.value < maxObj.current.pitchAcc.value ? "#295773" : "#A60D0D" }}>
											{((100 * (maxObj.newState.pitchAcc.value - maxObj.current.pitchAcc.value)) / maxObj.current.pitchAcc.value).toFixed(2)}%
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)
		} catch (error) {
			console.warn(error)
			return (
				<div className="container-fluid align-items-center p-3">
					<div>Error found: {error}</div>
				</div>
			)
		}
	}

	return <TestComponent />
}

export default ResponseComparison
