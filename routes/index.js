var express = require('express');
var router = express.Router();
const conn = require('../lib/conn')
var path = require('path')
var multer = require('multer')

const upload = multer({
	dest: path.join(__dirname, '../public/images')
}) 


/* GET home page. */
router.get('/', function(req, res, next) {
	const sql = `
	SELECT 
		*
	FROM 
		categories 
	`

	let data = {
		title: 'Las Vegas'
	}
	

	conn.query(sql, (err, results, fields) => {
		data.categories = results.filter(result => result.parent_id === null)
		data.categories.map(cat => {
			let subcat = results.filter( result => {
				if (result.parent_id === cat.id){
					return result
				}
			})
			cat.subcategories = subcat
		})
		res.render('home', data)
	})
})

//get specific category page
router.get('/category/:category', function(req, res, next) {
	let cat = req.params.category

	const sql = `
	SELECT 
		*
	FROM 
		listings
	`
	

	conn.query(sql, (err, results, fields) => {
		let data = {
			category: cat,
			titlemain: cat,
			list : results.filter(listing => listing.category_name === cat)
		}
		// console.log(data.list)
		res.render('sub', data)
	})
	
})







//get summary categories

router.get ('/category/summary/:category/:id', function(req, res, next) {
	let catname = req.params.category
	let catid = req.params.id

	const sql = `
	SELECT 
		*
	FROM 
		categories 
	WHERE parent_id = ${catid}
	`

	conn.query(sql, (err, results, fields) => {
		let data = {
			title: catname,
			subcat : results
		}

		// console.log(data.subcat)
		res.render('summary',data)
	})
})

router.get('/category/listing/:catname/:listid', function(req, res, next) {
	let listid = req.params.listid
	let catname = req.params.catname
	const sql = `
	SELECT * 
	FROM listings 
	WHERE id = ${listid}
	`

	conn.query(sql, (err, results, fields) => {
		let data = {
			titlemain: catname,
			info : results
		}
		// console.log(data)
		res.render('listing', data)
	})
})







//get post page
router.get('/post',  function(req, res, next) {
	res.render('post')
})

//post to db
router.post('/addimage', upload.single('picture'), (req, res, next) => {
	console.log(req.file.filename)
	const title = req.body.title
	const description = req.body.description
	const picture = '/images/' + req.file.filename
	const category = req.body.selectchoice

	const sql = `
	INSERT INTO listings 
		(title, category_name, description, listing_image)
	VALUES 
		(?, ?, ?, ?)`


		conn.query(sql, [title, category, description, picture], (err, results, fields) => {
			res.redirect('/category/' + category)
		})
})


  

























module.exports = router;
