var request = require('request'),
	bodyParser = require('body-parser'),
	express = require('express'),
	app = express();
	
app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(err, req, res, next)
{
	console.error(err.stack);
	res.status(500);
	res.json({"status":"401","message":err.message});
});

app.listen(app.get('port'),function() 
{
	console.log('App is running, keep the ship steady on a heading to port: ',app.get('port'));
});

app.get('/',function(req,res)
{
	var opts = {title:"Home Page"};
	res.render('pages/index',opts);	
});

app.all('*',function(req,res)
{
	console.log("[ERROR] URL NOT FOUND!");
	res.json({"status":"401","message":"Invalid URL"});	
});