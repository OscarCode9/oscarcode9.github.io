var express = require('express');
var router = express.Router();
var controles = require('../controles/sendMessage');




router.get('/', function (req, res, next) {
	res.render('index', { title: 'Oscar | Code' });
})
router.get('/Oscar', function (req, res, next) {
	res.render('sobre_mi', { title: 'Oscar CODE' });
});

router.get('/Blog', controles.QueryPost);

router.post('/Blog',  controles.QueryComent);


router.get('/editor', function (req, res, next) {
	res.render('editor', { title: 'Blog | Oscar Code' })
});



router.get('/perfil', function (req, res, next) {
	res.status(200).send({ Hola: "Hola mundo with express" })
});



router.post('/send', controles.sendMensaje);

module.exports = router;
