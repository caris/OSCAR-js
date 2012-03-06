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
 * @requires OpenLayers/Control/PanZoomBar.js
 */

/**
 * Class: oscar.Control.PanZoomBar
 * The Oscar PanZoomBar extends <OpenLayers.Control.PanZoomBar> and adds
 * a PanZoomBar to your map.
 * 
 * Inherits from:
 * - <OpenLayers.Control.PanZoomBar>
 */

oscar.Control.PanZoomBar = oscar.BaseClass(OpenLayers.Control.PanZoomBar, {
    /** 
     * APIProperty: zoomStopWidth
     * {Integer}
     */
    zoomStopWidth: 18,

    /** 
     * APIProperty: zoomStopHeight
     * {Integer}
     */
    zoomStopHeight: 11,

    /** 
     * Property: slider
     */
    slider: null,

    /** 
     * Property: sliderEvents
     * {<OpenLayers.Events>}
     */
    sliderEvents: null,

    /** 
     * Property: zoomBarDiv
     * {DOMElement}
     */
    zoomBarDiv: null,

    /** 
     * Property: divEvents
     * {<OpenLayers.Events>}
     */
    divEvents: null,

    /** 
     * APIProperty: zoomWorldIcon
     * {Boolean}
     */
    zoomWorldIcon: false,
    
    /**
     * APIMethod: draw
     * Draws the pan zoom bar to the screen.
     * 
     * Parameters:
     * px - position of the pan zoom bar.
     */
    draw: function(px) {
        // initialize our internal div
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        px = this.position.clone();

        // place the controls
        this.buttons = [];

        var sz = new OpenLayers.Size(21,21);
        var loc = new OpenLayers.Pixel(13,10);
        
        if (this.zoomWorldIcon) {
            this._addButton("zoomworld", oscar.getImagePath() + "panzoom/overviewIcon.png", loc, new OpenLayers.Size(28,30));
            loc = loc.add(2,32);
        }
        this._addButton("zoomin", oscar.getImagePath() + "panzoom/sliderTop.png", loc, new OpenLayers.Size(22,30));
        loc = loc.add(0,30);
        loc = this._addZoomBar(loc);
        this._addButton("zoomout", oscar.getImagePath() + "panzoom/sliderBottom.png", loc, new OpenLayers.Size(22,30));

        return this.div;
    },
    
    /** 
	* Method: _addZoomBar
	* 
	* Parameters:
	* centered - {<OpenLayers.Pixel>} where zoom bar drawing is to start.
	* 
	* Returns: 
	* centered - {<OpenLayers.Pixel>} 
	*/
	_addZoomBar:function(centered) {
	    
	    var id = "OpenLayers_Control_PanZoomBar_Slider" + this.map.id;
	    var zoomsToEnd = this.map.getNumZoomLevels() - 1 - this.map.getZoom();
	    var slider = OpenLayers.Util.createAlphaImageDiv(id,
	                   centered.add(-1, zoomsToEnd * this.zoomStopHeight), 
	                   new OpenLayers.Size(22,8), 
	                   oscar.getImagePath() + "panzoom/sliderHandle.png",
	                   "absolute");
	    this.slider = slider;
	    
	    this.sliderEvents = new OpenLayers.Events(this, slider, null, true,{includeXY: true});
	    
	    this.sliderEvents.on({
	        "mousedown": this.zoomBarDown,
	        "mousemove": this.zoomBarDrag,
	        "mouseup": this.zoomBarUp,
	        "dblclick": this.doubleClick,
	        "click": this.doubleClick
	    });
	    
	    var sz = new OpenLayers.Size();
	    sz.h = this.zoomStopHeight * this.map.getNumZoomLevels();
	    //sz.w = this.zoomStopWidth;
	    sz.w = 22;
	    var div = null;
	    
	    if (OpenLayers.Util.alphaHack()) {
	        var id = "OpenLayers_Control_PanZoomBar" + this.map.id;
	        div = OpenLayers.Util.createAlphaImageDiv(id, centered,
	                                  new OpenLayers.Size(sz.w, 
	                                          this.zoomStopHeight),
	                                          oscar.getImagePath() + "panzoom/sliderCenter.png", 
	                                  "absolute", null, "crop");
	        div.style.height = sz.h;
	    } else {
	        div = OpenLayers.Util.createDiv(
	                    'OpenLayers_Control_PanZoomBar_Zoombar' + this.map.id,
	                    centered,
	                    sz,
	                    oscar.getImagePath() + "panzoom/sliderCenter.png");
	    }
	    
	    this.zoombarDiv = div;
	    
	    this.divEvents = new OpenLayers.Events(this, div, null, true,{includeXY: true});
	    
	    this.divEvents.on({
	        "mousedown": this.divClick,
	        "mousemove": this.passEventToSlider,
	        "dblclick": this.doubleClick,
	        "click": this.doubleClick
	    });
	    
	    this.div.appendChild(div);
	
	    this.startTop = parseInt(div.style.top);
	    this.div.appendChild(slider);
	
	    this.map.events.register("zoomend", this, this.moveZoomBar);
	
	    centered = centered.add(0, 
	        this.zoomStopHeight * this.map.getNumZoomLevels());
	    return centered; 
	},   
    
    /**
     * Method: passEventToSlider
     * This function is used to pass events that happen on the div, or the map,
     * through to the slider, which then does its moving thing.
     *
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     */
    passEventToSlider:function(evt) {
        this.sliderEvents.handleBrowserEvent(evt);
    },
    
    /**
     * Method: divClick
     * Picks up on clicks directly on the zoombar div and sets the zoom level appropriately.
     * 
     * Parameters: 
     * evt - {<OpenLayers.Event>} 
     */
    divClick: function (evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) {
            return;
        }
        var y = evt.xy.y;
        var top = OpenLayers.Util.pagePosition(evt.object)[1];
        var levels = (y - top)/this.zoomStopHeight;
        var zoom = (this.map.getNumZoomLevels() - 1) - levels; 
        if(this.map.fractionalZoom) {
           zoom = Math.min(Math.max(zoom, 0), this.map.getNumZoomLevels() - 1);
        } else {
            zoom = Math.floor(zoom);
        }    
        this.map.zoomTo(zoom);
        OpenLayers.Event.stop(evt);
    },
    
    /**
     * Method: zoomBarDown
     * event listener for clicks on the slider
     *
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     */
    zoomBarDown:function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) {
            return;
        }
        this.map.events.on({
            "mousemove": this.passEventToSlider,
            "mouseup": this.passEventToSlider,
            scope: this
        });
        this.mouseDragStart = evt.xy.clone();
        this.zoomStart = evt.xy.clone();
        this.div.style.cursor = "move";
        // reset the div offsets just in case the div moved
        this.zoombarDiv.offsets = null; 
        OpenLayers.Event.stop(evt);
    },
    
    /**
     * Method: zoomBarDrag
     * This is what happens when a click has occurred, and the client is
     * dragging.  Here we must ensure that the slider doesn't go beyond the
     * bottom/top of the zoombar div, as well as moving the slider to its new
     * visual location
     *
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     */
    zoomBarDrag:function(evt) {
        if (this.mouseDragStart != null) {
            var deltaY = this.mouseDragStart.y - evt.xy.y;
            var offsets = OpenLayers.Util.pagePosition(this.zoombarDiv);
            if ((evt.clientY - offsets[1]) > 0 && 
                (evt.clientY - offsets[1]) < parseInt(this.zoombarDiv.style.height) - 2) {
                var newTop = parseInt(this.slider.style.top) - deltaY;
                this.slider.style.top = newTop+"px";
            }
            this.mouseDragStart = evt.xy.clone();
            OpenLayers.Event.stop(evt);
        }
    },
    
    /**
     * Method: zoomBarUp
     * Perform cleanup when a mouseup event is received -- discover new zoom
     * level and switch to it.
     *
     * Parameters:
     * evt - {<OpenLayers.Event>} 
     */
    zoomBarUp:function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) {
            return;
        }
        if (this.zoomStart) {
            this.div.style.cursor="";
            this.map.events.un({
                "mouseup": this.passEventToSlider,
                "mousemove": this.passEventToSlider,
                scope: this
            });
            var deltaY = this.zoomStart.y - evt.xy.y;
            var zoomLevel = this.map.zoom;
            if (this.map.fractionalZoom) {
                zoomLevel += deltaY/this.zoomStopHeight;
                zoomLevel = Math.min(Math.max(zoomLevel, 0), 
                                     this.map.getNumZoomLevels() - 1);
            } else {
                zoomLevel += Math.round(deltaY/this.zoomStopHeight);
            }
            this.map.zoomTo(zoomLevel);
            this.moveZoomBar();
            this.mouseDragStart = null;
            OpenLayers.Event.stop(evt);
        }
    },
    
    /**
     * Method: moveZoomBar
     */
	moveZoomBar: function() {
		OpenLayers.Control.PanZoomBar.prototype.moveZoomBar.apply(this,arguments);
	},
    /**
     * Method: _addButton
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
        var imgLocation = img;
        var btn = OpenLayers.Util.createAlphaImageDiv(
                                    this.id + "_" + id, 
                                    xy, sz, imgLocation, "absolute");

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
     * Method: doubleClick
     *
     * Parameters:
     * evt - {Event} 
     *
     * Returns:
     * {Boolean}
     */
    doubleClick: function (evt) {
        return OpenLayers.Control.PanZoom.prototype.doubleClick.apply(this,arguments);;
    },
    
    /**
     * Method: buttonDown
     *
     * Parameters:
     * evt - {Event} 
     */
    buttonDown: function (evt) {
    	OpenLayers.Control.PanZoom.prototype.buttonDown.apply(this,arguments);
    },
    
    /**
     * Constant: CLASS_NAME
     * - oscar.Control.PanZoomBar
     */
    CLASS_NAME: "oscar.Control.PanZoomBar"
	});
	
	