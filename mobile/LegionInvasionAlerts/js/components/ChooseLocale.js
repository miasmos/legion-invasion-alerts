import React from 'react'
import { AppRegistry, View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import {instance as Enum} from '../core/enums'

export default class ChooseLocale extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<Text>Which region are{"\n"}you playing in?</Text>
				<View style={styles.buttonContainer}>
					<TouchableOpacity activeOpacity={0.3} style={styles.button} onPress={() => {this.props.setLocale('us')}}>
						<Text>Americas</Text>
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={0.3} style={styles.button} onPress={() => {this.props.setLocale('eu')}}>
						<Text>Europe</Text>
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={0.3} style={styles.button} onPress={() => {this.props.setLocale('oc')}}>
						<Text>Oceanic</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	buttonContainer: {
		flex: 1,
		maxHeight: 300,
		paddingTop: 30
	},
	button: {
		paddingHorizontal: 100
	}
})