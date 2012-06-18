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
			loggingObject: "ParallelSelectSort",
			logFileName : "parallel-select-sort.log"
		})
	};
    
    // get the full configuration
    var config = require("./rec2s-generic-extend").init().extend(defaults, opts);
	
	
	function selectSort(v, comparator) {
		var l = v.length;
		var max;
		var aux;
		for (var i=0; i<l; i+=1) {
			max = i;
			for (var j=i+1; j<l; j+=1) {
				if (comparator(v[max], v[j])) {				
					max = j;
				}
			}
			aux = v[max];
			v[max] = v[i];
			v[i] = aux;
		}	
		return v;
	};
    		
	var moduleSort = function (input, callback) {								
		var length = input.length;
		if (length < 2) {
			callback(input);
			process.exit(0);
		}
		
		var cores = require('os').cpus().length;
		var n = cores * 3; 					
		var sortedInput = [];
		var childrenCount = 0;
		
		var cluster = require("../rec2s-utils/rec2s-generic-cluster").init({
			workerCount: n,
			logger : config.log,
			failOverMode: false,
			messageFromWorkersCallback: function(worker) { 
				return function(message){					
					if (message.type === "taskdone") {
						sortedInput[message.payload.id] = message.payload.response;
						childrenCount -= 1;
					}
				} 
			}, 
			afterChildrenForkFunction: function(worker, workerIndex) {				
			},
			afterChildrenDeathFunction: function(worker) {
				childrenCount -= 1;
			},
			masterMainFunction : function(workers){
				//create jobs
				var chunkSize = Math.ceil(length / n);
				var jobs = [];
				var s = 0;
				for (var i=0; i<n-1; i+=1) {		
					jobs.push({
						id: i,
						start: s,
						end: s+chunkSize,
						vector: input.slice(s, s+chunkSize)
					});
					s += chunkSize;
				}
				jobs.push({
					id: n-1,
					start: s,
					end: length,
					vector: input.slice(s, length)
				});
				
				//send each job to the workers
				workers.forEach(function(element, index){
					var worker = element.worker;										
					//config.log.info("[m] workeru " + worker.pid + ": start=" + jobs[index].start + " end=" + jobs[index].end);
					worker.send({
						type: "newtask",
						payload: jobs[index]
					});
					childrenCount += 1;
				});
				
				//wait for completion
				setInterval(function () {
					if (childrenCount == 0) {
						childrenCount = 1;
						var temp = [];
						sortedInput.forEach(function(element, index){
							temp.push({
								value: element[0],
								index: index
							});
						});
						temp = selectSort(temp, function(a,b){
							if (a.value > b.value) {
								return true;
							}
							return false;
						});
						
						var output = [];
						temp.forEach(function(element, index){
							output = output.concat(sortedInput[element.index]);
						});
						
						
						if (callback) {							
							callback(output);							
						} 
						workers.forEach(function(element, index){								
							element.worker.send({
								type: "suicide"									
							});								
						});
						process.exit(0);
					}
				}, 20);
			}, 
			childrenMainFunction : function(){
				process.on('message', function(message) {
					if (message.type == "newtask") {
						var job = message.payload;										
						var v = selectSort(job.vector, function(a, b){
							if (a > b) {
								return true;
							}
							return false;
						});
						process.send({
							type: "taskdone",
							payload: {
								id: job.id,
								response: v
							}
						});	
					}
					if (message.type == "suicide") {
						process.exit(0);
					}
					
				});
			} 
		});
	};
	
    return Object.create({}, {		
		sort: {
			value: moduleSort
		}	
    });
};