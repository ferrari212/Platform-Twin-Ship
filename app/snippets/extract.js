export default function extract(src, props) {
	// gets the src code and returns the extracted variables
	// source: https://stackoverflow.com/questions/51340819/elegant-way-to-copy-only-a-part-of-an-object/51340842#51340842
	// Access data: 2021-04-03
	// src: object containing the source
	// props: array with the keys to be extracted

	let obj = {}
	props.map(prop => (obj[prop] = src[prop]))
	return obj
}
