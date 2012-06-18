/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
exports.init = function(opts) {
    var cluster = require('cluster');

    var defaults = {
        workerCount : require('os').cpus().length, // how many workers I want; defaults to the core count
        logger : console, // logger object; defaults to console
        messageFromWorkersCallback: function(worker) { return function(message){} }, // setup the callback for child messages
        failOverMode : true, // choose failover in case one child dies; default is true
        masterMainFunction : function(workers){}, // function to be ran in the master process; receives the list of children processes as parameter
        childrenMainFunction : function(){}, // function to be ran in the child process
		afterChildrenForkFunction: function(worker, workerIndex){},
		afterChildrenDeathFunction: function(worker) {}
    };

    // get the full configuration
    var config = require("./rec2s-generic-extend").init().extend(defaults, opts);

    if (cluster.isMaster) {
		var workers = [];
		
        // fork some workers
        for (var i = 0; i < config.workerCount; i++) {
            // save the worker as a separate value
            var worker = cluster.fork();
			workers.push({
				worker: worker,
				afterChildrenForkFunction: config.afterChildrenForkFunction,
				index: i
			});

			if (config.afterChildrenForkFunction) {				
				config.afterChildrenForkFunction(worker, i);
			}
            // setup a communication channel between the parent and the child processes
            worker.on('message', config.messageFromWorkersCallback(worker));
        }

        // setup children death callbacks
        cluster.on('death', function(worker) {
            config.logger.info('Worker ' + worker.pid + ' died on ' + new Date());
			
			//remove the dead child from the list
			var foundIndex = -1;
			for (var i=0; i<workers.size; i++) {
				if (workers[i].worker.pid === worker.pid) {
					foundIndex = i;
					break;
				}
			}			
			var deadChild = workers.splice(foundIndex, 1);
			
			if (config.afterChildrenDeathFunction) {
				config.afterChildrenDeathFunction(deadChild);
			}
			
			//if we have configured failOver, we restart the worker
            if (config.failOverMode) {
                var newWorker = cluster.fork();
				if (deadChild.afterChildrenForkFunction) {
					deadChild.afterChildrenForkFunction(newWorker, deadChild.index);
				}
                newWorker.on('message', messageFromWorkersCallback);
            }
        });

        config.masterMainFunction(workers);

    } else {
        // in the child process
        
        config.childrenMainFunction();

        // try to send every time interval a keepalive message to the master.
        // if it's dead, a "channel closed" exception is raised
        // and the children commit suicide
        setInterval(function () {
            try {
                process.send({ type: 'keepAlive'});
            } catch (e) {
                process.exit(0);
            }
        }, 1000);
    }

    return Object.create({}, {
        info: {
            value: function() {
                return "Cluster up&running!";
            }
        }
    });
};