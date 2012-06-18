/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
var queue = require("../rec2s-utils/rec2s-generic-queue-with-backup").init({
	log: require("../rec2s-utils/rec2s-generic-logger").create({
		loggingObject: "TestQueue",
		logFileName : "test-queue.log"
	}),
	mysql_opts: {
		username : "root", // username for connection to MySQL server
		password : "password", // password for the user
		database : "rec2s", // database in which the username has access
		table : "test", // table in which you store the leases
		server : "192.168.1.96", // MySQL server IP
		port : 3306 // MySQL server port
	},
	restoreQuery: "select * from test;",
	adderCallback: function(element, queue) {		
		queue.push(element);		
	},
	restoreDbElement: function(row) {
		//the way the element looks like when deserializing from DB
		return {			
			lease: row["lease"]
		};
	},
	insertDbElement: function(element) {
		return "insert into test(id, lease) values (NULL, '" + element.lease + "')";
	},
	deleteDbElement: function(element) {
		return "delete from test where lease='" + element.lease + "';";
	}
});


//testare valori din DB backup
setTimeout(function(){
	console.log("coada din DB are lungimea: " + queue.getLength());
	console.log(queue.seeNextElement());
}, 2000);

//testare valori din memorie si DB
setTimeout(function(){
	queue.addElement({lease:"fufu are mouseu mare"});
	console.log("coada are lungimea: " + queue.getLength());	
	console.log(queue.seeNextElement());
	console.log(queue.getNextElement());
	console.log("coada are lungimea: " + queue.getLength());
}, 3000);