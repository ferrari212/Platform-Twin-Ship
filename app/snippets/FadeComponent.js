export default class FadeComponent {
	// Class that input the element name in the #tooltip
	// id: String of the element to be faded; default = "loader-wrapper"
	constructor(id = "loader-wrapper") {
		var fadeTarget = document.getElementById(id)
		var fadeEffect = setInterval(function () {
			if (!fadeTarget.style.opacity) {
				fadeTarget.style.opacity = 1
			}
			if (fadeTarget.style.opacity > 0) {
				fadeTarget.style.opacity -= 0.05
			} else {
				clearInterval(fadeEffect)
				fadeTarget.remove()
			}
		}, 50)
	}
}
