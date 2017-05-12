import React from 'react'
import { AppRegistry, View, StyleSheet} from 'react-native'
import {Text} from './base/BaseComponents'
import Utils from '../core/util/Util'

let moment = require('moment')
moment.updateLocale('en', {
	relativeTime: {
		past: '%s ago',
		s: 'a few seconds',
		m: 'a minute',
		mm: '%d minutes',
		h: 'an hour',
		hh: '%d hours',
		d: 'a day',
		dd: '%d days',
		M: 'a month',
		MM: '%d months',
		y: 'a year',
		yy: '%d years'
	}
})

export default class Contacts extends React.Component {
	componentWillUpdate(props, state) {
		this._isMounted = false
		if (props.date !== this.props.date) {
			this.resetInterval(props)
		}
	}

	componentDidMount() {
		this._isMounted = true
		this.resetInterval(this.props)
	}

	componentWillUnmount() {
		this._isMounted = false
		this.resetInterval(this.props)
	}

	render() {
		let text = `${!!this.props.prepend ? this.props.prepend+' ' : ''}${!!this.props.date ? this.formatDatetime(this.props.date) : ''}${!!this.props.append ? ' '+this.props.append : ''}`
		return (
			<Text style={[styles.text, this.props.style]} title={text}></Text>
		)
	}

	formatDatetime(then) {
		return moment(then).fromNow()
	}

	resetInterval(props) {
		if (!props.date || !this._isMounted) {
			clearInterval(this.interval)
			this.interval = undefined
			return
		}
		let now = moment(Date.now()),
			then = moment(props.date),
			isSameMinute = now.isSame(then, 'minute'),
			isSameHour = now.isSame(then, 'hour')

		if (isSameMinute) interval = 1000  //every second
		else if (!isSameMinute && isSameHour) interval = 1000 * 60  //every minute
		else interval = 1000 * 60 * 60 //every hour

		this.interval = setInterval(this.tick.bind(this), interval)
	}

	tick() {
		this.forceUpdate()
	}
}

const styles = StyleSheet.create({
	text: {}
})