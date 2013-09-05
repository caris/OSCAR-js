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
 * Class: oscar.Control.DragPanel
 * 
 * This control is a base control for creating draggable planels.
 * 
 * 
 * Inherits from:
 * - <oscar.Control>
 * 
 */
oscar.Control.DragPanel = oscar.BaseClass(oscar.Control, {
	/**
	 * APIProperty: resizable
	 * {Boolean} allows the panel to be resizable, default is true.
	 */
	resizable :true,
	/**
	 * APIProperty: drawPanel
	 * {Boolean} whether the theme switcher should be drawn, default is true.
	 */
	drawPanel:true,

	/**
	 * APIProperty: closed
	 * {Boolean} initial display of the panel, default is true
	 */
	closed :true,
	
	/**
	 * APIProperty: closable
	 * {Boolean} Should the panel be able to be closed. Defaults to false.
	 */
	closable:false,
	
	/**
	 * APIProperty: collapsible
	 * {Boolean} Should the panel be collapsible. Defaults to true.
	 */
	collapsible:true,
	/**
	 * APIProperty: iconClass
	 * {String} class to usee for the icon of the panel. Default is oDragPanel.
	 */
	iconClass :"",
    /**
     * APIProperty: tooltipText
     * {String} Key or text to display as a tool tip.
     */
	tooltipText :"",
    /**
     * APIProperty: titleText
     * {String} Key or text to be used for the title of the panel.
     */	
	titleText :"",
	
	EVENT_TYPES:["closed","minimized","maximized"],
	events:null,
	/**
	 * Constructor: Creates a new instance of the DragPanel  control.
	 * 
     * Parameters:
     * - options {Object} Override default property values
     * 
     * Usage:
     * (code)
     * var dragPanel= new oscar.Control.DragPanel({resizable:true,closed:false});
     * (end)
     */
	initialize : function(options) {
		this.EVENT_TYPES = oscar.Control.DragPanel.prototype.EVENT_TYPES.concat(OpenLayers.Control.prototype.EVENT_TYPES);
		this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES,false,{includeXY :true});	
		oscar.Control.prototype.initialize.apply(this, [ options ]);
	},
	/**
	 * APIMethod: setMap
	 * Sets a reference to the map object.
	 * 
	 * Parameters:
	 * - map <OpenLayers.Map>
	 */
	setMap : function(map) {
		this.map = map;
	},
	/**
	 * APIMethod: draw
	 * Creates the panel to be rendered in the map.
	 * 
	 */
	draw: function() {
		oscar.Control.prototype.draw.apply(this);
		oscar.jQuery(this.div).addClass("o-widget");
		this.handle = document.createElement("div");
		oscar.jQuery(this.handle).addClass("handle");
		this.handle.setAttribute("title", oscar.i18n(this.tooltipText));
		this.icon = document.createElement("div");
		oscar.jQuery(this.icon).addClass("oIcon");
		if(this.iconClass && this.iconClass.length > 0) {
			oscar.jQuery(this.icon).addClass(this.iconClass);	
		}
		this.title = document.createElement("div");
		var tSpan = document.createElement("span");
		oscar.jQuery(tSpan).addClass("panelTitleText");
		tSpan.innerHTML = oscar.i18n(this.titleText);
		this.title.appendChild(tSpan)
		oscar.jQuery(this.title).addClass("panelTitle");
		this.handle.appendChild(this.icon);
		this.handle.appendChild(this.title);
		
		if(this.closable) {
			this.closeBox = document.createElement("div");
			oscar.jQuery(this.closeBox).addClass("closeBox");
			var context = this;
			OpenLayers.Event.observe(this.closeBox, "click", function(e) {
                oscar.jQuery(context.div).fadeOut();
				context.events.triggerEvent("closed");
				//OpenLayers.Event.stop(e, true);
			});
			this.handle.appendChild(this.closeBox);
		}
		
		if(this.collapsible) {
			this.minMax = document.createElement("div");
			oscar.jQuery(this.minMax).addClass("minMax");
			oscar.jQuery(this.minMax).addClass("contentOpen");
			var context = this;
			OpenLayers.Event.observe(this.minMax, "click", function(e) {
				context.toggleContentDisplay();
				
				//OpenLayers.Event.stop(e, true);
			});
			oscar.jQuery(this.clicker).addClass("contentOpen");
			this.handle.appendChild(this.minMax);
		}		
		
		this.div.appendChild(this.handle);
		this.content = document.createElement("div");

		oscar.jQuery(this.content).addClass("content");
			this.div.appendChild(this.content);
			OpenLayers.Event.observe(this.div, "mousedown", function(e) {
			OpenLayers.Event.stop(e, true);
		});

		oscar.jQuery(this.div).draggable( {
			containment :"parent",
			start : function(event, ui) {
				oscar.jQuery(this).addClass("olDragDown");
				event.stopPropagation();
			},
			stop : function(event, ui) {
				oscar.jQuery(this).removeClass("olDragDown");
				event.stopPropagation();
			},
			drag : function(e,u) {
				event.stopPropagation();
			},
			cancel :"div.content"
		});
		if(this.resizable) {
			oscar.jQuery(this.div).resizable();
		}
		
		if(this.closed) {
			this.toggleContentDisplay();
		}
		
		oscar.jQuery(this.div).hide();
		
		var scope = this;
		if (this.drawPanel) {
			setTimeout(
					function() {
						oscar.jQuery(scope.div).fadeIn("fast");
					},
					0
			);	
		}			

		return this.div;
	},
	/**
	 * APIMethod: setTitle
	 * Sets the title of the panel.
	 * 
	 * Parameters:
	 *  - key {String} Translation key or text to use for the title.
	 */
	setTitle : function(key) {
		this.title.innerHTML = oscar.i18n(key);
	},
	/**
	 * APIMethod: toggleContentDisplay
	 * Opens or closes the display of the content pane.
	 */
	toggleContentDisplay : function() {
		if (oscar.jQuery(this.minMax).hasClass("contentOpen")) {
			oscar.jQuery(this.minMax).removeClass("contentOpen");
			oscar.jQuery(this.minMax).addClass("contentClosed");
			oscar.jQuery(this.div).addClass("small");
			oscar.jQuery(this.content).hide();
			if (this.resizable) {
				oscar.jQuery(this.div).resizable("destroy");
			}
		} else {
			oscar.jQuery(this.minMax).removeClass("contentClosed");
			oscar.jQuery(this.minMax).addClass("contentOpen");
			oscar.jQuery(this.div).removeClass("small");
			oscar.jQuery(this.content).show();
			if (this.resizable) {
				oscar.jQuery(this.div).resizable();
			}
		}
	},
	/**
	 * Constant: CLASS_NAME
	 */
	CLASS_NAME :"oscar.Control.DragPanel"
});