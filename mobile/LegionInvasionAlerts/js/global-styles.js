import {
  setCustomView,
  setCustomTextInput,
  setCustomText,
  setCustomImage,
  setCustomTouchableOpacity,
  setCustomScrollView,
} from 'react-native-global-props'

class GlobalStyles {
	constructor() {
		this._defaults = {
			fontColor: '#333',
			fontSize: 20,
			accentColor: '#f7f7f7',
			defaultColor: '#FFF',
			disabledColor: '#d8d8d8',
			largeFontSize: 50
		}

		setCustomView({
			style: {
				backgroundColor: this.defaults.defaultColor,
				flex: 1,
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center'
			}
		})

		setCustomText({
			style: {
				color: this.defaults.fontColor,
				textAlign: 'center',
				fontSize: this.defaults.fontSize
			}
		})
	}

	get defaults() {
		return this._defaults
	}
}

export let instance = new GlobalStyles()