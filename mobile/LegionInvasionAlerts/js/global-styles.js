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
			fontFamily: 'oldstandard_regular',
			fontSize: 18,
			accentColor: '#f7f7f7',
			defaultColor: '#FFF',
			disabledColor: '#d8d8d8',
			borderColor: '#eeeeee',
			largeFontSize: 50
		}
	}

	get defaults() {
		return this._defaults
	}

	Load() {
		setCustomView({
			style: {
				backgroundColor: this.defaults.defaultColor,
				flex: 1,
				flexDirection: 'column'
			}
		})

		setCustomTextInput({
			underlineColorAndroid: 'rgba(0,0,0,0)',
			selectionColor: '#000',
			style: {
				backgroundColor: this.defaults.accentColor,
				fontFamily: this.defaults.fontFamily,
				paddingHorizontal: 16,
				paddingVertical: 7,
				fontSize: this.defaults.fontSize
			}
		})

		setCustomScrollView({
			style: {
				backgroundColor: this.defaults.defaultColor,
				alignSelf: 'stretch'
			}
		})
	}
}

export let instance = new GlobalStyles()