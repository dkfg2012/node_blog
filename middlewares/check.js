module.exports = {
	checkLogin: function checkLogin(req, res, next){
		if(!req.session.user){
			req.flash("error", "login first")
			return res.redirect("/signup")
		}
	next()
	},

	checkNotLogin: function checkNotLogin(req, res, next){
		if(!req.session.user){
			req.flash("error", "logined")
			return res.redirect("back")
		}
		next()
	}
}
