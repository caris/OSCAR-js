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
 * Class: oscar.Handler
 * 
 * The oscar.Handler object defines the Oscar Handler namespace. Handler objects 
 * are used to execute actions (such as WFS AJAX requests) using a {<OpenLayers.Geometry>}
 * object and a {<oscar.ox.Theme>} object.
 * 
 */

oscar.Handler = oscar.BaseClass( {
	/**
	 * Constructor: oscar.Handler
	 * 
	 * Initialize the handler object.
	 * 
	 * Parameters: 
	 * options - {Object} An optional object whose properties will be set on
	 * 			 this instance.
	 * 
	 */
	initialize : function(options) {

	},
	/**
	 * APIMethod: execute
	 * 
	 * The *execute* method encapsulates the actual job to be done. All subclasses 
	 * of the Oscar Handler should override this method to complete the its own business
	 * logic. 
	 * 
	 * Parameters: 
	 * geom - {<OpenLayers.Geometry>} object. 
	 * theme - {<oscar.ox.Theme>} object.
	 */
	execute : function(geom, theme) {

	},
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Handler
	 */
	CLASS_NAME :"oscar.Handler"
});