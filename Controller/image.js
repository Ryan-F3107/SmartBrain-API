const handleImage = (req,res, db) => {
	const {id} = req.body;
	//knex is used for the update function, the documentary is used, in the category update and increment
	db('users').where('id','=',id)	//since its SQL we use = and not ==
	.increment('entries',1)//we increment the entry by one where id == id
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})	//end of then
	.catch(err => res.status(400).json('unable to get entries'))	
}

module.exports = {
	handleImage
}