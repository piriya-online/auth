var express = require('express')
  , routes = require('./routes')
  , http = require('http')
	, favicon = require('serve-favicon')
	, logger = require('morgan')
	, methodOverride = require('method-override')
	, bodyParser = require('body-parser')
	, errorHandler = require('errorhandler')
	, cookieParser = require('cookie-parser')
  , path = require('path')
  , config = require('./config.js')
  , i18n = require('i18n');

i18n.configure({
	locales: ['th', 'en'],
	defaultLocale: 'th',
	directory: __dirname + '/locales'
});

var app = express();

app.set('port', config.port || 9999);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
//app.use(requireHTTPS);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(i18n.init);
app.use(cookieParser(config.cookie.password));
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
	app.use(errorHandler());
}

app.get('*', function(req, res, next) {

	if (typeof req.cookies.language == 'undefined') {
		res.cookie('language', 'th', {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
		req.setLocale('th');
	} else {
		req.setLocale(req.cookies.language);
	}
	
	if (typeof req.cookies.remember == 'undefined') {
		res.cookie('remember', '0', {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
	}

	if (typeof req.headers.referer != 'undefined' && req.headers.referer.indexOf(config.refererUrl) == -1) {
		var split = req.headers.referer.split('/');
		var referer = split[0]+'//'+split[2];
		res.cookie('site', referer, {signed: true, secure: true, expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
	}
	if (typeof req.signedCookies.site == 'undefined') {
		res.cookie('site', config.defaultRedirectUrl, {signed: true, secure: true, expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
	}

	res.cookie('url', req.url, {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});

	if (typeof req.signedCookies.authKey != 'undefined') {
		
		var request = require('request');
		
		request.post({headers: { 'referer': config.refererUrl }, url: config.apiPostUrl + '/member/exist/auth', form: { authKey: req.signedCookies.authKey.toString()} }, function (error, response, body) {
			routes.process(req, res, 'checkAuth', body);
		});
		//var util = require('./objects/util');
		//util.postData(req, res, routes, 'checkAuth', '/member/exist/auth', 'authKey='+req.signedCookies.authKey.toString());
	}
	else {
		next();
	}
});

app.get('/', function(req, res) {
	routes.index(req, res);
});

app.get('/lock', function(req, res) {
	if (typeof req.signedCookies.username != 'undefined' && typeof req.cookies.name != 'undefined') {
		routes.lock(req, res);
	}
	else {
		res.redirect('/');
		//res.send('/');
	}
});

app.get('/language/:lang', function(req, res) {
	res.cookie('language', req.params.lang, {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
	res.cookie('url', '/', {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
	req.setLocale(req.params.lang);
	//res.send('/');
	res.redirect('/');
});

app.get('/auth/:authKey/:username/:remember/:name', function(req, res) {
	if (req.params.remember == '1')
		res.cookie('authKey', req.params.authKey, {signed: true, secure: true, expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
	else
		res.cookie('authKey', req.params.authKey, {signed: true, secure: true});

	res.cookie('name', req.params.name, {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
	res.cookie('remember', req.params.remember, {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
	res.cookie('username', req.params.username, {signed: true, secure: true, expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
	res.cookie('url', '/', {expires: new Date(Date.now() + config.cookie.expire ), maxAge: config.cookie.expire});
	//if (typeof req.signedCookies.site == 'undefined')
		//res.send(config.defaultRedirectUrl+'/auth/'+req.params.authKey+'/'+req.cookies.language+'/'+req.params.remember);
		res.redirect(config.defaultRedirectUrl+'/auth/'+req.params.authKey+'/'+req.cookies.language+'/'+req.params.remember);
	//else
		//res.sendt(req.signedCookies.site+'/auth/'+req.params.authKey+'/'+req.cookies.language+'/'+req.params.remember);
		//res.redirect(req.signedCookies.site+'/auth/'+req.params.authKey+'/'+req.cookies.language+'/'+req.params.remember);
});

app.get('/register', function(req, res) {
	routes.register(req, res);
});

app.get('/forgot', function(req, res) {
	routes.forgot(req, res);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

/*function requireHTTPS(req, res, next) {
    if (!req.get('x-arr-ssl')) {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}*/