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
 * Class: oscar.Control.Multi
 * This control is the base class for controls which contain a sub-menu with controls.  
 * 
 * Inherits from: 
 * - <oscar.Control>
 * 
 */

oscar.Control['Multi'] = oscar
		.BaseClass(
				oscar.Control,
				{
					type :OpenLayers.Control.TYPE_TOOL,
					className :"MeasureToolBar",
					parent :null,
					size :new OpenLayers.Size(32, 32),
					/**
					 * Property: controls
					 * {Array (Object)} Array containing the sub menu controls.
					 */
					controls : null,
					subMenu :null,
					subMenuWidth : null,
					subMenuPosition :null,
					/**
					 * Constructor: oscar.Control.Multi
					 * 
					 * Parameters: 
					 * options - {Object} An optional object whose properties will be set on this instance.
					 */
					initialize : function(options) {
						this.controls=[];
						OpenLayers.Control.prototype.initialize.apply(this,
								[ options ]);
					},
					/**
					 * APIMethod: activate
					 * Called when the control is activated.
					 */
					activate : function() {
						OpenLayers.Control.prototype.activate.apply(this,
								arguments);
						this.initSubMenu();
					},
					/**
					 * APIMethod: deactivate
					 * Called when the control is deactivated.
					 */
					deactivate : function() {
						try {
							var finishedFn = function(obj) {
								return function() {
									try {
										obj.panel_div.removeChild(obj.subMenu)
									} catch (err) {
									}
								};
							}
							oscar.jQuery(this.subMenu).fadeOut("fast",
									finishedFn(this));
						} catch (err) {
						}
					},
					/**
					 * Method: initSubMenu
					 * This method creates the element used for the sub menu.
					 */
					initSubMenu : function() {
						this.subMenuPosition = new OpenLayers.Pixel(
								this.panel_div.offsetLeft,
								this.panel_div.offsetHeight + 20);
						this.subMenu = document.createElement("div");
						oscar.jQuery(this.subMenu).addClass("subMenu");
						this.panel_div.appendChild(this.subMenu);
						var leftBookEnd = document.createElement("div");
						oscar.jQuery(leftBookEnd).addClass("subMenuBookEnd");
						this.subMenu.appendChild(leftBookEnd)
						oscar.jQuery(this.subMenu).hide();
						oscar.jQuery(this.subMenu).fadeIn("fast");
						this.subMenuWidth = this.subMenu.offsetWidth;
					},
					/**
					 * Method: createSubMenuItem
					 * This method is used to create an element for a control to be added to the sub menu.
					 */
					createSubMenuItem : function() {
						var clickFn = function(obj) {
							return function(e) {
								OpenLayers.Event.stop(e, true);
							}

						}
						var item = document.createElement("span");
						oscar.jQuery(item).addClass('subTool');
						OpenLayers.Event.observe(item, "click", clickFn(this));

						return item;

					},
					/**
					 * Method: addToSubMenu
					 * Adds the element to the SubMenu.
					 * 
					 * Parameters:
					 * elem - The clicked subtool HTML Span element.
					 */
					addToSubMenu : function(elem) {
						this.subMenu.appendChild(elem);
						this.subMenuWidth += elem.offsetWidth;
						var pos = null;
						var easyPosition = function(subMenu) {
							var offsetParent = subMenu.offsetParent;
							var parent = subMenu.parentNode;
							return offsetParent.offsetWidth - parent.offsetLeft- (parent.offsetWidth / 2);
						}

						var hardPosition = function(subMenu) {
							var offsetParent = subMenu.offsetParent;
							var realParentWidth = 0;
							for(var i = 0;i<offsetParent.childNodes.length;i++) {
								var node = offsetParent.childNodes[i];
								realParentWidth += node.offsetWidth;
							}
							//realParentWidth-= (offsetParent.offsetLeft + (offsetParent.offsetWidth/2));
							return (realParentWidth/2);
						}
						if(document.documentMode && document.documentMode == 8 || oscar.Util.getBrowserName() != "msie") {
							pos = easyPosition(this.subMenu);
						} else {
							pos = hardPosition(this.subMenu);
						}
						
						
						//console.log(pos.left);
						oscar.jQuery(this.subMenu).css("position","absolute");
						oscar.jQuery(this.subMenu).css("top","33px");
						//oscar.jQuery(this.subMenu).css("left",(0 - this.subMenuWidth + 18)+"px");
						oscar.jQuery(this.subMenu).css("right",pos + "px");
						oscar.jQuery(this.subMenu).css("width",this.subMenuWidth+"px");
						oscar.jQuery(this.subMenu).css("z-index","1999");
						//this.calcPosition();
						return;
						
						this.subMenu.setAttribute("style",
								"position:relative;top:" + 33 + "px;left:"
										+ (0 - this.subMenuWidth + 18)
										+ "px;width:" + this.subMenuWidth
										+ "px");						

					},
					/**
					 * Method: calcPosition
					 * This method calculates the position for the sub menu
					 * in relation to its parent container.
					 */
					calcPosition : function() {
						var innerWidth = 0;
						var maxHeight = 0;
						for ( var i = 0; i < this.subMenu.childNodes.length; i++) {
							innerWidth += this.subMenu.childNodes[i].clientWidth;
							maxHeight = (maxHeight < this.subMenu.childNodes[i].clientHeight) ? this.subMenu.childNodes[i].clientHeight
									: maxHeight;
						}
						var position = this.subMenuPosition.x - innerWidth
								+ (this.size.w / 4);
						//this.subMenu.style.left = position;
					},
					
					/**
					 * Constant: CLASS_NAME
					 * - oscar.Control.Multi
					 */
					CLASS_NAME :"oscar.Control.Multi"
				});