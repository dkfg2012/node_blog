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
		if(!(name.length >= 1 && name.length <= 10){
			throw new Error('name lenght should within 1 to 10')
		})
	}
})

module.exports = router