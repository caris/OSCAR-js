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
 * Class: oscar.Gui.ServicePanel
 * 
 * A panel to display metadata of a service. 
 */

oscar.Gui.ServicePanel = oscar.BaseClass(oscar.Gui.CollapsiblePanel,
		{
			/**
			 * APIProperty: serviceMetadata 
			 * {oscar.Gui.CollapsiblePanel} Displays information about the service.
			 */
			serviceMetadata :null,
			/**
			 * APIProperty: serviceContent 
			 * {oscar.Gui.CollapsiblePanel} Displays information about the service contents.
			 */
			serviceContent :null,
			/**
			 * Constructor: oscar.Gui.ServicePanel
			 * 
			 * Parameters: 
			 * div - {HTMLDivElement} the div container for this widget.
			 */
			initialize : function(div) {
				oscar.Gui.CollapsiblePanel.prototype.initialize.apply(this,
						[ div ]);
				this.css.contentClass = "servicePanelContent";
				this.serviceContents = new oscar.Gui.CollapsiblePanel(
						this.contentPane);
				this.serviceContents.setTitle(oscar
						.i18n("servicepanel_content_header"));

				this.serviceMetadata = new oscar.Gui.CollapsiblePanel(
						this.contentPane, {
							collapsed :true
						});
				this.serviceMetadata.setTitle(oscar
						.i18n("servicepanel_info_header"));
				this.panel.appendChild(this.contentPane);
				$(this.container).appendChild(this.panel);
			},
			/**
			 * APIMethod: appendMetadataContent 
			 * Adds content to the service metadata panel.
			 * 
			 * Parameters: 
			 * node - {HTMLDivElement} div container for the metadata content added.
			 * 
			 */
			appendMetadataContent : function(node) {
				this.serviceMetadata.appendContent(node);
			},
			/**
			 * APIMethod: appendServiceContents 
			 * Adds content to the service contents panel.
			 * 
			 * Parameters: 
			 * node - {HTMLDivElement} div container for the service content added.
			 * 
			 */
			appendServiceContents : function(node) {
				this.serviceContents.appendContent(node);
			},
			/**
			 * Constant: CLASS_NAME
			 * - oscar.Gui.ServicePanel
			 */
			CLASS_NAME :"oscar.Gui.ServicePanel"
		});