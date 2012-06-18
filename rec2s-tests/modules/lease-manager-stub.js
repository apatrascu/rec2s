/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
var leaseEngine = require('./lease').init();
var app = require('express').createServer();
 
 
var leaseManagerIp = '192.168.1.1';
var leaseManagerPort = '1234';
var lease = leaseEngine.getTestLease();
//var base64json = new Buffer(JSON.stringify(lease)).toString('base64');


app.get('/getLease', function(req, res){
	res.send(JSON.stringify(lease));	
});

app.listen(leaseManagerPort, leaseManagerIp);
log.info('lease-manager STUB listening on ' + leaseManagerIp  + ':' + leaseManagerPort);