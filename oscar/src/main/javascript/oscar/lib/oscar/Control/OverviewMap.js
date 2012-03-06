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
     * Renders the OverviewMap in the browser.
     */    
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        if(!(this.layers.length > 0)) {
            if (this.map.baseLayer) {
                var layer = this.map.baseLayer.clone();
                this.layers = [layer];
            } else {
                this.map.events.register("changebaselayer", this, this.baseLayerDraw);
                return this.div;
            }
        }

        // create overview map DOM elements
        this.element = document.createElement('div');
        this.element.className = this.displayClass + 'Element';
        this.element.style.display = 'none';

        this.mapDiv = document.createElement('div');
        this.mapDiv.style.width = this.size.w + 'px';
        this.mapDiv.style.height = this.size.h + 'px';
        this.mapDiv.style.position = 'relative';
        this.mapDiv.style.overflow = 'hidden';
        this.mapDiv.id = OpenLayers.Util.createUniqueID('overviewMap');
        
        this.extentRectangle = document.createElement('div');
        this.extentRectangle.style.position = 'absolute';
        this.extentRectangle.style.zIndex = 1000;  //HACK
        this.extentRectangle.className = this.displayClass+'ExtentRectangle';
        this.mapDiv.appendChild(this.extentRectangle);

        this.element.appendChild(this.mapDiv);  

        this.div.appendChild(this.element);

        // Optionally add min/max buttons if the control will go in the
        // map viewport.
        if(!this.outsideViewport) {
            this.div.className += " " + this.displayClass + 'Container';
            var imgLocation = oscar._imgPath;
            var sz = new OpenLayers.Size(21,21);        
            // maximize button div
            var img = oscar.getImagePath() + 'overviewWindow_expand.png';
            this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                        "OpenLayers_Control_MaximizeDiv", 
                                        null, 
                                        sz, 
                                        img, 
                                        "absolute");
            this.maximizeDiv.style.display = 'none';
            this.maximizeDiv.className = this.displayClass + 'MaximizeButton';
            OpenLayers.Event.observe(this.maximizeDiv, 'click', 
                OpenLayers.Function.bindAsEventListener(this.maximizeControl,
                                                        this)
            );
            this.div.appendChild(this.maximizeDiv);
    
            // minimize button div
            var img = oscar.getImagePath() + 'overviewWindow_collapse.png';
            var sz = new OpenLayers.Size(21,21);        
            this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                        "OpenLayers_Control_MinimizeDiv", 
                                        null, 
                                        sz, 
                                        img, 
                                        "absolute");
            this.minimizeDiv.style.display = 'none';
            this.minimizeDiv.className = this.displayClass + 'MinimizeButton';
            OpenLayers.Event.observe(this.minimizeDiv, 'click', 
                OpenLayers.Function.bindAsEventListener(this.minimizeControl,
                                                        this)
            );
            this.div.appendChild(this.minimizeDiv);
            
            var eventsToStop = ['dblclick','mousedown'];
            
            for (var i=0, len=eventsToStop.length; i<len; i++) {

                OpenLayers.Event.observe(this.maximizeDiv, 
                                         eventsToStop[i], 
                                         OpenLayers.Event.stop);

                OpenLayers.Event.observe(this.minimizeDiv,
                                         eventsToStop[i], 
                                         OpenLayers.Event.stop);
            }
            
            this.minimizeControl();
        } else {
            // show the overview map
            this.element.style.display = '';
        }
        if(this.map.getExtent()) {
            this.update();
        }
        
        this.map.events.register('moveend', this, this.update);

        return this.div;
    },
	
    /**
     * Constant: CLASS_NAME
     * - oscar.Control.OverviewMap
     */
	CLASS_NAME:"oscar.Control.OverviewMap"
});