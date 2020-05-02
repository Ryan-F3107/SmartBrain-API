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
const database = {
	users: [
	{
		id: '123',
		name: 'John',
		password: 'cookies',
		email: 'john@gmail.com',
		password: 'cookies',
		entries: 0, //track score
		joined: new Date() //create a date when the part gets executed
	},
	{
		id: '124',
		name: 'Ryan',
		password: 'Lion',
		email: 'ryansmith@gmail.com',
		password: 'banana',
		entries: 0, //track score
		joined: new Date()
	}
	]
}

app.get('/', (req, res) => { //in root
	res.send(database.users); //can send a json or string, see what users we have
})

// start with the signin endpoint
app.post('/signin', (req,res) => {
	if(req.body.email == database.users[0].email && 
		req.body.password == database.users[0].password) {
		res.json(database.users[0]);
	}
	else{
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req,res) => {
	const {email, name, password} = req.body;
	db('users')
		.returning('*') //instead of using a select statment, we can return all
		.insert({ //taken from knex documentary, insert category  
			email: email,
			name: name,
			joined: new Date()
		})
		.then(user => { //if success 
			res.json(user[0]); // we return user as an object and we only return one user hence 0.	
		})
		.catch(err => res.status(400).json('unable to join')) //if any error occurs, don't give out any information to black haters.
})

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