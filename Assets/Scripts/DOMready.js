var DOMready = (function(){

	// Variables used throughout this script
	var queue = [],
		 exec,
		 loaded,
		 original_onload;
	
	// Private inner function which is called once DOM is loaded.
	function process() {
		// Let the script know the DOM is loaded
		loaded = true;
		
		// Cleanup
		if (document.addEventListener) {
			document.removeEventListener("DOMContentLoaded", process, false);
		}
	
		// Move the zero index item from the queue and set 'exec' equal to it
		while ((exec = queue.shift())) {
			// Now execute the current function
			exec();
		}
	}

	return function(fn) {
		// if DOM is already loaded then just execute the specified function
		if (loaded) { 
			return fn();
		}
		
		if (document.addEventListener) {
			// Any number of listeners can be set for when this event fires,
			// but just know that this event only ever fires once
			document.addEventListener("DOMContentLoaded", process, false);
		} else {
			// All browsers support document.readyState (except Firefox 3.5 and lower, but they support DOMContentLoaded event)
			/loaded|complete/.test(document.readyState) ? process() : setTimeout("DOMready(" + fn + ")", 10)
		}
		
		// Fall back to standard window.onload event
		// But make sure to store the original window.onload in case it was already set by another script
		original_onload = window.onload;
		
		window.onload = function() {
		
			// Note: calling process() now wont cause any problem for modern browsers.
			// Because the function would have already been called when the DOM was loaded.
			// Meaning the queue of functions have already been executed
			process();
			
			// Check for original window.onload and execute it
			if (original_onload) {
				original_onload();
			}
			
		};
		
		// As the DOM hasn't loaded yet we'll store this function and execute it later
		queue.push(fn);
	};
	
}());