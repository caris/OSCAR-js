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
 * Class: oscar.Control.SelectFeature
 * 
 * This control handles the selection of features from multiple layers.
 * When added to the map it registers for the addlayer and removelayer functions to monitor
 * when layers are added and adjusts an internal control to handle the selection events.
 * 
 * 
 * 
 * Inherits from:
 * - <oscar.Control>
 * 
 */


oscar.Control.SelectFeature = oscar.BaseClass(oscar.Control,{
	/**
	 * APIProperty: autoActivate
	 * {Boolean} defaults to true
	 */
	autoActivate: true,
	
	/**
	 * Constructor: new oscar.Control.SelectFeature
	 * Creates a new instance of this controls.
	 */
	initialize:function(options) {
	  OpenLayers.Control.prototype.initialize.apply(this,[options]);
	  this.layers = [];
	  this.handlers = {};
	 
	},
	/**
	 * Method: setMap
	 * Parameters: 
	 * map (OpenLayers.Map)
	 * 
	 * Registers the map with the control. Registers the addlayer and removelayer events. 
	 * 
	 */
	setMap:function(map) {
	    oscar.Control.prototype.setMap.apply(this,[map]);
	    this.map.events.on({"addlayer":this.addLayer,scope:this});
	    this.map.events.on({"removelayer":this.layerRemoved,scope:this});
	},
	/**
	 * Method: activate
	 * Activates the control
	 */
	activate:function() {
	       this.handlers.click.activate();
	       var scope = this;
	       this.ctrl = new OpenLayers.Control.SelectFeature(this.layers);
	       this.map.addControl(this.ctrl);  
	},
	/**
	 * Method: draw
	 * Resgisters any handlers. Since this is not a visible control no div is returned.
	 */
	draw:function() {
	     var clickCallbacks = { 
	                'click':this.clicked
	    };
	    this.handlers.click = new OpenLayers.Handler.Click(
	            this, clickCallbacks
	    );
	},
	
	/**
	 * Method: clicked
	 * Called when the map is clicked
	 * 
	 * Parameters:
	 *  e - MouseEvent
	 * 
	 */
	clicked:function(e) {
	    var lonlat = this.map.getLonLatFromPixel(e.xy);
	    
	},
	/**
	 * Method: layerRemoved
	 * Called when a layer is removed from the map.
	 * 
	 * Parameters: 
	 * e - Event 
	 */
	layerRemoved:function(e) {
	    var layer = e.layer;
	    var currLen = this.layers.length;
	    for(var i=0;i<this.layers.length;i++) {
	        if(layer.id == this.layers[i].id) {
	            this.layers.splice(i,1);
	            this.ctrl.setLayer(this.layers);
	            break;
	        }
	    }
	
	},
	/**
	 * Method: addLayer
	 * Called when a layer is added.
	 * 
	 * Parameters:
	 * e - Event
	 */
	addLayer:function(e) {
	    var layer = e.layer;
	    if(layer.renderers) {
	        layer.events.on({"loadend":this.layerLoaded,scope:this});
	    }
	},
	/**
	 * Method: layerLoaded
	 * Called when a layer has finished loading.
	 * 
	 * Parameters:
	 * e - Event
	 */
	layerLoaded:function(e) {
	    var layer = e.object;
	    if(layer.features.length == 0) {
	        this.map.removeLayer(layer)
	    } else {
	    	if(layer.hidden) return;
	        var isNew = function(layer,existing) {
	            for(var i=0;i<existing.length;i++) {
	                if(layer.id == existing[i].id) {
	                    return false;
	                }
	            }
	            return true;
	        }
	        if(isNew(layer,this.layers)) {
	        	try {
	            this.layers.push(layer);
	            this.ctrl.setLayer(this.layers);
	        	} catch (err) {}
	            this.ctrl.activate();	        	
	        }
	    }
	},
	/**
	 * Method: clearControl
	 * Clears the internal control and removes it from the map.
	 */
	clearControl:function() {
	    if(this.ctrl) {
	        this.ctrl.deactivate();
	        this.map.removeControl(this.ctrl);
	        this.ctrl = null;
	    }
	},
	/**
	 * Constant: CLASS_NAME
	 */
	CLASS_NAME:"oscar.Control.SelectFeature"
});