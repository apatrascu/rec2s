/**
 * ReC2S - Reliable Cloud Computing System
 *
 * Copyright (C) 2012 Alecsandru Patrascu - alecsandru[dot]patrascu[at]gmail[dot]com
 *
 */
exports.init = function(){
    return Object.create({}, {
        extend: {
            value: function(defaults, opts) {
				
				for (var element in opts) {
					defaults[element] = opts[element];
				}
				
				return defaults;
				/*
                //transform in ES format
                for (var element in defaults) {
                    defaults[element] = { value: defaults[element] };
                }
                for (var element in opts) {
                    opts[element] = { value: opts[element] };
                }

                // get the full configuration
                var config = Object.create(defaults, opts);
				
				
				
				console.log("a");
				console.log( Object.isExtensible( defaults ) );
				console.log(defaults);
				console.log(opts);
                
				
				return config;
				*/
            }
        }
    });
};
