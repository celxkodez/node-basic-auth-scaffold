//require all the needed modules
const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const passport = require('passport')
const routes = require('./routes/handlers')
const flash = require('connect-flash');
const passportlocalstrategy = require('./config/passportlocalstrategy')

const app = express()
const PORT = process.env.PORT || 5000

//setting up the middlewares
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'main' }))
app.set('view engine', 'hbs')
app.use(express.static(__dirname + '/public'))
app.use(
  session({ secret: 'mysecret key', resave: false, saveUninitialized: true })
)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//setting up passport
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((id, done) => {
  done(null, user)
})
passport.use('local', passportlocalstrategy)
app.use(flash());
app.use(routes)

app.listen(PORT, () => {
  console.log(`> server running on http://localhost:${PORT}`)
})
