class Enums {
	constructor() {
		this.error = {
			message: {
				"NOT_FOUND": "Whoops. That page doesn't exist.",
				"INVALID_PARAM_TOKEN": "Invalid token supplied.",
				"INVALID_PARAM_LOCALE": "Invalid locale supplied.",
				"RATE_LIMITED": "Your request was rate limited. Try again later.",
				"GENERIC_ERROR": "An undiagnosed error has occurred.",
				"CORS": "This resource is restricted to the shortr.li domain.",
				"NO_RESULTS": "The request was made, but returned no results.",
				"SERVICE_UNAVAILABLE": "The requested service is unavailable. It is either down or slow to respond.",
				"RECAPTCHA_FAILED": "You failed to complete the captcha. Are you a robot?"
			},
			code: {
				"OK": 200,
				"FORBIDDEN": 403,
				"BAD_REQUEST": 400,
				"NOT_FOUND": 404,
				"TIMED_OUT": 408,
				"ERROR": 500,
				"TOO_MANY_REQUESTS": 429,
				"NO_RESULTS": 601,
				"SERVICE_UNAVAILABLE": 503
			}
		}

		this.boolean = {
			TRUE: 1,
			FALSE: 0
		}

		this.notifications = {
			types: {
				ENDING_SOON: 0,
				STARTING_SOON: 1,
				STARTING_NOW: 2
			},
			messages: {
				0: {
					title: 'Legion Invasion Alerts',
					body: 'The invasion is ending soon! 1 hour left.',
					tweet: 'The {locale} invasion is ending in 1 hour.'
				},
				1: {
					title: 'Legion Invasion Alerts',
					body: 'An invasion is starting in 1 hour.',
					tweet: 'The {locale} invasion is starting in 1 hour.'
				},
				2: {
					title: 'Legion Invasion Alerts',
					body: 'An invasion is starting now.',
					tweet: 'The {locale} invasion is starting now.'
				}
			}
		}
	}
}

export let instance = new Enums()