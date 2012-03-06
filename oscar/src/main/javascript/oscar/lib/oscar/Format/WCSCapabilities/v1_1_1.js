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
 * Class: oscar.Format.WCSCapabilities.v1_1_1
 * 
 * Reads a WCS Capabilities document version 1.1.1
 * 
 * Inherits from:
 * 
 * <oscar.Format.WCSCapabilities.v1_1_0>
 * 
 */
oscar.Format.WCSCapabilities.v1_1_1 = oscar.BaseClass(
		oscar.Format.WCSCapabilities.v1_1_0, oscar.Format.OGC.ows.v1_1_0,oscar.Format.OGC.wcs, {
			/**
			 * Constructor: oscar.Format.WCSCapabilities.v1_1_1
			 */
			initialize : function(options) {
			},
			/**
			 * Constant: CLASS_NAME
			 * - oscar.Format.WCSCapabilities.v1_1_1
			 */
			CLASS_NAME :"oscar.Format.WCSCapabilities.v1_1_1"
		});