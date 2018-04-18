var express = require('express')
var router = express.Router()
const sha1 = require('sha1')
const conn = require('../lib/conn')


router.get('/login', (req, res, next) => {
	
	let data = {
		title: 'Login'
	}

	if(req.query.error) {
		data.errormessage = "error in displaying the previous error"
	}

	res.render('login', data)
})



router.post('/login', (req, res, next) => {
	const user = req.body.username
	const pass = req.body.password

	const sql = `
	SELECT count(1) AS count
	FROM users
	WHERE username = ? AND password = ?
	`

	conn.query(sql, [user, sha1(pass)], (err, results, field) => {
		
		if(results[0].count > 0) {
			req.session.authenticated = true
			res.redirect('/post')
		} else {
			res.redirect('/login?error=true')
		}
	})
	
})



router.post('/register', (req, res, next) => {
	
	const user = req.body.username
	const pass = req.body.password
	const confirm = req.body.confirmpassword

	if(user === "" || pass === "" || confirm !== pass) {
		res.redirect('/login?error=true')
	} else {
		const sql = `
		INSERT INTO users (username, password) 
		VALUES (?, ?)
		`

		conn.query(sql, [user, sha1(pass)], (err, results, field) => {
			req.session.authenticated = true
			res.redirect('/post')
		})
	}

})

router.get('/logout', (req, res, next) => {
	req.session.destroy(() => {
		res.redirect('/')
	})
})

module.exports = router;



