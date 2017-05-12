import {Response} from './response/Response'
import {ErrorExtended as Error} from './response/Error'
import {instance as Enum} from '../../core/enums'

class Params {
	constructor() {
		this.routes = []
	}

	// hash(request, response, id) {
	// 	return false
	// }

	Apply(server) {
		for (let key in this.routes) {
			let route = this.routes[key]

			server.App().param(route, (request, response, next, id) => {
				let error = false
				if (route in this && typeof this[route] === 'function') {
					error = this[route].call(this, request, response, id)
				}

				if (!error) {
					error = Validate[route].call(this, request.params[route])

					if (!error) {
						next()
					} else {
						Response.Error(response, error)
					}
				} else {
					Response.Error(response, error)
				}
			})
		}
	}
}

class Validate {
	// static hash(param) {
	// 	if (validator.isAlphanumeric(param)) {
	// 		return false
	// 	} else {
	// 		return new Error(Enum.error.message.INVALID_PARAM_HASH, Enum.error.code.BAD_REQUEST)
	// 	}
	// }
}

export let instance = new Params()