var store = require('react-native-simple-store')
import 'bluebird'

class Store  {
	constructor() {
		this.settings = undefined
	}

	SaveSetting(name, value) {
		if (!this.settings) {
			store.get('settings')
				.then(settings => {
					if (!!settings) this.settings = settings
					else this.settings = {}
					finalize.call(this)
				})
				.catch(error => console.error(error))
		} else {
			finalize.call(this)
		}

		function finalize() {
			this.settings[name] = value
			store.save('settings', this.settings)
				.catch(error => console.error(error))
		}
	}

	GetSetting(name) {
		return new Promise((resolve, reject) => {
			if (!this.settings) {
				store.get('settings')
					.then(settings => {
						if (!!settings) this.settings = settings
						else this.settings = {}
						finalize.call(this)
					})
					.catch(error => reject(error))
			} else {
				finalize.call(this)
			}

			function finalize() {
				resolve(name in this.settings ? this.settings[name] : undefined)
			}
		})
	}

	GetSettings() {
		return new Promise((resolve, reject) => {
			if (!this.settings) {
				store.get('settings')
					.then(settings => {
						if (!!settings) this.settings = settings
						else this.settings = {}
						finalize.call(this)
					})
					.catch(error => reject(error))
			} else {
				finalize.call(this)
			}

			function finalize() {
				resolve(this.settings)
			}
		})
	}

	RemoveSetting(name) {
		if (name in this.settings) delete this.settings[name]
		store.save('settings', this.settings)
			.catch(error => console.error(error))
	}
}

export let instance = new Store()