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
 * Class: oscar.Gui.Grid
 * 
 * This *oscar.Gui.Grid* widget is designed to hold a tabView display which has 
 * the information of selected features as its content.
 * 
 * @deprecated
 * 
 */
oscar.Gui.Grid = oscar
		.BaseClass( {
			/**
			 * APIProperty: processor
			 * 
			 * {<oscar.Handler>} The handler object which executes the action and returns
			 * the requested information. The value of this object can be set via the 
			 * constructor's *options* argument. 
			 */
			processor :null,
			/**
			 * APIProperty: doDialog
			 * 
			 * {Boolean} Indicates whether or not to display the grid in a dialog.
			 */
			doDialog :false,
			/**
			 * APIProperty: div
			 * 
			 * {String} The id of the div tag to display the grid in.
			 */
			div :"selResults",
			/**
			 * Property: tab
			 */
			tab :null,
			/**
			 * APIProperty: features
			 * 
			 * {Array(Array(<OpenLayers.Feature>))} The two dimensional array of feature objects 
			 * passed in either by the processor or user manually.
			 */
			features :null,
			/**
			 * APIProperty: tabView
			 * 
			 * {YAHOO.widget.TabView} The YUI TabView control element.
			 */
			tabView :null,
			/**
			 * APIProperty: map
			 * 
			 * {oscar.Map} The reference to the map object.
			 */
			map :null,
			/**
			 * APIProperty: tables
			 * 
			 * {Object} An object referencing the tables for features
			 */
			tables :null,
			/**
			 * APIProperty: featureCtrl
			 * 
			 * {<OpenLayers.Control.SelectFeature>} Reference to an OpenLayers.Control.SelectFeature
			 * control.
			 */
			featureCtrl :null,
			/**
			 * APIProperty: featureLayer
			 * 
			 * {<OpenLayers.Layer.Vector>} Reference to an OpenLayers.Layer.Vector layer for displaying
			 * features.
			 */
			featureLayer :null,
			/**
			 * Constructor: oscar.Gui.Grid
			 * 
			 * Parameters: 
			 * options - {Object} An optional object whose properties will be set on
	         * 			 this instance.
			 */
			initialize : function(options) {
				this.tables = {};
				OpenLayers.Util.extend(this, options);
				this.EVENT_TYPES = [ 'gridready', 'clean' ];
				this.events = new OpenLayers.Events(this, null,
						this.EVENT_TYPES, false, {
							includeXY :true
						});
				if (this.processor) {
					this.processor.events.on( {
						'complete' :this.processResults,
						scope :this
					});
					this.processor.events.on( {
						'clean' :this.clean,
						scope :this
					});
				}

				if (!document.getElementById(this.div)) {
					var t = document.createElement('div');
					t.id = this.div;
					document.body.appendChild(t);
				}
				this.buildTabLayout();
				
			},
			/**
			 * APIMethod: processResults
			 * 
			 * This method is used to process the results returned by the 
			 * processor object.
			 * 
			 * Parameters: 
			 * results - {Object} An object that contains the information to be processed.
			 * 			 It may have the following format: 
			 * (start code)
			 * results = { 	map      : oscar.Map,      // A reference to an oscar.Map object;    
			 * 			 	features : this.features,  // A reference to an {Array(Array(<OpenLayers.Feature>))} object;
			 * 			 	object   : this.processor  // A reference to handler object;
			 *            }
			 * (end code)                      
			 * This *results* parameter can be passed in by user or returned by the processor object.
			 */
			processResults : function(layer) {
				this.map = layer.map;
				this.layer = layer;
				var feats = layer.features;
				this.features = {};
				
				for(var i=0;i<feats.length;i++) {
					var feature = feats[i];
					if(this.features[feature.type]==null) {
						this.features[feature.type] = [];
					}
					this.features[feature.type].push(feature);
				}
				this.showGrid();

			},

			/**
			 * APIMethod: showGrid
			 * 
			 * Displays the features in a TabView grid.
			 */
			showGrid : function() {
				this.tabView = new YAHOO.widget.TabView(this.tab.id);
				for(var prop in this.features) {
					var obj = this.features[prop];
					if (obj.length == 0)
						continue;
					var tab = this._addTab(prop);
					this._buildTable(tab, prop, obj);
				}
				oscar.jQuery('#' + this.div).addClass("yui-skin-sam");
				if (this.doDialog) {
					this.dlg = oscar.jQuery("#" + this.div).dialog( {
						title :oscar.i18n('Features'),
						width :640,
						height :480,
						resizable :true,
                        position:['left','bottom']
					});
				}
				this.tabView.selectTab(0);
				this.events.triggerEvent("gridready", this.layer);
			},
			/**
			 * APIMethod: buildTabLayout
			 * 
			 * Creates the elements to contain the tabs and places them in the
			 * DOM.
			 * 
			 */
			buildTabLayout : function() {
				this.tab = document.createElement("div");
				this.tab.id = "tabs";
				$(this.div).appendChild(this.tab);
			},
			/**
			 * APIMethod: buildTable 
			 * Builds the tables to show the feature information.
			 * 
			 * Parameters: 
			 * div - {HTMLElement} a div HTMLElement.
			 * key - {String} The *key* String of a feature object.
			 * features - {Array({<OpenLayers.Feature.Vector>})} an Array of OpenLayers.Feature.Vector objects.
			 */
			buildTable : function(div, key, features) {
				oscar.jQuery(div).addClass("wfsGrid");
				var headers = this._getFeatureHeaders(features[0]);
				var colDefs = [];
				for ( var i = 0; i < headers.length; i++) {
					colDefs.push( {
						key :headers[i],
						sortable :true
					});
				}
				var dsArray = [];
				for ( var i = 0; i < features.length; i++) {
					var obj = features[i].attributes;
					obj.fid = features[i].fid;
					obj.key = key;
					dsArray.push(obj);
				}
				var ds = new YAHOO.util.DataSource(dsArray);
				ds.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
				ds.responseSchema = {
					fields :headers
				};
				var dt = new YAHOO.widget.DataTable(div, colDefs, ds);
				var fn = function(event) {
					features = this.features;
					var getGrid = function(key) {
						for ( var i = 0; i < features.length; i++) {
							var grid = features[i];
							if (grid.key == key)
								return grid.features;
						}
					};
					var getFeat = function(fid, grid) {
						for ( var i = 0; i < grid.length; i++) {
							if (fid == grid[i].fid)
								return grid[i];
						}
					}
					var activeTab = this.tabView._configs.activeTab.value._configs.label.value;
					var fid = dt.getRecord(event.target).getData('fid');
					var feat = getFeat(fid, this.features[activeTab]);
					var selectFeature = this.map.getControlsByClass("oscar.Control.SelectFeature")[0];
					selectFeature.ctrl.unselectAll();
					selectFeature.ctrl.select(feat);

				}
				dt.hideColumn("fid");

				dt.subscribe('rowMouseoverEvent', dt.onEventHighlightRow);
				dt.subscribe('rowMouseoutEvent', dt.onEventUnhighlightRow);
				dt.subscribe('rowClickEvent', dt.onEventSelectRow);
				dt.subscribe('rowClickEvent', fn, this, this);
				this.tables[key] = {
					dt :dt
				};

			},
			/**
			 * APIMethod: clean
			 * 
			 * Clears the selection result features on the map and the grid.
			 */
			clean : function() {
				if (!this.tabView)
					return;
				while (this.tabView._configs.tabs.value.length != 0) {
					this.tabView.removeTab(this.tabView.getTab(0));
				}
				if(this.map!= null) {
					this.map.removeLayer(this.layer);
					this.layer = null;
					this.map = null;
				}
				if(this.dlg) {
					oscar.jQuery(this.dlg).dialog("destroy");	
				}
				this.events.triggerEvent("clean");
			},
			/**
			 * APIMethod: selectFeature
			 * 
			 * Called when a feature is selected. Creates the pop-up which is
			 * displayed on screen.
			 * 
			 * Parameters:
			 * feature - {<OpenLayers.Feature.Vector>} an OpenLayers.Feature.Vector object. 
			 */
			selectFeature : function(feature) {
				this._selectRow(feature);
				var returnHTML = "";
				returnHTML += "<TABLE>";
				for (attributeName in feature.attributes) {
					//fid is an OpenLayers attribute, key is an Oscar display attribute
					//don't bother showing them in the popup
					if (!(attributeName == "fid" || attributeName == "key")) {
						returnHTML += "<TR>";
						returnHTML += "<TD valign='top'>";
						returnHTML += "<span style='font-size:.75pc' class='entTitle'>"
								+ attributeName
								+ " : "
								+ feature.attributes[attributeName] + "</span>";
						returnHTML += "</TD>";
						returnHTML += "</TR>";
					}
				}
				returnHTML += "</TABLE>";
				var popup = new oscar.FramedCloud("id", feature.geometry
						.getBounds().getCenterLonLat(), null, returnHTML, null,
						true);
				popup.autoSize=false;
				feature.popup = popup;
				this.map.addPopup(popup);
				var lonLat = feature.geometry.getBounds().getCenterLonLat();
				this.map.panTo(lonLat);

			},
			/**
			 * APIMethod: unSelectFeature
			 * 
			 * Called when a feature is unselected. Removes the pop-up from the
			 * map.
			 * 
			 * Parameters:
			 * feature - {<OpenLayers.Feature.Vector>} an OpenLayers.Feature.Vector object.
			 */
			unSelectFeature : function(feature) {

				if (feature.popup == null)
					return;
				this.map.removePopup(feature.popup);
				feature.popup.destroy();
				feature.popup = null;
			},
			/**
			 * APIMethod: _selectRow
			 * 
			 * Called when a row in a table is selected. Will attempt to select
			 * a feature on the map.
			 * 
			 * Parameters:
			 * feature - {<OpenLayers.Feature.Vector>} an OpenLayers.Feature.Vector object.
			 * 
			 */
			_selectRow : function(feature) {
				var name = feature.key;
				if (!name) {
					name = feature.attributes["key"];
				}
				if (feature.gml) {
					if (feature.gml.featureNSPrefix && feature.gml.featureType) {
						name = feature.gml.featureNSPrefix + ":"
								+ feature.gml.featureType;
					}
				}
				var featureList = null;
				var tab = null;
				if (name.length > 1) {
					tab = this._findTab(name);
				}
				var dt = this.tables[name].dt;
				dt.unselectAllRows();
				var recordSet = dt.getRecordSet();
				var numRecords = recordSet.getLength();
				for ( var i = 0; i < numRecords; i++) {
					var record = recordSet.getRecord(i);
					var fid = record.getData("fid");
					if (fid == feature.fid) {
						dt.selectRow(record);
						break;
					}

				}
			},
			/**
			 * APIMethod: _getListByName
			 * 
			 * Retrieves the array of features contained in the features array
			 * by name
			 * 
			 * Parameters: 
			 * name - name of the feature array.
			 */
			_getListByName : function(name) {
				for ( var i = 0; i < this.features.length; i++) {
					var list = this.features[i];
					if (list.key == name)
						return list;
				}
			},
			/**
			 * APIMethod: _findTab
			 * 
			 * Retrieves the currently activated tab.
			 * 
			 * Parameters: 
			 * name - {String} the label String of the tab.
			 */
			_findTab : function(name) {
				for ( var i = 0; i < this.features.length; i++) {
					var tab = this.tabView.getTab(i);
					if (tab._getLabel() == name) {
						this.tabView.selectTab(i);
						return tab;
					}

				}
			},
			/**
			 * APIMethod: _addTab
			 * 
			 * Creates a tab in the TabView.
			 * 
			 * Parameters: 
			 * lbl - {String} The *key* String of a feature object, and it will 
			 *       be used as the label of a tab.
			 * 
			 * Returns: 
			 * newTab - {<YAHOO.widget.Tab>} a new tab object.
			 * 
			 */
			_addTab : function(lbl) {
				var newTab = new YAHOO.widget.Tab( {
					label :lbl
				});
				this.tabView.addTab(newTab);
				return newTab;

			},
			/**
			 * APIMethod: _buildTable
			 * 
			 * Calls the buildTable method with the correct parameters.
			 * 
			 * Parameters: 
			 * tab - {<YAHOO.widget.Tab>} a reference to a tab object.
			 * key - {String} The *key* String of a feature object.
			 * features - {<OpenLayers.Feature.Vector>} an Array of OpenLayers.Feature.Vector objects.
			 */
			_buildTable : function(tab, key, features) {
				this.buildTable(tab._configs.contentEl.value, key, features);
			},
			/**
			 * APIMethod:getFeatureHeaders
			 * 
			 * Loops through the feature to create an array of header names
			 * based off of the attributes object.
			 * 
			 * Parameters: 
			 * feature - {<OpenLayers.Feature.Vector>} an OpenLayers.Feature.Vector object. 
			 */
			_getFeatureHeaders : function(feature) {
				var headers = [];
				for ( var attr in feature.attributes) {
					headers.push(attr);
				}
				headers.push("fid");
				return headers;

			},
			/**
			 * Constant: CLASS_NAME
			 * - oscar.Gui.Grid
			 */
			CLASS_NAME :'oscar.Gui.Grid'
		});
