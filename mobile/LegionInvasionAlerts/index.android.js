import React, { Component } from 'react'
import { AppRegistry, StyleSheet, Text, View } from 'react-native'
import { NativeRouter, Route, Link, Redirect, Switch, AndroidBackButton } from 'react-router-native'
import { instance as Store } from './js/services/Store'
import { instance as Enum } from './js/core/enums'
import { instance as GlobalStyles } from './js/global-styles'
import { instance as AndroidNotification } from './js/services/Notification'
import InvasionAlertsAPI from './js/services/InvasionAlertsAPI'

var moment = require('moment')

GlobalStyles.Load()
console.disableYellowBox = true

export default class LegionInvasionAlerts extends Component {
    constructor() {
        super()
        this.state = {
            seed: 1495067400,
            nextInvasion: undefined,
            timeUntil: {}
        }

        let temp = moment(this.state.seed, 'X'),
            now = moment()

        while(true) {
            if (temp.isAfter(now)) {
                this.state.nextInvasion = temp
                break
            } else {
                temp = temp.add(18.5, 'hours') //6 hours on, 12.5 hours off
            }
        }

        this.state.timeUntil = this.GetTimeUntilNextInvasion()
        AndroidNotification.on('token', this.OnTokenChange.bind(this))
        setInterval(this.Tick.bind(this), 1000)
    }

    componentDidMount() {
        console.log(this.state.nextInvasion.format('LLL'))
    }

    render() {
        return (
        <View style={styles.container}>
            <Text style={styles.welcome}>
                {this.state.timeUntil.hours}h {this.state.timeUntil.minutes}m {this.state.timeUntil.seconds}s
            </Text>
        </View>
        );
    }

    Tick() {
        this.setState({
            ...this.state,
            timeUntil: this.GetTimeUntilNextInvasion()
        })
    }

    OnTokenChange(token) {
        InvasionAlertsAPI.Token(token)
            .then(json => {
                console.log('successfully stored token:', token)
            })
            .catch(error => {
                console.error(error)
            })
    }

    GetTimeUntilNextInvasion() {
        let now = moment(),
            diff = moment.duration(this.state.nextInvasion.diff(now))

        return {
            hours: Math.floor(diff.asHours()),
            minutes: diff.minutes(),
            seconds: diff.seconds()
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
})

AppRegistry.registerComponent('LegionInvasionAlerts', () => LegionInvasionAlerts)
