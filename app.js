//require all the needed modules
const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const passport = require('passport')
const localstrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { Pool, Client } = require('pg')
const router = require('./routes/handlers')

const app = express()
const PORT = process.env.PORT || 5000

// connect to  postgres database
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'my_blog',
  password: process.env.PGPASSWORD || 'ADMIN',
  port: '5432',
})

//setting up the middlewares
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'main' }))
app.set('view engine', 'hbs')
app.use(express.static(__dirname + '/public'))
app.use(
  session({ secret: 'mysecret key', resave: false, saveUninitialized: true })
)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/', router)

//setting up passport
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((id, done) => {
  done(null, user)
})
passport.use(
  'local',
  new localstrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      loginAttempt()
      async function loginAttempt() {
        const client = await pool.connect()
        try {
          await client.query('BEGIN')
          var currentAccountsData = JSON.stringify(
            client.query(
              'SELECT id, username, email, password FROM users WHERE email=$1',
              [username],
              (err, result) => {
                if (err) return done(err)

                if (result.rows[0] == null) {
                  return done(null, false)
                } else {
                  bcrypt.compare(
                    password,
                    result.rows[0].password,
                    (err, check) => {
                      if (err) {
                        console.log(`Error while checking password`)
                        return done()
                      } else if (check) {
                        return done(null, [
                          {
                            email: result.rows[0].email,
                            username: result.rows[0].username,
                          },
                        ])
                      } else {
                        return done(null, false)
                      }
                    }
                  )
                }
              }
            )
          )
        } catch (error) {
          throw error
        }
      }
    }
  )
)

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/account',
    failureRedirect: 'login',
    failureFlash: false,
  }),
  (req, res) => {
    console.log('on passport')
    // if (req.body.remember) {
    //   req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000 // Cookie expires after 30 days
    // } else {
    //   req.session.cookie.expires = false // Cookie expires at end of session
    // }
    res.redirect('/index')
  }
)

app.post('/signup', async function (req, res) {
  try {
    const client = await pool.connect()
    console.log('client passed')
    await client.query('BEGIN')
    var pwd = await bcrypt.hash(req.body.password, 5)
    console.log('bcrypt passed')
    JSON.stringify(
      client.query(
        'SELECT id FROM users WHERE "email"=$1',
        [req.body.email],
        function (err, result) {
          console.log(result)
          console.log(err)
          if (result?.rows[0]) {
            req.flash(
              'warning',
              'This email address is already registered. <a href=’login’>Log in!</a>'
            )
            res.redirect('signup')
          } else {
            client.query(
              'INSERT INTO users ("username", email, password) VALUES ($1, $2, $3)',
              [req.body.username, req.body.name, req.body.email, pwd],
              function (err, result) {
                if (err) {
                  console.log(err)
                } else {
                  client.query('COMMIT')
                  console.log(result)
                  req.flash('success', 'User created.')
                  res.redirect('account')
                  return
                }
              }
            )
          }
        }
      )
    )
    client.release()
  } catch (e) {
    throw e
  }
})

app.listen(PORT, () => {
  console.log(`> server running on http://localhost:${PORT}`)
})
