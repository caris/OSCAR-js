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
 * Class: oscar.Format.WCSCapabilities.v1_1_0
 * 
 * Reads a WCS Capabilities document version 1.1.0
 * 
 * Inherits from:
 * 
 * <oscar.Format.WCSCapabilities.v1>
 */
oscar.Format.WCSCapabilities.v1_1_0 = oscar.BaseClass(
		oscar.Format.WCSCapabilities.v1, oscar.Format.OGC.ows.v1_0_0, oscar.Format.OGC.wcs,{
			/**
			 * Constructor: oscar.Format.WCSCapabilities.v1_1_0
			 *
			 */
			initialize : function(options) {
			},
			/**
			 * Method: getProcessor
			 */
			getProcessor : function(childNode) {
				var prefix = childNode.prefix || "wcs";
				var localName = childNode.localName || childNode.nodeName.split(":").pop();
				var nsObj = this[prefix] || this;
				var processor = nsObj["read_cap_" + localName]
						|| this["read_cap_" + localName];
				return processor;
			},

			/**
			 * Constant: CLASS_NAME
			 * - oscar.Format.WCSCapabilities.v1_1_0
			 */
			CLASS_NAME :"oscar.Format.WCSCapabilities.v1_1_0"
		});