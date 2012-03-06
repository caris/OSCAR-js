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
 * Class: oscar.Gui
 * 
 * The Oscar GUI package offers a set of utilities for building richly
 * interactive web applications.This oscar.Gui object defines the Oscar GUI
 * namespace.
 * 
 */

oscar.Gui = oscar.BaseClass({
	/**
	 * APIProperty: EVENT_TYPES
	 * 
	 */
	EVENT_TYPES:["afterDraw","afterAppend","beforeDraw"],
	/**
	 * APIProperty: events
	 */
	events:null,
	/**
	 * Property: div
	 * 
	 * The div element of the GUI object.
	 */
	div:null,
	initialize:function(options) {
		OpenLayers.Util.extend(this,options);
		this.events = new OpenLayers.Events(this, null,
				this.EVENT_TYPES, false, {
					includeXY :true
				});
	},
	/**
	 * APIMethod: draw 
	 * 
	 * Creates the div element for the GUI Class
	 */
	draw: function(){
	    this.div=document.createElement("div");
	    this.div.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME);
		var className = this.CLASS_NAME.replace(/\./g, "");
		oscar.jQuery(this.div).addClass(className);
	},
	/**
	 * APIMethod: appendTo
	 * 
	 * Appends the div to a parent container.
	 */
	appendTo:function(parent) {
		if(this.div == null) {
			this.draw();
		}
		$$(parent).append(this.div);
	},
	
	/**
	 * Constant: CLASS_NAME
	 */
	CLASS_NAME:"oscar.Gui"
});
