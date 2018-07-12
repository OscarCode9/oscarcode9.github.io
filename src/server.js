import express from 'express';

const app = express();

app.set('port', process.env.port || 3000);




//start the server
app.listen(app.get('port'), () =>{
  console.log('server on port', app.get('port'));
});