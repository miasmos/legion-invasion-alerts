import 'bluebird'

export default class InvasionAlertsAPI {
	static Token(token) {
		return this._resolve(`/token/${token}`)
	}

	static _resolve(path) {
		return new Promise((resolve, reject) => {
			fetch(`http://10.15.44.158:4000${path}`)
				.then(response => {
					response.json()
						.then(json => resolve(json))
						.catch(error => reject())
				})
				.catch(error => {
					reject({status: 500, data: {error}})
				})
		})
	}
}
