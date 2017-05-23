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
					reject(new Error(Enum.error.message.INVALID_PARAM_TOKEN, Enum.error.code.BAD_REQUEST))
				}
			})
		})
	}

	_default(condition, error) {
		return new Promise((resolve, reject) => {
			if (condition) {
				resolve()
			} else {
				reject(error)
			}
		})
	}

	NotificationToken(param) {
		let schema = Joi.string().min(152).max(152).required()
		return this.Validate(schema, param)
	}

	Locale(param) {
		return this._default(param === 'us' || param === 'eu' || param === 'oc', new Error(Enum.error.message.INVALID_PARAM_LOCALE, Enum.error.code.BAD_REQUEST))
	}
}

class Params {
	constructor() {
		this.routes = ['NotificationToken', 'Locale']
		this.validator = new Validator()
		console.log(this.validator.Validate)
	}

	NotificationToken(request, response, id) {
		return false
	}

	Locale() {
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
							Response.Error(response, error)
						})
				} else {
					Response.Error(response, error)
				}
			})
		}
	}
}

export let instance = new Params()