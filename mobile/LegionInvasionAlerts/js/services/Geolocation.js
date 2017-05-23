import 'bluebird'

class Geolocation {
	Get() {
		return new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition(({ coords }) => {
				resolve(coords)
			}, (error) => {
				reject(error)
			}, {
				enableHighAccuracy: false,
				timeout: 2000,
				maximumAge: 0
			})
		})
	}
}

export let instance = new Geolocation()