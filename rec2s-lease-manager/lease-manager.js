/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
var GLOBALS = require("../rec2s-globals/rec2s-globals").create();
var app = require('express').createServer(GLOBALS.getExpressOpts());
var log = require("../rec2s-utils/rec2s-generic-logger").create({
    loggingObject: "LeaseManager",
    logFileName : "lease-manager.log"
});
var CONSTANTS = require("./lease-constants").create();
var ip = CONSTANTS["leaseManagerIp"];
var port = CONSTANTS["leaseManagerPort"];
var sqlIp = CONSTANTS["mysqlServerIp"];
var sqlPort = CONSTANTS["mysqlServerPort"];

/**
 * Create the cache and check for existing leases
 */
var leasesCache = require("../rec2s-utils/rec2s-generic-queue-with-backup").init({
	log: log,
	mysql_opts: {
		username : "root", // username for connection to MySQL server
		password : "password", // password for the user
		database : "rec2s", // database in which the username has access
		table : "leases", // table in which you store the leases
		server : sqlIp, // MySQL server IP
		port : sqlPort // MySQL server port
	},
	restoreQuery: "select * from leases;",
	adderCallback: function(element, queue) {	
		//TODO implement a priority queue	
		queue.push(element);		
	},
	restoreDbElement: function(row) {
		//the way the element looks like when deserializing from DB
		return row["lease"];
	},
	insertDbElement: function(element) {	
		var lease = JSON.parse(element);
		return "insert into leases(id, userId, lease) values (NULL, " + lease.credentials.details.id + ",'" + element + "')";
	},
	deleteDbElement: function(element) {
		return "delete from leases where lease='" + element + "';";
	}
});

//add the lease in all possible connections
app.get('/addLease/:base64json', function (req, res) {
    var lease = new Buffer(req.params.base64json, 'base64').toString('ascii');
	//var recvData = new Buffer(req.params.base64json, 'base64').toString('ascii');    	
	//var lease = JSON.parse(recvData);
	//lease.uid = new Date.getTime();
	
	//add timestamp
	lease = JSON.parse(lease);
	lease.added = new Date().getTime();
	lease = JSON.stringify(lease);
	
	var callback = function(res) {
		return function() {
			res.send("ok");
		};
	};
	//leasesCache.addElement(JSON.stringify(lease), callback(res));
	leasesCache.addElement(lease, callback(res));
});

//get the lease from the memory
app.get('/getLease', function(req, res){
    //get from memory connection
	var lease = leasesCache.getNextElement();
    res.send(lease);
});

//get pending leases for a certain user
app.get('/pendingLeaseManager/:base64json', function(req, res){
	var stuff = new Buffer(req.params.base64json, 'base64').toString('ascii');
	
	var req = JSON.parse(stuff);
	
	var userId = req.userId;
	
	var results = leasesCache.find(function(element){
		var lease = JSON.parse(element);
		if (lease.credentials.details.id == userId) {
			return true;
		}
		return false;
	});
	

	res.send(new Buffer(JSON.stringify({			
		leases: results
	})).toString('base64'));	
});

/*
//TODO metoda asta nu trebuie apelata din extern, ci doar prin intermediul CLI intern. prin urmare json-ul primit nu mai trebuie validat
app.get('/addLeaseConnection/:json', function (req, res) {
    var params = JSON.parse(req.params.json);
    log.info(params);
});
*/

app.listen(port, ip);

log.info((GLOBALS.isSecure() ? "[SECURE]" : "") + 'listening on ' + ip  + ':' + port);