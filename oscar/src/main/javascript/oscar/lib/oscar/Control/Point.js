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
 * Class: oscar.Control.Point
 * 
 * The Oscar Point creates a new control on your map for doing points
 * selection.
 * 
 * Inherits from: 
 * - <oscar.Control>
 * 
 */

oscar.Control.Point = oscar.BaseClass(oscar.Control, {
	/**
	 * Constant: EVENT_TYPES 
	 * 
	 * done - {Array(String)} triggered when the selection event has
	 * been completed. Will pass a geometry object to any listeners.
	 * 
	 */
	EVENT_TYPES : [ "done" ],
	type : OpenLayers.Control.TYPE_TOOL,
	events : null,
	
	/**
	 * Constructor: oscar.Control.Point
	 * 
	 * Parameters:
	 * 
	 * options - {Object} An optional object whose properties will be set on
	 * this instance.
	 * 
	 */
	initialize : function(options) {
		this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES,
				false, {
					includeXY : true
				});
	},
	/**
	 * APIMethod: draw 
	 * 
	 * The *draw* method activates the handler used to draw the selection point
	 * on screen.
	 */
	draw : function() {
		this.handler = new OpenLayers.Handler.Point(this, {
			done : this.done
		});
	},
	
	/**
	 * Method: done 
	 * 
	 * Parameters: 
	 * geom - {OpenLayers.Geometry} The geometry object of the selection
	 *        point.
	 */
	done : function(geom) {
		this.events.triggerEvent("done", geom);
	},
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Control.Point
	 */
	CLASS_NAME : "oscar.Control.Point"
});