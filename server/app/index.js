'use strict'
import {instance as Enum} from './enums'
import Database from './database/db'
import {instance as Params} from './params'
import {Response} from './response/Response'
import {ErrorExtended as Error} from './response/Error'
import Server from './server'
import {instance as Invasions} from './Invasions'
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
			this.db.User.Create(request.params.NotificationToken)
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

		Invasions.on(Enum.notifications.types.STARTING_NOW, () => {
			console.log('Sending STARTING_NOW')
			this.SendNotification('STARTING_NOW')
				.catch(error => console.error(error))
		})

		Invasions.on(Enum.notifications.types.STARTING_SOON, () => {
			console.log('Sending STARTING_SOON')
			this.SendNotification('STARTING_SOON')
				.catch(error => console.error(error))
		})

		Invasions.on(Enum.notifications.types.ENDING_SOON, () => {
			console.log('Sending ENDING_SOON')
			this.SendNotification('ENDING_SOON')
				.catch(error => console.error(error))
		})

		setTimeout(() => Invasions.emit(Enum.notifications.types.STARTING_SOON), 1000)
	}

	SendNotification(notificationType) {
		return new Promise((resolve, reject) => {
			if (!(notificationType in Enum.notifications.types)) resolve()

			this.db.User.GetAll()
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
