export default class ShipObject {
	// Class takes the user format in a database, find it and parse it as an object
	// id: choosen id for the object
	// version: string of the used version
	// obj: object of the user version
	// @ferrari212

	constructor(user) {
		this.id = user.shipId
		var versions = user.versions
		this.version = versions[this.id]
		this.shipObj = this.version ? this.parseInfo(this.version.ship) : undefined
	}

	parseInfo(shipString) {
		return Boolean(shipString) ? JSON.parse(shipString) : undefined
	}
}
