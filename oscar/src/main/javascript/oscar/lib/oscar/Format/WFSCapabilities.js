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
 * Class: oscar.Format.WFSCapabilities
 * 
 * Formatter base class for WFS Capabilities.
 * 
 * Inherits from:
 * 
 * <OpenLayers.Format.WFSCapabilities>
 * 
 */
oscar.Format.WFSCapabilities = oscar.BaseClass(
		OpenLayers.Format.WFSCapabilities, {
			/**
			 * APIMethod: read
			 * 
			 * Read capabilities data from a string, and return a list of
			 * layers.
			 * 
			 * Parameters: 
			 * data - {String} or {DOMElement} data to read/parse.
			 * 
			 * Returns: 
			 * capabilities - {Array} List of named layers.
			 */
			read : function(data) {
				if (typeof data == "string") {
					data = OpenLayers.Format.XML.prototype.read.apply(this,
							[ data ]);
				}
				var root = data.documentElement;
				var version = this.version;
				if (!version) {
					version = root.getAttribute("version");
					if (!version) {
						version = this.defaultVersion;
					}
				}
				var constr = oscar.Format.WFSCapabilities["v"
						+ version.replace(/\./g, "_")];
				if (!constr) {
					throw "Can't find a WFS capabilities parser for version "
							+ version;
				}
				var parser = new constr(this.options);
				var capabilities = parser.read(data);
				capabilities.version = version;
				return capabilities;
			},
			/**
			 * Constant: CLASS_NAME
			 * - oscar.Format.WFSCapabilities
			 */
			CLASS_NAME :"oscar.Format.WFSCapabilities"
		});
