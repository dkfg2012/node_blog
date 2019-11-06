const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

router.get('/', checkNotLogin, function(req, res, next){
	res.render('signup')
})

router.post('/', checkNotLogin, function(req, res, next){
	const name = req.fields.name
	const gender = req.fields.gender
	const bio = req.fields.bio
	const avatar = req.files.avatar.path.split(path.sep).pop()
	let password = req.fields.password
	const repassword = req.fields.repassword

	try{
		if(!(name.length >= 1 && name.length <= 10)){
			throw new Error('name length should within 1 to 10')
		}
		if(['m','f','x'].indexOf(gender) === -1){
			throw new Error('gender must be m, f or x')
		}
		if(!(bio.length >= 1 && bio.length <= 30)){
			throw new Error('bio should within 30 words')
		}
		if(!req.files.avatar.name){
			throw new Error("require name")
		}
		if(password.length < 6){
			throw new Error("password should larger than 6")
		}
		if(password !== repassword){
			throw new Error('password is different with repassword')
		}
	}catch(e){
		fs.unlink(req.files.avatar.path) //if register failed, unlink the uploaded image
		req.flash('error', e.message)
		return res.redirect('/signup')
	}

	password = sha1(password) //encrypt password

	let user = {
		name: name,
		password: password,
		gender: gender,
		bio: bio,
		avatar: avatar
	}

	//write into database
	UserModel.create(user).then(function(result){
		user = result.ops[0]
		delete user.password //write user data into session, but delete the password 
		req.session.user = user
		req.flash('success', 'registration success')
		res.redierct('/posts')
	}).catch(function(e){
		fs.unlink(req.files.avatar.path)
		//duplicate key is a mongodb error
		if(e.message.match('duplicate key')){
			req.flash('error', 'username is already used')
			return res.redirect('/signup')
		}
	})
	next(e)
})

module.exports = router