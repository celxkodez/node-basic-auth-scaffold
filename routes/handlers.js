const router = require('express').Router()
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

module.exports = router
