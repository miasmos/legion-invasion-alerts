var Sequelize = require('sequelize')
import 'bluebird'
import Table from './table'

export default class User extends Table {
	Create(token, locale) {
		return new Promise((resolve, reject) => {
			this.Exists(token)
				.then(results => {
					if (!!results && !!results.get('token')) {
						resolve()
					} else {
						this.model.create({ token, locale })
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

	GetByLocale(locale) {
		return new Promise((resolve, reject) => {
			this.model.find({ where: { locale }})
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

	Upsert(token, locale) {
		return new Promise((resolve, reject) => {
			this.model.findOne({ where: { token } })
				.then(results => {
					if (!!results) {
						this.model.update({ locale }, { where: { token } })
							.then(result => resolve(result))
							.catch(error => reject(error))
					} else {
						this.model.create({ token, locale })
							.then(result => resolve(result))
							.catch(error => reject(error))
					}
				})
				.catch(error => reject(error))
		})
	}

	Exists(token) {
		return this.model.findOne({
			where: {
				token: token
			}
		})
	}

	Destroy(token) {
		return this.model.destroy({
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