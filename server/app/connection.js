'use strict'
import Service from '../../core/services/Service'
import Observer from '../../core/util/Observer'
import {instance as Enum} from '../../core/enums'

var Log = Service.Log()

export default class Connection extends Observer {
	constructor(id, socket) {
		super()
		this.id = id
		this.socket = socket
	}

	Send(message) {
		this._send(Enum.websocket.messageTypes.TEXT, message)
	}

	SendJSON(message) {
		this._send(Enum.websocket.messageTypes.JSON, message)
	}

	_send(type, data) {
		this.socket.sendUTF(JSON.stringify({
			type: type,
			data: data
		}))
	}

	OnMessage(message) {
		if (message.type === 'utf8') {
			try {
				let json = JSON.parse(message.utf8Data)

				if ('data' in json) {
					this.emit('message', json.data)
				} else {
					Log.Error(`Message contained no valid data: ${json.data}`)
				}
			} catch(e) {
				Log.Error(`Failed to parse message: ${message.utf8Data}`)
			}
		}
	}

	OnDisconnected() {
		Log.Say(`${this.id} disconnected.`, 'green')
		this.emit('disconnected')
	}

	OnConnected() {
		Log.Say(`${this.id} connected.`, 'green')
		this.emit('connected')
	}

	Disconnect() {
		this.socket.close()
	}
}