'use strict'
import {instance as Enum} from './enums'
import Database from './database/db'
import {instance as Params} from './params'
import {Response} from './response/Response'
import {ErrorExtended as Error} from './response/Error'
import Server from './server'
import {instance as InvasionManager} from './InvasionManager'
import {instance as Notification} from './Notification'

let config = require('./config.json'),
	credentials = require('./credentials.json'),
	server = new Server(),
	moment = require('moment')

class App {
	constructor() {
		Params.Apply(server)
		this.db = new Database(credentials.database)

		server.Route('/token/:NotificationToken', (request, response) => {
			console.log(`/token/${request.params.NotificationToken.substring(0, 8)}...`)
			this.db.User.Upsert(request.params.NotificationToken, 'us')
				.then(result => {
					Response.Ok(response)
				})
				.catch(error => {
					console.log(error)
					Response.Error(response, new Error(Enum.error.message.GENERIC_ERROR, Enum.error.code.ERROR))
				})
		})

		server.Route('/locale/:NotificationToken/:Locale', (request, response) => {
			console.log(`/locale/${request.params.NotificationToken.substring(0, 8)}.../${request.params.Locale}`)
			this.db.User.Upsert(request.params.NotificationToken, request.params.Locale)
				.then(result => {
					Response.Ok(response)
				})
				.catch(error => {
					console.log(error)
					Response.Error(response, new Error(Enum.error.message.GENERIC_ERROR, Enum.error.code.ERROR))
				})
		})

		server.Route('*', (request, response) => {
			Response.Error(response, new Error(Enum.error.message.NOT_FOUND, Enum.error.code.NOT_FOUND))
		})

		server.Start()

		InvasionManager.on(Enum.notifications.types.STARTING_NOW, (locale) => {
			console.log(`Sending STARTING_NOW to ${locale}`)
			this.SendNotification('STARTING_NOW', locale)
					.catch(error => console.error(error))
		})

		InvasionManager.on(Enum.notifications.types.STARTING_SOON, (locale) => {
			console.log(`Sending STARTING_SOON to ${locale}`)
			this.SendNotification('STARTING_SOON', locale)
					.catch(error => console.error(error))
		})

		InvasionManager.on(Enum.notifications.types.ENDING_SOON, (locale) => {
			console.log(`Sending ENDING_NOW to ${locale}`)
				this.SendNotification('ENDING_SOON', locale)
					.catch(error => console.error(error))
		})
	}

	SendNotification(notificationType, locale) {
		return new Promise((resolve, reject) => {
			if (!(notificationType in Enum.notifications.types)) resolve()

			this.db.User.GetByLocale(locale)
				.then(results => {
					if (!!results && results.length) {
						results.map(json => {
							let message = Enum.notifications.messages[Enum.notifications.types[notificationType]]

							Notification.Send(json.token, message.title, message.body)
								.then(response => {
									try {
										let json1 = JSON.parse(response)

										if ('results' in json1 && json1.results.length) {
											let results = json1.results[0]

											if ('error' in results && results.error === 'InvalidRegistration') {
												this.db.User.Destroy(json.token)
													.then(() => resolve())
													.catch(error => reject(error))
											}
										}
									} catch(error) {
										reject(error)
										return
									}

									resolve(response)
								})
								.catch(error => reject(error))
						})
					} else {
						resolve()
					}
				})
				.catch(error => reject(error))
		})
	}
}

let app = new App()
