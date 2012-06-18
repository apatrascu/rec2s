/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
var log = require("../rec2s-utils/rec2s-generic-logger").create({
    loggingObject: "Frontend",
    logFileName : "frontend.log"
});

var PERMISSION = {
	GRANTED: "granted",
	DENIED: "denied"
};



var cluster = require("../rec2s-utils/rec2s-generic-cluster").init({
    workerCount: require('os').cpus().length,
    logger : log,
    messageFromWorkersCallback : function(worker) {
        return function(message) {
            /*
            if (message.type == 'notifyRequest') {
                console.log("am primit un mesaj de la un copil:" + message.content);
            }
            */
        }
    },
    failOverMode: true,
    masterMainFunction : function(workers) { },
    childrenMainFunction: function() {
		var GLOBALS = require("../rec2s-globals/rec2s-globals").create();
        var CONSTANTS = require("./frontend-constants").create();
		//var app = require('express').createServer(GLOBALS.getExpressOpts());
		var app = require('express').createServer();
		var request = require('request');
		app.get('/authenticate/:base64json', function (req, res) {
			var stuff = new Buffer(req.params.base64json, 'base64').toString('ascii');
			
			try {
				var user = JSON.parse(stuff);
				
				var link = CONSTANTS["userManagerIp"] + ":" + CONSTANTS["userManagerPort"] + "/authenticate/" + req.params.base64json;
				request(GLOBALS.getRequestOpts(link), function (error, response, body) {
					if (!error && response.statusCode == 200) {		
						res.send(body);
					}
				});
			} catch (e) {
				log.info("hmmm1...");		
				res.send(new Buffer(JSON.stringify({
					request: user,
					access: PERMISSION.DENIED,
					reason: "userManagerError0001"
				})).toString('base64'));
			}
		});
		app.get('/register/:base64json', function (req, res) {
			var stuff = new Buffer(req.params.base64json, 'base64').toString('ascii');
			
			try {
				var user = JSON.parse(stuff);
				
				var link = CONSTANTS["userManagerIp"] + ":" + CONSTANTS["userManagerPort"] + "/register/" + req.params.base64json;
				request(GLOBALS.getRequestOpts(link), function (error, response, body) {
					if (!error && response.statusCode == 200) {		
						res.send(body);
					}
				});
			} catch (e) {
				log.info("hmmm2...");
				res.send(new Buffer(JSON.stringify({
					request: user,
					access: PERMISSION.DENIED,
					reason: "userManagerError0003"
				})).toString('base64'));
			}
		});
		app.get('/addLease/:base64json', function (req, res) {
			var stuff = new Buffer(req.params.base64json, 'base64').toString('ascii');
			
			try {
				var lease = JSON.parse(stuff);
				
				var link = CONSTANTS["leaseManagerApiIp"] + ":" + CONSTANTS["leaseManagerApiPort"] + "/addLease/" + req.params.base64json;
				request(GLOBALS.getRequestOpts(link), function (error, response, body) {
					if (!error && response.statusCode == 200) {		
						res.send(body);
					}
				});
			} catch (e) {
				log.info("hmmm3...");
				res.send(new Buffer(JSON.stringify({			
					access: PERMISSION.DENIED,
					reason: "leaseManagerError0001"
				})).toString('base64'));
			}
		});
		app.get('/pendingLeaseManager/:base64json', function (req, res) {
			var stuff = new Buffer(req.params.base64json, 'base64').toString('ascii');
			
			try {
				var r = JSON.parse(stuff);
				
				var link = CONSTANTS["monitorIp"] + ":" + CONSTANTS["monitorPort"] + "/pendingLeaseManager/" + req.params.base64json;
				request(GLOBALS.getRequestOpts(link), function (error, response, body) {
					if (!error && response.statusCode == 200) {		
						res.send(body);
					}
				});
			} catch (e) {
				log.info("hmmm4...");
				res.send(new Buffer(JSON.stringify({			
					leases: [],
					reason: "error"
				})).toString('base64'));
			}
		});
		app.get('/pendingSchedulerDelayable/:base64json', function (req, res) {
			var stuff = new Buffer(req.params.base64json, 'base64').toString('ascii');
			
			try {
				var r = JSON.parse(stuff);
				
				var link = CONSTANTS["monitorIp"] + ":" + CONSTANTS["monitorPort"] + "/pendingSchedulerDelayable/" + req.params.base64json;
				request(GLOBALS.getRequestOpts(link), function (error, response, body) {
					if (!error && response.statusCode == 200) {		
						res.send(body);
					}
				});
			} catch (e) {
				log.info("hmmm5...");
				res.send(new Buffer(JSON.stringify({			
					leases: [],
					reason: "error"
				})).toString('base64'));
			}
		});
		app.get('/pendingSchedulerRunning/:base64json', function (req, res) {
			var stuff = new Buffer(req.params.base64json, 'base64').toString('ascii');
			
			try {
				var r = JSON.parse(stuff);
				
				var link = CONSTANTS["monitorIp"] + ":" + CONSTANTS["monitorPort"] + "/pendingSchedulerRunning/" + req.params.base64json;
				request(GLOBALS.getRequestOpts(link), function (error, response, body) {
					if (!error && response.statusCode == 200) {		
						res.send(body);
					}
				});
			} catch (e) {
				log.info("hmmm6...");
				res.send(new Buffer(JSON.stringify({			
					leases: [],
					reason: "error"
				})).toString('base64'));
			}
		});
		


		app.listen(CONSTANTS["frontendPort"], CONSTANTS["frontendIp"]);
		log.info((GLOBALS.isSecure() ? "[SECURE]" : "") + 'listening on ' + CONSTANTS["frontendIp"]  + ':' + CONSTANTS["frontendPort"]);
    }
});