const express = require('express'); //guardar express en una variable de servidor
const router = express.Router(); //usar modulo de router de ex´press


/* const UserController = require('../controllers/UserController');
const ProjectosController = require('../controllers/ProjectosController'); */


router.get('/', (req, res) => {
	//res.send('holoo');
	res.render('index.html'); 
});

module.exports = router;


