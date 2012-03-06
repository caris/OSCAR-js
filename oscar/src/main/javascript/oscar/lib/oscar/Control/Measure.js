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
 * Class: oscar.Control.Measure
 * The Oscar Measure control is used for measuring distance or area.
 * 
 * Inherits from: 
 * - <oscar.Control.Multi>
 * 
 */

oscar.Control["Measure"] = oscar.BaseClass(oscar.Control.Multi, {
	/**
	 * Property: type 
	 * {Integer} OpenLayers.Control.TYPE_TOGGLE 
	 * 
	 * When added to a <Control.Panel>, 'type' is used by the panel 
	 * to determine how to handle our events.
	 */
	type :OpenLayers.Control.TYPE_TOGGLE,
	
	/**
	 * Property: sketchSymbolizers
	 * {Object{Object}} Contains the display information for the look of the measurement tools.
	 * > "Point": {
	 * >       pointRadius: 4,
	 * >       graphicName: "square",
	 * >       fillColor: "white",
	 * >       fillOpacity: 1,
	 * >       strokeWidth: 1,
	 * >       strokeOpacity: 1,
	 * >       strokeColor: "#333333"
	 * >   },
	 * >   "Line": {
	 * >       strokeWidth: 3,
	 * >       strokeOpacity: 1,
	 * >       strokeColor: "#666666",
	 * >       strokeDashstyle: "dash"
	 * >   },
	 * >   "Polygon": {
	 * >       strokeWidth: 2,
	 * >       strokeOpacity: 1,
	 * >       strokeColor: "#666666",
	 * >       fillColor: "white",
	 * >       fillOpacity: 0.3
	 * >   }
	 *  
	 */
	sketchSymbolizers : {
		"Point" : {
			pointRadius :4,
			graphicName :"square",
			fillColor :"white",
			fillOpacity :1,
			strokeWidth :1,
			strokeOpacity :1,
			strokeColor :"#333333"
		},
		"Line" : {
			strokeWidth :3,
			strokeOpacity :1,
			strokeColor :"#f00",
			strokeDashstyle :"solid"
		},
		"Polygon" : {
			strokeWidth :2,
			strokeOpacity :1,
			strokeColor :"#f00",
			fillColor :"white",
			fillOpacity :0.3
		}
	},
	/**
	 * Property: defaultUnit
	 * {String} The default display unit of the measurement. Set to metric.
	 */
	defaultUnit :'metric',
	
	/**
	 * Property: currentUnit
	 * {String} The current display unit.
	 */
	currentUnit :null,
	
	/**
	 * Constructor: oscar.Control.Measure
	 * 
	 * Parameters: 
	 * options - {Object} An optional object whose properties will be set on
	 *           this instance.
	 */
	initialize : function(options) {
		oscar.Control.Multi.prototype.initialize.apply(this, []);
		//Setup the sketchSymbolisers
		if (options && options.sketchSymbolizers) {
			for ( var key in this.sketchSymbolizers) {
				this._setupSketchSymbolizers(this.sketchSymbolizers[key],
						options.sketchSymbolizers[key]);
			}
		}
		this.style = new OpenLayers.Style();
		this.style.addRules( [ new OpenLayers.Rule( {
			symbolizer :this.sketchSymbolizers
		}) ]);
		this.styleMap = new OpenLayers.StyleMap( {
			"default" :this.style
		});
		this.controls = {
			line :new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
				persist :true,
				handlerOptions : {
					layerOptions : {
						styleMap :this.styleMap
					}
				}
			}, {
				displaySystem :this.defaultUnit
			}),
			polygon :new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon,
					{
						persist :true,
						handlerOptions : {
							layerOptions : {
								styleMap :this.styleMap
							}
						}
					}, {
						displaySystem :this.defaultUnit
					})
		};
	},
	/**
	 * APIMethod: activate
	 * Called with the control is activated.
	 */
	activate : function() {
		oscar.Control.Multi.prototype.activate.apply(this, arguments);
		this._createLineMeasure();
		this._createAreaMeasure();
		this._createUnits();
		var control;
		for ( var key in this.controls) {
			control = this.controls[key];
			control.events.on( {
				"measure" :this.handleMeasurements,
				"measurepartial" :this.handleMeasurements,
				scope :this

			});

			this.map.addControl(control);

		}
		this.createDialog();
	},
	/**
	 * APIMethod: deactivate
	 * Called when the control is deactivated. It will also deactivate and remove any sub controls.
	 */
	deactivate : function() {
		OpenLayers.Control.prototype.deactivate.apply(this, arguments);
		if (d = document.getElementById("MeasureToolBar")) {
			document.body.removeChild(d);
		}
		for (key in this.controls) {
			if (this.controls[key].popup) {
				this.map.removePopup(this.controls[key].popup);
			}
			this.controls[key].events.un( {
				"measure" :this.handleMeasurements,
				"measurepartial" :this.handleMeasurements
			});
			this.controls[key].deactivate();
			this.map.removeControl(this.controls[key]);
		}
		if (this.dialog) {
			this.dialog.hide();
			this.dialog = null;
		}
		oscar.Control.Multi.prototype.deactivate.apply(this, []);
	},

	/**
	 * Method: _setupSketchSymbolizers
	 * This method will setup the customise sketch symbolisers.
	 * 
	 * Parameter:  
	 * defaultSketchSymbolizersOpts - an object to represent the default sketch 
	 * 								  symbolisers options that are defined in the Measure classes.
	 * sketchSymbolizersOpts - an object that represent the new customise sketch symbolisers, 
	 * 						   and they will replace the default sketch symbolisers. 
	 */
	_setupSketchSymbolizers : function(defaultSketchSymbolisersOpts,
			sketchSymbolisersOpts) {
		if (defaultSketchSymbolisersOpts && sketchSymbolisersOpts) {
			OpenLayers.Util.extend(defaultSketchSymbolisersOpts,
					sketchSymbolisersOpts);
		}
	},
	
	/**
	 * Method: createDialog
	 * 
	 * Creates a dialog for the control.
	 */
	createDialog : function() {
		this.dialog = new oscar.Gui.Dialog("Measurement", {
			draggable :true,
			modal :false,
			height :55,
			zIndex :2001,
			fixedcenter :false
		});
		var header = oscar.i18n("");
		this.dialog.setHeader(header);
		this.dlgDiv = document.createElement("div");
		this.dlgDiv.id = "Measurement";
		this.dialog.setContent(this.dlgDiv);
		var closeFn = function(obj) {
			return function() {
				obj.dialog.destroy();
				obj.dialog = null;
			}
		};
	},

	/**
	 * Method: _createLineMeasure
	 * This method creates the sub menu item for doing linear measurements.
	 */
	_createLineMeasure : function() {
		var line = this.createSubMenuItem();
		line.ref = "line";
		line.title = oscar.i18n("Distance");
		oscar.jQuery(line).addClass("line");
		oscar.jQuery(line).addClass("toolInactive");
		var ctx = {
			button :line,
			owner :this
		};
		var toggle = function() {
			this.owner._toggleTool(this, this.button);
		}
		OpenLayers.Event.observe(line, "mouseup", OpenLayers.Function
				.bindAsEventListener(toggle, ctx));
		OpenLayers.Event.observe(line, "click", function(e) {
			OpenLayers.Event.stop(e, true);
		});
		this.addToSubMenu(line);
	},
	/**
	 * Method: _createAreaMeasure
	 * This method creates the sub menu item for doing area measurements.
	 */

	_createAreaMeasure : function() {
		var area = this.createSubMenuItem();
		area.ref = "polygon";
		area.title = oscar.i18n("Area");
		oscar.jQuery(area).addClass("polygon");
		oscar.jQuery(area).addClass("toolInactive");
		var ctx = {
			button :area,
			owner :this
		};
		var toggle = function() {
			this.owner._toggleTool(this, this.button);
		}
		OpenLayers.Event.observe(area, "mouseup", OpenLayers.Function
				.bindAsEventListener(toggle, ctx));
		OpenLayers.Event.observe(area, "click", function(e) {
			OpenLayers.Event.stop(e, true);
		});
		this.addToSubMenu(area);

	},
	/**
	 * Method: _createUnits
	 * 
	 * Description: This method creates the dropdown list for the available units.
	 */

	_createUnits : function() {
		var units = [ 'english', 'metric' ];
		var container = document.createElement("span");
		oscar.jQuery(container).css("float", "left");
		oscar.jQuery(container).css("background", "transparent");
		oscar.jQuery(container).css("display", "block");
		oscar.jQuery(container).css("padding-top", "7px");

		var select = document.createElement("select");
		select.id = "oscarMeasureUnits";
		oscar.jQuery(select).addClass("measurementUnits");
		var option = document.createElement("option");
		select.options[select.options.length]

		for ( var unit = 0; unit < units.length; unit++) {
			var option = document.createElement("option");
			select.options[select.options.length]
			option.value = units[unit];
			option.text = oscar.i18n(units[unit]);
			if (units[unit] == this.defaultUnit)
				option.selected = true;
			select.options[select.options.length] = option;
		}
		var ctx = this;
		var fn = function(evt) {
			ctx.changeUnits();
			OpenLayers.Event.stop(evt, true);
		};
		OpenLayers.Event.observe(select, "change", OpenLayers.Function
				.bindAsEventListener(fn, ctx));
		OpenLayers.Event.observe(select, "mousedown", OpenLayers.Function
				.bindAsEventListener(fn, ctx));
		OpenLayers.Event.observe(select, "click", OpenLayers.Function
				.bindAsEventListener(fn, ctx));
		container.appendChild(select);
		this.addToSubMenu(container);
	},
	/**
	 * Method: changeUnits 
	 * This method is called when there is a change in units drop
	 * down menu and updates the current units
	 * 
	 * Parameters: 
	 * evt - {<OpenLayers.Event>}
	 */

	changeUnits : function(evt) {
		var select = $('oscarMeasureUnits');
		unit = select.options[select.selectedIndex].value;
		if (unit == -1)
			return;
		this.currentUnit = unit;
		if (this.activeControl)
			this.activeControl.displaySystem = unit;

	},
	
	/**
	 * Method: _toggleTool 
	 * This method activates the control based on the sub menu icon selected.
	 * 
	 * Parameters: 
	 * element - Object {button, owner}
	 * button - The span element of the subtool button. 
	 */
	_toggleTool : function(element, button) {
		var unit = this.currentUnit ? this.currentUnit : this.defaultUnit;
		if (d = document.getElementById("MeasureToolBar")) {
			d.style.visibility = "hidden";
		}
		var parent = button.parentNode;
		for ( var i = 0; i < parent.childNodes.length; i++) {
			oscar.jQuery(parent.childNodes[i]).removeClass("toolActive");
			oscar.jQuery(parent.childNodes[i]).addClass("toolInactive");
		}
		for ( var key in this.controls) {
			var control = this.controls[key];
			if (element.button.ref == key) {
				control.displaySystem = unit;
				var header = (key == "line") ? oscar.i18n("Distance") : oscar
						.i18n("Area");
				if (!this.dialog) {
					this.createDialog();
				}
				this.dialog.setHeader(header);
				if(!this.dlgDiv){
					this.dlgDiv = document.createElement("div");
					this.dialog.setContent(this.dlgDiv);
				}
				this.dlgDiv.innerHTML = "";

				this.dialog.show();
				control.activate();
				oscar.jQuery(button).removeClass("toolInactive");
				oscar.jQuery(button).addClass("toolActive");
				this.activeControl = control;
			} else {
				if (control.popup) {
					this.map.removePopup(control.popup);
				}
				control.deactivate();
			}
		}
	},
	/**
	 * Method: handleMeasurements
	 * This method displays the measurement on screen.
	 * 
	 * Parameters: 
	 * event - {Object}
	 */
	handleMeasurements : function(event) {
		var geometry = event.geometry;
		var units = event.units;
		var order = event.order;
		var measure = event.measure;
		var element = document.getElementById('measureInfo');
		var out = "";
		if (order == 1) {
			out += measure.toFixed(2) + " " + units;
		} else {
			out += measure.toFixed(2) + " " + units + "<sup>2</" + "sup>";
		}
		var tmpDlgDiv = document.getElementById('MeasurementText');
		if(!tmpDlgDiv){
			this.dlgDiv = document.createElement("div");
			this.dlgDiv.id = "MeasurementText";
		}
		this.dlgDiv.innerHTML = out;
		this.dialog.setContent(this.dlgDiv);
		this.dialog.show();

	},
	
	/**
	 * Constant: CLASS_NAME
	 *  - oscar.Control.Measure
	 */
	CLASS_NAME :"oscar.Control.Measure"
});