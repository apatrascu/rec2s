/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
exports.create = function() {
    var ip = '192.168.1.158';
    return {
        "userManagerIp": ip,
        "userManagerPort": 6100,
		"dbUsername" : "root",
		"dbPassword" : "password",
		"dbDatabase" : "rec2s",
		"dbServer" : "192.168.1.56",
		"dbPort" : "3306"
    };
};

