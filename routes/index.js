const express = require('express');
var router = express.Router();
var controles = require('../controles/sendMessage');
var mysql = require('mysql')
var knox = require('knox');
var fs = require('fs');
const newSubscriptor = require('../controles/newSubcrition');
const deleteSubscriptor = require('../controles/deleteSubcrition');
const getSubscribers = require('../controles/getSubscribers');
const getEmails = require("../controles/getEmail");

const webPush = require('web-push');
const util = require('util');


const VAPID_SUBJECT = process.env.VAPID_SUBJECT;
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY; 
const AUTH_SECRET = process.env.AUTH_SECRET;

if (!VAPID_SUBJECT) {
	return console.log('VAPID_SUBJECT env variable  not found.');
} else if (!VAPID_PUBLIC_KEY) {
	return console.log('VAPID_PUBLIC_KEY env varible not found.');
} else if (!VAPID_PRIVATE_KEY) {
	return console.log('VAPID_PIVATE_KEY env varible not found.');
}

webPush.setVapidDetails(
	VAPID_SUBJECT,
	VAPID_PUBLIC_KEY,
	VAPID_PRIVATE_KEY
);

router.get('/status', async (req, res) => {
	const result = await getEmails();
	console.log('Result', result);
	res.status(200).send({
		APIKEY: webPush.generateVAPIDKeys(),
		result 
	});
});


router.post('/subscribe', async(req, res) => {
	const endPoint = req.fields['notificationEndPoint'];
	const publicKey = req.fields['publicKey'];
	const auth = req.fields['auth'];

	const result = await newSubscriptor(endPoint,publicKey,auth);

	res.status(200).send({isSubscribe:true});
});

router.post('/unsubscribe', async (req, res) => {
	const endPoint = req.fields['notificationEndPoint'];
	try {
		const result = await deleteSubscriptor(endPoint);
		console.log(result);
		res.send({result});
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
	subscribers = subscribers.filter(subs => { endPoint === subs.endpoint });
});

router.post('/notify/all', async(req, res) => {
	console.log(req.fields);
	if (req.get('auth-secret') !== AUTH_SECRET) {
		console.log('Missing or incorrect auth-secret header.');
		return res.sendStatus(401);
	}
	const message = req.fields.message || "Willy Wonk's";
	const clickTarget = req.fields.clickTarget || 'http://oscarcode.herokuapp.com/';
	const title = req.fields.title || 'Push notification received!';

	console.log('Info: ', message, clickTarget, title);
	
	const subscribers = await getSubscribers();
	console.log(subscribers);


	subscribers.forEach(pushSubscription => {
		const payload = JSON.stringify({
			message: message,
			clickTarget: clickTarget,
			title: title
		});
		
		webPush.sendNotification(pushSubscription, payload, {}).then((response) => {
			console.log('Status:', util.inspect(response.statusCode));
			console.log('Headers:', JSON.stringify(response.headers));
			console.log('Body', JSON.stringify(response.body));
			
		}).catch(err => {

			console.log('Status:', util.inspect(err.statusCode));
			console.log('Headers:', JSON.stringify(err.headers));
			console.log('Body', JSON.stringify(err.body));
		});
	});
	res.status(200).send('Subscription accepted');
});

/*
var client = knox.createClient({
	key: process.env.KEY,
	secret: process.env.SECRET,
	bucket: process.env.BUCKET
});
*/

router.get('/', function (req, res, next) {

	res.render('index', { title: 'Oscar | Code' });
});
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


			const conn = mysql.createConnection(process.env.DATABASE_URL);
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

router.get('/Proyectos', function (req, res, next) {
	res.render('proyectos');

});

router.get('/cyptoOscarCode', function (req, res, next) {
	res.render('encrypto');
});

router.get('/codeLife', function (req, res, next) {
	res.render('codeLife')
});

router.get('/aboutReact', function (req, res, next) {
	res.render('aboutReact');
});

router.get('/reactAxiosFetch', function (req, res, next) {
	res.render('reactAxiosFetch');
});

router.get('/workers', function (req, res, next) { 
	res.render('webWorkers');
});


module.exports = router;


