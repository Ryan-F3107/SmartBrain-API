const handleRegister = (req,res, db, bcrypt) => {
	const {email, name, password} = req.body;
	if(!email || !name || !password) {	//If left empty, then its false
		return res.status(400).json('incorrect form submission');
	}
	// Synchronise way of bcrypt is used, additional Javascript code won't be execute until bcrypt finishes
	const hash = bcrypt.hashSync(password);
		db.transaction(trx => {	//taken from transaction chapter in knex documentation, we use a transaction when we have to do more things than once
			//we use trx instead of db, to do the operations
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')	// we first update the login table
			.returning('email')
			.then(loginEmail => {	// we get and use the loginEmail
				return trx('users')	//we make sure that they are of the same transactions
					.returning('*') //instead of using a select statment, we can return all
					.insert({ //taken from knex documentary, insert category  
						email: loginEmail[0],	//Since we were returning an array.
						name: name,
						joined: new Date()
					})
					.then(user => { //if success 
						res.json(user[0]); // we return user as an object and we only return one user hence 0.	
					})					
			})	//end of then
			.then(trx.commit) //if the transactions passed, needed to add it into the table
			.catch(trx.rollback)	//if anything fails, we roll back.		
		})	//end of transaction
		.catch(err => res.status(400).json(err)) //if any error occurs, don't give out any information to black haters.
}	//end of handleRegister.

module.exports = {
	handleRegister: handleRegister
}