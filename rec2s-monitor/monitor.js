/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
// initialize the logger
var log = require("../rec2s-utils/rec2s-generic-logger").create({
    loggingObject: "Monitor",
    logFileName : "monitor.log"
});

/*


1. rulez la un interval de X minute (pentru inceput 5)

I)
- iau de la S lista cu lease-urile care se pot preempta
- iau de la HM: 
	* lista cu H cu tot cu incarcarea lor si 
	* cate masini suporta maxim 
	* cate masini ruleaza pe el la un moment dat
- daca am un H care are nrVmCareRuleaza + nrVmDinLease < nrMaximVmSuportate, atunci le mut lease-ul pe acel H


II) <-
- iau de la S lista cu toate lease-urile pornite, care nu sunt preemtibile
- iau de la HM: 
	* lista cu H cu tot cu incarcarea lor si 
	* cate masini suporta maxim 
	* cate masini ruleaza pe el la un moment dat
	* incarcarea pe fiecare masina din fiecare lease care ruleaza
- daca am incarcarea pe un lease (sum(vm_load)/vm_count) de mai mult de Y % (pentru inceput 90%), mai pornesc una, in limita impusa de maxVmCount din lease 
- daca am incarcarea pe un lease mai mica de Z % si numarul masinilor virtuale care ruleaza din lease e mai mare decat numarul minVmCount, ma uit care VM are incarcare 0% si o opresc

*/

var GLOBALS = require("../rec2s-globals/rec2s-globals").create();
var CONSTANTS = require("./monitor-constants").create();
var app = require('express').createServer(GLOBALS.getExpressOpts());
var request = require('request');


app.get('/pendingLeaseManager/:base64json', function (req, res) {
	var link = CONSTANTS["leaseManagerApiIp"] + ":" + CONSTANTS["leaseManagerApiPort"] + "/pendingLeaseManager/" + req.params.base64json;
	request(GLOBALS.getRequestOpts(link), function (error, response, body) {
		if (!error && response.statusCode == 200) {		
			res.send(body);
		}
	});
});

app.get('/pendingSchedulerDelayable/:base64json', function (req, res) {
	var link = CONSTANTS["schedulerIp"] + ":" + CONSTANTS["schedulerPort"] + "/pendingSchedulerDelayable/" + req.params.base64json;
	request(GLOBALS.getRequestOpts(link), function (error, response, body) {
		if (!error && response.statusCode == 200) {		
			res.send(body);
		}
	});
});

app.get('/pendingSchedulerRunning/:base64json', function (req, res) {
	var link = CONSTANTS["schedulerIp"] + ":" + CONSTANTS["schedulerPort"] + "/pendingSchedulerRunning/" + req.params.base64json;
	request(GLOBALS.getRequestOpts(link), function (error, response, body) {
		if (!error && response.statusCode == 200) {		
			res.send(body);
		}
	});
});

app.listen(CONSTANTS["monitorPort"], CONSTANTS["monitorIp"]);
log.info( (GLOBALS.isSecure() ? "[SECURE]" : "") + 'listening on ' + CONSTANTS["monitorIp"]  + ':' + CONSTANTS["monitorPort"]);



///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
var vmLoadBarrier = CONSTANTS["vmLoadBarrier"]; //90 %

var getLoadForLease = function(obj, callback) {
	//contact the HypervisorManager to get load for lease
	var base64Obj = new Buffer(JSON.stringify(obj)).toString('base64');
	var link = CONSTANTS["hypervisorManagerIp"] + ":" + CONSTANTS["hypervisorManagerPort"] + "/getLoadForLease/" + base64Obj;	
	request(GLOBALS.getRequestOpts(link), function (error, response, body) {
		if (!error && response.statusCode == 200) {		
			var load = parseInt(body);
			callback(load);
		}
	});	
};

var addVmInstanceToLease = function(obj) {	
	log.info("Increasing VM count");
	var base64Obj = new Buffer(JSON.stringify(obj)).toString('base64');
	var link = CONSTANTS["schedulerIp"] + ":" + CONSTANTS["schedulerPort"] + "/addVmInstanceToLease/" + base64Obj;
	request(GLOBALS.getRequestOpts(link), function (error, response, body) {
		if (!error && response.statusCode == 200) {		
			//
		}
	});
};

var removeVmInstanceFromLease = function(obj) {
	log.info("Decreasing VM count");
	var base64Obj = new Buffer(JSON.stringify(obj)).toString('base64');
	var link = CONSTANTS["schedulerIp"] + ":" + CONSTANTS["schedulerPort"] + "/removeVmInstanceFromLease/" + base64Obj;
	request(GLOBALS.getRequestOpts(link), function (error, response, body) {
		if (!error && response.statusCode == 200) {		
			//
		}
	});
};

//elastic increase VM running instances count
var allLeasesCallback  = function() {
	var link = CONSTANTS["schedulerIp"] + ":" + CONSTANTS["schedulerPort"] + "/getAllRunningLeases";
	//console.log("link=" + link);
	//console.log(GLOBALS.getRequestOpts(link));
	request(GLOBALS.getRequestOpts(link), function (error, response, body) {
		if (!error && response.statusCode == 200) {					
			var leases = JSON.parse(body);
			leases.forEach(function(obj){
				//console.log("count=" + obj.runningInstancencesCount);
				var lease = obj.lease.lease;				
				var min = parseInt(lease.minimumInstancesCount, 10);
				var max = parseInt(lease.maximumInstancesCount, 10);
				var running = parseInt(obj.runningInstancencesCount);
				if (running >= min) {
					getLoadForLease(lease, function(load){
						if (load > vmLoadBarrier) {
							if (running < max) {
								addVmInstanceToLease(obj);
							}
						} else {
							if (running > min) {
								removeVmInstanceFromLease(obj);
							}
						}						
					});
				}				
			});
		} 		
	});
};

var monitor_tick = 20 * 1000; //10 sec
setInterval(allLeasesCallback, monitor_tick);
