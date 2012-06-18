/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
exports.init = function(opts) {
    //the default values to run the logger
    var defaults = {
		log: require("./rec2s-generic-logger").create({
			loggingObject: "GenericQueueWithBackup",
			logFileName : "generic-queue-with-backup.log"
		}),
		mysql_opts: {
			database : "rec2s",
			table: "test"
		},
		restoreQuery: "select * from test;",
		adderCallback: function(element, queue) {
			queue.push(element);
		},
		updaterCallback: function(element, queue) {
			//search the element in queue and update it
		},
		restoreDbElement: function(row) {
			//the way the object looks like when deserializing from DB
			return {};
		},
		insertDbElement: function(element) {
			return "insert into gigi values (...)";
		},
		deleteDbElement: function(element) {
			return "delete from test ....";
		},
		updateDbElement: function(element) {
			return "update ....";
		}
	};
    
    // get the full configuration
    var config = require("./rec2s-generic-extend").init().extend(defaults, opts);
    
	//the object to store the elements
	var queue = [];
		
	var mysql = require("./rec2s-generic-backup-restorer").create(config.mysql_opts);
	mysql.restore(config.restoreQuery, function(rows){		
		rows.forEach(function(row, index){
			//you use push in this function; 
			//if additional processing is needed, you must supply a different array and then traverse it in the proper way
			var element = config.restoreDbElement(row);
			config.log.info("Going to restore element: " + element);
			config.adderCallback(element, queue);
		});
	});
	
    return Object.create({}, {		
		// add a new element in queue
        addElement: {
            value: function(element, mySqlCallback) {
				config.log.info("Going to add element: " + element);
                config.adderCallback(element, queue);
				var insertQuery = config.insertDbElement(element);
				mysql.backup(insertQuery, mySqlCallback);
            }
		},
		//update an existing element in queue
		updateElement: {
            value: function(element, mySqlCallback) {
				config.log.info("Going to update element: " + element);
                config.updaterCallback(element, queue);
				var updateQuery = config.updateDbElement(element);				
				mysql.update(updateQuery, mySqlCallback);
            }
		},
		// only see the next element, without removing it
		seeNextElement: {
			value: function() {
				config.log.info("Going to see the next element");
				if (queue.length > 0) {
					return queue[0];
				}
				return {};
			}
		},
		// see and remove the next element
		getNextElement: {
			value: function() {
				config.log.info("Going to get the next element");
				if (queue.length > 0) {
					//remove from memory
					var element = queue.shift();
					
					//remove from DB
					var deleteQuery = config.deleteDbElement(element);
					//console.log(deleteQuery);
					mysql.remove(deleteQuery);
					
					return element;
				}
				return {};
			}
		},
		// element count
		getLength: {			
			value: function() {
				config.log.info("Going to get the queue length");
				return queue.length;
			}
		},
		//find elements
		find: {			
			value: function(filter) {
				config.log.info("Going to find elements");
				if (queue.length > 0) {
					var results = [];
					queue.forEach(function(element, index){
						if (filter(element)) {
							results.push(element);
						}
					});
					return results;
				}
				return [];
			}
		}		
    });
};