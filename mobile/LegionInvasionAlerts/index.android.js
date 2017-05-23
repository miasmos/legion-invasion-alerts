import React, { Component } from 'react'
import { AppRegistry, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { NativeRouter, Route, Link, Redirect, Switch, AndroidBackButton } from 'react-router-native'
import { instance as Store } from './js/services/Store'
import { instance as Geolocation } from './js/services/Geolocation'
import { instance as Enum } from './js/core/enums'
import { instance as GlobalStyles } from './js/global-styles'
import { instance as AndroidNotification } from './js/services/Notification'
import InvasionAlertsAPI from './js/services/InvasionAlertsAPI'

import ChooseLocale from './js/components/ChooseLocale'

var moment = require('moment'),
    config = require('./config.json')

console.disableYellowBox = true

export default class LegionInvasionAlerts extends Component {
    constructor() {
        super()
        this.state = {
            app: {
                loading: true,
                token: undefined,
                locale: 'us',
                didSetLocale: false
            },
            invasion: {
                seed: "1495519200",
                moment: undefined,
                timeUntil: '',
                datetime: '',
                isSoon: false,
                isActive: false,
            },
            duration: config.invasion_duration,
            interval: config.invasion_interval,
            showTimeUntil: true
        }

        Store.GetSettings()
            .then(settings => {
                settings = {}

                console.log('got settings:',settings)
                this.setState({
                    ...this.state,
                    app: {
                        ...this.state.app,
                        loading: false,
                        locale: 'locale' in settings && typeof settings.locale !== 'undefined' ? settings.locale : this.state.app.locale,
                        didSetLocale: 'didSetLocale' in settings && typeof settings.didSetLocale !== 'undefined' ? settings.didSetLocale : this.state.app.didSetLocale
                    },
                    invasion: {
                        ...this.state.invasion,
                        seed: 'seed' in settings && typeof settings.seed !== 'undefined' ? settings.seed : this.state.invasion.seed,
                    },
                    showTimeUntil: 'showTimeUntil' in settings && typeof settings.showTimeUntil !== 'undefined' ? settings.showTimeUntil : this.state.showTimeUntil
                })
            })
            .catch(error => {
                this.setState({
                    ...this.state,
                    app: {
                        ...this.state.app,
                        loading: false
                    }
                })
                console.error(error)
            })
            .finally(() => {
                this.Init()
            })

        AndroidNotification.on('token', this.OnTokenChange.bind(this))
    }

    Init() {
        let nextMoment = moment(this.state.invasion.seed, 'X'),
            now = moment(),
            isActive = false

        while(!nextMoment.isAfter(now)) {
            isActive = !isActive
            nextMoment = this.GetNextInvasionMoment(nextMoment, isActive)
        }

        Store.SaveSetting('seed', nextMoment.format('X'))

        let timeUntil = this.GetTimeUntilInvasion(nextMoment),
            isSoon = this.InvasionIsSoon(nextMoment),
            datetime = this.GetDatetimeOfInvasion(nextMoment)

        this.setState({
            ...this.state,
            invasion: {
                ...this.state.invasion,
                timeUntil,
                isActive,
                isSoon,
                datetime,
                moment: nextMoment
            }
        })

        setInterval(this.Tick.bind(this), 1000)
    }

    render() {
        let word = this.state.invasion.isActive ? 'ends' : 'begins',
            color = this.state.invasion.isSoon && this.state.invasion.isActive ? '#d73e3e' : '#333333'

        return (
            this.state.app.loading ? (
                <View></View>
            ) : !this.state.app.didSetLocale ? (
                <ChooseLocale setLocale={this.SetLocale.bind(this)} />
            ) : (
                <TouchableOpacity onPress={this.ToggleDateFormat.bind(this)}>
                    <View>
                        <Text>
                            {this.state.showTimeUntil ? `Invasion ${word} in` : `Invasion ${word}`}
                        </Text>
                        <Text style={[{color: color}]}>
                            {this.state.showTimeUntil ? this.state.invasion.timeUntil : this.state.invasion.datetime}
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        )
    }

    componentWillUpdate(props, state) {
        if (this.state.app.locale !== state.app.locale) {
            this.OnLocaleChange(state.app.locale)
        }
    }

    Tick() {
        let now = moment(),
            isActive = this.state.invasion.isActive,
            invasion = this.state.invasion.moment,
            seed = this.state.invasion.seed

        if (this.state.invasion.moment.isBefore(now)) {
            isActive = !isActive
            invasion = this.GetNextInvasionMoment(invasion)
            seed = invasion.format('X')

            Store.SaveSetting('seed', seed)
        }

        let timeUntil = this.GetTimeUntilInvasion(invasion),
            datetime = this.GetDatetimeOfInvasion(invasion),
            isSoon = this.InvasionIsSoon(invasion)

        this.setState({
            ...this.state,
            invasion: {
                ...this.state.invasion,
                moment: invasion,
                seed,
                timeUntil,
                datetime,
                isActive,
                isSoon
            }
        })
    }

    OnTokenChange(token) {
        InvasionAlertsAPI.Locale(token, this.state.locale)
            .then(json => {
                console.log('successfully stored token:', token, this.state.locale)
            })
            .catch(error => {
                console.error(error)
            })

        this.setState({
            ...this.state,
            app: {
                ...this.state.app,
                token: token
            }
        })
    }

    OnLocaleChange(locale) {
        if (!!this.state.app.token) {
            InvasionAlertsAPI.Locale(this.state.app.token, locale)
                .then(json => {
                    console.log(json)
                })
                .catch(error => console.error(error))
        }

        if (!this.state.app.didSetLocale) {
            this.setState({
                ...this.state,
                app: {
                    ...this.state.app,
                    didSetLocale: true
                }
            })

            Store.SaveSetting('didSetLocale', true)
        }
    }

    GetTimeUntilInvasion(invasion) {
        if (!invasion) invasion = this.state.invasion.moment

        let now = moment(),
            diff = moment.duration(invasion.diff(now)),
            hours = Math.floor(diff.asHours()),
            minutes = diff.minutes(),
            seconds = diff.seconds()

        return `${hours}h ${minutes}m ${seconds}s`
    }

    GetNextInvasionMoment(invasion, active) {
        if (!invasion) invasion = this.state.invasion.moment
        if (!active) active = this.state.invasion.isActive
        let addition = active ? this.state.duration : this.state.interval
        return invasion.add(addition, 'hours')
    }

    GetDatetimeOfInvasion(invasion) {
        if (!invasion) invasion = this.state.invasion.moment
        let isToday = invasion.isSame(new Date(), "day")
        return (isToday ? 'Today, ' : 'Tomorrow, ') + invasion.format('h:mm A')
    }

    InvasionIsSoon(invasion) {
        if (!invasion) invasion = this.state.invasion.moment
        let now = moment()

        return invasion.diff(now, 'hours') == 0
    }

    ToggleDateFormat() {
        Store.SaveSetting('showTimeUntil', !this.state.showTimeUntil)

        this.setState({
            ...this.state,
            showTimeUntil: !this.state.showTimeUntil
        })
    }

    SetLocale(locale) {
        Store.SaveSetting('locale', locale)

        this.setState({
            ...this.state,
            app: {
                ...this.state.app,
                locale: locale
            }
        })
    }
}

const styles = StyleSheet.create({

})

AppRegistry.registerComponent('LegionInvasionAlerts', () => LegionInvasionAlerts)
