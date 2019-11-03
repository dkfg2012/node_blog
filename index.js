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

routes(app)

app.listen(config.port, function(){
	console.log('${pkg.name} listening on port ${config.port}')
})
