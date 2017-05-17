import {instance as Enum} from './enums'
import Observer from './util/Observer'

var config = require('./config.json'),
	moment = require('moment')

class Invasions extends Observer {
	constructor() {
		super()
		this.seed = config.seed
		this.duration = config.invasion_duration
		this.interval = config.invasion_interval
		this.next = {
			start: undefined,
			hourBeforeStart: undefined,
			hourBeforeEnd: undefined
		}

		let temp = moment(this.seed, 'X'),
            now = moment()

        while(true) {
            if (temp.isAfter(now)) {
                this.next = this.GetNextInvasion(temp)
                break
            } else {
                temp = temp.add(this.duration + this.interval, 'hours')
            }
        }

		setInterval(this.Tick.bind(this), 1000)
	}

	GetNextInvasion(start) {
		start = !!start ? start : this.next.start.add(this.duration + this.interval, 'hours')
		return {
			start: start,
			hourBeforeStart: start.subtract(1, 'hours'),
			hourBeforeEnd: start.add(this.duration - 1)
		}
	}

	Tick() {
		let now = Date.now()

		if (this.next.start.isBefore(now)) {
			this.next = this.GetNextInvasion()
			this.emit(Enum.notifications.STARTING_NOW)
		} else if (this.next.hourBeforeStart.isBefore(now)) {
			this.emit(Enum.notifications.STARTING_SOON)
		} else if (this.next.hourBeforeEnd.isBefore(now)) {
			this.emit(Enum.notifications.ENDING_SOON)
		}
	}
}

export let instance = new Invasions()