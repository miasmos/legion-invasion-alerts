import React from 'react'
import { AppRegistry, View, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import {NativeRouter, Redirect} from 'react-router-native'
import {Text, LargeText, Button} from './base/BaseComponents'

export default class Login extends React.Component {
	constructor() {
		super()
		this.state = {
			username: '',
			usernameValid: true,
			password: '',
			passwordValid: true
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<LargeText
					style={styles.largeTextTop}
					title="talk with" />
				<LargeText
					style={styles.largeTextBottom}
					title="stephen" />
				<Text
					style={styles.text}
					title="what is your username?"
					maxLength="40"></Text>
				<TextInput
					style={[styles.input, {marginBottom: 5}]}
					autofocus={true}
					onChangeText={this.onUsernameChange.bind(this)} />
				<Text
					style={styles.text}
					title="and your password?"
					maxLength="40"></Text>
				<TextInput
					style={[styles.input, {marginBottom: 10}]}
					autoCorrect={false}
					secureTextEntry={true}
					onChangeText={this.onPasswordChange.bind(this)} />
				<Button
					style={styles.button}
					title="log in" enabled={this.props.connected && this.state.usernameValid && this.state.passwordValid}
					onPress={this.onLoginPressed.bind(this)} />
			</View>
		)
	}

	onUsernameChange(text) {
		this.setState({
			...this.state,
			username: text,
			usernameValid: text.length >= 5 && text.length <= 40
		})
	}

	onPasswordChange(text) {
		this.setState({
			...this.state,
			password: text,
			passwordValid: text.length >= 8 && text.length <= 40
		})
	}

	onLoginPressed() {
		this.props.SendLoginRequest(this.state.username, this.state.password)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	input: {
		width: 300
	},
	text: {
		width: 300,
		paddingLeft: 15,
		marginBottom: 2
	},
	button: {
		width: 300,
		maxHeight: 70
	},
	largeTextTop: {
		marginBottom: -15
	},
	largeTextBottom: {
		marginBottom: 50
	}
})