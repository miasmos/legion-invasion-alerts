'use strict'
import Service from '../../core/services/Service'
import {instance as Enum} from '../../core/enums'
import CustomError from '../../core/error'
import {instance as Params} from './params'
import {Response} from './response/Response'
import {ErrorExtended as Error} from './response/Error'
import Server from './server'

let config = require('./config.json'),
	credentials = require('./credentials.json'),
	Log = Service.Log(),
	server = new Server()

class App {
	constructor() {
		Params.Apply(server)

		// server.Route('/api/hash/get/:hash', (request, response) => {
		// 	this.db.Links.Get(request.params.hash)
		// 		.then(result => {
		// 			if (result !== null) {
		// 				let link = result.get('link')

		// 				if (!!link) {
		// 					Response.Ok(response, Messages.Link(request.params.hash, link))
		// 					return
		// 				}
		// 			}

		// 			Response.Ok(response, Messages.Link(request.params.hash, null))
		// 		})
		// 		.catch(error => {
		// 			console.log(error)
		// 			Response.Error(response, new Error(Enum.error.message.GENERIC_ERROR, Enum.error.code.ERROR))
		// 		})
		// })

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
