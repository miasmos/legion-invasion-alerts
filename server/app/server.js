'use strict'

var express = require('express'),
	helmet = require('helmet'),
	compression = require('compression'),
	http = require('http')

export default class Server {
	constructor() {
		let app = express()
		app.set('json spaces', 4)
		app.use(helmet())
		app.use(compression())
		this.app = app
	}

	Start() {
		let server = http.createServer(this.app)

		server.listen(4000, () => {
			console.log(`Server listening`)
		})

		this.server = server
	}

	App() {
		return this.app
	}

	Route(route, fn) {
		this.app.get(route, fn)
	}
}