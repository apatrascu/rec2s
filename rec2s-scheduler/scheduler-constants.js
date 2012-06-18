/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
exports.create = function() {
    return {        
        "leaseManagerApiIp" : "192.168.1.158",
        "leaseManagerApiPort": 8000,
		"mysqlServerIp": "192.168.1.56",
		"mysqlServerPort": 3306,
		"vmCreateDelay": 10, //minutes needed for 1 virtual machine to be deployed and started,
		"hypervisorManagerIp": "192.168.1.158",
		"hypervisorManagerPort": "11000",
		"schedulerIp": "192.168.1.158",
		"schedulerPort": 6600
    };
};

