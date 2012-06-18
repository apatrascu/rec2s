/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
exports.create = function() {
    var ip = '192.168.1.158';
    return {
        "leaseManagerIp": ip,
        "leaseManagerPort": 9000,
        "leaseManagerApiIp" : ip,
        "leaseManagerApiPort": 8000,
		"mysqlServerIp": "192.168.1.56",
		"mysqlServerPort": 3306
    };
};

