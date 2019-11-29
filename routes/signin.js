const express = require('express')
const router = express.Router()
const sha1 = require('sha1')

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

//middleware checkNotLogin, would hinder the login in this moment, the reason is unknown yet
// router.get('/', function(req, res, next){
// 	res.send('login page')
// })


router.get('/', function(req, res, next){
	res.render('signin')
})

router.post('/', function(req, res, next){
	const name = req.fields.name
	const password = req.fields.password

	try{
		if(!name.length){
			throw new Error('Please enter username')
		}
		if(!password.length){
			throw new Error('Please enter password')
		}
	}catch(e){
		req.flash('error', e.message)
		return res.redirect('back')
	}

	UserModel.getUserByName(name)
		.then(function(user){
			if(!user){
				req.flash('error', 'User doesnt exist')
				return res.redirect('back')
			}
			if(sha1(password) !== user.password){
				req.flash('error', 'Username or Password incorrect')
				return res.redirect('back')
			}
			req.flash('success', 'login sucess')
			delete user.password
			res.redirect('/posts')
		})
		.catch(next)
})

module.exports = router