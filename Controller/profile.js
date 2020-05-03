const handleProfileGet = (req, res, db) => { // :id is the taken parameter, the part may be needed for future development. A future endpoint
	const {id} = req.params;
	db.select('*').from('users').where({id: id})
		.then(user => {	//it will return the user
			if(user.length) { // if the length is one which is also true
				res.json(user[0])
			} else {
				res.status(400).json('Not found')
			}
	})
		.catch(err => res.status(400).json('Error getting user'))
} //end of handleProfileGet

module.exports = {
	handleProfileGet
}