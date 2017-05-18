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
		this.sent = {
			start: false,
			hourBeforeStart: false,
			hourBeforeEnd: false
		}
		this.next = {
			start: undefined,
			hourBeforeStart: undefined,
			hourBeforeEnd: undefined,
			end: undefined
		}

		let nextMoment = this.GetNextInvasion(moment(this.seed, 'X')),
            now = moment(),
            isActive = false

        while(!((nextMoment.start.isAfter(now) && isActive) || (nextMoment.end.isAfter(now) && !isActive))) {
            isActive = !isActive
            nextMoment = this.GetNextInvasion(nextMoment.start)
        }
        this.next = nextMoment

		setInterval(this.Tick.bind(this), 1000)
	}

	GetNextInvasion(invasion) {
		invasion = !!invasion ? invasion.clone() : this.next.start.clone()
		let obj = {
			start: invasion.add(this.duration + this.interval, 'hours'),
			hourBeforeStart: invasion.clone().subtract(1, 'hours'),
			hourBeforeEnd: invasion.clone().add(this.duration - 1),
			end: invasion.clone().add(this.duration, 'hours')
		}

		console.log('New invasion: starting', obj.start.format('LLL'), ', ending', obj.end.format('LLL'))
		return obj
	}

	Tick() {
		let now = moment()

		if (this.WasAMinuteOrLessAgo(now, this.next.start) && !this.sent.start) {
			this.sent.start = true
			this.emit(Enum.notifications.types.STARTING_NOW)
		}
		if (this.WasAMinuteOrLessAgo(now, this.next.hourBeforeStart) && !this.sent.hourBeforeStart) {
			this.sent.hourBeforeStart = true
			this.emit(Enum.notifications.types.STARTING_SOON)
		}
		if (this.WasAMinuteOrLessAgo(now, this.next.hourBeforeEnd) && !this.sent.hourBeforeEnd) {
			this.sent.hourBeforeEnd = true
			this.emit(Enum.notifications.types.ENDING_SOON)
		}
		if (this.WasAMinuteOrLessAgo(now, this.next.end)) {
			this.next = this.GetNextInvasion()
			this.sent = {
				hourBeforeStart: false,
				hourBeforeEnd: false,
				start: false
			}
		}
	}

	WasAMinuteOrLessAgo(start, end) {
		let diff = moment.duration(start.diff(end)).asMinutes()
		return diff <= 1 && diff >= 0
	}
}

export let instance = new Invasions()