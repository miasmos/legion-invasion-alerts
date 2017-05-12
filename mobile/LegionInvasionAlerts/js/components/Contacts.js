import React from 'react'
import { AppRegistry, View, TouchableOpacity, TextInput, StyleSheet, ListView } from 'react-native'
import { Link } from 'react-router-native'
import {Text, LargeText, Button} from './base/BaseComponents'
import Contact from './Contact'
import Utils from '../core/util/Util'

export default class Contacts extends React.Component {
	constructor() {
		super()
		this.rows = []
		this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
	}

	componentDidMount() {
		let rows = this.rows || this.generateRows(this.props)
		this.dataSource = this.dataSource.cloneWithRows(rows)
		if (!this.rows.length) {
			this.rows = rows
			this.forceUpdate()
		}
	}

	componentWillUpdate(props, state) {
		let rows = this.generateRows(props)
		if (this.rows !== rows) {
			this.dataSource = this.dataSource.cloneWithRows(rows)
			this.rows = rows
		}
	}

	generateRows(props) {
		if (!props) return []

		let arr = []
		for (var key in props.conversations) {
			let convo = props.conversations[key]

			if (convo.show) arr.push({
				...convo
			})
		}

		var swapped, temp  //bubble sort
	    do {
	        swapped = false
	        for (var i=0; i < arr.length-1; i++) {
	            if (arr[i].lastMessage < arr[i+1].lastMessage) {
	                temp = arr[i]
	                arr[i] = arr[i+1]
	                arr[i+1] = temp
	                swapped = true
	            }
	        }
	    } while (swapped)

	    arr.forEach((value, index) => arr[index].key = index)

	    return arr
	}

	render() {
		return this.props && !!this.props.conversations && Object.keys(this.props.conversations).length ? (
			<ListView
				style={styles.listView}
				contentContainerStyle={styles.listViewContainer}
				dataSource={this.dataSource}
				renderRow={data =>
					<Link to={`/convo/${data.id}`} replace={false}>
						<Contact {...data} />
					</Link>
				}
			/>
		) : (
			<View style={styles.defaultText} ><Text title="You have no friends."></Text></View>
		)
	}
}

const styles = StyleSheet.create({
	listView: {
		flex: 1
	},
	listViewContainer: {
		flex: 0,
		justifyContent: 'flex-start'
	},
	defaultText: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
})