import React from 'react'
import { AppRegistry, Text as BaseText, View, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import {instance as GlobalStyles} from '../../global-styles'

const Text = (props) => (
	<BaseText style={[styles.text, props.style]}>{props.title || ''}</BaseText>
)

const styles = StyleSheet.create({
	text: {
		color: GlobalStyles.defaults.fontColor,
		fontFamily: GlobalStyles.defaults.fontFamily,
		textAlign: 'left',
		fontSize: GlobalStyles.defaults.fontSize - 1
	}
})

export default Text