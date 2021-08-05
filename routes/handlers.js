const router = require('express').Router()
const bcrypt = require('bcrypt')
const { Pool, Client } = require('pg')
const passport = require('passport')
const session = require('express-session')
const exphbs = require('express-handlebars')

const pool = new Pool({
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'my_blog',
    password: process.env.PGPASSWORD || '1111',
    // password: '',
    port: '5432',
})

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

router.get('/', (req, res) => {
  res.render('index', { title: 'Homepage', style: 'index.css' })
})

router.get('/login', (req, res) => {
  res.render('login', { title: 'login', style: 'main.css' })
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('login')
})

router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Registration', style: 'main.css' })
})

//if users isn't logged in,restrict access to the homepage.
router.get('/account', isLoggedIn, (req, res) => {
  res.render('index', { title: 'account', style: 'index.css' })
})

router.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/account',
      failureRedirect: 'login',
      failureFlash: false,
    }),
    (req, res) => {
      console.log('on passport')
      if (req.body.remember) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000 // Cookie expires after 30 days
      } else {
        req.session.cookie.expires = false // Cookie expires at end of session
      }
      res.redirect('/index')
    }
)

router.post('/signup', async function (req, res) {
  try {
    const client = await pool.connect()
    console.log('client passed')
    await client.query('BEGIN')
      console.log('password'+req.body.password)
    var pwd = await bcrypt.hash(req.body.password, 5)
    console.log('bcrypt passed')
    JSON.stringify(
        client.query(
            'SELECT id FROM users WHERE "email"=$1',
            [req.body.email],
            function (err, result) {
              console.log(result)
              console.log(err)
              if (result.rows[0]) {
                req.flash(
                    'warning',
                    'This email address is already registered. <a href=’login’>Log in!</a>'
                )
                res.redirect('signup')
              } else {
                client.query(
                    'INSERT INTO users ("name", email, password) VALUES ($1, $2, $3)',
                    [req.body.name, req.body.email, pwd],
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


module.exports = router
