/*
 * CARIS oscar - Open Spatial Component ARchitecture
 *
 * Copyright 2014 CARIS <http://www.caris.com>
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
oscar.Control.MeasurementTools = oscar.BaseClass(oscar.Control.MultiControl, {
    autoActivate : true,

    /**
     * Property: defaultUnit {String} The default display unit of the
     * measurement. Set to metric.
     */
    defaultUnit : 'metric',

    /**
     * Property: currentUnit {String} The current display unit.
     */
    currentUnit : null,

    /**
     * Property: dlg
     */
    dlg : null,

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
            strokeColor : "#f00",
            strokeDashstyle : "solid"
        },
        "Polygon" : {
            strokeWidth : 2,
            strokeOpacity : 1,
            strokeColor : "#f00",
            fillColor : "white",
            fillOpacity : 0.3
        }
    },
    initialize : function(options) {
        oscar.Control.MultiControl.prototype.initialize.apply(this, [ options ]);

        // Setup the sketchSymbolisers
        if (options && options.sketchSymbolizers) {
            for ( var key in this.sketchSymbolizers) {
                this._setupSketchSymbolizers(this.sketchSymbolizers[key], options.sketchSymbolizers[key]);
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
            line : new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
                persist : true,
                handlerOptions : {
                    layerOptions : {
                        styleMap : this.styleMap
                    }
                }
            }, {
                displaySystem : this.defaultUnit
            }),
            polygon : new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
                persist : true,
                handlerOptions : {
                    layerOptions : {
                        styleMap : this.styleMap
                    }
                }
            }, {
                displaySystem : this.defaultUnit
            })
        };
        this.controls.line.events.includeXY = true;
    },
    draw : function(options) {
        var scope = this;
        oscar.Control.MultiControl.prototype.draw.apply(this, [ options ]);

        var line = $$("<div></div>");
        line.addClass("subTool");
        line.addClass("line");
        line.data("tool", "line");
        this.addMuliControl(line);
        var polygon = $$("<div></div>");
        polygon.addClass("subTool");
        polygon.addClass("polygon");
        polygon.data("tool", "polygon");

        this.addMuliControl(polygon);

        this._createUnits();

        return this.div;
    },

    /**
     * Method: _createUnits
     * 
     * Description: This method creates the dropdown list for the available
     * units.
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

        for (var unit = 0; unit < units.length; unit++) {
            var option = document.createElement("option");
            select.options[select.options.length]
            option.value = units[unit];
            option.text = oscar.i18n(units[unit]);
            if (units[unit] == this.defaultUnit)
                option.selected = true;
            select.options[select.options.length] = option;
        }
        var scope = this;

        $$(select).change(function(evt) {
            scope.changeUnits();
        });

        $$(container).append($$(select));
        $$(this.div).append($$(container));
    },
    /**
     * Method: changeUnits This method is called when there is a change in units
     * drop down menu and updates the current units
     * 
     * Parameters: evt - {<OpenLayers.Event>}
     */

    changeUnits : function(evt) {
        var select = $('oscarMeasureUnits');
        unit = select.options[select.selectedIndex].value;

        if (unit == -1)
            return;
        this.currentUnit = unit;

        for ( var key in this.controls) {
            this.controls[key].displaySystem = unit;
        }

    },

    activate : function() {
        oscar.Control.MultiControl.prototype.activate.apply(this);
        var control;
        for ( var key in this.controls) {
            control = this.controls[key];
            control.events.on({
                "measure" : this.handleMeasurements,
                "measurepartial" : this.handleMeasurements,
                scope : this
            });
            this.map.addControl(control);
        }
    },
    deactivate : function() {

        if (this.dlg) {
            this.dlg.remove();
        }
        var control;
        for ( var key in this.controls) {
            control = this.controls[key];

            control.events.un({
                "measure" : this.handleMeasurements,
                "measurepartial" : this.handleMeasurements,
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
    _setupSketchSymbolizers : function(defaultSketchSymbolisersOpts, sketchSymbolisersOpts) {
        if (defaultSketchSymbolisersOpts && sketchSymbolisersOpts) {
            OpenLayers.Util.extend(defaultSketchSymbolisersOpts, sketchSymbolisersOpts);
        }
    },
    /**
     * Method: handleMeasurements This method displays the measurement on
     * screen.
     * 
     * Parameters: event - {Object}
     */
    handleMeasurements : function(event) {
        var units = event.units;
        var order = event.order;
        var measure = event.measure;
        var out = "";
        if (measure.toFixed(2) == 0.00) {
            return;
        }

        if (order == 1) {
            out += measure.toFixed(2) + " " + units;
        } else {
            out += measure.toFixed(2) + " " + units + "<sup>2</" + "sup>";
        }
        var scope = this;
        if (!this.dlg) {
            this.dlg = $$("<div></div>").html(out);
            this.dlg.dialog({
                height : 75,
                width : 150,
                close : function(e, ui) {
                    scope.dlg = null;
                },
                position : {
                    at : "left"
                }
            });
        } else {
            this.dlg.html(out);
        }
    },
    CLASS_NAME : "oscar.Control.MeasurementTools"
});