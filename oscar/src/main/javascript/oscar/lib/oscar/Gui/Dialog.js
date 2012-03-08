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
 * Class: oscar.Gui.Dialog
 * 
 * oscar.Gui.Dialog is the base class for dialogs in Oscar Framework.
 * 
 * Inherits from: 
 * - <oscar.Gui>
 * 
 * @deprecated
 * 
 */

oscar.Gui.Dialog = oscar.BaseClass(oscar.Gui, {
	/**
	 * Properties:
	 */
	name :"Dialog",
	dialog :null,
	container :null,
	header :null,
	body :null,
	icon :null,
	dialogButtons : null,
	
	/**
	 * Constructor: oscar.Gui.Dialog
	 * 
	 * Parameters: 
	 * name - name of the dialog.
	 * options - {Object} An optional object whose properties will be set on
	 * 			 this instance.
	 */
	initialize : function(name, options) {
		this._setDlgDefaults();
		this.dialogButtons = [];
		if (!options) options = {};
		this.dialogProperties.icon = options.icon;
		this.name = name;
		OpenLayers.Util.extend(this.dialogProperties, options);
		if (!this.dialogProperties.effect) {
			this.dialogProperties.effect = {
				effect :YAHOO.widget.ContainerEffect.FADE,
				duration :0.2
			};
		}
		this.dialog = new YAHOO.widget.SimpleDialog(this.name,
				this.dialogProperties);

	},
	/**
	 * APIMethod: setHeader
	 *  
	 * Sets the header for the dialog panel
	 * 
	 * Parameters:  
	 * header - header for the dialog panel.
	 */
	setHeader : function(header) {
		this.header = header;
	},
	/**
	 * APIMethod: setContent
	 * 
	 * Sets the content for the dialog panel, can either be text or an HTML
	 * element like a div.
	 * 
	 * Parameters: 
	 * content - the content object to be set.
	 */
	setContent : function(content) {

		this.body = document.createElement("div");
		this.body.className = "oscarGuiDialog";
		if (typeof content == "object")
			this.body.appendChild(content);
		else
			this.body.innerHTML = oscar.i18n(content);
	},	
	/**
	 * Method: addButton
	 * 
	 * This function will add a button to the panel.
	 * 
	 * Parameters: 
	 * button - a button object.
	 */
	addButton : function(button) {
		this.dialogButtons.push(button);
	},

	/**
	 * APIMethod: render
	 * 
	 * This function will "draw" the dialog panel.
	 */
	render : function() {
		if (!this.container) {
			this._createDialogContainer();
		}
		this.dialog.cfg.queueProperty("buttons", this.dialogButtons);
		this.dialog.setHeader(oscar.i18n(this.header));
		this.dialog.setBody(this.body);
		document.body.appendChild(this.container);
		this.dialog.render(this.container);

	},
	/**
	 * APIMethod: hide
	 * 
	 * This function will hide and destroy the dialog.
	 */
	hide : function() {
		if (this.dialog)
			this.dialog.hide();
		this.destroy();
	},
	/**
	 * APIMethod: show
	 * 
	 * This function will show the dialog panel.
	 */
	show : function() {
		if (this.dialog) {
			this.render();
			this.dialog.show();
		}
	},
	
	/**
	 * APIMethod: addOkButton
	 * 
	 * This is a convenience method for adding an OK button to the dialog.
	 * 
	 * Parameters: 
	 * callback - the callback function.
	 * 
	 */
	addOkButton : function(callback) {
		this.createButton("okayButtonLabel", callback)
	},
	/**
	 * APIMethod: addCancelButton
	 * 
	 * This is a convenience method for adding a Cancel button to the dialog.
	 * 
	 * Parameters:
	 * callback - the callback function. 
	 */
	addCancelButton : function(callback) {
		this.createButton("cancelButtonLabel", callback);
	},
	/**
	 * Method: createButton
	 * 
	 * Use this method to add a button to the dialog, include the text or
	 * language key, include a callback method if required.
	 * 
	 * Parameters: 
	 * txt - text of the button.
	 * callback - the callback function.
	 */
	createButton : function(txt, callback) {
		var ctx = this;
		var handler;
		if (!callback) {
			handler = function() {
				this.hide();

			};
		} else {
			handler = function() {
				if (ctx.autoclose)
					this.hide();
				callback();
			};
		}
		this.addButton( {
			text :oscar.i18n(txt),
			handler :handler
		});
	},
	
	/**
	 * Method: destroy
	 * Destroys this widget.
	 */
	destroy : function() {
		try {
			if (this.container != null) {
				document.body.removeChild(this.container);
			}
			this.dialog = null;
		} catch (err) {
		}
	},
	
	/**
	 * Method: _createDialogContainer
	 * This method will create a container for the dialog. (YUI specific)
	 */
	_createDialogContainer : function() {
		this.container = document.createElement("div");
		this.container.className = "yui-skin-sam";
		this.container.id = OpenLayers.Util.createUniqueID("oscarGuiDialog");
	},
	
	/**
	 * Method: _setDlgDefaults
	 * This method sets the dialog's properties with the default values.
	 */
	_setDlgDefaults : function() {
		this.dialogProperties = {
			fixedcenter :true,
			visible :false,
			draggable :false,
			close :false,
			modal :true,
			constraintoviewport :true,
			zIndex :999
		};
	},
	
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Gui.Dialog
	 */
	CLASS_NAME :"oscar.Gui.Dialog"

});