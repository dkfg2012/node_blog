const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin

router.post('/', checkLogin, function(req, res, next){
	res.send('leave comment')
})

router.get('/:commentId/remove', checkLogin, function(req, res, next){
	res.send('delete comment')	
})

module.exports = router