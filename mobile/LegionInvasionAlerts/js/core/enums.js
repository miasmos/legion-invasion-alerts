class Enums {
	constructor() {
		this.errors = {
			codes: {
				DATABASE_ERROR: -1,
				USER_LOGIN: 1,
				GENERIC_ERROR: 0,
				NOT_AUTHORIZED: 401,
				FORCIBLY_LOGGED_OUT: 2
			},
			messages: {
				GENERIC_ERROR: 'An error occurred.',
				USER_EXISTS: 'That username is already in use.',
				USER_LOGIN: 'We don\'t recognize that username or password.',
				TOKEN_EXPIRED_ERROR: 'Your session has expired. Please log in again.',
				NOT_AUTHORIZED: 'You don\'t have permission to do that.',
				USER_LOGGED_IN_ELSEWHERE: 'Your account has been accessed elsewhere. Please log in again.'
			}
		}

		this.android = {
			appstate: {
				ACTIVE: 'active',
				BACKGROUND: 'background',
				INACTIVE: 'inactive'
			}
		}

		this.boolean = {
			TRUE: 1,
			FALSE: 0
		}
	}
}

export let instance = new Enums()