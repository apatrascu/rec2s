/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
exports.create = function() {
    var ip = '192.168.1.158';
    return {
		"vmLoadBarrier" : 90,
		"monitorIp": ip,
		"monitorPort": 6500,
        "frontendIp": ip,
        "frontendPort": 6000, 		
		"leaseManagerApiIp":ip,
		"leaseManagerApiPort":8000,
		"schedulerIp": ip,
		"schedulerPort": 6600,
		"hypervisorManagerIp": ip,
		"hypervisorManagerPort": 11000
    };
};

