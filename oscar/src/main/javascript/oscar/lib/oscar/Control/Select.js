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
 * Class: oscar.Control.Select
 * 
 * This control will listen for a point click or a bounding box
 * drawn on the map and send the result to a specified callback function.
 * 
 * Two modes will be available, Point (result of a click action) and Range
 * (result of a bounding box action).
 * 
 * Inherits from: 
 * - <oscar.Control.Multi>
 * 
 */

oscar.Control.Select = oscar.BaseClass(oscar.Control.Multi, {
	/**
	 * Property: type
	 * 
	 * {String} The type of <OpenLayers.Control>. When added to a
	 * <Control.Panel>, *type* is used by the panel to determine how to handle
	 * our events.
	 */
	type:OpenLayers.Control.TYPE_TOGGLE,
	
	/**
	 * Property: theme 
	 * {Object} <oscar.ox.Theme> References the active theme.
	 */
	theme : null,
	
	/**
	 * Property: processor 
	 * {Object} Type of <oscar.Handler>. Called when a
	 * selection event has been completed.
	 */
	processor : null,
	
	/**
	 * Property: threshold
	 * 
	 * Number of milliseconds used to determine a double click action.
	 */
	threshold : 1500,
	
	/**
	 * Property ignoreDoubleClick
	 * 
	 * Used to track a Timeout event to prevent a double click action on
	 * selection.
	 */
	ignoreDblClick : null,
	
	/**
	 * Property: sketchSymbolizers 
	 * {Object{Object} Used to control the style / color of the selection controls.
	 */
	sketchSymbolizers : {
		"Point" : {
			pointRadius : 4,
			graphicName : "square",
			fillColor : "white",
			fillOpacity : 1,
			strokeWidth : 1,
			strokeOpacity : 1,
			strokeColor : "#333333"
		},
		"Line" : {
			strokeWidth : 3,
			strokeOpacity : 1,
			strokeColor : "#666666",
			strokeDashstyle : "dash"
		},
		"Polygon" : {
			strokeWidth : 2,
			strokeOpacity : 1,
			strokeColor : "#666666",
			fillColor : "white",
			fillOpacity : 0.3
		}
	},
	
	/**
	 * Property: callback
	 * Function to call when a selection operation is complete.
	 */
	callback:null,
	
	/**
	 * Constructor: oscar.Control.Select 
	 * 
	 * Parameters: 
	 * options - {Object} An optional object whose properties will be set on
	 * this instance.
	 * 
	 */
	initialize : function(options) {
		oscar.Control.Multi.prototype.initialize.apply(this, [ options ]);
		this.style = new OpenLayers.Style();
		this.style.addRules( [ new OpenLayers.Rule( {
			symbolizer : this.sketchSymbolizers
		}) ]);
		this.styleMap = new OpenLayers.StyleMap( {
			"default" : this.style
		});
		this.controls = {
			point : new oscar.Control.Point(),
			area : new oscar.Control.Box()
		};
	},
	
	/**
	 * APIMethod: activate 
	 * Called when the control is activated.
	 */
	activate : function() {
		oscar.Control.Multi.prototype.activate.apply(this, arguments);
		this._createPointControl();
		this._createBoxControl();

		var control;
		for ( var key in this.controls) {
			control = this.controls[key];
			control.events.on( {
				'done' : this.done,
				scope : this
			});
			this.map.addControl(control);
		}

	},
	
	/**
	 * APIMethod: deactivate 
	 * Called when a control is deactivated. This will deactivate all sub controls 
	 * and trigger a 'clean' event on the processor object.
	 */
	deactivate : function() {
		OpenLayers.Control.prototype.deactivate.apply(this,arguments);
		for (key in this.controls) {
			this.controls[key].deactivate();
			this.controls[key].events.un( {
				'done' :this.done,
				scope :this
			});
			this.map.removeControl(this.controls[key]);
		}
		if (this.processor)
			this.processor.events.triggerEvent("clean");
		oscar.Control.Multi.prototype.deactivate.apply(this, []);
	},
	
	/**
	 * Method: done
	 * Called when one of the selection handlers have been completed.
	 * 
	 * Parameters: 
	 * geom - {OpenLayers.Geometry} The resulting geometry from the selection.
	 */
	done : function(geom) {
		if (this.ignoreDblClick)
			return;
		var idcFn = function() {
			ctx.ignoreDblClick = null;
		}
		var ctx = this;
		this.ignoreDblClick = window.setTimeout(idcFn, this.threshold);
		if (this.processor)
			this.processor.execute(geom, this.theme);
		else if(this.callback) {
			this.callback(geom);
		}
	},
	
	/**
	 * Method: _createPointControl
	 * 
	 * Creates the point (point selection) control.
	 */
	_createPointControl : function() {
		var point = this.createSubMenuItem();
		point.ref = "point";
		point.title = oscar.i18n("Point");
		oscar.jQuery(point).addClass('point');
		oscar.jQuery(point).addClass('toolInactive');

		var ctx = {
			element : point,
			owner : this
		};
		var toggle = function() {
			this.owner._toggleTool(this, this.element);
		};

		OpenLayers.Event.observe(point, "mouseup", OpenLayers.Function
				.bindAsEventListener(toggle, ctx));
		this.addToSubMenu(point);
	},
	
	/**
	 * Method: _createBoxControl
	 * 
	 * Creates the box (range selection) control.
	 */
	_createBoxControl : function() {
		var area = this.createSubMenuItem();
		area.ref = "area";
		area.title = oscar.i18n("Range");
		oscar.jQuery(area).addClass('range');
		oscar.jQuery(area).addClass('toolInactive');

		var ctx = {
			element : area,
			owner : this
		};
		var toggle = function() {
			this.owner._toggleTool(this, this.element);
		};

		OpenLayers.Event.observe(area, "mouseup", OpenLayers.Function
				.bindAsEventListener(toggle, ctx));
		this.addToSubMenu(area);
	},
	
	/**
	 * Method: _toggleTool
	 * 
	 * Called when one of the selection containers is clicked to activate that control.
	 * 
	 * Parameters: 
	 * event - 
	 * element - 
	 */
	_toggleTool : function(event, element) {
		var parent = element.parentNode;
		for ( var i = 0; i < parent.childNodes.length; i++) {
			oscar.jQuery(parent.childNodes[i]).removeClass("toolActive");
			oscar.jQuery(parent.childNodes[i]).addClass("toolInactive");
		}

		for ( var key in this.controls) {
			var control = this.controls[key];
			if (element.ref == key) {
				oscar.jQuery(element).removeClass("toolInactive");
				oscar.jQuery(element).addClass("toolActive");
				this.activeControl = control;
				this.activeControl.activate();
			} else {
				control.deactivate();
			}
		}
	},
	
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Control.Select
	 */
	CLASS_NAME : "oscar.Control.Select"
});
