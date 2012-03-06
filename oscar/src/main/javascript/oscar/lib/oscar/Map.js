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
 * Class: oscar.Map
 * 
 * Inherits from : <OpenLayers.Map>
 * 
 */

oscar.Map = oscar.BaseClass(OpenLayers.Map, {
	/**
	 * Property: defaultControls
	 * 
	 * Contains a list of default controls to be placed on the map.
	 */
	defaultControls : {
		Navigation :OpenLayers.Control.Navigation,
		SelectFeature: oscar.Control.SelectFeature
	},
	/**
	 * Constructor: oscar.Map
	 * 
	 * Parameters:
	 * div - id of DIV element to contain the map
	 * options - {Object} Optional object with properties to tag onto the map.
	 */
	initialize : function(div, options) {
		var newArgs = [];
		if (options == null) {
			options = {};
		}
		options.theme = oscar._getScriptLocation() + 'theme/default/style.css';
		newArgs.push(div, options);
		OpenLayers.Map.prototype.initialize.apply(this, newArgs);
		this.addControl(new this.defaultControls.Navigation( {
			mouseWheelOptions : {
				interval :500
			}
		}));
		this.addControl(new this.defaultControls.SelectFeature());

	},
	/**
	 * Constant: CLASS_NAME
	 * - <oscar.Map>
	 */
	CLASS_NAME :"oscar.Map"
});