var config = require('../config.js');

exports.index = function(req, res){
  res.render('index', { title: res.__('signInHeader'), cookie: req.cookies, apiUrl: config.apiUrl, 
	  username: ((typeof req.signedCookies.username == 'undefined') ? '' : req.signedCookies.username) });
};

exports.register = function(req, res){
  res.render('register', { title: res.__('registerHeader'), cookie: req.cookies, apiUrl: config.apiUrl });
};

exports.forgot = function(req, res){
  res.render('forgot', { title: res.__('forgotHeader'), cookie: req.cookies, apiUrl: config.apiUrl });
};

exports.lock = function(req, res){
	res.render('lock', { title: res.__('signInHeader'), cookie: req.cookies, apiUrl: config.apiUrl, username: req.signedCookies.username });
};

exports.process = function(req, res, action, data){
	if (action == 'checkAuth') {
		var obj = JSON.parse(data);
		if ( obj.exist ) {
			if (typeof req.signedCookies.site == 'undefined')
				//res.send(config.defaultRedirectUrl+'/auth/'+obj.authKey+'/'+req.cookies.language+'/'+req.cookies.remember);
				res.redirect(config.defaultRedirectUrl+'/auth/'+obj.authKey+'/'+req.cookies.language+'/'+req.cookies.remember);
			else {
				if (req.signedCookies.site.indexOf('24fin-backend') == -1){
					//res.send(config.defaultRedirectUrl+'/auth/'+obj.authKey+'/'+req.cookies.language+'/'+req.cookies.remember);
					res.redirect(config.defaultRedirectUrl+'/auth/'+obj.authKey+'/'+req.cookies.language+'/'+req.cookies.remember);
				}
				else {
					//res.send(req.signedCookies.site+'/auth/'+obj.authKey+'/'+req.cookies.language+'/'+req.cookies.remember);
					res.redirect(req.signedCookies.site+'/auth/'+obj.authKey+'/'+req.cookies.language+'/'+req.cookies.remember);
				}
			}
			//else
				//res.redirect(req.signedCookies.site+'/auth/'+obj.authKey+'/'+req.cookies.language+'/'+req.cookies.remember);
		}
		else {
			res.clearCookie('authKey');
			//res.send((req.get('x-original-url') == '/lock') ? '/lock' : '/');
			res.redirect((req.get('x-original-url') == '/lock') ? '/lock' : '/');
		}
	}
};