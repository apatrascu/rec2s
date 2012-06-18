/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
var log = require("../rec2s-utils/rec2s-generic-logger").create({
    loggingObject: "HypervisorManager",
    logFileName : "hypervisor-manager.log",
	consoleOutput: false
});




var childrenOpts = [
    {
        script: "./esxi-hypervisor",
		hypervisorProperties: {
			hypervisorID: "ESX(i)5",
			ip: "192.168.1.32",
			username: "root",
			password: "password",
			host: "localhost.localdomain"
		}
    }/*,
    {
        script: "./esxi-hypervisor",
		hypervisorProperties: {
			hypervisorID: "ESX(i)5 v2",
			ip: "192.168.1.32",
			username: "root",
			password: "password",
			host: "localhost.localdomain"
		}
    }*/
];

var freeHypervisors = {};

var cluster = require("../rec2s-utils/rec2s-generic-cluster").init({
    workerCount: childrenOpts.length,
    logger : log,
    messageFromWorkersCallback : function(worker) {
        return function(message) {
            if (message.type === "freeHypervisor") {
                log.info("[s]am gasit pid " + worker.pid + " liber pt rulare lease");				
                var lease = message.payload;
				
				if (freeHypervisors[lease]) {
					//someone has already taken the lease; do nothing
				} else {
					//mark the first worker to respond
					freeHypervisors[lease] = worker;					
					worker.send({
						type: "allocateLease",
						payload: lease
					});
				}
            }
            if (message.type === "leaseAllocated") {
				var lease = message.payload;
                log.info("[s]cica s-a alocat lease-u");
				worker.send({
					type: "startLease",
					payload: lease
				});
            }
			if (message.type === "leaseStarted") {
                log.info("[s]cica s-a pornit lease-u");
            }
			if (message.type === "vmInstanceCountPlus") {
                log.info("[s]cica s-a marit nr de vm pentru lease");				
            }
			if (message.type === "vmInstanceCountMinus") {
                log.info("[s]cica s-a scazut nr de vm pentru lease");				
            }
			
			
        };

    },
    failOverMode: true,    
    afterChildrenForkFunction: function(worker, workerIndex) {
        log.info("[s-c] workeru " + worker.pid + " o sa ruleze " + childrenOpts[workerIndex].script);
        worker.send({
			type: "newhypervisor",
			payload: childrenOpts[workerIndex]
		});
    },
	masterMainFunction : function(workers) {
		var GLOBALS = require("../rec2s-globals/rec2s-globals").create();
		var CONSTANTS = require("./hypervisor-constants").create();		
		var request = require('request');
		var app = require('express').createServer(GLOBALS.getExpressOpts());
        var ip = CONSTANTS["hypervisorManagerIp"];
		var port = CONSTANTS["hypervisorManagerPort"];
		
		var pollForFreeHypervisor = function(lease) {
            log.info("[s]o sa interoghez cei " + workers.length + " copii pentru " +lease);
			for (var i=0; i<workers.length; i++) {
                log.info("[s]inainte sa trimit catre copilul " + workers[i].worker.pid);
				workers[i].worker.send({
					type: "pollForFreeHypervisor",
					payload: lease
				});
			}
		};
		
		var modifyVmInstanceCount = function(lease, direction) {
			//increase/decrese VM count from a lease
			log.info("[s-vmI]o sa interoghez cei " + workers.length + " copii pentru " +lease);
			var messageType = "";
			if (direction > 0) {
				messageType = "modifyVmInstanceCountPlus";
			} else {
				messageType = "modifyVmInstanceCountMinus";
			}
			for (var i=0; i<workers.length; i++) {
                log.info("[s-vmI]inainte sa trimit catre copilul " + workers[i].worker.pid);
				workers[i].worker.send({
					type: messageType,
					payload: lease
				});
			}
		};
		
		var getLoadForLease = function(lease) {
			//get load for certain lease			
			log.info("[s-load]o sa interoghez cei " + workers.length + " copii pentru " +lease);
			for (var i=0; i<workers.length; i++) {
                log.info("[s-load]inainte sa trimit catre copilul " + workers[i].worker.pid);
				workers[i].worker.send({
					type: "getLoadForLease",
					payload: lease
				});
			}
		};
        
		app.get('/runLease/:base64json', function (req, res) {
			var lease = new Buffer(req.params.base64json, 'base64').toString('ascii');
            log.info("[s]am primit: " + lease);
			var freeHypervisor = pollForFreeHypervisor(lease);
			res.send("ok");
		});
		
		app.get('/addVmInstanceToLease/:base64json', function (req, res) {
			var lease = new Buffer(req.params.base64json, 'base64').toString('ascii');
            log.info("[s2]am primit: " + lease);
			modifyVmInstanceCount(lease, 1);
			res.send("ok");
		});
		
		app.get('/removeVmInstanceFromLease/:base64json', function (req, res) {
			var lease = new Buffer(req.params.base64json, 'base64').toString('ascii');
            log.info("[s3]am primit: " + lease);
			modifyVmInstanceCount(lease, -1);
			res.send("ok");
		});
		
		app.get('/getLoadForLease/:base64json', function (req, res) {
			var lease = new Buffer(req.params.base64json, 'base64').toString('ascii');
            log.info("[s4]am primit: " + lease);
			var load = getLoadForLease(lease);
			//TODO find how to communicate through 'res'
			res.send("10");
		});
		
		/*
		getHypervisorDetails
		getHypervisorDetailsAndLeaseLoad
		*/
		
		app.listen(port, ip);
		log.info((GLOBALS.isSecure() ? "[SECURE]" : "") + 'listening on ' + ip  + ':' + port);
	},
    childrenMainFunction: function() {
        var hypervisorConnection = undefined;
		process.on('message', function(message) {
            log.info("[c]am primit un mesaj de tipul " + message.type);

			if (message.type === "newhypervisor") {
				//add a new hypevisor
				var hypervisorScript = message.payload.script;
				var hypervisorOpts = message.payload.hypervisorProperties;
				hypervisorConnection = require(hypervisorScript).init(hypervisorOpts);
				log.info("[c]Children " + process.pid + " received " + message.payload.script);
			}

			if (message.type === "pollForFreeHypervisor") {
				//check if i have free resources
				var lease = message.payload;
                log.info("[c] am primit cererea daca am loc de " + lease);
				var callback = function(process, lease) {					
					return function(freeResourcesAvailable) {
						console.log("freeResourcesAvailable=" + freeResourcesAvailable);						
						if (freeResourcesAvailable) {
							process.send({
								type: "freeHypervisor",
								payload: lease
							});
						}
					};
				};
				hypervisorConnection.checkFreeResourcesAvailable(lease, callback(process, lease));
			}
            
            if (message.type === "allocateLease") {
				//alocate a new lease
                var lease = message.payload;
                log.info("[c]o sa aloc lease-u " + lease);
                var callback = function(process, lease){
                    return function(error, stdout, stderr){
                        log.info('<stdout>' + stdout + '</stdout>');
                        log.info('<stderr>' + stderr + '</stderr>');
                        if (error !== null) {
                          log.info('exec error: ' + error);
                        }
                        process.send({
                            type: "leaseAllocated",
                            payload: lease
                        });
                    }
                };
                hypervisorConnection.allocateLease(lease, callback(process, lease));
            }
						
			if (message.type === "startLease") {
				//start all the VMs associated to a lease
                var lease = message.payload;
                log.info("[c]o sa pornesc lease-u " + lease);
                var callback = function(process, lease, responseObj){
                    return function(error, stdout, stderr){
                        log.info('<stdout>' + stdout + '</stdout>');
                        log.info('<stderr>' + stderr + '</stderr>');
                        if (error !== null) {
                          log.info('exec error: ' + error);
                        }
                        process.send({
                            type: "leaseStarted",
                            payload: lease
                        });
                    }
                };
                hypervisorConnection.startLease(lease, callback(process, lease, message.responseObj));
            }
			
			if (message.type === "modifyVmInstanceCountPlus") {
				//increase the number of VMs from the lease
				var lease = message.payload;
                log.info("[c]o sa maresc nr de vm pentru lease-u " + lease);
                var callback = function(process, lease){
                    return function(error, stdout, stderr){
                        log.info('<stdout>' + stdout + '</stdout>');
                        log.info('<stderr>' + stderr + '</stderr>');
                        if (error !== null) {
                          log.info('exec error: ' + error);
                        }
                        process.send({
                            type: "vmInstanceCountPlus",
                            payload: lease
                        });
                    }
                };
				hypervisorConnection.addVirtualMachine(lease, callback(process, lease));
			}
			
			if (message.type === "modifyVmInstanceCountMinus") {
				//decrease the number of VMs from the lease
				var lease = message.payload;
                log.info("[c]o sa scad nr de vm pentru lease-u " + lease);
                var callback = function(process, lease){
                    return function(error, stdout, stderr){
                        log.info('<stdout>' + stdout + '</stdout>');
                        log.info('<stderr>' + stderr + '</stderr>');
                        if (error !== null) {
                          log.info('exec error: ' + error);
                        }
                        process.send({
                            type: "vmInstanceCountMinus",
                            payload: lease
                        });
                    }
                };
				hypervisorConnection.removeVirtualMachine(lease, callback(process, lease));
			}
						
			if (message.type === "getLoadForLease") {
				//get the load for a lease
				var lease = message.payload;
                log.info("[c]o sa iau load-u pentru lease-u " + lease);
                var callback = function(process, lease, responseObj){
                    return function(statistics){
						var load = statistics.load;
						log.info("received load=" + load);
                        //responseObj(""+load);
                    }
                };
				hypervisorConnection.getLeaseStatistics(lease, callback(process, lease, message.responseObj));
			}
		});
    }
});