import React from 'react'
import { AppRegistry, View, TouchableOpacity, TextInput, StyleSheet, Image, TouchableHighlight } from 'react-native'
import {Text, LargeText, Button} from './base/BaseComponents'
import {instance as GlobalStyles} from '../global-styles'
import {instance as Enum} from '../core/enums'
import Utils from '../core/util/Util'

export default class Message extends React.Component {
	render() {
		let style = this.props.shouldHaveBottomPadding ? {paddingBottom: 30} : {}

		return (
			this.props.from === Enum.from.ME ? (
				<View style={[style, styles.container]}>
					<View style={styles.borderLeft}></View>
					<View style={styles.message}>
						<Text title={this.props.text}></Text>
					</View>
				</View>
			) : (
				<View style={[style, styles.container]}>
					<View style={styles.message}>
						<Text style={styles.messageTextRight} title={this.props.text}></Text>
					</View>
					<View style={styles.borderRight}></View>
				</View>
			)
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		flex: 0
	},
	message: {
		flex: 0.95,
		paddingVertical: 15,
		paddingHorizontal: 20,
	},
	messageTextRight: {
		textAlign: 'right'
	},
	borderLeft: {
		flex: 0.05,
		borderRightColor: GlobalStyles.defaults.borderColor,
		borderRightWidth: 1,
		borderStyle: 'solid'
	},
	borderRight: {
		flex: 0.05,
		borderLeftColor: GlobalStyles.defaults.borderColor,
		borderLeftWidth: 1,
		borderStyle: 'solid'
	}
})