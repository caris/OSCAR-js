/*!
 * CARIS oscar - Open Spatial Component ARchitecture
 *
 * Copyright 2011 CARIS <http://www.caris.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Class: Loader 
 * 
 * Loads JavaScript dependencies required by Oscar.
 */

var hostUtility = function(scriptName) {
	var host = {
		location :null,
		parameters : {
			devMode :false
		}
	};
	var scripts = document.getElementsByTagName('script');
	for ( var i = 0, len = scripts.length; i < len; i++) {
		var src = scripts[i].getAttribute('src');
		if (src) {
			var index = src.indexOf(scriptName);
			if (index > -1) {
				if (src.indexOf("?") > -1) {
					var params = src.split("?").pop().split("&");
					for ( var i = 0; i < params.length; i++) {
						var param = params[i].split("=");
						host.parameters[param[0]] = param[1];
					}
				}
				host.location = src.substring(0, index);
				break;
			}
		}
	}
	return host;
}

var scriptName = "Loader.js";
var host = hostUtility(scriptName);

var OscarLoader = function(base) {
	/**
	 * JavaScript resources
	 */
	this.jsResources = [];
	/**
	 * CSS Resources
	 */
	this.cssResources = [];
	/**
	 * base URL for resources.
	 */
	this.base = base;
	/**
	 * Header block of the document
	 */
	this.header = null;
	/**
	 * List of callback functions
	 */
	this.callbacks = [];
	/**
	 * Method: loadJS
	 * 
	 * Loads a JavaScript resource object.
	 */
	this.loadJS = function(resource) {
		var now = new Date();
		var element = document.createElement("script");
		var ctx = this;

		element.onload = function() {
			ctx.loadJSResources()
		};
		if (/MSIE/.test(navigator.userAgent)) {
			element.onreadystatechange = this.checkReadyState;
		}
		element.src = this.base + resource.location;

		this.appendResource(element);
	};
	/**
	 * Method: loadCSS
	 * 
	 * Loads a CSS object literal.
	 * 
	 */
	this.loadCSS = function(resource) {
		var now = new Date();
		var element = document.createElement("link");
		element.rel = "stylesheet";
		element.type = "text/css"
		element.href = this.base + resource.location;
		this.appendResource(element);
	}
	/**
	 * Method: loadResource
	 * 
	 * Single method to call, checks the type of the resource and passes control
	 * to the proper method.
	 */
	this.loadResource = function(resource) {
		switch (resource.type) {
		case "js":
			this.loadJS(resource);
			break;
		case "css":
			this.loadCSS(resource);
			break;
		}
	};
	/**
	 * Method: appendResource
	 * 
	 * Appends the resource to the <head> or <body> block of the document.
	 */
	this.appendResource = function(element) {
		if (this.header == null) {
			var header = document.getElementsByTagName("head").length ? document
					.getElementsByTagName("head")[0]
					: document.body;
		}
		var context = this;
		header.appendChild(element);
	};
	/**
	 * Method: addResource
	 * 
	 * Adds a resource object to the corresponding array.
	 */
	this.addResource = function(resource) {
		switch (resource.type) {
		case "js":
			this.jsResources.push(resource);
			break;
		case "css":
			this.cssResources.push(resource);
			break;
		}
	};
	/**
	 * Method: load
	 * 
	 * Begins loading resources.
	 */
	this.load = function() {
		for ( var i = 0; i < this.cssResources.length; i++) {
			this.loadResource(this.cssResources[i]);
		}
		this.loadJSResources();
	};
	/**
	 * Method: loadJSResources
	 * 
	 * Loads the JavaScript resources to make sure the previous is loaded before
	 * another one attemps to load.
	 */
	this.loadJSResources = function() {
		var resource = this.jsResources.shift();
		if (resource != null)
			this.loadResource(resource);
		else {
			for ( var i = 0; i < this.callbacks.length; i++) {
				var cb = this.callbacks[i];
				cb.call();
			}
		}

	};
	/**
	 * Method: checkReadyState
	 * 
	 * This if for Internet Explorer to handle it's issues with onload.
	 */
	this.checkReadyState = function() {
		if (this.readyState == 'loaded' || this.readyState == "complete") {
			this.onload();
		}
	};
	/**
	 * APIMethod: onReady
	 * 
	 * Takes in a function or an array of functions to call when the script
	 * resources are finished loading.
	 * 
	 * If the resources are already loaded it will call them immediately.
	 * 
	 * Parameters: 
	 * cb - The function or the array of functions to be called after loading.
	 */
	this.onReady = function(cb) {
		if (this.jsResources.length == 0) {
			if (typeof cb == 'object') {
				for ( var i = 0; i < cb.length; i++) {
					cb[i].call();
				}
			} else {
				cb.call();
			}
			return;
		}
		if (typeof cb == 'object') {
			for ( var i = 0; i < cb.length; i++) {
				this.callbacks.push(cb[i]);
			}
		} else {
			this.callbacks.push(cb);
		}
	};
};
/**
 * Resource List:
 */
var _OscarLoader = new OscarLoader(host.location);
_OscarLoader.addResource( {
	location :"../jquery/css/smoothness/jquery-ui-1.8.16.custom.css",
	type :"css"
});
_OscarLoader.addResource( {
	location :"../jquery/js/jquery-1.6.2.min.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../jquery/js/jquery-ui-1.8.16.custom.min.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../proj4js/lib/proj4js.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../openlayers/OpenLayers.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/yahoo-dom-event/yahoo-dom-event.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/element/element-min.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/button/button-min.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/container/container-min.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/datasource/datasource.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/json/json.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/dragdrop/dragdrop.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/treeview/treeview.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/animation/animation.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/autocomplete/autocomplete.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/connection/connection.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/datatable/datatable.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/paginator/paginator-min.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/resize/resize.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/layout/layout-min.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/connection/connection.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/resize/resize-min.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/tabview/tabview-min.js",
	type :"js"
});
_OscarLoader.addResource( {
	location :"../yui/build/fonts/fonts-min.css",
	type :"css"
});
_OscarLoader.addResource( {
	location :"../yui/build/button/assets/skins/sam/button.css",
	type :"css"
});
_OscarLoader.addResource( {
	location :"../yui/build/autocomplete/assets/skins/sam/autocomplete.css",
	type :"css"
});
_OscarLoader.addResource( {
	location :"../yui/build/container/assets/skins/sam/container.css",
	type :"css"
});
_OscarLoader.addResource( {
	location :"../yui/build/paginator/assets/skins/sam/paginator.css",
	type :"css"
});
_OscarLoader.addResource( {
	location :"../yui/build/datatable/assets/skins/sam/datatable.css",
	type :"css"
});
_OscarLoader.addResource( {
	location :"../yui/build/datatable/assets/skins/sam/datatable-skin.css",
	type :"css"
});
_OscarLoader.addResource( {
	location :"../yui/build/layout/assets/skins/sam/layout.css",
	type :"css"
});
_OscarLoader.addResource( {
	location :"../yui/build/resize/assets/skins/sam/resize.css",
	type :"css"
});
_OscarLoader.addResource( {
	location :"../yui/build/tabview/assets/skins/sam/tabview.css",
	type :"css"
});
_OscarLoader.addResource( {
	location :"theme/default/style.css",
	type :"css"
});
_OscarLoader.addResource( {
	location :"oscar.js",
	type :"js"
});

/**
 * Start loading the resources.
 */
_OscarLoader.load();