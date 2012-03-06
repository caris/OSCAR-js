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
 * Class: oscar.Control.Box
 * A box control for handling range selections.
 * 
 * Inherits from:  
 * - <oscar.Control>
 * 
 */

oscar.Control.Box = oscar.BaseClass(oscar.Control, {
	/**
	 * Constant: EVENT_TYPES
	 * 
	 * {Array(String)} Supported application event types.
	 * 
	 * Supported event types:
	 * done - triggered when the *selection* event has been completed. Will
	 *        pass a geometry object to any listeners.
	 * 
	 */
	EVENT_TYPES : [ "done" ],
	
	/**
	 * Property: 
	 * type - OpenLayers.Control.TYPE_TOGGLE
	 */
	type : OpenLayers.Control.TYPE_TOGGLE,
	
	/**
	 * Constructor: oscar.Control.Box
	 * Creates a box control for handling range selection. 
	 * 
	 * Parameters:
	 * options - {Object} An optional object whose properties will be set on
	 * this instance.
	 */
	initialize : function(options) {
		this.EVENT_TYPES = oscar.Control.Box.prototype.EVENT_TYPES.concat(OpenLayers.Control.prototype.EVENT_TYPES);
		this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES,
				false, {
					includeXY :true
				});
		this.handlers={};
	},
	
	/**
	 * APIMethod: draw
	 * 
	 * This method activates the handler and draws the selection area on screen.
	 */
	draw : function() {
		this.handlers.rangeSelect = new OpenLayers.Handler.RegularPolygon(this, {
			done :this.done,
			down : function(e) {
				OpenLayers.Element.addClass(
	                this.map.viewPortDiv, "olDrawBox"
	            );
			},
			up :function(e) {
				OpenLayers.Element.removeClass(
		                this.map.viewPortDiv, "olDrawBox"
		        );
			}
		}, {
			irregular :true
		});
		var callbacks = {
	            "move":this.panMap,
	            "done":this.panMapDone
	        };		
		this.handlers.dragPan = new OpenLayers.Handler.Drag(
                this, callbacks, {keyMask: OpenLayers.Handler.MOD_SHIFT});
		
	},
	
	panMap:function(xy) {
		this.panned = true;
		this.map.pan(
				this.handlers.dragPan.last.x - xy.x,
	            this.handlers.dragPan.last.y - xy.y,
	            {dragging: this.handlers.dragPan.dragging, animate: false}	
		);
		
		
		
	},
	panMapDone:function(xy) {
        if(this.panned) {
            this.panMap(xy);
            this.panned = false;
        }
	},
	
	activate:function() {
		this.handlers.rangeSelect.activate();
		this.handlers.dragPan.activate();
		return oscar.Control.prototype.activate.apply(this,arguments);
		
	},
	deactivate:function() {
		for(var handler in this.handlers) {
			this.handlers[handler].deactivate();
		}
		
		return oscar.Control.prototype.deactivate.apply(this.arguments);
		
	},

	/**
	 * Method: done
	 * 
	 * Parameters:
	 * geom - {OpenLayers.Geometry} The geometry object of the selection area.
	 */
	done : function(geom) {
		this.events.triggerEvent("done", geom);
	},
	/**
	 * Constant: CLASS_NAME 
	 * 
	 * - oscar.Control.Box
	 */
	CLASS_NAME :"oscar.Control.Box"
});