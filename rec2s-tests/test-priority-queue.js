/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
 var q = require("../rec2s-utils/rec2s-generic-priority queue").init();
 
 q.enqueue(1, 9);
 q.enqueue(4, 2);
 q.enqueue(5, 3);
 q.enqueue(7, 5);
 
 var correct = [4, 5, 7, 1];
 
 
 var isOk = true;
 for (var i=0; i<4; i+=1) {
	if (q.dequeue() != correct[i]) {
		isOk = false;
		break;
	}		
 }

console.log(isOk);
console.log(q.size() == 0); 