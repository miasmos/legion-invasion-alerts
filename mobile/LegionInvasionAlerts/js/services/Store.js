var store = require('react-native-simple-store')
import 'bluebird'

class Store  {
	constructor() {
		this.user = undefined
	}

	SaveUser(id, token) {
		this.user = {id, session_token: token, date: Date.now()}
		return store.save('user', this.user)
	}

	GetUser() {
		return new Promise((resolve, reject) => {
			if (!!this.user) resolve(this.user)
			else {
				store.get('user')
					.then(user => {
						this.user = user
						resolve(user)
					})
					.catch(error => reject(error))
			}
		})
	}

	RemoveUser() {
		this.user = undefined
		return store.delete('user')
	}
}

export let instance = new Store()