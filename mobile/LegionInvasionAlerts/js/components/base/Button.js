import React from 'react'
import { TouchableOpacity, StyleSheet, Image } from 'react-native'
import {instance as GlobalStyles} from '../../global-styles'
import Text from './Text'

export default class Button extends React.Component {
	render() {
		let disabled = typeof this.props.enabled !== 'undefined' && !this.props.enabled ? true : false,
			textStyles = StyleSheet.create({
				text: {
					color: disabled ? GlobalStyles.defaults.disabledColor : GlobalStyles.defaults.fontColor,
				}
			})

		return !!this.props.title ? (
			<TouchableOpacity ref="root" onPress={this.props.onPress} style={[this.props.style, styles.button]} disabled={disabled}>
				<Text style={textStyles.text} title={this.props.title}></Text>
			</TouchableOpacity>
		) : !!this.props.source ? (
			<TouchableOpacity ref="root" onPress={this.props.onPress} style={[this.props.style, styles.button]} disabled={disabled}>
				<Image title={this.props.title} source={this.props.source}></Image>
			</TouchableOpacity>
		) : (
			<TouchableOpacity ref="root" onPress={this.props.onPress} style={[this.props.style, styles.button]} disabled={disabled}>
			</TouchableOpacity>
		)
	}

	componentDidMount() {
		this.updateOpacity()
	}

	componentWillUpdate(props, state) {
		if (props.disabled !== this.props.disabled) {
			this.updateOpacity()
		}
	}

	updateOpacity() {
		 this.refs.root.setOpacityTo(typeof this.props.disabled === 'undefined' ? 1 : this.props.disabled ? 1 : 0.2, !!this.props.duration ? this.props.duration : 1)
	}
}

const styles = StyleSheet.create({
	button: {
	  	flexDirection: 'row',
	  	justifyContent: 'center',
		alignItems: 'center'
	}
})