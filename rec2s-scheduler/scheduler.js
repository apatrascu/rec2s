/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
// initialize the logger
var log = require("../rec2s-utils/rec2s-generic-logger").create({
    loggingObject: "LeaseScheduler",
    logFileName : "lease-scheduler.log"
});
var GLOBALS = require("../rec2s-globals/rec2s-globals").create();
var CONSTANTS = require("./scheduler-constants").create();
var request = require('request');
var app = require('express').createServer(GLOBALS.getExpressOpts());



var ip = CONSTANTS["leaseManagerApiIp"];
var port = CONSTANTS["leaseManagerApiPort"];
var sqlIp = CONSTANTS["mysqlServerIp"];
var sqlPort = CONSTANTS["mysqlServerPort"];
var virtualMachineCreationDelay = CONSTANTS["vmCreateDelay"];
var hypervisorManagerIp = CONSTANTS["hypervisorManagerIp"];
var hypervisorManagerPort = CONSTANTS["hypervisorManagerPort"];

/**
 * Create the cache and check for existing leases to delay
 */
var delayableLeasesCache = require("../rec2s-utils/rec2s-generic-queue-with-backup").init({
	log: log,
	mysql_opts: {
		username : "root", // username for connection to MySQL server
		password : "password", // password for the user
		database : "rec2s", // database in which the username has access
		table : "scheduler_delayable", // table in which you store the leases
		server : sqlIp, // MySQL server IP
		port : sqlPort // MySQL server port
	},
	restoreQuery: "select * from scheduler_delayable;",
	adderCallback: function(element, queue) {	
		//TODO implement a priority queue	
		queue.push(element);		
	},
	restoreDbElement: function(row) {
		//the way the element looks like when deserializing from DB
		return {			
			lease: JSON.parse(row["lease"]),
			timeout: row["timeout"]
		};
	},
	insertDbElement: function(element) {
		return "insert into scheduler_delayable(id, lease, timeout) values (NULL, '" + JSON.stringify(element.lease) + "', '" + element.timeout + "')";
	},
	deleteDbElement: function(element) {
		return "delete from scheduler_delayable where lease='" + JSON.stringify(element.lease) + "';";
	}
});

/**
 * Create the cache and check for existing running leases
 */
var runningLeasesCache = require("../rec2s-utils/rec2s-generic-queue-with-backup").init({
	log: log,
	mysql_opts: {
		username : "root", // username for connection to MySQL server
		password : "password", // password for the user
		database : "rec2s", // database in which the username has access
		table : "scheduler_running", // table in which you store the leases
		server : sqlIp, // MySQL server IP
		port : sqlPort // MySQL server port
	},
	restoreQuery: "select * from scheduler_running;",
	adderCallback: function(element, queue) {		
		queue.push(element);		
	},
	updaterCallback: function(element, queue) {
		var index = -1;
		queue.forEach(function(obj, i){
			if (obj.started == element.started) {
				index = i;
			}
		});
		if (index != -1) {
			queue[index] = element;
		}
	},
	restoreDbElement: function(row) {
		//the way the element looks like when deserializing from DB
		return {			
			lease: JSON.parse(row["lease"]),
			runningInstancencesCount: row["vm"],
			started: row["started"]
		};
	},
	insertDbElement: function(element) {
		return "insert into scheduler_running(id, lease, vm, started) values (NULL, '"+JSON.stringify(element.lease)+"', "+element.lease.lease.minimumInstancesCount+", '"+element.started+"')";
	},
	deleteDbElement: function(element) {
		return "delete from scheduler_running where lease='" + JSON.stringify(element.lease) + "';";
	},
	updateDbElement: function(element) {		
		return "update scheduler_running set vm=" + element.runningInstancencesCount + " where started='" + element.started + "'";
	}
});

var computeDeadline = function(lease) {        
	//leaseDeadline-vmCount*virtualMachineCreationDelay
	var leaseDeadline = new Date(lease.lease.leaseStartTime);
	var vmCount = parseInt(lease.lease.minimumInstancesCount, 10);
	var durationInMinutes = virtualMachineCreationDelay * vmCount; 
	
	var MS_PER_MINUTE = 60000;
	var deadline = new Date(leaseDeadline - durationInMinutes * MS_PER_MINUTE);

	return deadline.getTime();
};

var startLeaseOnFreeHypervisor = function(leaseObject, successCallback, errorCallback) {	
	var lease = leaseObject;	
	var base64json = new Buffer(JSON.stringify(lease)).toString('base64');
	var link = hypervisorManagerIp + ":" + hypervisorManagerPort + "/runLease/" + base64json;
	log.info("Going to start the VM on a hypervisor");	
	request(GLOBALS.getRequestOpts(link), function (error, response, body) {				
        if (!error && response.statusCode == 200) {
			log.info(response);
			successCallback();
        } else {
			if (errorCallback) {
				errorCallback();
			}
		}
    });		
};

var readyToRun = function(delayedLease) {
	var now = new Date().getTime();
	if (now >= delayedLease.timeout) {
		return true;
	}
	return false;
};

var startLeaseCallback = function(cache, leaseObj) {
	return function() {
		cache.addElement({
			lease: leaseObj,
			runningInstancencesCount: leaseObj.lease.minimumInstancesCount,
			started: new Date().getTime()
		});
	};
};

