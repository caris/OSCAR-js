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
 * Class: oscar.Format.WFSDescribeFeatureType
 * 
 * Formatter base class for WFS DescribeFeatureType.
 * 
 * Inherits from: 
 * - <OpenLayers.Format.XML>
 * 
 */
oscar.Format.WFSDescribeFeatureType = oscar.BaseClass(OpenLayers.Format.XML, {
	
	/**
	 * APIProperty: defaultVersion
	 * 
	 * 
	 * {String} Version number to assume if none found. Default is "1.0.0".
	 */
	defaultVersion :"1.0.0",

	/**
	 * APIProperty: version
	 * 
	 * 
	 * {String} Specify a version string if one is known.
	 */
	version :null,

	/**
	 * Property: parser
	 * 
	 */
	parser :null,

	/**
	 * Constructor: oscar.Format.WFSDescribeFeatureType
	 * 
	 * Parameters:
	 * 
	 * options - {Object} An optional object whose properties will be set on
	 *           this instance.
	 */
	initialize : function(options) {
		OpenLayers.Format.prototype.initialize.apply(this, [ options ]);
		this.options = options;
	},
	

	/**
	 * APIMethod: read
	 * 
	 * Read WFSDescribeFeatureType data from a string, and return a list of nodes.
	 * 
	 * Parameters: 
	 * data - {String} or {DOMElement} data to read/parse.
	 * 
	 * Returns: 
	 * featureTypes - {Array} List of named nodes.
	 */
	read : function(data) {
		if (typeof data == "string") {
			data = OpenLayers.Format.XML.prototype.read.apply(this, [ data ]);
		}
		var root = data.documentElement;
		var version = this.version;
		if (!version) {
			version = root.getAttribute("version");
			if (!version) {
				version = this.defaultVersion;
			}
		}
		var constr = oscar.Format.WFSDescribeFeatureType["v"
				+ version.replace(/\./g, "_")];
		if (!constr) {
			throw "Can't find a WFSDescribeFeatureType parser for version "
					+ version;
		}
		var parser = new constr(this.options);
		var featureTypes = parser.read(data);
		featureTypes.version = version;
		return featureTypes;
	},
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Format.WFSDescribeFeatureType
	 */
	CLASS_NAME : "oscar.Format.WFSDescribeFeatureType"
});
