import React from 'react'
import { Text, StyleSheet } from 'react-native'
import {instance as GlobalStyles} from '../../global-styles'

const LargeText = (props) => (
	<Text style={[styles.text, props.style]}>{props.title || ''}</Text>
)

const styles = StyleSheet.create({
	text: {
		color: GlobalStyles.defaults.fontColor,
		fontFamily: GlobalStyles.defaults.fontFamily,
		textAlign: 'left',
		fontSize: GlobalStyles.defaults.largeFontSize
	}
})

export default LargeText