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
 * Class: oscar.Control 
 * 
 * The components under *oscar.Control* package add extra effects and 
 * behaviors to user's maps. This oscar.Control object defines the Oscar
 * Control namespace.
 * 
 * Inherits from: 
 * - <OpenLayers.Control>
 * 
 */
oscar.Control = oscar.BaseClass(OpenLayers.Control, {
	/**
	 * APIMethod: deactivate 
	 * 
	 * Called when the object is deactivated.
	 */
	deactivate : function() {
		OpenLayers.Control.prototype.deactivate.apply(this, [ arguments ]);
	},	
	/**
	 * Method: draw
	 * 
	 * Draws the Control onto the map at the position specified.
	 * 
	 * Parameters: 
	 * px - the position where the Control should be drawn.
	 * 
	 * Returns: 
	 * div - container of the Control.
	 */
	draw : function(px) {
		OpenLayers.Control.prototype.draw.apply(this, [ px ]);

		return this.div;
	},
	
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Control
	 */
	CLASS_NAME :"oscar.Control"
});