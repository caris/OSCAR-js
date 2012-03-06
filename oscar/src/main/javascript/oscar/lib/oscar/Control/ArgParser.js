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
 * Class: oscar.Control.ArgParser 
 * The Oscar ArgParser extends the <OpenLayers.Control.ArgParser> and 
 * parses the parameters from href string for values of lon, lat, zoom 
 * and other layers information. 
 * 
 * Inherits from:  
 * - <OpenLayers.Control.ArgParser>
 * 
 */
oscar.Control.ArgParser = oscar.BaseClass(OpenLayers.Control.ArgParser, {
	/**
	 * Property: args 
	 * Stores the map property.
	 */
	args :null,
	
	/**
	 * Constructor: oscar.Control.ArgParser
	 * 
	 * Parameters: 
	 * options - {Object} An optional object whose properties will be set on
	 * 			 this instance.
	 */
	initialize : function() {
		OpenLayers.Control.ArgParser.prototype.initialize.apply(this, []);
	},
	
	/**
	 * APIMethod: setMap 
	 * Set the map property for the control.
	 * 
	 * Parameters: 
	 * map - {<oscar.Map>}
	 */
	setMap : function(map) {
		this.map = map;
		this.args = OpenLayers.Util.getParameters();
	},
	
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Control.ArgParser
	 */
	CLASS_NAME :'oscar.Control.ArgParser'

});