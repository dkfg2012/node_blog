const marked = require('marked')
const Post = require('../lib/mongo').Post

Post.plugin('contentToHtml', {
	afterFind: function(posts){
		return posts.map(function(post){
			post.content = marked(post.content) //marked is a parser that can change markdown(consider as 
												//a web language, file syntax end with .md) to html
			return post
		})
	},
	afterFindOne: function(post){
		if(post){
			post.content = marked(post.content)
		}
		return post
	}
})

//create a new post 
module.exports = {
	//create one post
	create: function create(post){
		return Post.create(post).exec()
	},
	//get one post by post_id
	getPostById: function getPostById(postId){
		return Post
			.findOne({ _id: postId })
			.populate({ path: 'author', model:'User' })
			.addCreatedAt()
			.contentToHtml()
			.exec()
	},
	//get all post or post from specific author in descending order by time
	getPosts: function getPosts(author){
		const query = {}
		if(author){
			query.author = author
		}
		return Post
			.find(query)
			.populate({ path: 'author', model: 'User' })
			.sort({ _id: -1})
			.addCreatedAt()
			.contentToHtml()
			.exec()
	},
	//add post view point
	incPv: function incPv(postId){
		return Post
			.update({ _id: postId }, { $inc: { pv:1 }})
			.exec()
	},

	getRawPostById: function getRawPostById(postId){
		return Post
			.findOne({ _id: postId })
			.populate({ path: 'author', model:'User' })
			.exec()
	},

	updatePostById: function updatePostById(postId, data){
		return Post.update({ _id: postId }, { $set: data })
			.exec()
	},

	delPostById: function delPostById(postId){
		return Post.deleteOne({ _id: postId })
			.exec()
	}


}