import {instance as Enum} from './enums'
import Observer from './util/Observer'

var config = require('./config.json'),
	moment = require('moment')

export class Invasion extends Observer {
	constructor(seed) {
		super()
		this.seed = seed
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

		let seedMoment = moment(this.seed, config.seedFormat)
		console.log('Invasion seed:', seedMoment.format('LLL'))
		let nextMoment = this.GetNextInvasion(seedMoment, false),
            now = moment(),
            isActive = this.InvasionIsActive(nextMoment)

        while(!((nextMoment.start.isAfter(now) && isActive) || (nextMoment.end.isAfter(now) && !isActive))) {
            isActive = !isActive
            nextMoment = this.GetNextInvasion(nextMoment.start)
        }
        this.next = nextMoment
	}

	GetNextInvasion(invasion, lookahead = true) {
		invasion = !!invasion ? invasion.clone() : this.next.start.clone()

		let addition = lookahead ? this.duration + this.interval : 0
		let start = invasion.add(addition, 'hours')
		let obj = {
			start: start,
			hourBeforeStart: start.clone().subtract(1, 'hours'),
			hourBeforeEnd: start.clone().add(this.duration - 1),
			end: start.clone().add(this.duration, 'hours')
		}

		console.log('New invasion: starting', obj.start.format('LLL'), ', ending', obj.end.format('LLL'))
		return obj
	}

	InvasionIsActive(invasion) {
		let now = Date.now()
		return invasion.start.isBefore(now) && invasion.end.isAfter(now)
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