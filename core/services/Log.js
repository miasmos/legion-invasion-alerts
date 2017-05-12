var colors = require('colors')

class Log {
	Say(obj, color) {
		if (process.env.NODE_ENV === 'production') return
		switch(color) {
			case 'red':
				console.log(colors.red(obj))
				break
			case 'yellow':
				console.log(colors.yellow(obj))
				break
			case 'green':
				console.log(colors.green(obj))
				break
			default:
				console.log(obj)
		}
	}

	Warn(...args) {
		console.warn(...args)
	}

	Error(...args) {
		console.error(colors.red(...args))
	}

	Dir(...args) {
		if (process.env.NODE_ENV !== 'production') return
		console.dir(...args)
	}
}



export let instance = new Log()