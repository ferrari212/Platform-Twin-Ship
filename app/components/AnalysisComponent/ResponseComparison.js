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

			frequencies.forEach(freq => {
				var currentResponse90 = currentState.getWaveResponse(freq, 1, 90)
				var newResponse90 = newState.getWaveResponse(freq, 1, 90)
				var currentResponse180 = currentState.getWaveResponse(freq, 1, 180)
				var newResponse180 = newState.getWaveResponse(freq, 1, 180)

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
