var Sequelize = require('sequelize')
import Table from './table'

export default class User extends Table {
	Create(token) {
		return this.model.create({
			token: token,
		})
	}

	UpdateToken(id, token) {
		return this.model.update({
			token: token
		}, {
			where: {
				id: id
			}
		})
	}
}