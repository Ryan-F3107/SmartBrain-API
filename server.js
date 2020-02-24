const express = require('express');

const app = express(); //we run express

app.use(express.json());
const database = {
	users: [
	{
		id: '123',
		name: 'John',
		email: 'john@gmail.com',
		password: 'cookies',
		entries: 0, //track score
		joined: new Date() //create a date when the part gets executed
	},
	{
		id: '124',
		name: 'Ryan',
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
	//compare value given in POSTMAN with the value hardcoded in our "database".
	if(req.body.email == database.users[0].email && 
		req.body.password == database.users[0].password) {
		res.json("success");
	}
	else{
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req,res) => {
	const {email, name, password} = req.body;
	database.users.push({
		id: '125',
		name: name,
		email: email,
		password: password,
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

app.listen(3000, () =>{
	console.log('app is running on port 3000');// message after port 3000 is run
});




/* When we send a password, we would want it to be sent through the body so its more secure
We would be creating these end points
 --> res = this is working
 /signin --> POST request, respond with a success /fail
 /register --> POST = user
 /profile/:userID --> GET  = user (return the user)
 /image --> PUT Since we update a score -->user, return the updated user counter
*/