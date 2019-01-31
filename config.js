var config = {}

config.port = 3000;

config.apiUrl = '//api.domain.com';
config.apiPostUrl = 'https://localhost:1122';
config.refererUrl = 'https://auth.domain.com';
config.defaultRedirectUrl = 'https://backend.domain.com';

config.crypto = {};
config.crypto.algorithm = 'md5';
config.crypto.password = 'abc123';

config.cookie = {};
config.cookie.password = 'abc123';
config.cookie.expire = 86400000*365; //365 Day (1000*3600*24)

module.exports = config;