var errorStartLeaseCallback = function(cache, leaseObj) {
	return function(){
		if (leaseObj.started) {	
			cache.addElement(leaseObj);
		} else {
			cache.addElement({
				lease: leaseObj,
				runningInstancencesCount: leaseObj.lease.minimumInstancesCount,
				started: new Date().getTime()
			});
		}
	};
};
		
var schedulerCallback  = function() {
	//Ti
	var delayedLease = delayableLeasesCache.seeNextElement();
	if (readyToRun(delayedLease)) {
		delayableLeasesCache.getNextElement();
		startLeaseOnFreeHypervisor(
			delayedLease, 
			startLeaseCallback(runningLeasesCache, delayedLease),
			errorStartLeaseCallback(runningLeasesCache, delayedLease)
		);
	}
	
	//T0
	//var stuff = new Buffer(req.params.base64json, 'base64').toString('ascii');
	//new Buffer("Hello World").toString('base64')
    var link = ip + ":" + port + "/getLease";
    request(GLOBALS.getRequestOpts(link), function (error, response, body) {				
        if (!error && response.statusCode == 200) {			
			if (body != "{}") {
				var lease = JSON.parse(body);
				log.info("lease= " + body);			
				if (lease.lease["leaseType"] == "URGENT") {
					startLeaseOnFreeHypervisor(
						lease, 
						startLeaseCallback(runningLeasesCache, lease),
						errorStartLeaseCallback(runningLeasesCache, lease)
					);
				} else {                
					delayableLeasesCache.addElement({
						lease: lease,
						timeout: computeDeadline(lease) || 0
					});
				}
			}
        }
    });	

	//TODO see if a certain lease must be stopped
};
var schedulerTick = 2 * 1000; //10 sec
setInterval(schedulerCallback, schedulerTick);






//if I get a message from the monitor about running/delayable leases
var getPendingLeaseByUserId = function(req, cache) {
	var stuff = new Buffer(req.params.base64json, 'base64').toString('ascii');
	
	var req = JSON.parse(stuff);
	
	var userId = req.userId;
	
	var results = cache.find(function(lease){		
		if (lease.lease.credentials.details.id == userId) {
			return true;
		}
		return false;
	});
	
	return results;
};

app.get('/pendingSchedulerDelayable/:base64json', function (req, res) {
	res.send(new Buffer(JSON.stringify({			
		leases: getPendingLeaseByUserId(req, delayableLeasesCache)
	})).toString('base64'));		
});

app.get('/pendingSchedulerRunning/:base64json', function (req, res) {
	res.send(new Buffer(JSON.stringify({			
		leases: getPendingLeaseByUserId(req, runningLeasesCache)
	})).toString('base64'));
});


////////////////////////
//if I get a message from the monitor module to preemt a certain lease
/*
//getPreemtibleRunningLeases
//getNonPreemtibleRunningLeases
//getAllRunningLeases
*/
app.get('/getPreemtibleRunningLeases', function (req, res) {
	var allPreemtibleRunningLeases = runningLeasesCache.find(function(lease){
		if (lease.lease.leasePreemptible === 'true') {
			return true;
		}
		return false;
	});
	res.send(JSON.stringify(allPreemtibleRunningLeases));	
});
app.get('/getNonPreemtibleRunningLeases', function (req, res) {
	var allNonPreemtibleRunningLeases = runningLeasesCache.find(function(lease){
		if (lease.lease.leasePreemptible === 'true') {
			return false;
		}
		return true;
	});
	res.send(JSON.stringify(allNonPreemtibleRunningLeases));	
});
app.get('/getAllRunningLeases', function (req, res) {	
	var allRunningLeases = runningLeasesCache.find(function(lease){return true;});
	res.send(JSON.stringify(allRunningLeases));	
});


//increase/decrease number of VMs from lease
/*
//addVmInstanceToLease
//removeVmInstanceFromLease
*/
var hypervisorModifyVmCount = function(req, res, path, direction) {
	var stuff = new Buffer(req.params.base64json, 'base64').toString('ascii');
	var obj = JSON.parse(stuff);
	var started = obj.started;
	
	var list = runningLeasesCache.find(function(lease){
		if (lease.started === started) {
			return true;
		}
		return false;
	});
	
	//contact the HypervisorManager to increase the number of VMs
	var base64json = new Buffer(JSON.stringify(list[0].lease)).toString('base64');
	var link = hypervisorManagerIp + ":" + hypervisorManagerPort + "/" + path + "/" + base64json;
	request(GLOBALS.getRequestOpts(link), function (error, response, body) {				
        if (!error && response.statusCode == 200) {
			//modify in runningLeasesCache, the VM instance count
			var lease = list[0];
			lease.runningInstancencesCount = direction + lease.runningInstancencesCount;
			runningLeasesCache.updateElement(lease);
        }
    });	
	res.send("ok");
};
app.get('/addVmInstanceToLease/:base64json', function (req, res) {
	hypervisorModifyVmCount(req, res, "addVmInstanceToLease", 1);
});
app.get('/removeVmInstanceFromLease/:base64json', function (req, res) {
	hypervisorModifyVmCount(req, res, "removeVmInstanceFromLease", -1);
});


app.listen(CONSTANTS["schedulerPort"], CONSTANTS["schedulerIp"]);
log.info((GLOBALS.isSecure() ? "[SECURE]" : "") + 'listening on ' + CONSTANTS["schedulerIp"]  + ':' + CONSTANTS["schedulerPort"]);

