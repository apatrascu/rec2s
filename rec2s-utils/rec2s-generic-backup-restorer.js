/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
exports.create = function(opts) {
    
    var defaults = {
		log: require("./rec2s-generic-logger").create({
			loggingObject: "GenericBackupRestorer",
			logFileName : "generic-backup-restorer.log"
		}),
		poolSize : 4, // how large I want the thread pool
		username : "root", // username for connection to MySQL server
		password : "password", // password for the user
		database : "rec2s", // database in which the username has access
		table : "scheduler_delayable", // table in which you store the leases
		server : "127.0.0.1", // MySQL server IP
		port : 3306 // MySQL server port
	};
    
    // get the full configuration
    var config = require("./rec2s-generic-extend").init().extend(defaults, opts);	
    
	// initialize the connection pool to MySQL server
	var MySQLPool = require("mysql-pool").MySQLPool;
	var pool = new MySQLPool({
		poolSize: config.poolSize,
		user:     config.username,
		password: config.password,
		database: config.database,
		host: config.server,
		port: config.port
	});
	
    return Object.create({}, {
		// the "select  from ..."
        restore: {
            value: function(query, callback) {					
                pool.query(query, function(err, rows, fields) {					 
					if (err) {
						config.log.info(err+"");			 
					} else {
						if (callback) {
							callback(rows);
						}
					}
				});
            }
        },
		// the "insert into ...."
		backup: {
			value: function(query, callback) {
				pool.query(query, function(err, rows, fields) {
                    if (err) {
                        config.log.info(err+"");
                    } else {
						if (callback) {
							callback();	
						}
					}
                });
			}
		},
		// the "delete from ..."
		remove: {
			value: function(query, callback) {				
				pool.query(query, function(err, rows, fields) {
                    if (err) {
                        config.log.info(err+"");
                    } else {
						if (callback) {
							callback();	
						}
					}
                });
			}
		},
		// the "update ..."
		update: {
			value: function(query, callback) {				
				pool.query(query, function(err, rows, fields) {
                    if (err) {
                        config.log.info(err+"");
                    } else {
						if (callback) {
							callback();	
						}
					}
                });
			}
		}
    });
};