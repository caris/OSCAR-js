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
 * Class: oscar.Control.PanZoom
 * 
 * This Oscar PanZoom control extends the <OpenLayers.Control.PanZoom> and 
 * adds zoom controls to your map.
 * 
 * Inherits from: 
 * - <OpenLayers.Control.PanZoom>
 * 
 */

oscar.Control.PanZoom = oscar.BaseClass(OpenLayers.Control.PanZoom, {
	/**
	 * Constructor: oscar.Control.PanZoom
	 * 
	 * Parameters: 
	 * options - {object} An optional object whose properties will be set on
	 *           this instance.
	 */
	initialize : function(options) {
		OpenLayers.Control.PanZoom.prototype.initialize.apply(this,[options]);
	},
	/**
	 * APIMethod: draw 
	 * Draws the controls on screen.
	 * 
	 * Parameters: 
	 * px - position of the PanZoom control.
	 */
    draw: function(px) {
        // initialize our internal div
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        px = this.position;

        // place the controls
        this.buttons = [];

        var sz = new OpenLayers.Size(22,30);
        var centered = new OpenLayers.Pixel(px.x, px.y);

        this._addButton("zoomin", "sliderTop.png", 
                        centered, sz);
        this._addButton("zoomout", "sliderBottom.png", 
                        centered.add(0, sz.h), sz);
        return this.div;
    },
    
    /**
     * Method: _addButton
     * Adds a button to the control.
     * 
     * Parameters:
     * id - {String} 
     * img - {String} 
     * xy - {<OpenLayers.Pixel>} 
     * sz - {<OpenLayers.Size>} 
     * 
     * Returns:
     * btn - {DOMElement} A Div (an alphaImageDiv, to be precise) that contains the
     *       image of the button, and has all the proper event handlers set.
     */
    _addButton:function(id, img, xy, sz) {
        var imgLocation = oscar.getImagePath() + "panzoom/" + img;
        var btn = OpenLayers.Util.createAlphaImageDiv(
                                    this.id + "_" + id, 
                                    xy, sz, imgLocation, "absolute");
        oscar.jQuery(btn).addClass("panZoomPointer");
        //we want to add the outer div
        this.div.appendChild(btn);

        OpenLayers.Event.observe(btn, "mousedown", 
            OpenLayers.Function.bindAsEventListener(this.buttonDown, btn));
        OpenLayers.Event.observe(btn, "dblclick", 
            OpenLayers.Function.bindAsEventListener(this.doubleClick, btn));
        OpenLayers.Event.observe(btn, "click", 
            OpenLayers.Function.bindAsEventListener(this.doubleClick, btn));
        btn.action = id;
        btn.map = this.map;
    
        if(!this.slideRatio){
            var slideFactorPixels = this.slideFactor;
            var getSlideFactor = function() {
                return slideFactorPixels;
            };
        } else {
            var slideRatio = this.slideRatio;
            var getSlideFactor = function(dim) {
                return this.map.getSize()[dim] * slideRatio;
            };
        }

        btn.getSlideFactor = getSlideFactor;

        //we want to remember/reference the outer div
        this.buttons.push(btn);
        return btn;
    },
    
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Control.PanZoom
	 */
	CLASS_NAME :"oscar.Control.PanZoom"
});