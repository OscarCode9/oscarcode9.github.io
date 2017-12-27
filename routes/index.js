

var express = require('express');
var router = express.Router();
var controles = require('../controles/sendMessage');
var mysql = require('mysql')
var knox = require('knox');
var fs = require('fs');

var client = knox.createClient({
	key:process.env.KEY,
	secret:process.env.SECRET,
	bucket:process.env.BUCKET
});





router.get('/', function (req, res, next) {
	res.render('index', { title: 'Oscar | Code' });
})
router.get('/Oscar', function (req, res, next) {
	res.render('sobre_mi', { title: 'Oscar CODE' });
});

router.get('/Blog', controles.QueryPost);

router.post('/Blog', controles.QueryComent);


router.get('/editor', function (req, res, next) {
	res.render('editor', { title: 'Blog | Oscar Code' })
});



router.get('/perfil', function (req, res, next) {
	res.status(200).send({ Hola: "Hola mundo with express" })
});

router.get('/blogRealTime', function (req, res, next) {
	res.render('blogRealTime', { title: 'Blog | Oscar Code' })
})

router.get('/addPost', function (req, res, next) {
	res.render('addPost')
});

router.post('/addPost', function (req, res, next) {

	const titulo = req.fields.titulo;
	const descripcion = req.fields.descripcion;
	const pathImg = req.files.img.path;
	const name = req.fields.imgName;
	const postName = req.fields.postName;

	var exten = name.split('.').pop();
	var num = Math.floor((Math.random() * 1000) + 1);

	client.putFile(pathImg, `/${Date.now() + num}.${exten}`, { 'x-amz-acl': 'public-read' }, function (err, response) {
		if (err) return res.status(500).send(err);

		const url = response.req.url;
		var con = require('./defaultCon');

		

		var fileContent = con.contenido();


		var filepath = `views/${postName}.hbs`;

		fs.writeFile(filepath, fileContent, (err) => {
			if (err) throw err;

			console.log("The file was succesfully saved!");
			console.log(response.req.url);

			const conn = mysql.createConnection('mysql://j8zdtysyz41uv9iq:yniktu2ff31goblf@ysp9sse09kl0tzxj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/wcrk58io9f4zgrff');
			conn.connect();
			conn.query(`select max(idPost) maxNum from Post;`, function (err, rows, fields) {
				if (err) {
					connection.end();
					return read.status(500).send(err);
				} else {
					let numMax = Number(rows[0].maxNum);
					numMax = numMax + 1;
					console.log(numMax)
					conn.query(`insert into Post values(${numMax},'${titulo}',0,sysdate(), '${url}','${descripcion}', '${postName}');`, function (err, rows, fields) {
						if (err) {
							conn.end();
							return res.status(500).send(err)
						} else {
							conn.end();
							res.status(200).send({ enviado: 'Esto esta chido' })
						}
					});
				}
			});
		});
	});

});

router.post('/send', controles.sendMensaje);
router.get('/newt', function (req, res, next) {
	res.render('mynewfile')
});

module.exports = router;


