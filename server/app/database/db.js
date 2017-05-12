var Sequelize = require('sequelize')
import Models from './models'
import User from './tables/user'

let instance = undefined

export default class Database {
	constructor(credentials) {
		if (!instance) instance = this
		else return instance

		this.user = credentials.user
		this.password = credentials.password
		this.host = credentials.host
		this.port = credentials.port
		this.database = credentials.database
		this.connection = undefined

		this.Connect()
			.then(() => {
				this.models = new Models(this.connection)
				this.User = new User(this.models.User)
			})
			.error((error) => {
				console.error(error)
			})

		return instance
	}

	Connect() {
		this.connection = new Sequelize(this.database, this.user, this.password, {
			host: this.host,
			port: this.port,
			dialect: 'postgres',
			logging: false,
			pool: {
				max: 5,
				min: 0,
				idle: 10000
			}
		})

		return this.connection.authenticate()
	}
}