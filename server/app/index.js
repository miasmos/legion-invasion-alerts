'use strict'
import {instance as Enum} from './enums'
import Database from './database/db'
import {instance as Params} from './params'
import {Response} from './response/Response'
import {ErrorExtended as Error} from './response/Error'
import Server from './server'

let config = require('./config.json'),
	credentials = require('./credentials.json'),
	server = new Server()

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
	}

	OnAppFocus(mediator, connectionId, data) {
		let isActive = data.isActive === Enum.boolean.TRUE ? true : false
		if (ConnectionManager.IsAuthenticatedUser(connectionId)) {
			ConnectionManager.SetAppFocus(connectionId, isActive)
			ConnectionManager.BroadcastAppFocus(Enum.usertypes.ADMIN, data.isActive, data.userid, connectionId)
		} else if (ConnectionManager.IsAuthenticatedAdmin(connectionId)) {
			ConnectionManager.SetAppFocus(connectionId, isActive)
			ConnectionManager.BroadcastAppFocus(Enum.usertypes.ANONYMOUS, data.isActive, data.userid, connectionId)
		}
	}
}

let app = new App()
