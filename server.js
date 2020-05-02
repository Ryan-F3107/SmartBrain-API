const express = require('express');

const app = express(); //we run express
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');
const knex = require('knex');

const db =knex({ // db is the data base from postgresql 
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'smartbrain'
  }
});

// db.select('*').from('users').then(data => {
// 	console.log(data);
// });

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => { //in root
	res.send(database.users); //can send a json or string, see what users we have
})

// start with the signin endpoint
app.post('/signin', (req,res) => {
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
		})
		.catch(err => res.status(400).json("wrong credentials"))
})

app.post('/register', (req,res) => {
	const {email, name, password} = req.body;
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
		.catch(err => res.status(400).json('unable to join')) //if any error occurs, don't give out any information to black haters.
})	//end of app.post
		

app.get('/profile/:id', (req,res) => { // :id is the taken parameter, the part may be needed for future development. A future endpoint
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
}) //end of app.get

//update user to increase their entry count
app.put('/image', (req,res) => {
	const {id} = req.body;
	//knex is used for the update function, the documentary is used, in the category update and increment
	db('users').where('id','=',id)	//since its SQL we use = and not ==
	.increment('entries',1)//we increment the entry by one where id == id
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})	//end of then
	.catch(err => res.status(400).json('unable to get entries'))	
})


app.listen(3000, () =>{
	console.log('app is running on port 3000');// message after port 3000 is run
});