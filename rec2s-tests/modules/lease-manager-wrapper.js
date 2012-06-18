/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
var request = require('request');
var leaseEngine = require('./lease').init();
var leaseManagerIp = '192.168.1.1';
var leaseManagerPort = '1234';


var lease = leaseEngine.getTestLease();

var base64json = new Buffer(JSON.stringify(lease)).toString('base64');
var requestIp = "http://" + leaseManagerIp + ":" + leaseManagerPort + "/addLease/" + base64json;
request(requestIp, function (error, response, body) {
	/*
	if (!error && response.statusCode == 200) {
		
	}
	*/
});