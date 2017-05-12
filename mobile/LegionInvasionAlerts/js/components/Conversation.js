import React from 'react'
import { AppRegistry, View, ListView, TextInput, StyleSheet, Image } from 'react-native'
import {Text, LargeText, Button} from './base/BaseComponents'
import {instance as GlobalStyles} from '../global-styles'
import {instance as Enum} from '../core/enums'
import TimeAgo from './TimeAgo'
import Utils from '../core/util/Util'
import Message from './Message'
import {instance as AppFocus} from '../services/AppFocus'

export default class Conversation extends React.Component {
	constructor() {
		super()
		this.state = {
			message: '',
			messageValid: false
		}
		this.rows = []
		this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
		this.gotNewMessage = false
		this.typingTimeout = undefined

		AppFocus.on('active', this.OnAppFocus.bind(this))
	}

	componentWillMount() {
		this.dataSource = this.dataSource.cloneWithRows(this.rows)
		this.updateList(this.props)
		this.props.ClearReplyIntent()

		if (!!this.props.lastMessage) {
			this.props.SendSeen(this.props.lastMessage.messageid)
		}
	}

	componentWillUpdate(props, state) {
		this.updateList(props)
	}

	OnAppFocus() {
		if (!!this.props.lastMessage) {
			this.props.SendSeen(this.props.lastMessage.messageid)
			// this.refs.listview.scrollToEnd()
		}
	}

	updateList(props) {
		let rows = this.generateRows(props)

		if (this.rows !== rows) {
			this.dataSource = this.dataSource.cloneWithRows(rows)
			this.rows = rows
			this.gotNewMessage = rows.length > 4
		}
	}

	generateRows(props) {
		if (!props) return []

		let arr = [], index = 0
		for (var key in props.messages) {
			let convo = props.messages[key]

			arr.push({
				...convo,
				key: key,
				shouldHaveBottomPadding: ++index !== props.messages.length
			})
		}
		return arr
	}

	onListViewLayout(event) {
		if (this.gotNewMessage) {
			this.refs.listview.scrollToEnd()
			this.gotNewMessage = false
		}
	}

	onMessageChange(text) {
		this.setState({
			...this.state,
			message: text,
			messageValid: text.length >= 1 && text.length <= 255
		})

		if (typeof this.typingTimeout === 'undefined') this.props.SendTyping(true)
		clearTimeout(this.typingTimeout)
		this.typingTimeout = setTimeout(() => {
			this.props.SendTyping(false)
			clearTimeout(this.typingTimeout)
			this.typingTimeout = undefined
		}, 800)
	}

	onSubmit() {
		if (this.state.messageValid) {
			this.props.SendMessage(this.state.message, this.props.id)
			this.setState({
				message: '',
				messageValid: false
			})
		}
	}

	canSubmit() {
		return this.messageValid
	}

	render() {
		let uri = !!this.props.identicon ? `data:image/png;base64,${this.props.identicon}` : undefined

		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Image style={styles.photo} source={!!uri ? {uri: uri, scale: 2} : undefined} />
					<Text style={styles.name} title={this.props.name}></Text>
					<View style={styles.lastseen}>
						{this.props.active &&
							<Image style={styles.active} source={require('../../assets/active.png')} />
						}
						{!this.props.active && !!this.props.lastSeen &&
							<TimeAgo style={styles.datetime} date={this.props.lastSeen} />
						}
					</View>
				</View>
				<ListView
					ref="listview"
					style={styles.messages}
					dataSource={this.dataSource}
					contentContainerStyle={styles.listViewContainer}
					onLayout={this.onListViewLayout.bind(this)}
					renderRow={data => <Message {...data} />}
				/>
				<View style={styles.input}>
					<TextInput
						ref="input"
						style={styles.inputbox}
						maxLength={255}
						onChangeText={this.onMessageChange.bind(this)}
						onSubmitEditing={this.onSubmit.bind(this)}
						blurOnSubmit={false}
						value={this.state.message}
						returnKeyType={"send"}
					/>
					<Button
						ref="submit"
						onPress={this.onSubmit.bind(this)}
						style={styles.sendIcon}
						source={require('../../assets/send.png')}
						disabled={!this.state.messageValid}
					/>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	listViewContainer: {
		flex: 0,
		justifyContent: 'flex-end'
	},
	messages: {
		flex: 1,
	},
	container: {
		flex: 1,
		flexDirection: 'column'
	},
	header: {
		flexDirection: 'row',
		flex: 0,
		height: 100,
		paddingVertical: 32,
		paddingHorizontal: 23,
		backgroundColor: GlobalStyles.defaults.defaultColor
	},
	input: {
		flex: 0,
		padding: 16,
		paddingRight: 60,
		backgroundColor: GlobalStyles.defaults.defaultColor
	},
	inputbox: {
		zIndex: 0
	},
	photo: {
		width: 35,
		height: 35,
	},
	name: {
		paddingTop: 7,
		paddingLeft: 20
	},
	active: {
		width: 10,
		height: 10,
		marginTop: 2
	},
	lastseen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-end',
		paddingRight: 7
	},
	datetime: {
	},
	sendIcon: {
		flex: 0,
		width: 20,
		height: 20,
		position: 'absolute',
		right: 20,
		top: 28
	}
})