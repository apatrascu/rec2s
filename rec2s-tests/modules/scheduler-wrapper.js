/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
/*
var request = require('request');
var leaseEngine = require('./lease').init();
var leaseManagerIp = '192.168.1.1';
var leaseManagerPort = '1234';
var hypervisorManagerIp = '192.168.1.1';
var hypervisorManagerPort = '1234';


var lease = leaseEngine.getTestLease();

var base64json = new Buffer(JSON.stringify(lease)).toString('base64');
var requestIp = "http://" + leaseManagerIp + ":" + leaseManagerPort + "/addLease/" + base64json;
request(requestIp, function (error, response, body) {
	
	//if (!error && response.statusCode == 200) {
	//	
	//}
	
});
*/

var leaseEngine = require('./lease').init();
var leaseStub = require('express').createServer();
var hypervisorManagerStub = require('express').createServer();
 
var leaseManagerIp = '192.168.1.158';
var leaseManagerPort = '8000';
var hypervisorManagerIp = '192.168.1.158';
var hypervisorManagerPort = '11000';

var lease = leaseEngine.getTestLease();
var base64json = new Buffer(JSON.stringify(lease)).toString('base64');


leaseStub.get('/getLease', function(req, res){
	console.log("STUB sending lease to scheduler");
	res.send(JSON.stringify(lease));	
});
leaseStub.listen(leaseManagerPort, leaseManagerIp);
console.log('lease-manager STUB listening on ' + leaseManagerIp  + ':' + leaseManagerPort);




/*
hypervisorManagerStub.get('/runLease/:base64json', function (req, res) {
	var recv = new Buffer(req.params.base64json, 'base64').toString('ascii');
	var recvLease = JSON.parse(recv);	
	console.log(leaseEngine.equalLeases(lease, recvLease));
	res.send("OK");
});
hypervisorManagerStub.listen(hypervisorManagerPort, hypervisorManagerIp);
console.log('hypervisor-manager STUB listening on ' + hypervisorManagerIp  + ':' + hypervisorManagerPort);
*/