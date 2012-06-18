/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
 exports.init = function(opts) {
    
    var defaults = {
		compare: function(left, right){
			//TODO
		},
		log: require("./rec2s-generic-logger").create({
			loggingObject: "SelectSort",
			logFileName : "select-sort.log"
		})
	};
    
    // get the full configuration
    var config = require("./rec2s-generic-extend").init().extend(defaults, opts);
    		
	var moduleSort = function (input) {						
		var length = input.length;
		var max;		
		var i;
		var j;
		var aux;
		
		if (length < 2) {
			return input;
		}
		//log.info("aici");
		for (i=0; i<length; i+=1) {
			max = i;
			for (j=i+1; j<length; j+=1) {
				if (input[max] > input[j]) {
					max = j;
				}
			}
			aux = input[max];
			input[max] = input[i];
			input[i] = aux;
		}				
		return input;
	};
	
    return Object.create({}, {		
		sort: {
			value: moduleSort
		}	
    });
};