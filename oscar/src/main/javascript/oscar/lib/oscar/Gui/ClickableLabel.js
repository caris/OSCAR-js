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
 * Class: oscar.Gui.ClickableLabel
 * 
 * This ClickableLabel widget provides a label that, when clicked, fires a labelClicked
 * event with the object reference.
 * 
 * Inherits from: 
 *  - <oscar.Gui>
 */
oscar.Gui.ClickableLabel = oscar.BaseClass(oscar.Gui, {
	/**
	 * APIProperty: styles
	 * 
	 * styles.BLOCK - Creates a <div> container
	 * 
	 * styles.INLINE - Creates a <span> container
	 */
	styles : {
		"BLOCK" :"block",
		"INLINE" :"inline"
	},
	/**
	 * Constant: EVENT_TYPES
	 * {Array(String)} Supported application event types. 
	 * 
	 * Register a listener for a particular event with the following syntax:
	 *   
	 * > clickablelabel.events.register(type, obj, listener); 
	 * 
	 * Supported ClickableLabel event types:
	 * 
	 * labelClicked - Triggered when the label is clicked. Passes the object
	 *                reference to the listeners. 
	 * labelTextChanged - Triggered when the label text is changed.
	 */
	EVENT_TYPES : [ "labelClicked", "labelTextChanged" ],

	/**
	 * APIProperty: events
	 * 
	 * {<OpenLayers.Events>} An events object that handles all
	 * events on the label.
	 */
	events :null,
	/**
	 * APIProperty: container
	 * 
	 * Reference to the label container.
	 */
	container :null,
	/**
	 * APIProperty: style
	 * 
	 * block or inline
	 */
	style :"inline",
	/**
	 * APIProperty: ref
	 * Holds a reference to an object.
	 */
	ref :null,
	/**
	 * Property: count
	 * Counter for the number of times the label has been clicked.
	 */
	count :0,
	/**
	 * Property: isToggled
	 * True or False if the label is in a toggled state.
	 */
	isToggled :false,
	/**
	 * Property: labelText
	 * Holds the value of the label text.
	 * 
	 */
	labelText :"",
	/**
	 * Property: previousText
	 * 
	 * Holds the previous text of the label before the text change.
	 */
	previousText :"",
	
	/**
	 * Constructor: oscar.Gui.ClickableLabel
	 * 
	 * Parameters: 
	 * labelText - text of the label. 
	 * options - {Object} An optional object whose properties will be set on
	 * 			 this instance.
	 */
	initialize : function(labelText, options) {
		if (options)
			OpenLayers.Util.extend(this, options);
		this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES,
				false, {
					includeXY :true
				});
		this.events.register("labelTextChanged", this, this.updateText);
		this.createContainer();
		this.setLabelText(labelText);
	},
	/**
	 * Method: createContainer
	 * 
	 * Creates the container div || span based on the style attribute.
	 */
	createContainer : function() {
		if (this.style == this.styles.BLOCK)
			this.container = document.createElement("div");
		else if (this.style == this.styles.INLINE)
			this.container = document.createElement("span");
		else {
			throw "Invalid style: " + this.style;
			return;
		}
		this.container.onmouseup = this.clicked.bind(this);
	},
	/**
	 * Method: clicked
	 * 
	 * Triggers the labelClicked event passing the object reference to the
	 * listeners.
	 */
	clicked : function(e) {
		this.count++;
		this.isToggled = !this.isToggled;
		this.events.triggerEvent("labelClicked", this)
	},

	/**
	 * APIMethod: setLabelText
	 * 
	 * Sets the label text and triggers the labelTextChanged event.
	 */
	setLabelText : function(labelText) {
		this.previousText = this.labelText;
		this.labelText = labelText;
		this.events.triggerEvent("labelTextChanged");
	},
	/**
	 * Method: updateText
	 * 
	 * Updates the text of the label.
	 */
	updateText : function(e) {
		this.container.innerHTML = this.labelText;
	},

	/**
	 * APIMethod: appendTo
	 * 
	 * Appends the the container to the element provided.
	 */
	appendTo : function(elem) {
		elem.appendChild(this.container);
	},

	/**
	 * Method: revert
	 * Reverts the label to the previous text.
	 */
	revert : function() {
		if (this.previousText.length > 0)
			this.setLabelText(this.previousText);
	},

	/**
	 * APIMethod: toggle
	 * 
	 * Returns true or false if the label has been toggled
	 */
	toggle : function() {
		return this.isToggled;
	},

	/**
	 * APIMethod: applyClass
	 * 
	 * Takes a single CSS class or an array of CSS classes and adds them to the
	 * container.
	 * 
	 * Parameters: 
	 * cls - the CSS class or array of CSS classes should be applied.
	 */
	applyClass : function(cls) {
		if (!(cls instanceof Array)) {
			cls = [ cls ];
		}
		for ( var i = 0; i < cls.length; i++) {
			oscar.jQuery(this.container).addClass(cls[i]);
		}
	},
	/**
	 * APIMethod: removeClass
	 * 
	 * Takes a single CSS class or an array of CSS classes and removes them from
	 * the container.
	 * 
	 * Parameters: 
	 * cls - the CSS class for array of CSS classes should be removed.
	 */
	removeClass : function(cls) {
		if (!(cls instanceof Array)) {
			cls = [ cls ];
		}
		for ( var i = 0; i < cls.length; i++) {
			oscar.jQuery(this.container).removeClass(cls[i]);
		}
	},
	
	/**
	 * APIMethod: reset
	 * 
	 * Resets the counter to 0 
	 */
	reset : function(){
		this.count = 0;
	},
	
	/**
	 * APIMethod: setTooltip
	 * 
	 * Parameters:
	 * 
	 * tooltipText - <String> Adds a tooltip to the label element
	 */
	setTooltip : function(tooltipText) {
		oscar.jQuery(this.container).attr("title", tooltipText);
	},
	
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Gui.ClickableLabel
	 */
	CLASS_NAME :"oscar.Gui.ClickableLabel"
});