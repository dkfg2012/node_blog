const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

router.get('/', checkLogin, function(req, res, next){
	req.session.user = null; //remove session's user 
	req.flash('success','logout successfully')
	res.send('/posts')
})

module.exports = router