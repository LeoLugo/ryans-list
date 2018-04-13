var express = require('express');
var router = express.Router();
const conn = require('../lib/conn')
var path = require('path')


/* GET home page. */
router.get('/', function(req, res, next) {
	const sql = `
	SELECT 
		*
	FROM 
		catagories 
	`

	let data = {
		title: 'exp'
	}
	// conn.connect()

	conn.query(sql, (err, results, fields) => {
		data.catagories = results.filter(result => result.parent_id === null)
		data.catagories.map(cat => {
			let subcat = results.filter( result => {
				if (result.parent_id === cat.id){
					return result
				}
			})
			cat.subcatagories = subcat
		})
		console.log(data)
		// res.json(data)
		res.render('home', data)
	})
})
	

  

module.exports = router;
