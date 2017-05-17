var Sequelize = require('sequelize')
import 'bluebird'
import Table from './table'

export default class User extends Table {
	Create(token) {
		return new Promise((resolve, reject) => {
			this.Exists(token)
				.then(results => {
					if (!!results && !!results.get('token')) {
						resolve()
					} else {
						this.model.create({ token: token })
							.then(result => {
								resolve()
							})
							.catch(error => {
								reject(error)
							})
					}
				})
				.catch(error => {
					reject(error)
				})
		})
	}

	GetAll() {
		return new Promise((resolve, reject) => {
			this.model.findAll()
				.then(results => {
					let arr = []
					if (!!results && results.length) {
						results.forEach(item => {
							arr.push(item.get({ plain: true }))
						})
					}
					resolve(arr)
				})
				.catch(error => {
					reject(error)
				})
		})
	}

	Exists(token) {
		return this.model.findOne({
			where: {
				token: token
			}
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