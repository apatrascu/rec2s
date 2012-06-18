/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
 exports.init = function(opts) {
    
    var defaults = {
		compare: function(left, right) {
			if (left < right) {
				return -1;
			}
			if (left == right) {
				return 0;		
			}					
			return 1;
		},
		log: require("./rec2s-generic-logger").create({
			loggingObject: "MergeSort",
			logFileName : "merge-sort.log"
		})
	};
    
    // get the full configuration
    var config = require("./rec2s-generic-extend").init().extend(defaults, opts);
    
	var moduleMerge = function(left, right, compare) {
		var result = [];

		while (left.length > 0 || right.length > 0) {
			if (left.length > 0 && right.length > 0) {
				if (compare(left[0], right[0]) <= 0) {
					result.push(left[0]);
					left = left.slice(1);
				}
				else {
					result.push(right[0]);
					right = right.slice(1);
				}
			}
			else if (left.length > 0) {
				result.push(left[0]);
				left = left.slice(1);
			}
			else if (right.length > 0) {
				result.push(right[0]);
				right = right.slice(1);
			}
		}
		return result;
	};	
	
	var moduleSort = function (input) {						
		var length = input.length;
		var middle = Math.floor(length / 2);
		
		if (length < 2) {
			return input;
		}
			
		return moduleMerge(
			moduleSort(input.slice(0, middle)),			
			moduleSort(input.slice(middle, length)),
			config.compare
		);
	};
	
    return Object.create({}, {		
		sort: {
			value: moduleSort
		}	
    });
};