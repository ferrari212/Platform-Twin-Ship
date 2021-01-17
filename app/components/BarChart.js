import { createClassFromSpec } from "react-vega"

const spec = {
	width: 400,
	height: 200,
	data: [{ name: "table" }],
	signals: [
		{
			name: "tooltip",
			value: {},
			on: [
				{ events: "rect:mouseover", update: "datum" },
				{ events: "rect:mouseout", update: "{}" }
			]
		}
	],
	scales: [
		{
			name: "xscale",
			type: "band",
			domain: { data: "table", field: "category" },
			range: "width"
		},
		{
			name: "yscale",
			domain: { data: "table", field: "amount" },
			nice: true,
			range: "height"
		}
	],

	axes: [
		{ orient: "bottom", scale: "xscale" },
		{ orient: "left", scale: "yscale" }
	],

	marks: [
		{
			type: "rect",
			from: { data: "table" },
			encode: {
				enter: {
					x: { scale: "xscale", field: "category", offset: 1 },
					width: { scale: "xscale", band: 1, offset: -1 },
					y: { scale: "yscale", field: "amount" },
					y2: { scale: "yscale", value: 0 }
				},
				update: {
					fill: { value: "steelblue" }
				},
				hover: {
					fill: { value: "red" }
				}
			}
		},
		{
			type: "text",
			encode: {
				enter: {
					align: { value: "center" },
					baseline: { value: "bottom" },
					fill: { value: "#333" }
				},
				update: {
					x: { scale: "xscale", signal: "tooltip.category", band: 0.5 },
					y: { scale: "yscale", signal: "tooltip.amount", offset: -2 },
					text: { signal: "tooltip.amount" },
					fillOpacity: [{ test: "datum === tooltip", value: 0 }, { value: 1 }]
				}
			}
		}
	]
}

const BarChart = createClassFromSpec({
	spec
})

export default BarChart
