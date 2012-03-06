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
 * Class: oscar.Control.RangeSelect
 * 
 * The Oscar Range selection control adds range selection ability to user's map.
 * 
 * Inherits from: 
 * - <oscar.Control.Box>
 * 
 */
oscar.Control.RangeSelect = oscar.BaseClass(oscar.Control.Box, {
	/**
	 * Property: container
	 */
	container:null,
	
	/**
	 * Property: displayClass
	 */
	displayClass:"rangeSelect",
	
	/**
	 * Property: div
	 */
	div:null,
	
	/**
	 * Constructor: oscar.Control.RangeSelect
	 * 
	 * Parameters:
	 * div - the container of the control.
	 */
	initialize:function(div) {
		oscar.Control.Box.prototype.initialize.apply(this,[]);
		this.container = div;
		this.div = document.createElement("span");
		this.div.ref="area";
        oscar.jQuery(this.div).addClass('subTool');
        oscar.jQuery(this.div).addClass('range');
        oscar.jQuery(this.div).addClass('toolInactive');
	},
	
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Control.RangeSelect
	 */
	CLASS_NAME:"oscar.Control.RangeSelect"
});