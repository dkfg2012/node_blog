const User = require('../lib/mongo').User

module.exports = {
	//create an user
	create: function create(user){
		return User.create(user).exec()
	}, 

	//get user information by username
	getUserByName: function getUserByName(name){
		return User
			.findOne({ name: name })
			.addCreateAt() //a plugin from mongo
			.exec()
	}
}