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
 * Class: oscar.Control.OverviewMap
 * 
 * The Oscar OverviewMap control creates a small overview map which displays 
 * a zoomed extent of the main map.
 * 
 * Inherits from:
 * - <OpenLayers.Control.OverviewMap>
 */

oscar.Control.OverviewMap= oscar.BaseClass(OpenLayers.Control.OverviewMap, {
    /**
     * Constructor: oscar.Control.OverviewMap
     * 
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
	 *           this instance.
     */
    initialize: function(options) {
        OpenLayers.Control.OverviewMap.prototype.initialize.apply(this, arguments);
	},
    /**
         * APIMethod: draw
         * 
         * Draws the control on screen.
         */
    draw:function() {
        var layers = [];
        for(var l in this.map.layers) {
            if(this.map.layers[l].renderer) continue;
            if(this.map.layers[l].clone) {
                layers.push(this.map.layers[l].clone());
            }
        }
        this.layers = layers;    
        OpenLayers.Control.OverviewMap.prototype.draw.apply(this,arguments);
        $$(this.maximizeDiv).empty();
        $$(this.minimizeDiv).empty();
        return this.div;
    },
	
    /**
     * Constant: CLASS_NAME
     * - oscar.Control.OverviewMap
     */
	CLASS_NAME:"oscar.Control.OverviewMap"
});