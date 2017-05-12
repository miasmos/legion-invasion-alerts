import {AppState} from 'react-native'
import Observer from '../core/util/Observer'
import {instance as Enum} from '../core/enums'

class AppFocus extends Observer {
	constructor() {
		super()
		AppState.addEventListener('change', this._onChange.bind(this))
		AppState.addEventListener('memoryWarning', this._onMemoryWarning.bind(this))
	}

	_onChange(state) {
		switch(state) {
			case Enum.android.appstate.ACTIVE:
				this.emit('active')
				break
			case Enum.android.appstate.BACKGROUND:
				this.emit('background')
				break
			case Enum.android.appstate.INACTIVE:
				this.emit('inactive')
				break
		}
	}

	_onMemoryWarning() {
		this.emit('memory_warning')
	}

	get Focus() {
		return AppState.currentState
	}
}

export let instance = new AppFocus()