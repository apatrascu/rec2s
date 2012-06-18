/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
var winston = require('winston');
exports.create = function(opts) {
    //the default values to run the logger
    var defaults = {
        loggingObject : "",
        logFileName : new Date().getTime()+"",
		consoleOutput: true
    };
    
    // get the full configuration
    var config = require("./rec2s-generic-extend").init().extend(defaults, opts);
    
	//configure the transport lists for the logger
	var transportsList = [];
	if (config.consoleOutput) {
		transportsList.push(new (winston.transports.Console)());
	}
	transportsList.push(new (winston.transports.File)({ filename: config.logFileName }));
    var logger = new (winston.Logger)({
        transports: transportsList/*[
            new (winston.transports.Console)(),
            new (winston.transports.File)({ filename: config.logFileName })
        ]*/
    });
	
	
	
	
    return Object.create({}, {
        info: {
            value: function(message) {
                logger.info("[" + config.loggingObject + "][" + new Date() + "] " + message);
            }
        }
    });
};