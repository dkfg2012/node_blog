const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')


mongolass.connect(config.mongodb)

exports.User = mongolass.model('User', {
	name: { type: "string", required: true },
	password: { type: "string", required: true },
	avatar: { type: "string", required: true },
	gender: { type: "string", enum: ['m', 'f', 'x'], default: 'x'},
	bio: { type: "string", required: true }
})

mongolass.plugin('addCreatedAt', {
	afterFind: function(results){
		results.forEach(function(item){
			item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
		})
		return results
	}, 
	afterFindOne: function(result){
		if(result){
			result.created_at = moment.(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
		}
		return result
	}
})

//saving post, with post author, title, content and number of views into the database
exports.Post = mongolass.model("Post", {
	author: { type: Mongolass.Types.ObjectId, required: true },
	title: { type: 'string', required: true },
	content: { type: 'string', required: true },
	pv: { type: 'number', default: 0 }
})

//show post in descending order according to post id
exports.Post.index({ author: 1, _id: -1}).exec() 

//set name be the only index, to ensure username wont be the same  
exports.User.index({ name: 1 }, { unique: true }).exec()


//saving comment of post
exports.Comment = mongolass.model('Comment', {
	author: { type: Mongolass.Types.ObjectId, required: true }, 
	content: { type: 'string', required: true },
	postId: { type: Mongolass.Types.ObjectId, required: true }
})

//get all comment from the selected article
exports.Comment.index({ postId: 1, _id: 1 }).exec()