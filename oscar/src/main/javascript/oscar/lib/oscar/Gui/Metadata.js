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
 * Class: oscar.Gui.Metadata
 * A panel to display metadata about a service. 
 */
oscar.Gui.Metadata = oscar
		.BaseClass( {
			/**
			 * Property: div
			 * 
			 * Reference to the div container.
			 */
			div :null,
			/**
			 * APIProperty: servicePanel
			 * 
			 * {HTMLDivElement} Container for the service panel.
			 */
			servicePanel :null,
			/**
			 * APIProperty: metadataPanel
			 * 
			 * {HTMLDivElement} Container for the metadata panel.
			 */
			metadataPanel :null,
			/**
			 * Property: showUsed
			 * 
			 * {Boolean} Show only service contents in use, or all.
			 */
			showUsed :true,
			/**
			 * APIProperty: requestList
			 * 
			 * {Array} A list of requests that have been made.
			 */
			requestList : null,
			/**
			 * Property: theme
			 * 
			 * {<oscar.ox.Theme>} A reference to a theme object.
			 */
			theme :null,
			/**
			 * Constructor: oscar.Gui.Metadata
			 * 
			 * Parameters: 
			 * div - {HTMLDivElement} a HTMLDivElement object.
			 * theme - {<oscar.ox.Theme>} an Oscar Theme object. 
			 * options - {Object} An optional object whose properties will be set on
	         * 			 this instance. 
			 */
			initialize : function(div, theme, options) {
				this.requestList = [];
				if (options)
					OpenLayers.Util.extend(this, options);

				this.div = document.createElement('div');
				oscar.jQuery(this.div).addClass("metadataConstraint");
				this.servicePanel = document.createElement('div');
				this.metadataPanel = document.createElement('div');
				oscar.jQuery(this.servicePanel).addClass(
						"Metadata_ServicePanel");
				oscar.jQuery(this.metadataPanel).addClass(
						"Metadata_MetadataPanel");
				oscar.jQuery(this.metadataPanel).addClass("yui-skin-sam");
				this.div.appendChild(this.servicePanel);
				this.div.appendChild(this.metadataPanel);
				this.theme = theme;
				this.loadCapabilities();
			},
			/**
			 * Method: getContainer
			 * 
			 * returns: 
			 * {HTMLDivElement} the div container.
			 */
			getContainer : function() {
				return this.div;
			},
			/**
			 * Method: loadCapabilities
			 * Loads the capabilities of OGC services.
			 * 
			 */
			loadCapabilities : function() {
				this.requestList = [];

				for ( var i = 0; i < this.theme.layers.length; i++) {
					var layer = this.theme.layers[i];
					if (layer.layerType == "WMS") {
						if (!this.isLoaded(layer.urls[0])) {
							this.loadWMSCapabilities(layer.urls[0]);
						}
					}
					if (layer.layerType == "WMTS") {
						var url = layer.urls[0];
						url = url.split("/1.0.0")[0];
						if (!this.isLoaded(url)) {
							this.loadWMTSCapabilities(url);
						}
					}
				}
				var service=null;
				var services=new Array();
				if ((service = this.theme.getSelectionService())) {
					services = services.concat(service);
				}
				if ((service = this.theme.getExtractionService())) {
					services = services.concat(service);
				}
				
				for ( var i = 0; i < services.length; i++) {
					var serviceEntry = services[i];
					if (this.isLoaded(serviceEntry.url)) { continue}
					
					switch (serviceEntry.serviceType) {
					case "WCS":
						this.loadWCSCapabilities(serviceEntry.url);
						break;
					case "WFS":
						this.loadWFSCapabilities(serviceEntry.url);
						break;
					
					}
				}
			},
			/**
			 * APIMethod: isLoaded 
			 * Checks to see if a URL has previously been loaded.
			 * 
			 * Parameters:
			 * url - {String} a URL String.
			 * 
			 * Returns: 
			 * {Boolean} whether the URL is loaded.
			 */
			isLoaded : function(url) {
				for ( var i = 0; i < this.requestList.length; i++) {
					if (this.requestList[i] == url) {
						return true;
					}
				}
				this.requestList.push(url);
				return false;
			},
			/**
			 * APIMethod: getLoadingDiv 
			 * Builds a div element place holder to show loading status
			 * 
			 * returns:
			 * {HTMLDivElement} a HTMLDivElement element.
			 * 
			 */
			getLoadingDiv : function() {
				var loadingDiv = document.createElement("div");
				oscar.jQuery(loadingDiv).addClass("md_loadingActive");
				this.servicePanel.appendChild(loadingDiv);
				return loadingDiv;
			},
			/**
			 * APIMethod: loadWCSCapabilities 
			 * Loads a WCS Capabilities document.
			 * 
			 * Parameters:
			 * url - {String} URL String of the WCS service.
			 */
			loadWCSCapabilities : function(url) {
				var container = this.getLoadingDiv();
				var success = function(resp) {
					try {
						var reader = new oscar.Format.WCSCapabilities();
						var doc = resp.responseXML;
						var capabilities = reader.read(doc);
						oscar.jQuery(container).removeClass("md_loadingActive");
						this.renderService(container, capabilities);
					} catch (err) {
						fail();
					}
				};
				var fail = function(resp) {
					oscar.jQuery(container).removeClass("md_loadingActive");
					oscar.jQuery(container).addClass("md_loadingFailed");
					container.innerHTML = oscar.i18n("md_request_failed");
					container.innerHTML += "<br>Url: " + url;
				}
				var params = {
					service :"WCS",
					request :"GetCapabilities"
				};
				OpenLayers.loadURL(url, params, this, success, fail);
			},
			/**
			 * APIMethod: loadWMSCapabilities 
			 * Loads a WMS Capabilities document
			 * 
			 * Parameters:
			 * url - {String} URL String of the WMS service.
			 */
			loadWMSCapabilities : function(url) {
				var container = this.getLoadingDiv();
				var success = function(resp) {
					try {
						var reader = new OpenLayers.Format.WMSCapabilities();
						var doc = resp.responseXML;
						var capabilities = reader.read(doc);
						oscar.jQuery(container).removeClass("md_loadingActive");
						this.renderService(container, capabilities);
					} catch (err) {
						fail();
					}

				};
				var fail = function(resp) {
					oscar.jQuery(container).removeClass("md_loadingActive");
					oscar.jQuery(container).addClass("md_loadingFailed");
					container.innerHTML = oscar.i18n("md_request_failed");
					container.innerHTML += "<br>Url: " + url;
				}
				var params = {
					service :"WMS",
					request :"GetCapabilities"
				};
				OpenLayers.loadURL(url, params, this, success, fail);

			},
			/**
			 * APIMethod: loadWMTSCapabilities 
			 * Loads a WMTS Capabilities document.
			 * 
			 * Parameters: 
			 * url - {String} URL String of the WMTS service.
			 */
			loadWMTSCapabilities : function(url) {
				var container = this.getLoadingDiv();
				var success = function(resp) {
					try {
						var reader = new oscar.Format.WMTSCapabilities();
						var doc = resp.responseXML;
						var capabilities = reader.read(doc);
						oscar.jQuery(container).removeClass("md_loadingActive");
						this.renderService(container, capabilities);
					} catch (err) {
						fail();
					}

				};
				var fail = function(resp) {
					oscar.jQuery(container).removeClass("md_loadingActive");
					oscar.jQuery(container).addClass("md_loadingFailed");
					container.innerHTML = oscar.i18n("md_request_failed");
					container.innerHTML += "<br>Url: " + url;
				}
				var params = {
					service :"WMTS",
					request :"GetCapabilities"
				};
				OpenLayers.loadURL(url, params, this, success, fail);

			},
			/**
			 * APIMethod: loadWFSCapabilities 
			 * Loads a WFS Capabilities document.
			 * 
			 * Parameters:
			 * url - {String} URL String of the WFS service.
			 */
			loadWFSCapabilities : function(url) {
				var container = this.getLoadingDiv();
				var success = function(resp) {
					try {
						var reader = new oscar.Format.WFSCapabilities();
						var doc = resp.responseXML;
						var capabilities = reader.read(doc);
						oscar.jQuery(container).removeClass("md_loadingActive");
						this.renderService(container, capabilities);
					} catch (err) {
						fail();
					}

				};
				var fail = function(resp) {
					oscar.jQuery(container).removeClass("md_loadingActive");
					oscar.jQuery(container).addClass("md_loadingFailed");
					container.innerHTML = oscar.i18n("md_request_failed");
					container.innerHTML += "<br>Url: " + url;
				}
				var params = {
					service :"WFS",
					request :"GetCapabilities"
				};
				OpenLayers.loadURL(url, params, this, success, fail);
			},
			/**
			 * APIMethod: renderService 
			 * Creates the panels to display service information.
			 * 
			 * Parameters: 
			 * panel - a HTMLDivElement container.
			 * capabilities - an Oscar formatted capabilities document.
			 */
			renderService : function(panel, capabilities) {
				var servicePanel = new oscar.Gui.ServicePanel(panel);
				servicePanel.setTitle(oscar.Util.Metadata
						.getServiceTitle(capabilities));
				servicePanel.appendServiceContents(this
						.buildServiceContent(capabilities));
				servicePanel.appendMetadataContent(this
						.buildServiceMetadata(capabilities));
			},
			/**
			 * APIMethod: buildServiceMetadata 
			 * Builds the panel for the service metadata.
			 * 
			 * Parameters: 
			 * capabilities - an Oscar formatted capabilities document.
			 * 
			 * Returns: 
			 * serviceMetadata - {HTMLDivElement} a panel contains service metadata.
			 */
			buildServiceMetadata : function(capabilities) {
				var serviceMetadata = document.createElement("div");
				var serviceInfoPanel = this
						.buildServiceInformationPanel(capabilities);
				serviceMetadata.appendChild(serviceInfoPanel);
				var serviceContactPanel = this
						.buildServiceContactPanel(capabilities);
				serviceMetadata.appendChild(serviceContactPanel);
				return serviceMetadata;
			},
			/**
			 * APIMethod: buildServiceInformationPanel
			 * 
			 * Builds the service information panel.
			 * 
			 * Parameters: 
			 * capabilities - {Object} an Oscar formatted capabilities document.
			 * 
			 * Returns: 
			 * serviceInformationPanel - {HTMLDivElement} a panel containing service information.
			 */
			buildServiceInformationPanel : function(capabilities) {
				var serviceInformationPanel = document.createElement("div");
				var serviceInformationLabel = document.createElement('label');
				serviceInformationLabel.innerHTML = oscar
						.i18n("md_service_info");
				oscar.jQuery(serviceInformationLabel).addClass("identifier");
				serviceInformationPanel.appendChild(serviceInformationLabel);
				var serviceInfo = {
					serviceAbstract :oscar.Util.Metadata
							.getServiceAbstract(capabilities)
				};
				var context = this;
				oscar
						.jQuery(serviceInformationLabel)
						.click(
								function(e, ui) {
									var panel = context.metadataPanel;
									panel.innerHTML = "";
									if (serviceInfo.serviceAbstract) {
										var abstractPanel = context
												.buildAbstractPanel(serviceInfo.serviceAbstract);
										panel.appendChild(abstractPanel);
									}
									if (serviceInfo.serviceKeywords) {
										var keywordsPanel = context
												.buildKeywordsPanel(serviceInfo.serviceKeywords);
										panel.appendChild(keywordsPanel);
									}
								});
				return serviceInformationPanel;

			},
			/**
			 * APIMethod: buildServiceContactPanel 
			 * Builds the panel to display service contact information.
			 * 
			 * Parameters: 
			 * capabilities - {Object} an Oscar formatted capabilities document.
			 * 
			 * Returns: 
			 * serviceContactPanel - {HTMLDivElement} a panel containing service contact information.
			 */
			buildServiceContactPanel : function(capabilities) {
				var serviceContactPanel = document.createElement("div");
				var serviceContactLabel = document.createElement('label');
				serviceContactLabel.innerHTML = oscar
						.i18n("md_service_contactInfo");
				oscar.jQuery(serviceContactLabel).addClass("identifier");
				serviceContactPanel.appendChild(serviceContactLabel);
				var serviceContactInfo = oscar.Util.Metadata
						.getContactInformation(capabilities);
				var context = this;
				oscar.jQuery(serviceContactLabel).click(
						function(e, ui) {
							var fn1 = function(obj, node) {
								for ( var prop in obj) {
									var row = document.createElement('div');
									oscar.jQuery(row).css("width","100%");
									var item = obj[prop];
									if (typeof item == 'object') {
										fn1(item, node);
										continue;
									} else {
										var cell1 = document
												.createElement('div');
										oscar.jQuery(cell1).css("width","45%");
										oscar.jQuery(cell1).css("float","left");
										cell1.innerHTML = oscar
												.i18n("md_contact_" + prop)
												+ ":";
										var cell2 = document
										.createElement('div');
										if(item.length==0) {
											item = oscar.i18n("NotAvailable");
										}
										cell2.innerHTML = item;
										oscar.jQuery(cell2).css("width","45%");
										oscar.jQuery(cell2).css("float","left");
										row.appendChild(cell1);
										row.appendChild(cell2)
									}
									node.appendChild(row);
								}

							};
							var panel = context.metadataPanel;
							panel.innerHTML = "";
							if (serviceContactInfo) {
								var caption = document.createElement("div");
								caption.innerHTML=oscar
								.i18n("md_contact_caption");
								oscar.jQuery(caption).css("text-align","center");
								oscar.jQuery(caption).css("background-color","#B7AB83");
								oscar.jQuery(caption).css("font-weight","bold");
								oscar.jQuery(caption).css("font-size","14px");
								panel.appendChild(caption);
								fn1(serviceContactInfo, panel);
							} else {
								panel.innerHTML = oscar
										.i18n("md_contact_info_unavailable");
							}
						});
				return serviceContactPanel;
			},
			/**
			 * APIMethod: buildServiceContent 
			 * Builds the panel to display service content.
			 * 
			 * Parameters: 
			 * capabilities - {Object} an Oscar formatted capabilities document.
			 * 
			 * Returns: 
			 * panel - {HTMLDivElement} a panel containing service content information. 
			 */
			buildServiceContent : function(capabilities) {
				var panel = document.createElement("div");
				var serviceType = oscar.Util.Metadata
						.getServiceType(capabilities);
				var ids = null;
				var serviceHref = null;
				var dataLayers = [];
				switch (serviceType) {
				case oscar.Util.Metadata.WCS:
					ids = oscar.Util.Metadata.getCoverages(capabilities);
					href = oscar.Util.Metadata.getOperationHref(capabilities,
							"GetCoverage");
					var extractionService = this.theme.getExtractionService();
					for ( var i = 0; i < extractionService.length; i++) {
						var serviceUrl = extractionService[i].url
						if (this.checkUrls(href, serviceUrl)) {
							for ( var identifier in extractionService[i].identifiers) {
								dataLayers
										.push(extractionService[i].identifiers[identifier]);
							}
						}
					}

					break;
				case oscar.Util.Metadata.WFS:
					ids = oscar.Util.Metadata.getFeatureTypes(capabilities);
					var href = oscar.Util.Metadata.getOperationHref(
							capabilities, "GetFeature");
					var service=null;
					var services=new Array();
					if ((service = this.theme.getSelectionService())) {
						services = services.concat(service);
					}
					if ((service = this.theme.getExtractionService())) {
						services = services.concat(service);
					}

					for ( var i = 0; i < services.length; i++) {
						var serviceUrl = services[i].url
						if (this.checkUrls(href, serviceUrl)) {
							for ( var identifier in services[i].identifiers) {
								dataLayers
										.push(services[i].identifiers[identifier]);
							}
						}
					}

					break;
				case oscar.Util.Metadata.WMS:
					ids = oscar.Util.Metadata.getLayers(capabilities);
					var href = oscar.Util.Metadata.getOperationHref(
							capabilities, "GetMap");
					for ( var i = 0; i < this.theme.layers.length; i++) {
						var layerUrl = this.theme.layers[i].urls[0];
						if (this.checkUrls(href, layerUrl)) {
							for ( var layer in this.theme.layers[i].dataLayers) {
								dataLayers
										.push(this.theme.layers[i].dataLayers[layer].layerName);
							}

						}
					}
					break;
				case oscar.Util.Metadata.WMTS:
					ids = oscar.Util.Metadata.getContent(capabilities);
					var href = oscar.Util.Metadata.getOperationHref(
							capabilities, "GetTile");

					for ( var i = 0; i < this.theme.layers.length; i++) {
						var url = this.theme.layers[i].urls[0];
						url = url.split("/1.0.0")[0];
						if (this.checkUrls(href, url)) {
							for ( var layer in this.theme.layers[i].dataLayers) {
								dataLayers
										.push(this.theme.layers[i].dataLayers[layer].layerName);
							}
						}
					}
					break;
				}
				;
				var idTable = document.createElement("div");
				oscar.jQuery(idTable).addClass("idContainer");
				for ( var i = 0; i < ids.length; i++) {
					var row = document.createElement("div");
					oscar.jQuery(row).css("height", "30px");
					var id = ids[i];
					if (this.showUsed) {
						var checkNameFn = function(dataLayers, id) {
							for ( var i = 0; i < dataLayers.length; i++) {
								var dataLayer = dataLayers[i];
								var idName = id.name || id.identifier || id.title;
								if (dataLayer == idName) {
									return true;
								}
							}
							return false;
						};
						if (!checkNameFn(dataLayers, id)) {
							continue;
						}
					}
					
					var title = null;
					if(typeof id.title == 'object') {
						title = id.title[OpenLayers.Lang.getCode()];
						if(title == null) { 
							for(var key in id.title) {
								title = id.title[key];
								break;
							}
						}
					}
					var lbl = title || id.title || id.name || id.Title;
					var clLabel = new oscar.Gui.ClickableLabel(lbl, {
						style :"block",
						ref :id
					});
					clLabel.applyClass("identifier");
					clLabel.events.on( {
						"labelClicked" :this.identifierClicked,
						scope :this
					});
					clLabel.appendTo(idTable);
				}
				panel.appendChild(idTable);
				return panel;
			},
			/**
			 * APIMethod: buildAbstractPanel 
			 * Builds the panel to display service abstracts.
			 * 
			 * Parameters: 
			 * content - content of Abstract section. 
			 * 
			 * Returns: 
			 * abstractPanel - {HTMLDivElement} a panel containing abstract information.
			 */
			buildAbstractPanel : function(content) {
				var abstractPanel = document.createElement("div");
				abstractPanel.id = "md_abstract_panel";
				var abstractLabel = document.createElement("label");
				abstractLabel.innerHTML = oscar.i18n("md_abstract_label");
				oscar.jQuery(abstractLabel).addClass("md_label");
				abstractPanel.appendChild(abstractLabel);
				var div = document.createElement("div");
				div.id = "md_abstractPanel";
				if(content.length==0) {
					content = oscar.i18n("NotAvailable");
				}
				div.innerHTML = content;
				abstractPanel.appendChild(div);
				return abstractPanel;
			},
			/**
			 * APIMethod: buildKeywordsPanel 
			 * Builds the panel to display service keywords.
			 * 
			 * Parameters: 
			 * keywords - content of the Keywords section in capabilities file. 
			 * 
			 * Returns: 
			 * keywordsPanel - {HTMLDivElement} a panel containing keywords information.
			 */
			buildKeywordsPanel : function(keywords) {
				var tKeywords = [];
				for ( var i = 0; i < keywords.length; i++) {
					if (typeof keywords[i] == "object") {
						tKeywords.push(keywords[i].value);
					} else {
						tKeywords.push(keywords[i]);
					}
				}
				keywords = tKeywords;
				var keywordsPanel = document.createElement("div");
				keywordsPanel.id = "md_keywords_panel";
				var keywordsLabel = document.createElement("label");
				keywordsLabel.innerHTML = oscar.i18n("md_keywords_label");
				oscar.jQuery(keywordsLabel).addClass("md_label");
				var keywordsContainer = document.createElement("div");
				keywordsContainer.innerHTML = keywords;
				keywordsPanel.appendChild(keywordsLabel);
				keywordsPanel.appendChild(keywordsContainer);
				oscar.jQuery(keywordsPanel).css("display","none");
				return keywordsPanel;
			},
			
			/**
			 * Method: checkUrls
			 * 
			 * Parameters: 
			 * param1 - the operation href.
			 * param2 - a service URL provided by an extraction service or a layer URL from a wms service.
			 */
			checkUrls : function(param1, param2) {
				try {
					return param1.toLowerCase().contains(param2.toLowerCase());
				} catch (err) {
					return false;
				}
			},

			/**
			 * Method: identifierClicked
			 * 
			 * Called when one of the identifiers / features in the service 
			 * contents panel is clicked. So we know when to call the method.
			 * 
			 * Parameters: 
			 * obj - {<oscar.Gui.ClickableLabel>} the identifier has been clicked.
			 */
			identifierClicked : function(obj) {
				var metadataContainer = this.metadataPanel;
				metadataContainer.innerHTML = "";
				var id = obj.ref;
				var title = id.title || id.name || id.Title;
				var abstractVal = id['abstract'] || "";
				var keywordsVal = id.keywords || id.Keywords || "";
				var abstractPanel = this.buildAbstractPanel(abstractVal);
				var keywordsPanel = this.buildKeywordsPanel(keywordsVal);
				metadataContainer.appendChild(abstractPanel);
				metadataContainer.appendChild(keywordsPanel);
				var resources = document.createElement('div');
				resources.id = "md_resource_panel";
				var resourcesLabel = document.createElement("label");
				oscar.jQuery(resourcesLabel).addClass("md_label");
				resourcesLabel.innerHTML = oscar.i18n("md_resources_label");
				resources.appendChild(resourcesLabel);
				var resourcesTable = document.createElement("div");
				resources.appendChild(resourcesTable);
				metadataContainer.appendChild(resources);
				var metadataUrls = oscar.Util.Metadata
						.getIdentifierMetadataUrls(id);
				if(metadataUrls.length == 0) {
					oscar.jQuery(resources).css("display","none");
				}
				if (metadataUrls.length > 0) {
					var metadataHeaders = [];
					var resource = metadataUrls[0];
					if(typeof resource == 'object') {
						for ( var prop in resource) {
							metadataHeaders.push(prop);
						}
					} else {
						metadataHeaders.push("type");
						metadataHeaders.push("format");
						metadataHeaders.push("url");
						
						var tempArray = [];
						for(var url in metadataUrls) {
							var uri = new String(metadataUrls[url]);
							var obj = {
									"type":"",
									"format":"",
									"url":uri
							};
							tempArray.push(obj);
						}
						metadataUrls = tempArray;
					}
					
					var olrFormatter = function(elCell, oRecord, oColumn, oData) {
						if (!oData) {
							oData = oRecord.getData("href") || oRecord.getData("url"); 
						};
						var link = document.createElement("a");
						link.href = oData;
						link.innerHTML = "View";
						link.target = "_new";
						elCell.appendChild(link);
					};
					
					
					var typeFormatter = function(elCell, oRecord, oColumn, oData) {
						if(oData.length==0) {
							oData = oscar.i18n("NotAvailable");
						}
						elCell.innerHTML = oData;
					};
					
					var formatFormatter = function(elCell, oRecord, oColumn, oData) {
						if(oData.length==0) {
							oData = oscar.i18n("NotAvailable");
						}
						elCell.innerHTML = oData;
					};
					

					var getHeaderFn = function(name) {
						for ( var i = 0; i < metadataHeaders.length; i++) {
							if (name == metadataHeaders[i])
								return metadataHeaders[i];
						}
						return null;
					};
					var typeHeader = getHeaderFn("type");
					var formatHeader = getHeaderFn("format");
					var urlHeader = getHeaderFn("url") || getHeaderFn("href");

					var myColumnDefs = [
							{
								key :typeHeader,
								label :oscar
										.i18n("map.information.url.column.type"),
								formatter:typeFormatter,
								sortable :true,
								resizeable :true
							},
							{
								key :formatHeader,
								label :oscar
										.i18n("map.information.url.column.format"),
								formatter:formatFormatter,
								resizeable :true
							},
							{
								key :urlHeader,
								formatter :olrFormatter,
								label :oscar
										.i18n("map.information.url.column.onlineresource"),
								resizeable :true
							} ];
					var myDataSource = new YAHOO.util.DataSource(metadataUrls);
					myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
					myDataSource.responseSchema = {
						fields :metadataHeaders
					};

					var oConfigs = {
						MSG_EMPTY :oscar
								.i18n("map.information.no.records.found")
					};
					var myDataTable = new YAHOO.widget.DataTable(
							resourcesTable, myColumnDefs, myDataSource,
							oConfigs);
					myDataTable.render();
				}

				if (id.styles && id.styles.length > 0) {
					var legendDiv = document.createElement("div");
					var legendLabel = document.createElement("label");
					oscar.jQuery(legendLabel).addClass("md_label");
					legendLabel.innerHTML = oscar.i18n("md_legend_graphic");
					legendDiv.appendChild(legendLabel);
					var style = id.styles[0].legend;
					var img = document.createElement("img");
					img.src = style.href;

					legendDiv.appendChild(img);
					metadataContainer.appendChild(legendDiv);
				}
			},		
			/**
			 * Constant: CLASS_NAME
			 * - oscar.Gui.Metadata
			 */
			CLASS_NAME :"oscar.Gui.Metadata"
		});