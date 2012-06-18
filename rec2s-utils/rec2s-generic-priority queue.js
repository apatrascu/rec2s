/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
 exports.init = function(opts) {
    
    var defaults = {
		
	};
    
    // get the full configuration
    var config = require("./rec2s-generic-extend").init().extend(defaults, opts);
    
	//the object to store the elements
	var queue = [];
		
	var sortPlugin = require("./rec2s-merge-sort").init({
		compare: function(left, right){
			if (left.priority < right.priority) {
				return -1;
			}
			if (left.priority == right.priority) {
				return 0;		
			}					
			return 1;
		}
	});
	
    return Object.create({}, {		
		enqueue: {
			value: function (element, priority) {				
				var obj = {
					value: element,
					priority: priority
				};
				queue.push(obj);
				queue = sortPlugin.sort(queue);
			}
		},
		dequeue: {
			value: function() {	
				if (queue.length > 0) {
					var element = queue.shift();
					return element.value;
				}
				return undefined;
			}
		},
		poll: {
			value: function() {		
				if (queue.length > 0) {
					return queue[0].value;
				}
				return undefined;
			}
		},
		size: {
			value: function() {
				return queue.length;
			}
		}		
    });
};