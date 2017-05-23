var Sequelize = require('sequelize')

export default class Models {
	constructor(connection) {
		this.connection = connection

		this.User = connection.define('User', {
			token: {
				type: Sequelize.STRING(),
				field: 'notificationToken',
				primaryKey: true,
				allowNull: false
			},
			locale: {
				type: Sequelize.STRING(),
				field: 'locale',
				primaryKey: false,
				allowNull: false
			}
		}, {
			freezeTableName: true
		})
		this.User.sync()
	}
}