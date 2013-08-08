oscar.Control.SelectionTools = oscar.BaseClass(oscar.Control.MultiControl, {
	autoActivate : true,
	processor : null,

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
	initialize : function(options) {
		oscar.Control.MultiControl.prototype.initialize
				.apply(this, [ options ]);

		if (options && options.sketchSymbolizers) {
			for ( var key in this.sketchSymbolizers) {
				this._setupSketchSymbolizers(this.sketchSymbolizers[key],
						options.sketchSymbolizers[key]);
			}
		}
		this.style = new OpenLayers.Style();
		this.style.addRules([ new OpenLayers.Rule({
			symbolizer : this.sketchSymbolizers
		}) ]);
		this.styleMap = new OpenLayers.StyleMap({
			"default" : this.style
		});

		this.controls = {
			point : new oscar.Control.Point(),
			area : new oscar.Control.Box()
		};
	},
	draw : function(options) {
		var scope = this;
		oscar.Control.MultiControl.prototype.draw.apply(this, [ options ]);

		var line = $$("<div></div>");
		line.addClass("subTool");
		line.addClass("point");
		line.data("tool", "point");
		this.addMuliControl(line);

		var polygon = $$("<div></div>");
		polygon.addClass("subTool");
		polygon.addClass("range");
		polygon.data("tool", "area");
		this.addMuliControl(polygon);

		return this.div;

	},

	activate : function() {
		oscar.Control.MultiControl.prototype.activate.apply(this);
		var control;
		for ( var key in this.controls) {
			control = this.controls[key];
			control.events.on({
				'done' : this.done,
				scope : this
			});
			this.map.addControl(control);
		}
	},
	deactivate : function() {
		if (this.popup) {
			this.map.removePopup(this.popup);
		}
		var control;
		for ( var key in this.controls) {
			control = this.controls[key];

			control.events.un({
				'done' : this.done,
				scope : this
			});
			control.deactivate();
			this.map.removeControl(control);
		}
		oscar.Control.MultiControl.prototype.deactivate.apply(this);

	},
	/**
	 * Method: _setupSketchSymbolizers This method will setup the customise
	 * sketch symbolisers.
	 * 
	 * Parameter: defaultSketchSymbolizersOpts - an object to represent the
	 * default sketch symbolisers options that are defined in the Measure
	 * classes. sketchSymbolizersOpts - an object that represent the new
	 * customise sketch symbolisers, and they will replace the default sketch
	 * symbolisers.
	 */
	_setupSketchSymbolizers : function(defaultSketchSymbolisersOpts,
			sketchSymbolisersOpts) {
		if (defaultSketchSymbolisersOpts && sketchSymbolisersOpts) {
			OpenLayers.Util.extend(defaultSketchSymbolisersOpts,
					sketchSymbolisersOpts);
		}
	},
	/**
	 * Method: done Called when one of the selection handlers have been
	 * completed.
	 * 
	 * Parameters: geom - {OpenLayers.Geometry} The resulting geometry from the
	 * selection.
	 */
	done : function(geom) {
		if (this.ignoreDblClick)
			return;
		var idcFn = function() {
			ctx.ignoreDblClick = null;
		}
		var ctx = this;
		this.ignoreDblClick = window.setTimeout(idcFn, this.threshold);
		if(this.parent.processor)
			this.parent.processor.execute(geom, this.parent.theme);
		else if (this.callback) { 
			this.callback(geom);
		}
	},
	setProcessor : function(p) {
		this.processor = p;
	},
	callback : function(geom) {
		if (console) {
			console.log(geom);
		}
	},
	CLASS_NAME : "oscar.Control.SelectionTools"
});
