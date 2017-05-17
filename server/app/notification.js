import 'bluebird'
import {instance as Enum} from './enums'

var config = require('./credentials.json'),
	uuid = require('uuid'),
	fcm = new (require('fcm-node'))(config.fcm.key)

class Notification {
	StartingNow(token) {
		let n = Enum.Notifications.STARTING_NOW
		return this.Send(token, n.title, n.body)
	}

	StartingSoon(token) {
		let n = Enum.Notifications.STARTING_SOON
		return this.Send(token, n.title, n.body)
	}

	EndingSoon(token) {
		let n = Enum.Notifications.ENDING_SOON
		return this.Send(token, n.title, n.body)
	}

	Send(token, title, message) {
		return new Promise((reject, resolve) => {
			fcm.send(this._MakeNotification(token, title, message), (error, response) => {
				if (!!error) reject(error)
				else resolve(response)
			})
		})
	}

	_MakeNotification(token, title = config.appname, body, foreground = true) {
		return {
			to: token,
			data: {
				type: 'MESSAGE',
				custom_notification: {
					body: body,
					title: title,
					color: '#c7c7c7',
					priority: 'high',
					icon: 'ic_launcher',
					id: 1,
					show_in_foreground: foreground,
				}
			}
		}
	}
}

export let instance = new Notification()