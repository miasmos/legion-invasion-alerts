import Observer from '../core/util/Observer'
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm'
var uuid = require('uuid')

class Notification extends Observer {
	constructor() {
		super()
		this.callbacks = {reply: [], launch: []}

		FCM.requestPermissions()
		FCM.on(FCMEvent.Notification, this._ReplyCallback.bind(this))
		FCM.getFCMToken().then(token => this._TokenCallback(token))
        FCM.on(FCMEvent.RefreshToken, this._TokenCallback.bind(this))
        FCM.getInitialNotification().then(notif => this._LaunchCallback.bind(this, notif))
	}

	Show(message, sender) {
		FCM.presentLocalNotification({
			...this.GetConfig(),
			title: sender,
			body: message
		})
	}

	_TokenCallback(token) {
		this.emit('token', token)
	}

	_ReplyCallback(data) {
		if (!!data.opened_from_tray) this.emit('reply_intent', data)
	}

	_LaunchCallback(data) {
		this.emit('launch_intent', data)
	}

	GetConfig() {
		return {
		    auto_cancel: true,
		    vibrate: 300,
		    ongoing: false,
			click_action: "Reply",
		    body: "My Notification Message",
		    large_icon: "ic_launcher",
		    icon: 'ic_launcher',
		    fire_date: new Date().getTime(),
		    repeat_interval: 'none',
		    sound: 'blank',
		    id: '0',
		    priority: 'high',
		    show_in_foreground: true
		}
	}
}

export let instance = new Notification()