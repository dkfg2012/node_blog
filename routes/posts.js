const express = require('express')
const router = express.Router()

const checkLogin = require("../middlewares/check.js").checkLogin

//get post publish by someone or any post
router.get('/', function(req, res, next){
	res.send("main hello")
})

//create post
//after post, it would go through the middleware checkLogin first,
//so if it has not login, then in the middleware, the request will be redirect to signup page
//and since the response is ended after redirecting, the following would not proceed
router.post('/create', checkLogin, function(req, res, next){
	res.send('post article')
})

//post /create is the action, get is go to the page where to create a new post
router.get('/create', checkLogin, function(req, res, next){
	res.send('to post article')
})

router.get('/:postId', function(req, res, next){
	res.send('detail page')
})

//go to the page of editing post
router.get('/:postId/edit', checkLogin, function(req, res, next){
	res.send('edit post page')
})

router.post('/:postId/edit', checkLogin, function(req, res, next){
	res.send('edit post')
})

router.get('/:postId/remove', checkLogin, function(req, res, next){
	res.send('delete post')
})

module.exports = router
