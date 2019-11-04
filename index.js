const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const routes = require('./routes') //refer to the index file in routes folder
const pkg = require('./package')

const app = express()

//set view file directory
app.set('views', path.join(__dirname, 'views'))
//set view engine
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
	name: config.session.key,
	secret: config.session.secret,
	resave: true,
	saveUninitialized: false,
	cookie:{
		maxAge: config.session.maxAge
	},
	store: new MongoStore({
		url: config.mongodb
	})
}))

app.use(flash())

<<<<<<< HEAD
//load constant, used for rendering ejs
app.locals.blog = {
	title: pkg.name,
	description: pkg.description
}

//load variable, used for rendering ejs
app.use(function(req, res, next){
	res.locals.user = req.session.user
	res.locals.success = req.flash('success').toString()
	res.locals.error = req.flash('error').toString()
	next()
})

// 设置模板全局常量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
}

// 添加模板必需的三个变量
app.use(function (req, res, next) {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

routes(app)

app.listen(config.port, function(){
	console.log('${pkg.name} listening on port ${config.port}')
})
