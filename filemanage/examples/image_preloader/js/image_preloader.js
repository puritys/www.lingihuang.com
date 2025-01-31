/********************
Author: Vivian Huang
Date: March 10, 2014

Related Posts
http://fragged.org/preloading-images-using-javascript-the-right-way-and-without-frameworks_744.html
http://perishablepress.com/3-ways-preload-images-css-javascript-ajax/
http://perishablepress.com/pure-css-better-image-preloading-without-javascript/
********************/

var IMGPRELOADER = function (images, options) {
	var defaults,
		isNative  = "addEventListner" in (new Image()),
		index     = 0,
		queues    = [],
		completed = [],
		errors    = [],
		handleLoad,
		handleError,
		handleAbort,
		reset,
		setOptions,
		removeEvents,
		load,
		checkProgress;

	defaults = {
		auto: true,
		onStart: function () {},
		onProgress: function () {},
		onError: function () {},
		onComplete: function () {}
	};

	handleLoad = function () {
		console.log("**** handleLoad ****");

		removeEvents.call(this);
		completed.push(this.src);
		checkProgress(this.src, this);
	};

	handleError = function () {
		console.log("**** handleLoad ****");

		removeEvents.call(this);
		errors.push(this.src);
		checkProgress(this.src, this);
		options.onError(this.src);
	};

	handleAbort = function () {
		console.log("**** handleAbort ****");

		removeEvents.call(this);
		errors.push(this.src);
		checkProgress(this.src, this);
		options.onError(this.src);
	};
	
	reset = function () {
		index = 0;
		queues = completed = errors = [];
	};

	setOptions = function (options) {
		for (var key in defaults) {
			if (!options.hasOwnProperty(key)) {
				options[key] = defaults[key];
			}
		}
		return options;
	};

	removeEvents = function () {
		if (isNative) {
			this.removeEventListner("load", handleLoad);
			this.removeEventListner("error", handleError, false);
			this.removeEventListner("abort", handleError, false);
		} else {
			this.onload  = this.onerror = this.onabort = null;
		}
	};

	load = function () {
		if (index >= queues.length) {
			return;
		}

		var image = new Image(),
			src   = queues[index];

		if (isNative) {
			image.addEventListner("load", handleLoad, false);
			image.addEventListner("error", handleError, false);
			image.addEventListner("abort", handleError, false);
		} else {
			image.onload  = handleLoad;
			image.onerror = handleError;
			image.onabort = handleError;
		}

		image.src = src;
	};

	checkProgress = function (imgSrc, imgElement) {
		options.onProgress(imgSrc, imgElement, (completed.length + errors.length), queues.length);
		index++;
		load();

		if (index === queues.length - 1) {
			options.onComplete(completed, errors);
		}
	};

	(function () {
		options = (options && typeof options === "object") ? setOptions(options) : defaults;
		queues  = (images && images instanceof Array) ? images.slice() : [];
		options.onStart(queues);

		if (queues.length && options.auto) {
			load();
		}
	})();
};