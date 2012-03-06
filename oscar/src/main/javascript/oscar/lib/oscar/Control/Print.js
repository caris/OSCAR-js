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
 * Class: oscar.Control.Print
 * 
 * The Oscar Print control adds a *Print* link to user's map.
 * 
 * Inherits from:
 * - <OpenLayers.Control.Permalink>
 */

oscar.Control.Print = oscar.BaseClass(OpenLayers.Control.Permalink,{
	/**
	 * Property: callback
	 * 
	 * Function to go to when the link is clicked.
	 */
	callback:null,
	
	/**
	 * Constructor: oscar.Control.Print
	 * 
	 * Parameters:
	 * element - {DOMElement} 
	 * base - {String}
	 * options - {Object} An optional object whose properties will be set on
	 *           this instance.
	 */
	initialize:function(element,base,options) {
		var newArgs = [];
		newArgs.push(element);
		newArgs.push(base);
		newArgs.push(options);
		OpenLayers.Control.Permalink.prototype.initialize.apply(this,newArgs);
	},
	
	/**
	 * APIMethod: destroy
	 * 
	 * Destroy the control.
	 */
	destroy:function() {
		OpenLayers.Control.Permalink.prototype.destroy.apply(this,arguments);
	},
	
	/**
	 * APIMethod: draw
	 * 
	 * Draw the control onto user's map.
	 */
	draw:function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        
        if (!this.element) {
        	var ctx = this;
        	var oClick = function() {
        		ctx.createPrintParams();
        	};
            this.div.className = this.displayClass;
            this.element = document.createElement("a");
            this.element.innerHTML = OpenLayers.i18n("Print");
            this.element.href="#";
            this.element.onclick=oClick;
            this.div.appendChild(this.element);
        }
        return this.div;	
    },
    
    /**
     * Method: createPrintParams
     */
    createPrintParams:function() {
    	var activeTheme=this.map.currentThemeName;
    	var bbox = this.map.getExtent().toBBOX();
    	if(this.callback)
    		this.callback(activeTheme,bbox);
    },
    	
	/**
	 * Method: updateLink
	 * 
	 * Overridden to remove functionality 
	 */
    updateLink:function() {
		
	},
	
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Control.Print
	 */
	CLASS_NAME:"oscar.Control.Print"
});