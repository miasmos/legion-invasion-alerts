import {Response} from './response/Response'
import {ErrorExtended as Error} from './response/Error'
import {instance as Enum} from './enums'
import 'bluebird'
let Joi = require('joi-browser')

class Validator {
	Validate(schema, param) {
		return new Promise((resolve, reject) => {
			Joi.validate(param, schema, (error, value) => {
				if (error === null) {
					resolve()
				} else {
					reject(error)
				}
			})
		})
	}

	NotificationToken(param) {
		let schema = Joi.string().min(152).max(152).required()
		return this.Validate(schema, param)
	}
}

class Params {
	constructor() {
		this.routes = ['NotificationToken']
		this.validator = new Validator()
		console.log(this.validator.Validate)
	}

	NotificationToken(request, response, id) {
		return false
	}

	Apply(server) {
		for (let key in this.routes) {
			let route = this.routes[key]

			server.App().param(route, (request, response, next, id) => {
				let error = false
				if (route in this && typeof this[route] === 'function') {
					error = this[route].call(this, request, response, id)
				}

				if (!error) {
					this.validator[route].call(this.validator, request.params[route])
						.then(next)
						.catch(error => {
							Response.Error(response, new Error(Enum.error.message.INVALID_PARAM_TOKEN, Enum.error.code.BAD_REQUEST))
						})
				} else {
					Response.Error(response, error)
				}
			})
		}
	}
}

export let instance = new Params()