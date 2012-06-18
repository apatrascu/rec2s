/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
var log = require("../rec2s-utils/rec2s-generic-logger").create({
    loggingObject: "UserManager",
    logFileName : "user-manager.log"
});

var PERMISSION = {
	GRANTED: "granted",
	DENIED: "denied",
	REGISTERED: "registered",
	EXISTING: "existing"
};
var GLOBALS = require("../rec2s-globals/rec2s-globals").create();
var app = require('express').createServer(GLOBALS.getExpressOpts());
var CONSTANTS = require("./user-manager-constants").create();



// initialize the connection pool to MySQL server
var MySQLPool = require("mysql-pool").MySQLPool;
var pool = new MySQLPool({
	poolSize: 4,
	user:     CONSTANTS["dbUsername"],
	password: CONSTANTS["dbPassword"],
	database: CONSTANTS["dbDatabase"],
	host: CONSTANTS["dbServer"],
	port: CONSTANTS["dbPort"]
});


app.get('/authenticate/:base64json', function (req, res) {
	var stuff = new Buffer(req.params.base64json, 'base64').toString('ascii');
	var user = JSON.parse(stuff);
	
	//poll the DB for something usefull
	var query = "select * from user where username = '" + user.username + "' and password = '" + user.password + "'";
	pool.query(query, function(err, rows, fields) {					 
		if (err) {
			log.info(err+"");			 
		} else {
			var answer = {
				request: user,
				access: PERMISSION.GRANTED
			};
			
			if (rows.length == 1) {
				answer.details = rows[0];				
			} else {
				answer.access = PERMISSION.DENIED;
				answer.reason = "userManagerError0002";
			}
			res.send(new Buffer(JSON.stringify(answer)).toString('base64'));
		}
	});	
});
app.get('/register/:base64json', function (req, res) {
	var stuff = new Buffer(req.params.base64json, 'base64').toString('ascii');
	var user = JSON.parse(stuff);
	
	//poll the DB for something usefull
	var query = "select * from user where username = '" + user.username + "'";
	pool.query(query, function(err, rows, fields) {					 
		if (err) {
			log.info(err+"");			 
		} else {
			if (rows.length > 0) {
				//already have the user in DB
				var answer = {
					request: user,
					access: PERMISSION.EXISTING,
					reason: "userManagerError0004"
				};
				res.send(new Buffer(JSON.stringify(answer)).toString('base64'));
			} else {
				//add the new user in DB
				var insert = "insert into user(username, password) values ('" + user.username + "', '" + user.password + "')";
				pool.query(insert, function(err, rows, fields) {	
					if (err) {
						log.info(err+"");			 
					} else {
						var answer = {
							request: user,
							access: PERMISSION.REGISTERED
						};
						res.send(new Buffer(JSON.stringify(answer)).toString('base64'));
					}
				});
			}
		}
	});	
});

app.listen(CONSTANTS["userManagerPort"], CONSTANTS["userManagerIp"]);
log.info((GLOBALS.isSecure() ? "[SECURE]" : "") + 'listening on ' + CONSTANTS["userManagerIp"]  + ':' + CONSTANTS["userManagerPort"]);