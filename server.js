const express = require('express');

const app = express(); //we run express
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');

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
	// 	// Load hash from your password DB.
	// bcrypt.compare("bacon", hash, function(err, res) {
	//     // res == true
	// });
	// bcrypt.compare("veggies", hash, function(err, res) {
	//     // res = false
	// });
	//compare value given in POSTMAN with the value hardcoded in our "database".
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
	//convert password into hash using bcrypt.
	bcrypt.hash(password, null, null, function(err, hash) {
		console.log(hash);
	    // Store hash in your password DB.
	});
	database.users.push({
		id: '125',
		name: name,
		email: email,
		entries: 0, //track score
		joined: new Date() 
	})
	res.json(database.users[database.users.length - 1]);
})

app.get('/profile/:id', (req,res) => { // :id is the taken parameter
	const {id} = req.params;
	var found = false;
	database.users.forEach(user => {
		if(user.id === id) {
			found = true;
			return res.json(user);
		}
	})
	if(!found){
		res.status(404).json('No such user');
	}
})

//update user to increase their entry count
app.put('/image', (req,res) => {
	const {id} = req.body;
	var found = false;
	database.users.forEach(user => {
		if(user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	})
	if(!found){
		res.status(404).json('No such user');
	}
})


app.listen(3000, () =>{
	console.log('app is running on port 3000');// message after port 3000 is run
});