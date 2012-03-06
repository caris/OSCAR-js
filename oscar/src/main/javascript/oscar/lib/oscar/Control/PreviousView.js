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
 *@requires OpenLayers.Control.Button
 */

/**
 * Class: oscar.Control.PreviousView
 * 
 * The Oscar PreviousView control keeps track of map movements and allows
 * user to go back to a previous view.
 * 
 * Inherits from: 
 * - <OpenLayers.Control.Button> 
 * 
 */
oscar.Control.PreviousView = oscar
		.BaseClass(
				OpenLayers.Control.Button,
				{

					/**
					 * Property: type {String}
					 * 
					 * Note that this control is not intended to be added
					 * directly to a control panel. Instead, add the
					 * sub-controls previous and next. These sub-controls are
					 * button type controls that activate and deactivate
					 * themselves. If this parent control is added to a panel,
					 * it will act as a toggle.
					 */
					type :OpenLayers.Control.TYPE_BUTTON,

					/**
					 * APIProperty: previous
					 * 
					 *  {<OpenLayers.Control>} A button type control whose
					 * trigger method restores the previous state managed by
					 * this control.
					 */
					previous :null,

					/**
					 * APIProperty: limit
					 * 
					 * {Integer} Optional limit on the number of history items
					 * to retain. If null, there is no limit. Default is 50.
					 */
					limit :50,

					/**
					 * Property: activateOnDraw
					 * 
					 * {Boolean} Activate the control when it is first added to
					 * the map. Default is true.
					 */
					activateOnDraw :true,

					/**
					 * Property: registry
					 * 
					 * {Object} An object with keys corresponding to event
					 * types. Values are functions that return an object
					 * representing the current state.
					 */
					registry :null,

					/**
					 * Property: nextStack
					 * 
					 * {Array} Array of items in the history.
					 */
					nextStack :null,

					/**
					 * Property: previousStack
					 * 
					 * {Array} List of items in the history. First item
					 * represents the current state.
					 */
					previousStack :null,

					/**
					 * Property: listeners
					 * 
					 * {Object} An object containing properties corresponding to
					 * event types. This object is used to configure the control
					 * and is modified on construction.
					 */
					listeners :null,

					/**
					 * Property: restoring
					 * 
					 * {Boolean} Currently restoring a history state. This is
					 * set to true before calling restore and set to false after
					 * restore returns.
					 */
					restoring :false,

					/**
					 * Constructor: oscar.Control.PreviousView
					 * 
					 * Parameters: 
					 * options - {Object} An optional object whose
					 * properties will be used to extend the control.
					 */
					initialize : function(options) {
						OpenLayers.Control.Button.prototype.initialize.apply(
								this, [ options ]);

						this.registry = OpenLayers.Util.extend( {
							"moveend" : function() {
								return {
									center :this.map.getCenter(),
									resolution :this.map.getResolution()
								};
							}
						}, this.registry);

						this.clear();

					},
					/**
					 * APIMethod: trigger 
					 * Restore the previous state. If no items
					 * are in the previous history stack, this has no effect.
					 * 
					 * Returns: 
					 * state - {Object} Item representing state that was
					 *         restored. Undefined if no items are in the previous
					 *         history stack.
					 */
					trigger : function() {
						var current = this.previousStack.shift();
						var state = this.previousStack.shift();
						if (state != undefined) {
							this.previousStack.unshift(state);
							this.restoring = true;
							this.restore(state);
							this.restoring = false;
							this.onPreviousChange(this.previousStack[1],
									this.previousStack.length - 1);
						} else {
							this.previousStack.unshift(current);
						}
						return state;
					},

					/**
					 * Method: onPreviousChange
					 * 
					 * Called when the previous history stack changes.
					 * 
					 * Parameters: 
					 * state - {Object} An object representing the state to be restored if previous is triggered again or
					 *         null if no previous states remain. 
					 * 
					 * length - {Integer} The number of remaining previous states that can be restored.
					 */
					onPreviousChange : function(state, length) {
						if (state && !this.active) {
							this.activate();
						} else if (!state && this.active) {
							this.deactivate();
						}
					},
					
					/**
					 * APIMethod: destroy 
					 * 
					 * Destroy the control.
					 */
					destroy : function() {
						OpenLayers.Control.prototype.destroy.apply(this);
					},

					/**
					 * APIMethod: setMap
					 * 
					 * Set the map property for the control and <previous>
					 * and <next> child controls.
					 * 
					 * Parameters:
					 * map - {<OpenLayers.Map>}
					 * 
					 */
					setMap : function(map) {
						this.map = map;
						/* apply listeners here */
						var moveEndFunction = function() {
							if (!this.restoring) {
								var state = this.registry["moveend"].apply(
										this, arguments);
								this.previousStack.unshift(state);
								if (this.previousStack.length > 1) {
									this.onPreviousChange(
											this.previousStack[1],
											this.previousStack.length - 1);
								}
								if (this.previousStack.length > (this.limit + 1)) {
									this.previousStack.pop();
								}
							}
							return true;
						};

						this.map.events.register("moveend", this,
								moveEndFunction);
					},

					/**
					 * APIMethod: draw 
					 * 
					 * Called when the control is added to the map.
					 */
					draw : function() {
						OpenLayers.Control.Button.prototype.draw.apply(this,
								arguments);
						if (this.activateOnDraw) {
							this.activate();
						}
					},
					/**
					 * APIMethod: clear 
					 * 
					 * Clear history.
					 */
					clear : function() {
						this.previousStack = [];
					},

					/**
					 * Method: restore
					 * 
					 * Update the state with the given object.
					 * 
					 * Parameters: 
					 * state - {Object} An object representing the state to restore.
					 */
					restore : function(state) {
						var zoom = this.map
								.getZoomForResolution(state.resolution);
						this.map.setCenter(state.center, zoom);
					},

					/**
					 * APIMethod: activate 
					 * Activate the control.
					 * 
					 * Returns:  
					 * {Boolean} Control successfully activated.
					 */
					activate : function() {
						return OpenLayers.Control.Button.prototype.activate
								.apply(this)
					},

					/**
					 * Method: initStack 
					 * 
					 * Called after the control is activated
					 * if the previous history stack is empty.
					 */
					initStack : function() {
						if (this.map.getCenter()) {
							this.listeners.moveend();
						}
					},

					/**
					 * APIMethod: deactivate 
					 * Deactivate the control. This unregisters any listeners.
					 */
					deactivate : function() {
						if (this.map)
							this.map.events.unregister("moveend", this);
					},
					
					/**
					 * Constant: CLASS_NAME
					 * - oscar.Control.PreviousView
					 */
					CLASS_NAME :"oscar.Control.PreviousView"
				});