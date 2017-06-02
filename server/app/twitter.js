import {instance as Enum} from './enums'
import Observer from './util/Observer'

var credentials = require('./credentials.json'),
	twitter = require('twitter')

class Twitter {
	constructor() {
		this.client = new twitter(credentials.twitter)
	}

	TweetAlert(alertType, locale) {
		locale = locale.toUpperCase()

		return new Promise((resolve, reject) => {
			if (alertType in Enum.notifications.messages) {
				let tweet = Enum.notifications.messages[alertType].tweet
				tweet = tweet.replace(/{locale}/g, locale)

				this.client.post('statuses/update', { status: `${tweet} #${locale} #invasionalerts` })
					.then(tweet => resolve(tweet))
					.catch(error => reject(error))
			} else {
				reject()
			}
		})
	}

	Tweet(message) {
		return new Promise((resolve, reject) => {
			this.client.post('statuses/update', { status: message })
				.then(tweet => resolve(tweet))
				.catch(error => reject(error))
		})
	}
}

export let instance = new Twitter()