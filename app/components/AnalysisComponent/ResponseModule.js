import React from "react"

import DataChartStructure from "../../snippets/DataChartStructure"
import LineChart from "../ChartComponents/LineChart"

function ResponseModule(prop) {
	function TestComponent() {
		try {
			// Define Models
			var models = prop.models
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

			models.wavMo.setSpeed(0)
			models.wave.setWaveDef(1, 1, 1)

			var freq = 0.2
			var maxFreq = 3
			var frequencies = []
			var freqVariation = 0.1

			do {
				frequencies.push(freq)
				freq = freq + freqVariation
			} while (freq <= maxFreq)

			// Define the wave angles 90 is side waves and 180 is head waves
			var angles = [90, 105, 120, 135, 150, 165, 180]

			var possibleColors = ["rgba(41, 85, 115, 0.6)", "rgba(115, 69, 41, 0.6)", "rgba(1, 28, 64, 0.6)", "rgba(64, 37, 1, 0.6)", "rgba(138, 103, 83, 0.6)", "rgba(166, 13, 13, 0.6)", "rgba(205, 135, 68, 0.6)"]

			angles.forEach((angle, index) => {
				var color = possibleColors[index % possibleColors.length]
				dataSetHeave.push(dataHeave.pushDataSet(`${angle}°`, color))
				dataSetRoll.push(dataRoll.pushDataSet(`${angle}°`, color))
				dataSetPitch.push(dataPitch.pushDataSet(`${angle}°`, color))
				dataSetHeaveACC.push(dataHeaveACC.pushDataSet(`${angle}°`, color))
				dataSetRollACC.push(dataRollACC.pushDataSet(`${angle}°`, color))
				dataSetPitchACC.push(dataPitchACC.pushDataSet(`${angle}°`, color))

				frequencies.forEach(freq => {
					var resp = models.getWaveResponse(freq, 1, angle)

					dataSetHeave[index].push(resp["heaveAmp"].toFixed(3))
					dataSetRoll[index].push(resp["rollAmp"].toFixed(3))
					dataSetPitch[index].push(resp["pitchAmp"].toFixed(4))
					dataSetHeaveACC[index].push(resp["heaveAcc"].toFixed(3))
					dataSetRollACC[index].push(resp["rollAmp"].toFixed(3))
					dataSetPitchACC[index].push(resp["pitchAcc"].toFixed(3))
				})
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
			return (
				<div className="container-fluid align-items-center p-3">
					<div>Error found: {error}</div>
				</div>
			)
		}
	}

	return <TestComponent />
}

export default ResponseModule
