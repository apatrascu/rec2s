/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
exports.create = function(opts) {    
    var fs = require("fs");
	var https = require('https');
	
	var secure = true;
	
	//express	
	var expressOpts = {
		key: fs.readFileSync("../rec2s-certs/keys/server.key"),
		cert: fs.readFileSync("../rec2s-certs/certs/server.crt"),
		ca: fs.readFileSync("../rec2s-certs/ca/ca.crt"),
		requestCert: true,
		rejectUnauthorized: true
	};
	
	//request
	var requestOpts = {
		//url: 'https://192.168.1.158:8000/test',
		key: fs.readFileSync("../rec2s-certs/keys/userA.key"),
		cert: fs.readFileSync("../rec2s-certs/certs/userA.crt"),
		ca: fs.readFileSync("../rec2s-certs/ca/ca.crt")
	};
	requestOpts.agent = new https.Agent(requestOpts);
	
	return Object.create({}, {
		isSecure: {
            value: function() {
                return secure;
            }
        },		
        getExpressOpts: {
            value: function() {
                if (secure) {
					return expressOpts;
				}
				return  "";
            }
        },
		getRequestOpts: {
			value: function(link) {
                if (secure) {
					requestOpts.url = "https://" + link;
					return requestOpts;
				}
				return "http://" + link;				
            }
		}
    });
};

