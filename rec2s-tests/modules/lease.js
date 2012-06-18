/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
 exports.init = function(opts) {
    /*
    var defaults = {
		//TODO
	};
    
    // get the full configuration
    var config = require("../rec2s-utils/rec2s-generic-extend").init().extend(defaults, opts);
    */
	/* CONSTANTS */
	var LEASE_TYPE = {
		"ADVANCED_RESERVATION" : "ADVANCED_RESERVATION",
		"BEST_EFFORT" : "BEST_EFFORT",
		"URGENT" : "URGENT"
	};

	var PROCESSOR_ARCH = {	 
		"x86":"x86",
		"x86_64":"x86_64"	
	};

	var PROCESSOR_VENDOR = {
		"Intel" : "Intel",
		"AMD" : "AMD"
	};

	var PROCESSOR_SPEED = {
		"500" : "500",
		"1000" : "1000",
		"1500" : "1500",
		"2000" : "2000",
		"2500" : "2500",
		"3000" : "3000"
	};

	var CORES = {
		"1":"1",
		"2":"2",
		"3":"3",
		"4":"4",
		"5":"5",
		"6":"6"
	};

	var MEMORY_SIZE = {
		"128":"128",
		"192":"192",
		"256":"256",
		"384":"384",
		"512":"512",
		"768":"768",
		"1024":"1024",
		"1536":"1536",
		"2048":"2048"
	};

	var STORAGE_CAPACITY = {
		"1":"1",
		"2":"2",
		"3":"3",
		"4":"4",
		"5":"5",
		"6":"6",
		"7":"7",
		"8":"8",
		"9":"9"
	};

	var NETWORK_BANDWIDTH = {
		"100":"100",
		"1000":"1000"
	};
					
	var TEMPLATE = {
		"U_S_10_04_S":"U_S_10_04_S",
		"U_S_10_04_M":"U_S_10_04_M"
	};

	/* GET METHODS */
	var getLeaseStartTime = function() {
		return new Date().getTime() + "";
	};
	var getLeaseEndTime = function() {
		return new Date().getTime() + "";
	};
	var getLeaseType = function() {
		return LEASE_TYPE.ADVANCED_RESERVATION;
	}
	var getLeasePreemtible = function() {
		return 'false';
	};
	var getMinimumInstancesCount = function() {
		return 1;
	};
	var getMaximumInstancesCount = function() {
		return 1;
	};
	var getProcessorArchitecture = function() {
		return PROCESSOR_ARCH["x86"];
	};
	var getProcessorVendor = function() {
		return PROCESSOR_VENDOR["Intel"];
	};
	var getProcessorSpeed = function() {
		return PROCESSOR_SPEED["500"];
	};
	var getNumberOfCores = function() {
		return CORES["1"];
	};
	var getMemorySize = function() {
		return MEMORY_SIZE["1024"];
	};
	var getStorageCapacity = function() {
		return STORAGE_CAPACITY["5"];
	};
	var getNetworkBandwidth = function() {
		return NETWORK_BANDWIDTH["100"];
	};
	var getTemplateName = function() {
		return TEMPLATE["U_S_10_04_S"];
	};

	

	
    return Object.create({}, {		
		getTestLease: {
			value: function() {
				/* CREATE THE LEASE */
				var lease = {
					"leaseStartTime" : getLeaseStartTime(),
					"leaseEndTime" : getLeaseEndTime(),
					"leaseType" : getLeaseType(),
					"leasePreemptible" : getLeasePreemtible(),
					"minimumInstancesCount" : getMinimumInstancesCount(),
					"maximumInstancesCount" : getMaximumInstancesCount(),
					"processorArchitecture" : getProcessorArchitecture(),
					"processorVendor" : getProcessorVendor(),
					"processorSpeed" : getProcessorSpeed(),
					"numberOfCores" : getNumberOfCores(),
					"memorySize" : getMemorySize(),
					"storageCapacity" : getStorageCapacity(),
					"networkBandwidth" : getNetworkBandwidth(),
					"templateName" : getTemplateName()
				};
				return lease;
			}
		},
		equalLeases: {
			value: function(a, b) {
				var fieldsToCompare = [
					"leaseType",
					"leasePreemptible",
					"minimumInstancesCount",
					"maximumInstancesCount",
					"processorArchitecture",
					"processorVendor",
					"processorSpeed",
					"numberOfCores",
					"memorySize",
					"storageCapacity",
					"networkBandwidth",
					"templateName"
				];
				fieldsToCompare.forEach(function(element, index){
					if (a[element] !== b[element])
						return false;
				});
				return true;
			}
		}
		
    });
};