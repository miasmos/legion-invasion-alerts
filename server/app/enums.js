class Enums {
	constructor() {
		this.error = {
			message: {
				"NOT_FOUND": "Whoops. That page doesn't exist.",
				"INVALID_PARAM_TOKEN": "Invalid token supplied.",
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

		this.Notifications = {
			ENDING_SOON: {
				title: 'Legion Invasion Alerts',
				body: 'The invasion in %s is ending in %s.',
			},
			STARTING_SOON: {
				title: 'Legion Invasion Alerts',
				body: 'An invasion in %s is starting in %s.'
			},
			STARTING_NOW: {
				title: 'Legion Invasion Alerts',
				body: 'An invasion in %s is starting now.'
			}
		}
	}
}

export let instance = new Enums()