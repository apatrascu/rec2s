/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
var log = require("../rec2s-utils/rec2s-generic-logger").create({
    loggingObject: "LeaseManagerAPI",
    logFileName : "lease-manager-api.log"
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
        var request = require('request');
        var app = require('express').createServer(GLOBALS.getExpressOpts());
        var CONSTANTS = require("./lease-constants").create();
        var ip = CONSTANTS["leaseManagerApiIp"];
        var port = CONSTANTS["leaseManagerApiPort"];
        var leaseManagerIp = CONSTANTS["leaseManagerIp"];
        var leaseManagerPort = CONSTANTS["leaseManagerPort"];
        //var wrongLeaseError = "Wrong format for lease!";
        app.get('/addLease/:base64json', function (req, res) {
			var stuff = new Buffer(req.params.base64json, 'base64').toString('ascii');
			var lease = JSON.parse(stuff);
			log.info("Received: " + stuff);

			var link = leaseManagerIp + ":" + leaseManagerPort + "/addLease/" + req.params.base64json;
			request(GLOBALS.getRequestOpts(link), function (error, response, body) {
				if (!error && response.statusCode == 200) {
					res.send(new Buffer(JSON.stringify({			
						access: PERMISSION.GRANTED							
					})).toString('base64'));
				} else {
					res.send(new Buffer(JSON.stringify({			
						access: PERMISSION.DENIED,
						reason: "leaseManagerError0002"
					})).toString('base64'));
				}
			});
        });

        app.get('/getLease', function(req, res){
            var link = leaseManagerIp + ":" + leaseManagerPort + "/getLease";
            request(GLOBALS.getRequestOpts(link), function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.send(body);
                }
            });
        });
		
		app.get('/pendingLeaseManager/:base64json', function(req, res){
            var link = leaseManagerIp + ":" + leaseManagerPort + "/pendingLeaseManager/" + req.params.base64json;
            request(GLOBALS.getRequestOpts(link), function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.send(body);
                }
            });
        });

        app.listen(port, ip);
        log.info((GLOBALS.isSecure() ? "[SECURE]" : "") + 'listening on ' + ip  + ':' + port);
    }
});