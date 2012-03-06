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
 * Class: oscar.Format.WFSCapabilities.v1_0_0
 * 
 * Reads a WFS version 1.0.0 capabilities document.
 * 
 * Inherits from:
 * 
 * <OpenLayers.Format.WFSCapabilities.v1_0_0>
 * 
 */

oscar.Format.WFSCapabilities.v1_0_0 = oscar.BaseClass(
		OpenLayers.Format.WFSCapabilities.v1_0_0,
		oscar.Format.WFSCapabilities.v1, {
			/**
			 * Constructor
			 */
			initialize : function(options) {
				OpenLayers.Format.WFSCapabilities.v1_0_0.prototype.initialize
						.apply(this, [ options ]);
			},
			
			/**
			 * Constant: CLASS_NAME
			 * - oscar.Format.WFSCapabilities.v1_0_0
			 */
			CLASS_NAME :"oscar.Format.WFSCapabilities.v1_0_0"
		});
