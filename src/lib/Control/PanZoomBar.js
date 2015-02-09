/*
 * CARIS oscar - Open Spatial Component ARchitecture
 * 
 * Copyright 2012 CARIS <http://www.caris.com>
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
/**
 * @requires OpenLayers/Control/PanZoomBar.js
 */

/**
 * Class: oscar.Control.PanZoomBar The Oscar PanZoomBar extends
 * <OpenLayers.Control.PanZoomBar> and adds a PanZoomBar to your map.
 * 
 * Inherits from: - <OpenLayers.Control.PanZoomBar>
 */

oscar.Control.PanZoomBar = oscar.BaseClass(OpenLayers.Control.PanZoomBar, {
    /**
     * APIProperty: zoomStopWidth {Integer}
     */
    zoomStopWidth : 22,

    /**
     * APIProperty: zoomStopHeight {Integer}
     */
    zoomStopHeight : 11,

    /**
     * Property: slider
     */
    slider : null,

    /**
     * Property: sliderEvents {<OpenLayers.Events>}
     */
    sliderEvents : null,

    /**
     * Property: zoomBarDiv {DOMElement}
     */
    zoomBarDiv : null,

    /**
     * Property: divEvents {<OpenLayers.Events>}
     */
    divEvents : null,

    /**
     * APIProperty: zoomWorldIcon {Boolean}
     */
    zoomWorldIcon : false,

    /**
     * APIMethod: draw Draws the pan zoom bar to the screen.
     * 
     * Parameters: px - position of the pan zoom bar.
     */
    draw : function(px) {
        // initialize our internal div
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        px = this.position.clone();

        // place the controls
        this.buttons = [];

        var sz = new OpenLayers.Size(21, 21);
        var loc = new OpenLayers.Pixel(13, 10);

        if (this.zoomWorldIcon) {
            this._addButton("zoomworld", "overviewIcon.png", loc, new OpenLayers.Size(28, 30));
            loc = loc.add(2, 32);
        }
        this._addButton("zoomin", "sliderTop.png", loc, new OpenLayers.Size(22, 30));
        loc = loc.add(0, 30);
        loc = this._addZoomBar(loc);
        this._addButton("zoomout", "sliderBottom.png", loc, new OpenLayers.Size(22, 30));

        return this.div;
    },

    /**
     * Method: _addButton
     * 
     * Parameters: id - {String} img - {String} xy - {<OpenLayers.Pixel>} sz - {<OpenLayers.Size>}
     * 
     * Returns: {DOMElement} A Div (an alphaImageDiv, to be precise) that
     * contains the image of the button, and has all the proper event handlers
     * set.
     */
    _addButton : function(id, img, xy, sz) {
        // var imgLocation = OpenLayers.Util.getImageLocation(img);
        var imgLocation = oscar.getImagePath() + "panzoom/" + img;
        var btn = OpenLayers.Util.createAlphaImageDiv(this.id + "_" + id, xy, sz, imgLocation, "absolute");
        btn.style.cursor = "pointer";
        // we want to add the outer div
        this.div.appendChild(btn);
        btn.action = id;
        btn.className = "olButton";

        // we want to remember/reference the outer div
        this.buttons.push(btn);
        return btn;
    },

    /**
     * Method: _addZoomBar
     * 
     * Parameters: centered - {<OpenLayers.Pixel>} where zoom bar drawing is to
     * start.
     * 
     * Returns: centered - {<OpenLayers.Pixel>}
     */
    _addZoomBar : function(centered) {
        var imgLocation = oscar.getImagePath() + "panzoom/sliderHandle.png"
        var id = "OpenLayers_Control_PanZoomBar_Slider" + this.map.id;
        var zoomsToEnd = this.map.getNumZoomLevels() - 1 - this.map.getZoom();
        var slider = OpenLayers.Util.createAlphaImageDiv(id, centered.add(-1, zoomsToEnd * this.zoomStopHeight), {
            w : 22,
            h : 9
        }, imgLocation, "absolute");
        slider.style.cursor = "move";
        this.slider = slider;

        this.sliderEvents = new OpenLayers.Events(this, slider, null, true, {
            includeXY : true
        });
        this.sliderEvents.on({
            "touchstart" : this.zoomBarDown,
            "touchmove" : this.zoomBarDrag,
            "touchend" : this.zoomBarUp,
            "mousedown" : this.zoomBarDown,
            "mousemove" : this.zoomBarDrag,
            "mouseup" : this.zoomBarUp
        });

        var sz = {
            w : this.zoomStopWidth,
            h : this.zoomStopHeight * this.map.getNumZoomLevels()
        };
        var imgLocation = oscar.getImagePath() + "panzoom/sliderCenter.png";
        var div = null;

        if (OpenLayers.Util.alphaHack()) {
            var id = this.id + "_" + this.map.id;
            div = OpenLayers.Util.createAlphaImageDiv(id, centered, {
                w : sz.w,
                h : this.zoomStopHeight
            }, imgLocation, "absolute", null, "crop");
            div.style.height = sz.h + "px";
        } else {
            div = OpenLayers.Util.createDiv('OpenLayers_Control_PanZoomBar_Zoombar' + this.map.id, centered, sz, imgLocation);
        }
        div.style.cursor = "pointer";
        div.className = "olButton";
        this.zoombarDiv = div;

        this.div.appendChild(div);

        this.startTop = parseInt(div.style.top);
        this.div.appendChild(slider);

        this.map.events.register("zoomend", this, this.moveZoomBar);

        centered = centered.add(0, this.zoomStopHeight * this.map.getNumZoomLevels());
        return centered;
    },
    /**
     * Constant: CLASS_NAME - oscar.Control.PanZoomBar
     */
    CLASS_NAME : "oscar.Control.PanZoomBar"
});