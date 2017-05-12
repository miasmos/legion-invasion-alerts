import React from 'react'
import { AppRegistry, View, ActivityIndicator, StyleSheet } from 'react-native'
import {instance as GlobalStyles} from '../global-styles'

export default class Loading extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" style={styles.indicator} />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	indicator: {
		height: 80
	}
})