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
 * Class: oscar.Control.Permalink
 * 
 * The Oscar Permalink control handles the URL of the map object.
 * 
 * Inherits from: 
 * - <OpenLayers.Control.Permalink>
 * 
 */ 
oscar.Control.Permalink = oscar.BaseClass(OpenLayers.Control.Permalink,{
	/**
     * APIProperty: argParserClass
     * {Class} The ArgParser control class (not instance) to use with this
     * control.
     */
	argParserClass:oscar.Control.ArgParser,
	
	/**
	 * Property: panel
	 */
	panel:null,
	
	/**
	 * Property: permalinkPanel
	 */
	permalinkPanel:null,
	
	/**
     * Constructor: oscar.Control.Permalink
     *
     * Parameters: 
     * element - {DOMElement} 
     * base - {String} 
     * options - {Object} An optional object whose properties will be set on
	 * this instance.
     */
    initialize:function(element,base,options) {
        var newArgs = [];
        newArgs.push(element);
        newArgs.push(base);
        newArgs.push(options);
        OpenLayers.Control.Permalink.prototype.initialize.apply(this,newArgs);
    },
    /**
    * Method: createParams
    * Creates the parameters(the current map center, zoom level and  theme name)  
    * that need to be encoded into the permalink URL.  
    * 
    * Returns:
    * params - {Object} Hash of parameters that will be URL-encoded into the
    *          permalink.
    */   
    createParams:function() {
        var themeManager = this.map.getControlsByClass('oscar.Control.ThemeManager')[0];      
        var params=OpenLayers.Control.Permalink.prototype.createParams.apply(this,arguments);
        if(themeManager && themeManager.activeTheme) {
            params.theme = themeManager.activeTheme.name;
        
        }
        return params;
    },
    /**
     * Method: updateLink 
     */
    updateLink: function() {
		OpenLayers.Control.Permalink.prototype.updateLink.apply(this);
		if(this.$panel){
			this.$panel.hide();
		}
    },
    /**
     * APIMethod: draw
     *
     * Returns:
     * {DOMElement}
     */
	draw: function() {
        OpenLayers.Control.Permalink.prototype.draw.apply(this);
		var ctx=this;	
		var showPermalink=function(){
			ctx._showPermalink();
		}
		this.element.onclick=function() {return false;}
        OpenLayers.Event.observe(this.element,"mouseup",
	        OpenLayers.Function.bindAsEventListener(showPermalink));
        return this.div;
    },
    /**
     * Method: _showPermalink
     * Creates a popup panel to display the permalink url.
     *  
     */
	_showPermalink: function(){
		//element is the anchor
		var parent = $$(this.element).parent();
		if(this.$panel == null) {
			this.$panel = $$("<div></div>");
			this.$closePanel = $$("<div></div>");
			this.$closePanel.addClass("closeBox");
			var scope = this;
			this.$closePanel.click(function() {
				scope.$panel.hide();
			});
			this.$panel.append(this.$closePanel);
			this.$panel.attr("id","permalinkPanel");
			var $title=$$("<div></div>").html(this.panelTitle);
			$title.css("text-align","left");
			this.$panel.append($title);
			this.$input=$$("<input type='text'>");
			this.$input.css("width","98%");
			this.$panel.append(this.$input);
			$$("body").append(this.$panel);
			this.$panel.css({
				"position":"absolute",
				"zIndex":1500,
				"width":600,
				"height":80,
				"backgroundColor":"#bbb"
			});
			this.$panel.position({
				of:$$(this.element),
				at:"right bottom",
				my:"right top"
			});			
		}
		this.$input.val(this.element.href);
		this.$panel.show();

	},
	/**
	 * Method: _selectAll 
	 * Returns a closure to capture the onclick event.
	 */
	_selectAll:function(field) {
		return function(e) {
			var end=field.value.length;
			if( field.createTextRange ) {
				var selRange = field.createTextRange();
				selRange.select();
			} else if(field.setSelectionRange) {
	            field.setSelectionRange(0, end);
	        } else if(field.selectionStart) {
			    
	            field.selectionStart = 0;
	            field.selectionEnd = end;
	        }
			field.focus();
			
		}
	},
	/**
     * Method: _createSelection
     * Set the content of the input field to be selected
     *  
     */
	_createSelection: function (field) {
	    var end=field.value.length;
		if( field.createTextRange ) {
			var selRange = field.createTextRange();
			selRange.select();
		} else if(field.setSelectionRange) {
            field.setSelectionRange(0, end);
        } else if(field.selectionStart) {
		    
            field.selectionStart = 0;
            field.selectionEnd = end;
        }
		field.focus();
	},
	
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Control.Permalink
	 */
    CLASS_NAME:"oscar.Control.Permalink"
});