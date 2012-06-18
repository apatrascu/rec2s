/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
 var version = "1.0.0";
 var opts = {
	ip: "192.168.1.158",
	port: 8080,
	name: "serverDeTest",
	version: version,
	post: [
		{
			route: "/hello",
			version: "2.0.0",
			callback: function(req, res, next) {
				res.send(201, 'am primit: ' + req.params.name);
				return next();
			}
		}
	],
	put: [
		{
			route: "/hello",
			version: version,
			callback: function(req, res, next) {
				res.send('hello ' + req.params.name);
				return next();
			}
		}
	],
	get: [
		{
			route: "/hello/:name",
			version: version,
			callback: function(req, res, next) {
				res.send('hello ' + req.params.name);
				return next();
			}
		}
	],
	head: [
		{
			route: "/hello/:name",
			version: version,
			callback: function(req, res, next) {
				res.send('hello ' + req.params.name);
				return next();
			}
		}
	],
	del: [
		{
			route: "/hello/:name",
			version: version,
			callback: function(req, res, next) {
				res.send(204);
				return next();
			}
		}
	]	
 };
 var restServer = require("../rec2s-utils/rec2s-rest-server").init(opts);
 restServer.start(function(server){
	console.log('%s listening at %s', server.name, server.url);
 });
 
 
 
 
var restify = require('restify');

var client = restify.createJsonClient({
	url: 'http://' + opts.ip + ':' + opts.port,
	retry: 10
});


var callOpts = {
	version: "1.9.9",
	path: '/hello'
};
client.post(callOpts, {'name':'fifi'}, function (err, req, res, obj) {  
  console.log('Server returned: %j', obj);
});
 