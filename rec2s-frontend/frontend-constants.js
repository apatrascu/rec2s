/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
exports.create = function() {
    var ip = '192.168.1.158';
    return {
        "frontendIp": ip,
        "frontendPort": 6000,  
		"userManagerIp" : ip,
		"userManagerPort" : 6100,
		"leaseManagerApiIp":ip,
		"leaseManagerApiPort":8000,
		"monitorIp": ip,
		"monitorPort": 6500,
		"schedulerIp": ip,
		"schedulerPort": 6600
    };
};

