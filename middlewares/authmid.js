module.exports = (req, res, next) => {
	
	if(req.session.authenticated) {
		var onemin = 60000
		req.session.cookie.expires = new Date(Date.now() + onemin)
		req.session.cookie.maxAge = onemin
		next()
	} else {
		res.redirect('/login')
	}
}