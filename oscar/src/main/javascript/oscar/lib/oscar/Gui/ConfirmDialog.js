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
 * @requires oscar.Gui.Dialog
 */

/** 
 * Class: oscar.Gui.ConfirmDialog
 * 
 * A GUI dialog widget that confirms user's choices of "yes" or "no".
 * 
 *  Inherits from: 
 *  - <oscar.Gui.Dialog>
 *  
 *  @deprecated
 */

oscar.Gui.ConfirmDialog = oscar.BaseClass(oscar.Gui.Dialog, {
	/**
	 * Property: yesCallback
	 */
	yesCallback:null,
	/**
	 * Property: noCallback
	 * 
	 */
	noCallback:null,
	/**
	 * Constructor: oscar.Gui.ConfirmDialog
	 * 
	 * Parameters: 
	 * header - header for this confirm dialog.
	 * content - content for this confirm dialog.
	 * options - {Object} An optional object whose properties will be set on
	 * 			 this instance.
	 */
	initialize : function(header, content, options) {
		options.icon = YAHOO.widget.SimpleDialog.ICON_HELP;
		oscar.Gui.Dialog.prototype.initialize.apply(this,["ConfirmDialog",options]);
		OpenLayers.Util.extend(this,options);
		this.createButton("yesButtonLabel",this.yesCallback);
		this.createButton("cancelButtonLabel",this.noCallback);
		this.setHeader(header);
		this.setContent(content);
		this.show();
	},
	
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Gui.ConfirmDialog 
	 */
	CLASS_NAME :"oscar.Gui.ConfirmDialog"
});
