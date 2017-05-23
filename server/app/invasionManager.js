import {instance as Enum} from './enums'
import Observer from './util/Observer'
import {Invasion} from './invasion'

var config = require('./config.json'),
	moment = require('moment')

export class InvasionManager extends Observer {
	constructor() {
		super()
		this.invasions = {
			us: new Invasion(config.seed.us),
			eu: new Invasion(config.seed.eu),
			oc: new Invasion(config.seed.oc)
		}

		for (let locale in this.invasions) {
			let invasion = this.invasions[locale]

			invasion.on(Enum.notifications.types.STARTING_NOW, this.emit.bind(this, Enum.notifications.types.STARTING_NOW, locale))
			invasion.on(Enum.notifications.types.STARTING_SOON, this.emit.bind(this, Enum.notifications.types.STARTING_SOON, locale))
			invasion.on(Enum.notifications.types.ENDING_SOON, this.emit.bind(this, Enum.notifications.types.ENDING_SOON, locale))
		}

		setInterval(this.Tick.bind(this), 1000)
	}

	Tick() {
		for (var locale in this.invasions) {
			this.invasions[locale].Tick()
		}
	}
}

export let instance = new InvasionManager()