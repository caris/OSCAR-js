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
 * Class: oscar.Util.Help
 * 
 * Class used to display help documentation provided by an xml file. 
 * 
 * Usage:
 *  new oscar.Util.Help('DataExtractor');
 */

oscar.Util.Help = oscar.BaseClass( {
	/**
	 * APIProperty: baseUrl
	 * {String} - Base path to the help files.
	 */
	baseUrl :oscar._getScriptLocation(),

	/**
	 * APIProperty: helpDir
	 * {String} - Path to the directory containing the help files relative to the baseUrl.
	 * 
	 * Default:
	 * 	help/
	 */
	helpDir :"help/",

	/**
	 * Property: helpFile
	 * Name of the help file with local variable.
	 */
	helpFile :"help_{local}.xml",

	/**
	 * Property: helpStyle
	 * {String} - Name of the xsl file containing transformation definitions.
	 */
	helpStyle :"help.xsl",
	/**
	 * Propery: dialog
	 * Reference to the help dialog.
	 */
	dialog :null,
	/**
	 * Constructor
	 * Parameters:
	 *  *helpReference* - {String} Must match and @id attribute of a component element in the  help xml file.
	 *  *options* - {Object} (Optional) Used to override default properties. 
	 */
	initialize : function(helpReference, options) {
		if (options) {
			OpenLayers.Util.extend(this, options);
		}
		this.helpReference = helpReference;
		this.help();
	},
	/**
	 * Method: help
	 * Makes the requests for the xml and xsl files.
	 */
	help : function() {

		var helpDoc = this.baseUrl + this.helpDir + this.helpFile;
		helpDoc = helpDoc.replaceAll("{local}", OpenLayers.Lang.getCode());
		OpenLayers.Request.GET( {
			url :helpDoc,
			async :false,
			success : function(resp) {
				this.xmlDocument = resp.responseXML;
			},
			failure : function(resp) {
				new oscar.Gui.AlertDialog(oscar.i18n("Error"), oscar
						.i18n("FileNotFound"), {
					width :300,
					height :100,
					draggable :true
				});
			},
			scope :this
		});
		if (!this.xmlDocument)
			return;
		OpenLayers.Request.GET( {
			url :this.baseUrl + this.helpDir + this.helpStyle,
			async :false,
			success : function(resp) {

				this.xslDocument = resp.responseXML;
			},
			failure : function(resp) {
				alert('Unable to retrive help document');
			},
			scope :this
		});
		if (!this.xslDocument)
			return;
		this.createDialog();

	},
	/**
	 * Method: render
	 * Initiates the xml transformation and displays the contents in the dialog.
	 */
	render : function() {
		if (this.xmlDocument && this.xslDocument) {
			oscar.jQuery(this.div).hide();
			if ((helpNode = this.getHelpNode())) {
				var helpContent = oscar.Util["Transform"].transform(helpNode,
						this.xslDocument);
				if (typeof helpContent == "string") {
					this.div.innerHTML = helpContent;
				} else {
					this.div.appendChild(helpContent);
				}
			}
			oscar.jQuery(this.div).fadeIn();
		}
	},
	/**
	 * Method: getHelpNode
	 * Traverses through the xml file to find the correct help component node.
	 */
	getHelpNode : function() {
		var children = this.xmlDocument.documentElement.childNodes;
		var childNode, processor;
		for ( var i = 0; i < children.length; ++i) {
			childNode = children[i];
			if (childNode.nodeType == 1) {
				var props = {};
				for ( var j = 0; j < childNode.attributes.length; j++) {
					var attribute = childNode.attributes[j];
					if (attribute.nodeName == "id"
							&& attribute.nodeValue == this.helpReference) {
						return childNode;
					}
				}
			}
		}
		return false;

	},
	/**
	 * Method: createDialog
	 * Creates the dialog.
	 */
	createDialog : function() {
		this.dialog = new oscar.Gui.Dialog("Help", {
			draggable :true,
			modal :false,
			width :350,
			height :350,
			zIndex :2000
		});
		var header = oscar.i18n("Help");
		this.dialog.setHeader(header);
		this.div = document.createElement("div");
		this.div.setAttribute("class", "help");
		this.dialog.setContent(this.div);
		var closeFn = function(obj) {
			return function() {
				obj.dialog.destroy();
				obj.dialog = null;
			}
		};
		this.dialog.createButton(oscar.i18n("Close"), closeFn(this));
		this.dialog.show();
		this.render();
	},
	/**
	 * Constant: CLASS_NAME
	 */
	CLASS_NAME :"oscar.Util.Help"
});