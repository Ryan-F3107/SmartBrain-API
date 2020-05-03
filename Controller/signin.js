// start with the signin endpoint
const handleSignin =  (db, bcrypt) => (req, res) => {	//another way of doing it, it runs twice with both the parameters
	db.select('email','hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if(isValid){
				return db.select('*').from('users')
				.where('email', '=', req.body.email)
				.then(user => {
					res.json(user[0])
				})
				.catch(err => res.status(400).json('unable to get user'))
			}	//end of if statement
			else {res.status(400).json("wrong credentials")
		}
		})	//	end of then.
		.catch(err => res.status(400).json("wrong credentials"))
}	//	end of handleSignin

module.exports = {
	handleSignin: handleSignin
}