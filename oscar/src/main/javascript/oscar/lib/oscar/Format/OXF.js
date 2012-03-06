/*
 * CARIS oscar - Open Spatial Component ARchitecture
 *
 * Copyright 2012 CARIS <http://www.caris.com>
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
 * Class: oscar.Format.OXF
 * 
 * Reads an OXF (Oscar eXchange Format) configuration resource.
 * 
 * Inherits from: 
 * - <OpenLayers.Format.JSON>
 */

oscar.Format.OXF = oscar.BaseClass(OpenLayers.Format.JSON, {
	
	/**
	 * Proptery: defaultVersion
	 * 
	 * Current version of the format.
	 */
	defaultVersion :2.0,
	
	/**
	 * Property: version
	 * 
	 * Version to use when parsing
	 */
	version :null,
	
	/**
	 * Constructor: oscar.Format.OXF
	 * 
	 * Parameters: 
	 * options - {Object} An optional object whose properties will be set on
	 * this instance.
	 */
	initialize : function(options) {
		OpenLayers.Format.JSON.prototype.initialize.apply(this, [ options ]);
	},
	
	/**
	 * APIMethod: read
	 * 
	 * Reads an OXF document file.
	 * 
	 * Parameters: 
	 * data - the document in OXF document file to be read.
	 * 
	 * Returns: 
	 * configuration - the OXF configuration object.
	 */
	read : function(data) {
		if (typeof data == "string") {
			data = OpenLayers.Format.JSON.prototype.read.apply(this, [ data ]);
		}
		var version = ""
				+ (this.version || data.version || this.defaultVersion);
		var constr = oscar.Format.OXF["v" + version.replace(/\./g, "_")];
		if (!constr) {
			throw "Can't find a OXF parser for version " + version;
		}
		var parser = new constr(this.options);
		var configuration = parser.read(data);
		return configuration;
	},
	
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Format.OXF
	 */
	CLASS_NAME :"oscar.Format.OXF"

});