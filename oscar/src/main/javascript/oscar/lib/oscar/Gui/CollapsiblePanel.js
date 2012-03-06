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
 * Class: oscar.Gui.CollapsiblePanel 
 * 
 * A user interface widget that contains a header with a collapsible content
 * panel.
 */

oscar.Gui.CollapsiblePanel = oscar.BaseClass( {
	/**
	 * APIProperty: collapsed
	 * 
	 * Boolean - Whether the content panel is open or closed during
	 * initialization
	 * 
	 * Default - false
	 */
	collapsed :false,
	/**
	 * APIProperty: title
	 * 
	 * String - The value of the header
	 */
	title :"",
	/**
	 * APIProperty: panel
	 * 
	 * HTMLElement - The div element for the object
	 */
	panel :null,
	/**
	 * APIProperty: container
	 * 
	 * HTMLElement - Reference to the container div
	 */
	container :null,
	/**
	 * APIProperty: contentPane
	 * 
	 * Reference to the content pane.
	 */
	contentPane :null,
	/**
	 * APIProperty: headerPanel
	 * 
	 * Reference to the header panel.
	 */
	headerPanel :null,
	/**
	 * APIProperty: css
	 * 
	 * Object - Contains the names of the css class references.
	 */
	css : {
		container :"_collapsiblePanel",
		headerPanel :"_headerPanel",
		contentPanel :"_contentPanel",
		contentOpen :"contentOpen",
		contentClosed :"contentClosed",
		headerText :"_headerText"
	},
	/**
	 * Constructor: oscar.Gui.CollapsiblePanel
	 * 
	 * Parameters: 
	 * container - the div container for this CollapsiblePanel 
	 * options - {Object} An optional object whose properties will be set on
	 * 			 this instance.
	 */
	initialize : function(container, options) {
		OpenLayers.Util.extend(this, options);
		this.container = container;
		this.panel = document.createElement('div');
		this.panel.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME);
		oscar.jQuery(this.panel).addClass(
				this.CLASS_NAME.replace(/\./g, "_") + "_collapsiblePanel");
		this.contentPane = document.createElement('div');
		this.contentPane.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME
				+ "_ContentPane");
		oscar.jQuery(this.contentPane).addClass(
				this.CLASS_NAME.replace(/\./g, "_") + this.css.contentPanel);
		this.createHeaderPanel();
		this.panel.appendChild(this.contentPane);
		$(this.container).appendChild(this.panel);
	},
	/**
	 * APIMethod: createHeaderPanel
	 * 
	 * Creates the header panel
	 */
	createHeaderPanel : function() {
		var headerPanel = document.createElement("div");
		oscar.jQuery(headerPanel).addClass(
				this.CLASS_NAME.replace(/\./g, "_") + this.css.headerPanel);
		var ctx = this;
		this.titleElement = document.createElement("div");
		oscar.jQuery(this.titleElement).addClass(
				this.CLASS_NAME.replace(/\./g, "_") + this.css.headerText);
		headerPanel.appendChild(this.titleElement);
		oscar.jQuery(this.titleElement).click(
				function(event) {
					ctx.collapsed = (!ctx.collapsed);
					if (ctx.collapsed) {
						oscar.jQuery(ctx.titleElement).removeClass(
								ctx.css.contentOpen);
						oscar.jQuery(ctx.titleElement).addClass(
								ctx.css.contentClosed);
					} else {
						oscar.jQuery(ctx.titleElement).removeClass(
								ctx.css.contentClosed);
						oscar.jQuery(ctx.titleElement).addClass(
								ctx.css.contentOpen);
					}
					oscar.jQuery(ctx.contentPane).slideToggle('slow');
				});
		if (this.collapsed) {
			oscar.jQuery(this.titleElement).addClass(this.css.contentClosed);
			oscar.jQuery(this.contentPane).css("display", "none");
		} else {
			oscar.jQuery(this.titleElement).addClass(this.css.contentOpen);
		}

		this.panel.appendChild(headerPanel);

	},
	/**
	 * APIMethod: setTitle
	 * 
	 * Parameters:
	 * 
	 * title - <String> The title of the panel
	 */
	setTitle : function(title) {
		this.title = title;
		this.titleElement.innerHTML = this.title;
	},
	/**
	 * APIMethod: getPanel
	 * 
	 * Returns the panel reference
	 */
	getPanel : function() {
		return this.panel;
	},
	/**
	 * APIMethod: getContentPane
	 * 
	 * Returns the contentPane reference
	 */
	getContentPane : function() {
		return this.contentPane;
	},
	/**
	 * APIMethod: appendContent
	 * 
	 * Parameters:
	 * 
	 * node - <HTMLElement> - Adds content to the content pane.
	 */
	appendContent : function(node) {
		this.contentPane.appendChild(node);
	},
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Gui.CollapsiblePanel
	 */
	CLASS_NAME :"oscar.Gui.CollapsiblePanel"
});