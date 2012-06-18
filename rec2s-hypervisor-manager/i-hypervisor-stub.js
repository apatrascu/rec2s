/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
exports.init = function(opts) {    
    var exec = require('child_process').exec;
   
    var attachedVirtualMachines = [];
	
	var STATE = {
		PENDING: "PENDING",
		RUNNING: "RUNNING",
		STOPPED: "STOPPED",
		SUSPENDED: "SUSPENDED"
	};
	
	var startLease = function(leaseObj, callback) {
		attachedVirtualMachines.forEach(function(storeObj){		
			if (storeObj.lease === leaseObj) {
				storeObj.vms.forEach(function(hopts){														
					var command = 'java -jar esx.jar start ' + new Buffer(JSON.stringify(hopts)).toString('base64');
					console.log("startLease#####" + command);					
					//java -jar esx.jar start eyJwYXJhbXMiOnsiaHlwZXJ2aXNvcklEIjoiRVNYKGkpNSIsImlwIjoiMTkyLjE2OC4xLjMyIiwidXNlcm5hbWUiOiJyb290IiwicGFzc3dvcmQiOiJwYXNzd29yZCIsImhvc3QiOiJsb2NhbGhvc3QubG9jYWxkb21haW4ifSwibGVhc2UiOnsiY3JlZGVudGlhbHMiOnsiZGV0YWlscyI6eyJpZCI6MSwiY2VydGlmaWNhdGUiOiJhIiwidXNlcm5hbWUiOiJ0ZXN0IiwicGFzc3dvcmQiOiJ0ZXN0In0sInJlcXVlc3QiOnsidXNlcm5hbWUiOiJ0ZXN0IiwicGFzc3dvcmQiOiJ0ZXN0In0sImFjY2VzcyI6ImdyYW50ZWQifSwibGVhc2UiOnsicHJvY2Vzc29yVmVuZG9yIjoiSW50ZWwiLCJuZXR3b3JrQmFuZHdpZHRoIjoiMTAwIiwibWVtb3J5U2l6ZSI6IjEyOCIsImxlYXNlU3RhcnRUaW1lIjoiIiwibGVhc2VFbmRUaW1lIjoiIiwibGVhc2VUeXBlIjoiVVJHRU5UIiwibGVhc2VQcmVlbXB0aWJsZSI6ImZhbHNlIiwibWluaW11bUluc3RhbmNlc0NvdW50IjoiMSIsInByb2Nlc3NvclNwZWVkIjoiNTAwIiwic3RvcmFnZUNhcGFjaXR5IjoiMSIsIm1heGltdW1JbnN0YW5jZXNDb3VudCI6IjEiLCJwcm9jZXNzb3JBcmNoaXRlY3R1cmUiOiJ4ODYiLCJudW1iZXJPZkNvcmVzIjoiMSIsInRlbXBsYXRlTmFtZSI6IlVfU18xMF8wNF9TIn0sImFkZGVkIjoxMzI5NDM2NzExMjI0fSwidmFwcE5hbWUiOiIxMzI5NDM2NzEyNjg2IiwibG9jYWxQYXRoIjoiRGl6ZXJ0YXRpZS5VYnVudHUuMTEuMTAub3ZmIiwic3RhdGUiOiJTVE9QUEVEIn0=
					exec(command, function(error, stdout, stderr) {
						hopts.state = STATE.RUNNING;
						callback(error, stdout, stderr);
					});
				});
			}
		});		
	};
	
    return Object.create({}, {
        getHypervisorID: {
            value: function() {
                return opts.hypervisorID;
            }
        },
		getLeaseStatistics: {
			value: function(leaseObj, callback) {
				//TODO get parameters for the lease from the hypervisor
				console.log("in getLeaseStatistics");
				callback({
					load: 10
				});
			}
		},
		/*
		getHypervisorStatistics: {
			value: function() {
			}
		},
        connect: {
            value: function(properties) {
                //TODO
            }
        },
        disconnect: {
            value: function() {
                //TODO
            }
        },*/
        getAllRunningVirtualMachines: {
            value: function() {
                return attachedVirtualMachines;
            }
        },
		//increase VM count from lease
        addVirtualMachine: {
            value: function(leaseObj, callback) {
				console.log("in addVirtualMachine");
				var lease = JSON.parse(leaseObj);
				
				var startVmInstance =  function(storeObj, lease, callback) {
					//TODO use the actual template from the user
					var templateName = "Dizertatie.Ubuntu.11.10.ovf"; //lease.lease.??
					var hopts = {
						params: opts,
						lease: lease,
						vappName: new Date().getTime()+"",
						localPath: templateName,
						state: STATE.STOPPED
					};
					//add to the auxiliary vms
					storeObj.auxVms.push(hopts);
					
					//run the command					
					var command = 'java -jar esx.jar clone ' + new Buffer(JSON.stringify(hopts)).toString('base64');
					console.log("addVirtualMachine@@@" + command);							
					exec(command, function(error, stdout, stderr) {
						var startCommand = 'java -jar esx.jar start ' + new Buffer(JSON.stringify(hopts)).toString('base64');
						console.log("addVirtualMachine@@@" + startCommand);
						exec(startCommand, function(error, stdout, stderr) {
							hopts.state = STATE.RUNNING;
							callback(error, stdout, stderr);
						});							
					});						
				};
				
				var found = false;
				attachedVirtualMachines.forEach(function(storeObj){		
					if (storeObj.lease === leaseObj) {						
						found = true;						
						console.log("found");
						startVmInstance(storeObj, lease, callback);
					}
				});	
				if (!found) {
					console.log("not found");
					var storeObj =  {
						lease: leaseObj,
						vms: [], //the VMs [1..minimumInstancesCount]
						auxVms: [] //the VMs from (minimumInstancesCount..maximumInstanceCount]
					};
					startVmInstance(storeObj, lease, callback);
				}
            }
        },
		//decrease VM count from lease
		removeVirtualMachine: {
            value: function(leaseObj, callback) {
                //TODO
				console.log("in removeVirtualMachine");
				callback();
            }
        },
		//check if a lease can be allocated
		checkFreeResourcesAvailable: {
            value: function(leaseObj, callback) {
				//TODO check if I have free resources on the target hypervisor
				console.log("in checkFreeResourcesAvailable");
				callback(true);
            }
        },
		//allocate the lease - clone the VM images from the lease
		allocateLease: {
            value: function(leaseObj, callback) {
				var lease = JSON.parse(leaseObj);
				//console.log(lease);				
				//clone minimumInstancesCount virtual machines				
				var storeObj =  {
					lease: leaseObj,
					vms: [], //the VMs [1..minimumInstancesCount]
					auxVms: [] //the VMs from (minimumInstancesCount..maximumInstanceCount]
				};
				
				//TODO use the actual template from the user
				var templateName = "Dizertatie.Ubuntu.11.10.ovf"; //lease.lease.??
				for (var i=0; i<lease.lease.minimumInstancesCount; i+=1) {
					var hopts = {
						params: opts,
						lease: lease,
						vappName: new Date().getTime()+"",
						localPath: templateName,
						state: STATE.STOPPED
					};
					storeObj.vms.push(hopts);
					
					//run the command					
					var command = 'java -jar esx.jar clone ' + new Buffer(JSON.stringify(hopts)).toString('base64');
					console.log("allocateLease>>>>>>>" + command);	
					//java -jar esx.jar clone {"params":{"hypervisorID":"ESX(i)5","ip":"192.168.1.32","username":"root","password":"password","host":"localhost.localdomain"},"lease":{"credentials":{"details":{"id":1,"certificate":"a","username":"test","password":"test"},"request":{"username":"test","password":"test"},"access":"granted"},"lease":{"processorVendor":"Intel","networkBandwidth":"100","memorySize":"128","leaseStartTime":"","leaseEndTime":"","leaseType":"URGENT","leasePreemptible":"false","minimumInstancesCount":"1","processorSpeed":"500","storageCapacity":"1","maximumInstancesCount":"1","processorArchitecture":"x86","numberOfCores":"1","templateName":"U_S_10_04_S"},"added":1329432888308},"vappName":"1329432888688","localPath":"Dizertatie.Ubuntu.11.10.ovf","state":"STOPPED"}
					//java -jar esx.jar clone eyJwYXJhbXMiOnsiaHlwZXJ2aXNvcklEIjoiRVNYKGkpNSIsImlwIjoiMTkyLjE2OC4xLjMyIiwidXNlcm5hbWUiOiJyb290IiwicGFzc3dvcmQiOiJwYXNzd29yZCIsImhvc3QiOiJsb2NhbGhvc3QubG9jYWxkb21haW4ifSwibGVhc2UiOnsiY3JlZGVudGlhbHMiOnsiZGV0YWlscyI6eyJpZCI6MSwiY2VydGlmaWNhdGUiOiJhIiwidXNlcm5hbWUiOiJ0ZXN0IiwicGFzc3dvcmQiOiJ0ZXN0In0sInJlcXVlc3QiOnsidXNlcm5hbWUiOiJ0ZXN0IiwicGFzc3dvcmQiOiJ0ZXN0In0sImFjY2VzcyI6ImdyYW50ZWQifSwibGVhc2UiOnsicHJvY2Vzc29yVmVuZG9yIjoiSW50ZWwiLCJuZXR3b3JrQmFuZHdpZHRoIjoiMTAwIiwibWVtb3J5U2l6ZSI6IjEyOCIsImxlYXNlU3RhcnRUaW1lIjoiIiwibGVhc2VFbmRUaW1lIjoiIiwibGVhc2VUeXBlIjoiVVJHRU5UIiwibGVhc2VQcmVlbXB0aWJsZSI6ImZhbHNlIiwibWluaW11bUluc3RhbmNlc0NvdW50IjoiMSIsInByb2Nlc3NvclNwZWVkIjoiNTAwIiwic3RvcmFnZUNhcGFjaXR5IjoiMSIsIm1heGltdW1JbnN0YW5jZXNDb3VudCI6IjEiLCJwcm9jZXNzb3JBcmNoaXRlY3R1cmUiOiJ4ODYiLCJudW1iZXJPZkNvcmVzIjoiMSIsInRlbXBsYXRlTmFtZSI6IlVfU18xMF8wNF9TIn0sImFkZGVkIjoxMzI5NDMzMDYxMzkyfSwidmFwcE5hbWUiOiIxMzI5NDMzMDYyNzAxIiwibG9jYWxQYXRoIjoiRGl6ZXJ0YXRpZS5VYnVudHUuMTEuMTAub3ZmIiwic3RhdGUiOiJTVE9QUEVEIn0=
					exec(command, callback);
				}
				
				//save the virtual machine allocation
				attachedVirtualMachines.push(storeObj);
            }
        },
		//start all the VMs from the lease
		startLease: {
			value: function(leaseObj, callback) {				
				attachedVirtualMachines.forEach(function(storeObj){		
					if (storeObj.lease === leaseObj) {
						storeObj.vms.forEach(function(hopts){														
							var command = 'java -jar esx.jar start ' + new Buffer(JSON.stringify(hopts)).toString('base64');
							console.log("startLease#####" + command);					
							//java -jar esx.jar start eyJwYXJhbXMiOnsiaHlwZXJ2aXNvcklEIjoiRVNYKGkpNSIsImlwIjoiMTkyLjE2OC4xLjMyIiwidXNlcm5hbWUiOiJyb290IiwicGFzc3dvcmQiOiJwYXNzd29yZCIsImhvc3QiOiJsb2NhbGhvc3QubG9jYWxkb21haW4ifSwibGVhc2UiOnsiY3JlZGVudGlhbHMiOnsiZGV0YWlscyI6eyJpZCI6MSwiY2VydGlmaWNhdGUiOiJhIiwidXNlcm5hbWUiOiJ0ZXN0IiwicGFzc3dvcmQiOiJ0ZXN0In0sInJlcXVlc3QiOnsidXNlcm5hbWUiOiJ0ZXN0IiwicGFzc3dvcmQiOiJ0ZXN0In0sImFjY2VzcyI6ImdyYW50ZWQifSwibGVhc2UiOnsicHJvY2Vzc29yVmVuZG9yIjoiSW50ZWwiLCJuZXR3b3JrQmFuZHdpZHRoIjoiMTAwIiwibWVtb3J5U2l6ZSI6IjEyOCIsImxlYXNlU3RhcnRUaW1lIjoiIiwibGVhc2VFbmRUaW1lIjoiIiwibGVhc2VUeXBlIjoiVVJHRU5UIiwibGVhc2VQcmVlbXB0aWJsZSI6ImZhbHNlIiwibWluaW11bUluc3RhbmNlc0NvdW50IjoiMSIsInByb2Nlc3NvclNwZWVkIjoiNTAwIiwic3RvcmFnZUNhcGFjaXR5IjoiMSIsIm1heGltdW1JbnN0YW5jZXNDb3VudCI6IjEiLCJwcm9jZXNzb3JBcmNoaXRlY3R1cmUiOiJ4ODYiLCJudW1iZXJPZkNvcmVzIjoiMSIsInRlbXBsYXRlTmFtZSI6IlVfU18xMF8wNF9TIn0sImFkZGVkIjoxMzI5NDM2NzExMjI0fSwidmFwcE5hbWUiOiIxMzI5NDM2NzEyNjg2IiwibG9jYWxQYXRoIjoiRGl6ZXJ0YXRpZS5VYnVudHUuMTEuMTAub3ZmIiwic3RhdGUiOiJTVE9QUEVEIn0=
							exec(command, function(error, stdout, stderr) {
								hopts.state = STATE.RUNNING;
								callback(error, stdout, stderr);
							});
						});
					}
				});	
			}
		},
		/*startVirtualMachine: {
			value: function(uid) {
				//TODO get opts for the required uid
				var hopts = {}; 
				
				//TODO do some stuff in Java
				
				//set the state to running
				hopts.state = STATE.RUNNING;
			}
		},
		stopVirtualMachine: {
			value: function(uid) {
				//TODO get opts for the required uid
				var hopts = {}; 
				
				//TODO do some stuff in Java
				
				//set the state to running
				hopts.state = STATE.STOPPED;
			}
		},
		suspendVirtualMachine: {
			value: function(uid) {
				//TODO get opts for the required uid
				var hopts = {}; 
				
				//TODO do some stuff in Java
				
				//set the state to running
				hopts.state = STATE.SUSPENDED;
			}
		},*/
		//get leases, running and auxiliary VMs
        getRunningVirtualMachinesCount: {
            value: function() {
				var countVms = 0;
				var countAuxVms = 0;
				attachedVirtualMachines.forEach(function(storeObj){							
					countVms += storeObj.vms.length;
					countAuxVms += storeObj.auxVms.length;
				});		
                return {
					leases: attachedVirtualMachines.length,
					vms: countVms,
					auxVms: countAuxVms
				};
            }
        }		
    });
};