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
 * Class: oscar.Gui.AlertDialog
 * 
 * A GUI dialog widget that displays an alert. 
 * 
 * Inherits from:
 * - <oscar.Gui.Dialog>
 */

oscar.Gui.AlertDialog = oscar.BaseClass(oscar.Gui.Dialog, {
	/**
	 * Constructor: oscar.Gui.AlertDialog
	 * 
	 * Parameters: 
	 * 
	 * header - header for this alert dialog.  
	 * content - alert content. 
	 * options - {Object} An optional object whose properties will be set on
	 * 			 this instance.
	 * 
	 * @deprecated
	 */

	initialize : function(header, content, options) {
		if (!header) header = oscar.i18n("alertBoxHeader");
		if (!content) content = oscar.i18n("oneChecked");
		if (!options) options = [];
		options.icon = YAHOO.widget.SimpleDialog.ICON_WARN;
		oscar.Gui.Dialog.prototype.initialize.apply(this,["AlertDialog",options]);
		this.addOkButton();
		this.setHeader(header);
		this.setContent(content);
		this.show();
	},
	
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Gui.AlertDialog
	 */
	CLASS_NAME :"oscar.Gui.AlertDialog"
});
