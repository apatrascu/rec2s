/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
 var sortMethod = require("../rec2s-utils/rec2s-parallel-select-sort").init();
 
 var max = 10;
 
 var toSort = [];
 for (var i=max; i>=0; i-=1) {
	toSort.push(i);
 }
 
 var correct = [];
 for (var i=0; i<=max; i+=1) {
	correct.push(i)
 }
 
sortMethod.sort(toSort, function(sorted){
	console.log("am primit mesaj de la sortare");
	var isOk = true;
	 for (var i=0; i<=max; i+=1) {
		if (sorted[i] != correct[i]) {
			isOk = false;
			break;
		}		
	 }
	 //console.log(correct);
	 //console.log(toSort);
	 //console.log(sorted);
	 console.log(isOk);
	 
 }); 
 