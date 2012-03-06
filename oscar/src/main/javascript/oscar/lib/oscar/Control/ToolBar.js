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
 * Class: oscar.Control.ToolBar
 * 
 * The Oscar ToolBar control is a container of other mapping tools which are
 * also controls.
 * 
 * Inherits from: - <OpenLayers.Control.Panel>
 */

oscar.Control.ToolBar = oscar
		.BaseClass(
				OpenLayers.Control.Panel,
				{
					/**
					 * Property: id
					 */
					id :"oscarToolbar",
					/**
					 * Property: leftCap
					 */
					leftCap :null,
					/**
					 * Property: rightCap
					 */
					rightCap :null,
					/**
					 * APIProperty: usePreviousView
					 * 
					 * Adds <oscar.Control.PreviousView> control automatically
					 * to the ToolBar.
					 */
					usePreviousView :false,
					/**
					 * Property: defaultWidth
					 */
					defaultWidth :30,
					
					/**
					 * APIProperty: draggable
					 * 
					 * Allows the control to be draggable. Default is false
					 */
					draggable:false,
					
					/**
					 * APIProperty: showMeasureControl
					 * 
					 * Shows the measurement control. Default is true.
					 * 
					 */
					showMeasureControl :true,
					
					/**
					 * APIProperty: EVENT_TYPES
					 * 
					 * {Array[String]} Event types fired by this control.
					 */
					EVENT_TYPES : [ "selection", "extraction", "measurement",
							"activate", "deactivate" ],

					/**
					 * Constructor: oscar.Control.ToolBar
					 * 
					 * Parameters: options - {Object} An optional object whose
					 * properties will be set on this instance.
					 */
					initialize : function(options) {
						OpenLayers.Control.Panel.prototype.initialize.apply(
								this, [ options ]);
						this.displayClass = 'oscarControlToolBar'
						this.leftCap = document.createElement("div");
						oscar.jQuery(this.leftCap).addClass(
								"toolBarBookendLeft");
						this.rightCap = document.createElement("div");
						oscar.jQuery(this.rightCap).addClass(
								"toolBarBookendRight");
					},

					/**
					 * APIMethod: draw
					 * 
					 * Draws the ToolBar control onto the map.
					 */
					draw : function() {
						OpenLayers.Control.prototype.draw.apply(this, []);
						this.div.setAttribute("style", "");
						this.div.appendChild(this.rightCap);
						this.ctrlContainer = document.createElement("div");
						this.div.appendChild(this.ctrlContainer);

						if (this.usePreviousView) {
							this.addControls(new oscar.Control.PreviousView());
						} else {
							this.div.appendChild(this.leftCap);
						}
						OpenLayers.Event.observe(this.div, "mousedown",
								function(e) {
									OpenLayers.Event.stop(e, true);
								});
						if(this.draggable) {
							oscar.jQuery(this.div).draggable( {
								containment :"parent",
								handle :"div.toolBarBookendRight"
							});
						}
						return this.div;
					},
					/**
					 * Method: redraw
					 * 
					 * Redraws the control onto the map.
					 */
					redraw : function() {
						if (this.active) {
							for ( var i = 0, len = this.controls.length; i < len; i++) {
								var element = this.controls[i].panel_div;

								// include tooltips for the elements.
								var tooltipText = oscar.i18n("tooltip_"
										+ this.controls[i].CLASS_NAME
												.toLowerCase());
								oscar.jQuery(element)
										.attr("title", tooltipText);

								var mouseOver = function(obj) {
									return function(e) {
										if (!obj.active) {
											var active = obj.displayClass
													+ "ItemActive";
											var inactive = obj.displayClass
													+ "ItemInactive";
											oscar.jQuery(obj.panel_div)
													.removeClass(inactive);
											oscar.jQuery(obj.panel_div)
													.addClass(active);
										}
									}
								};
								var mouseOut = function(obj) {
									return function(e) {
										if (!obj.active) {
											var active = obj.displayClass
													+ "ItemActive";
											var inactive = obj.displayClass
													+ "ItemInactive";
											oscar.jQuery(obj.panel_div)
													.addClass(inactive);
											oscar.jQuery(obj.panel_div)
													.removeClass(active);
										}
									}
								};
								element.onmouseover = mouseOver(this.controls[i]);
								element.onmouseout = mouseOut(this.controls[i]);
								if (this.controls[i].active) {
									element.className = this.controls[i].displayClass
											+ "ItemActive";
								} else {
									element.className = this.controls[i].displayClass
											+ "ItemInactive";
								}

								// if it's the previousView control, do not
								// include in the ctrlContainer div.
								if (this.controls[i].CLASS_NAME == "oscar.Control.PreviousView") {
									oscar
											.jQuery(element)
											.addClass(
													"oscarControlPreviousViewItemActive");
									this.div.appendChild(element);
								} else {
									controlsLength = (this.usePreviousView) ? this.controls.length - 1
											: this.controls.length;
									var ctrlContainerWidth = this.defaultWidth
											* controlsLength;
									oscar.jQuery(this.ctrlContainer).css(
											"width", ctrlContainerWidth);
									this.ctrlContainer.appendChild(element);
								}
							}
						}
					},

					/**
					 * APIMethod: activateControl
					 * 
					 * Activate a control when the user click on the icon
					 * representing the control in the panel.
					 * 
					 * Parameters: control - {<OpenLayers.Control>} control
					 * object.
					 */
					activateControl : function(control) {
						if (!this.active) {
							return false;
						}
						var c;
						for ( var i = 0, len = this.controls.length; i < len; i++) {
							c = this.controls[i];
							if (c != control
									&& (c.type === OpenLayers.Control.TYPE_TOOL || c.type == OpenLayers.Control.TYPE_TOGGLE)) {
								c.deactivate();
							}
						}
						if (control.type == OpenLayers.Control.TYPE_BUTTON) {
							control.trigger();
							return;
						}
						if (control.type == OpenLayers.Control.TYPE_TOGGLE) {
							if (control.active) {
								control.deactivate();
							} else {
								control.activate();
							}
							return;
						}
						control.activate();
					},

					/**
					 * Method: removeControl
					 * 
					 * Remove a control from the ToolBar.
					 * 
					 * Parameters: ctrl - {<oscar.Control>}
					 */
					removeControl : function(ctrl) {
						if (this.usePreviousView
								&& (ctrl.CLASS_NAME == "oscar.Control.PreviousView"))
							return;
						ctrl.deactivate();
						this.ctrlContainer.removeChild(ctrl.panel_div);
						this.map.removeControl(ctrl);
					},

					/**
					 * APIMethod: clean
					 * 
					 * Cleans the ToolBar by removing the Control tools.
					 */
					clean : function() {
						var control;
						var defaultSize = (this.usePreviousView) ? 1 : 0;

						while (this.controls.length > defaultSize) {
							control = this.controls[this.controls.length - 1];
							this.removeControl(control);
							this.controls.splice(this.controls.length - 1, 1);
						}
					},
					
					/**
					 * APIMethod: applyTheme
					 * 
					 * Parameters:
					 * - theme {oscar.ox.Theme} Updates the toolbar based on options available
					 * in the theme.
					 * 
					 */
					applyTheme : function(theme) {
						this.clean();
						if (this.showMeasureControl) {
							this.addControls(new oscar.Control.Measure());
						}
						if (theme.hasSelectionService()) {
							var ctrl = new oscar.Control.Select( {
								theme :theme
							});
							this.addControls(ctrl);
							this.events.triggerEvent("selection", ctrl);
						}
						if (theme.hasExtractionService()) {
							this.addControls(new oscar.Control.DataExtractor(
									theme));
						}

					},
					/**
					 * Constant: CLASS_NAME - oscar.Control.ToolBar
					 */
					CLASS_NAME :"oscar.Control.ToolBar"

				});