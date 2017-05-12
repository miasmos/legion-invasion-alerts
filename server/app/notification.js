import 'bluebird'

var config = require('./config.json'),
	fcm = new (require('fcm-node'))(config.fcm.key)

class Notification {
	Send(token, name, message, date, senderId) {
		return new Promise((reject, resolve) => {
			fcm.send(this.MakeNotification(token, name, message, date, senderId), (error, response) => {
				if (error) reject(error)
				else resolve(response)
			})
		})
	}

	MakeNotification(token, title = config.appname, body, date, senderId, foreground = false) {
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
					sound: 'blank',
					id: senderId,
					my_custom_data: date,
					show_in_foreground: foreground,
				}
			}
		}
	}
}

export let instance = new Notification