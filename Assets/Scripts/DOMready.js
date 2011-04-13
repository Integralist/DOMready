var DOMready = (function(){

	// Variables used throughout this script
	var queue = [],
		 exec,
		 loaded,
		 original_onload,
		 explorerTimer,
		 isIE = (function() {
			var undef,
				 v = 3,
				 div = document.createElement('div'),
				 all = div.getElementsByTagName('i');
		
			while (
				div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
				all[0]
			);
		
			return v > 4 ? v : undef;
		}());
	
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
		}
		
		// Internet Explorer versions less than 9 don't support DOMContentLoaded
		// But the doScroll('left') method appears to be the most reliable solution
		if (isIE < 9) {
			explorerTimer = window.setInterval(function() {
				if (document.body) {
					try {
						document.createElement('div').doScroll('left');
						window.clearInterval(explorerTimer);
						return process();
					} catch(e) {
						console.log(e.message);
					}
				}
			}, 10);	
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