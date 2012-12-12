/**
 * Copyright © 2012 Ramón Lamana
 */
 
define(function(require) {
	
	'use strict';

	/**
	 * @dependecies
	 */
	var Promise = require('core/promise');
	var Events = require('core/events');

	var OutputStream = require('io/outputstream');

	/**
	 * @class
	 *
	 * events: read, data, end
	 */
	var InputStream = function() {
		// Events support
		this.events = new Events();
		this.stream = [];

		this._promise = null;
	};

	InputStream.prototype = {
		read: function() {
			this.events.emit('read');
			this._promise = new Promise();

			return this._promise;
		}, 

		end: function() {
			if(this._promise)
				this._promise.done(this.stream);
		},

		/**
		 * Connects an output stream with an input stream
		 */ 
		pipe: function(outputstream) {
			var self = this;

			if(!outputstream)
				outputstream = new OutputStream();
			
			outputstream.events.on('data', function(input) {
				this.stream.push(input);
				this.events.emit('data', input);
			}, this);

			return outputstream;
		}
	};

	return InputStream;
	
});