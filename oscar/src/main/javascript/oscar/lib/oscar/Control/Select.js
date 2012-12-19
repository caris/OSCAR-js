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
 * Class: oscar.Control.Select
 * 
 * This control will listen for a point click or a bounding box
 * drawn on the map and send the result to a specified callback function.
 * 
 * Two modes will be available, Point (result of a click action) and Range
 * (result of a bounding box action).
 * 
 * Inherits from: 
 * - <oscar.Control.Multi>
 * 
 */

oscar.Control.Select = oscar.BaseClass(oscar.Control, {
	/**
	 * Property: type {Integer} OpenLayers.Control.TYPE_TOGGLE
	 * 
	 * When added to a <Control.Panel>, 'type' is used by the panel to determine
	 * how to handle our events.
	 */
	type : OpenLayers.Control.TYPE_TOGGLE,

	/**
	 * Constructor: oscar.Control.Measure
	 * 
	 * Parameters: options - {Object} An optional object whose properties will
	 * be set on this instance.
	 */
	initialize : function(options) {
		OpenLayers.Control.prototype.initialize.apply(this, [ options ]);

	},
	/**
	 * APIMethod: activate Called with the control is activated.
	 */
	activate : function() {
		OpenLayers.Control.prototype.activate.apply(this, arguments);
		this.tools = new oscar.Control.SelectionTools({
			parent : this
		});
		this.map.addControl(this.tools);
	},
	/**
	 * APIMethod: deactivate Called when the control is deactivated. It will
	 * also deactivate and remove any sub controls.
	 */
	deactivate : function() {
		if (this.tools) {
			this.tools.deactivate();

			this.map.removeControl(this.tools);
		}
		OpenLayers.Control.prototype.deactivate.apply(this, arguments);
	},
	/**
	 * Constant: CLASS_NAME - oscar.Control.Select
	 */
	CLASS_NAME : "oscar.Control.Select"
});