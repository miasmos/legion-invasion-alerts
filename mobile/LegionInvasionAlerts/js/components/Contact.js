import React from 'react'
import { AppRegistry, View, TouchableOpacity, TextInput, StyleSheet, Image, TouchableHighlight } from 'react-native'
import {Text, LargeText, Button} from './base/BaseComponents'
import {instance as GlobalStyles} from '../global-styles'
import {instance as Enum} from '../core/enums'
import TimeAgo from './TimeAgo'
import Utils from '../core/util/Util'

export default class Contact extends React.Component {
	render() {
		let uri = !!this.props.identicon ? `data:image/png;base64,${this.props.identicon}` : undefined,
			lastMessage = !!this.props.messages ? this.props.messages[Object.keys(this.props.messages).length-1] : undefined,
			lastMessageName = !!lastMessage ? lastMessage.from === Enum.from.YOU ? this.props.name : 'me' : undefined,
			lastMessageDate = !!lastMessage ? lastMessage.date : undefined

		return (
			<View style={styles.container} ref='base'>
				<View style={styles.contentContainer}>
					<View style={styles.leftSubcontainer}>
						<Image style={styles.photo} source={!!uri ? {uri: uri, scale: 2} : undefined} />
					</View>
					<View style={styles.rightSubcontainer}>
						<View style={styles.nameContainer}>
							<Text style={styles.name} title={this.props.name}></Text>
							{this.props.active &&
								<Image style={styles.active} source={require('../../assets/active.png')} />
							}
							{!this.props.active && !!this.props.lastSeen &&
								<TimeAgo style={styles.datetime} date={this.props.lastSeen} />
							}
							{typeof this.props.active === 'undefined' &&
								<Text style={styles.datetime} title={Utils.formatMessageDatetime(lastMessageDate)}></Text>
							}
						</View>
						<View style={styles.messageContainer}>
							<Text style={styles.message} title={!!lastMessage ? `${lastMessageName}: ${lastMessage.text}` : ''}></Text>
						</View>
					</View>
				</View>
				<View style={styles.borderContainer}>
					<View style={styles.borderOuter}></View>
					<View style={styles.borderMiddle}></View>
					<View style={styles.borderOuter}></View>
				</View>
			</View>
		)
	}

	setNativeProps(props) {
    	this.refs.base.setNativeProps(props);
  	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		flex: 0,
		height: 100
	},
	contentContainer: {
		flexDirection: 'row',
		height: 99,
		flex: 0,
		paddingVertical: 15,
		paddingHorizontal: 23
	},
	borderContainer: {
		height: 1,
		flex: 1,
		flexDirection: 'row'
	},
	borderMiddle: {
		backgroundColor: GlobalStyles.defaults.borderColor
	},
	borderOuter: {
		flex: 0.25
	},
	rightSubcontainer: {
		flex: 1,
		paddingLeft: 25,
		flexDirection: 'column'
	},
	leftSubcontainer: {
		width: 35,
		flex: 0,
		justifyContent: 'center'
	},
	nameContainer: {
		flex: 1,
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: 10,
	},
	messageContainer: {
		paddingBottom: 10
	},
	photo: {
		width: 35,
		height: 35
	},
	active: {
		width: 10,
		height: 10,
		marginTop: 6
	},
	datetime: {
		flex: 1,
		textAlign: 'right',
	},
	name: {
		textAlign: 'left'
	},
	message: {
		textAlign: 'left'
	}
})