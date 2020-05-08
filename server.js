const express = require('express');

const app = express(); //we run express
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');
const knex = require('knex');

const register = require('./Controller/register');
const signin = require('./Controller/signin');
const profile = require('./Controller/profile');
const image = require('./Controller/image');

const db =knex({ // db is the data base from postgresql 
  client: 'pg',
  connection: {
    host : 'process.env.DATABASE_URL',
    ssl: true
  }
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { //in root
	res.send("It is working")}); //can send a json or string, see what users we have.

app.post('/signin', signin.handleSignin(db, bcrypt));	//db, bcrypt runs first and then it takes req and res
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)}); // we add the dependency of whatever handleRegister needs 
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)});
//update user to increase their entry count
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PORT, () =>{
	console.log(`app is running on port ${process.env.PORT}`);// message after port 3000 is run
});