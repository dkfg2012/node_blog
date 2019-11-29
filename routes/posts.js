const express = require('express')
const router = express.Router()
const PostModel = require('../models/posts')
const marked = require('marked')

const checkLogin = require("../middlewares/check.js").checkLogin

//get post publish by someone or any post
router.get('/', function(req, res, next){
	const author = req.query.author
	PostModel.getPosts(author).then(function(posts){
		res.render('posts', {
			posts: posts
		})
	}).catch(next)
})

//create post
//after post, it would go through the middleware checkLogin first,
//so if it has not login, then in the middleware, the request will be redirect to signup page
//and since the response is ended after redirecting, the following would not proceed
router.post('/create', checkLogin, function(req, res, next){
	const author = req.session.user._id
	const title = req.fields.title
	const content = req.fields.content

	//check parameter
	try{
		if(!title.length){
			throw new Error('Please fill in the title')
		}
		if(!content.length){
			throw new Error('Please fill in the content')
		}
	}catch(e){
		req.flash('error', e.message)
		return res.redirect('back')
	}

	let post = {
		author: author,
		title: title,
		content: content
	}

	PostModel.create(post).then(function(result){
		post = result.ops[0]
		req.flash('success', 'publish successfully')
		res.redirect(`/posts/${post._id}`)
	}).catch(next)
})

//post /create is the action, get is go to the page where to create a new post
router.get('/create', checkLogin, function(req, res, next){
	res.render('create')
})

router.get('/:postId', function(req, res, next){
	const postId = req.params.postId
	Promise.all([
		PostModel.getPostById(postId),
		PostModel.incPv(postId)
	]).then(function(result){
		const post = result[0]
		if(!post){
			throw new Error('This article doesnt exist')
		}
		res.render('post', {
			post: post
		})
	}).catch(next)
})

//go to the page of editing post
router.get('/:postId/edit', checkLogin, function(req, res, next){
	const postId = req.params.postId
	const author = req.session.user._id

	PostModel.getRawPostById(postId).then(function(post){
		if(!post){
			throw new Error("This article doesnt exist")
		}
		if(author.toString() !== post.author._id.toString()){
			throw new Error('You are not allowed to edit this article')
		}
		res.render('edit', {
			post: post
		})
	})
	.catch(next)
})

router.post('/:postId/edit', checkLogin, function(req, res, next){
	const postId = req.params.postId
	const author = req.session.user._id
	const title = req.fields.title
	const content = req.fields.content
	try{
		if(!title.length){
			throw new Error('Please enter the title')
		}
		if(!content.length){
			throw new Error("Please enter content")
		}
	}catch(e){
		req.flash('error', e.message)
		return res.redirect('back')
	}
	PostModel.getRawPostById(postId).then(function(post){
		if(!post){
			throw new Error('This article doesnt exist')
		}
		if(post.author._id.toString() !== author.toString()){
			throw new Error('You are not allowed to edit this article')
		}
		PostModel.updatePostById(postId, {title: title, content: content}).then(function(){
			req.flash('success', 'Edit successfully')
			res.redirect(`/post/${postId}`)
		})
		.catch(next)
	})
})

router.get('/:postId/remove', checkLogin, function(req, res, next){
	const postId = req.params.postId
	const author = req.session.user._id

	PostModel.getRawPostById(postId).then(function(post){
		if(!post){
			throw new Error('This article doesnt exist')
		}
		if(post.author._id.toString() !== author.toString()){
			throw new Error('You are not allowed to edit this article')
		}
		PostModel.delPostById(postId).then(function(){
			req.flash('success', 'delete the article successfully')
			res.redirect('/posts')
		})
		.catch(next)
	})
})

module.exports = router