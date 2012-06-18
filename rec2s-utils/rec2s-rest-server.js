/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
exports.init = function(opts){
	
	var defaults = {		
		log: require("./rec2s-generic-logger").create({
			loggingObject: "restServer",
			logFileName : "rest-server.log"
		}),
		
	};
    
    // get the full configuration
    var config = require("./rec2s-generic-extend").init().extend(defaults, opts);

	//the main plugin
	var restify = require('restify');

	var server = restify.createServer({
		name: config.name//,
		//version: config.version
	});
	server.use(restify.acceptParser(server.acceptable));
	server.use(restify.queryParser());
	server.use(restify.bodyParser());

	
	
	config.post.forEach(function(e, i){
		server.post({path: e.route, version: e.version}, e.callback);
	});
	config.put.forEach(function(e, i){
		server.put({path: e.route, version: e.version}, e.callback);
	});
	config.get.forEach(function(e, i){
		server.get({path: e.route, version: e.version}, e.callback);
	});
	config.head.forEach(function(e, i){
		server.head({path: e.route, version: e.version}, e.callback);
	});
	config.del.forEach(function(e, i){
		server.del({path: e.route, version: e.version}, e.callback);
	});
	
	


    return Object.create({}, {
        start: {
            value: function(callback) {
				server.listen(config.port, function () {
					callback(server);
				});				
            }
        }
    });
};
