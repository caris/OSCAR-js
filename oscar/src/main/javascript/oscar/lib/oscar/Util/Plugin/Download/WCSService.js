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
 * Class: oscar.Util.Plugin.Download.WCSService
 * 
 * This plugin is used for downloading from the WCS service.
 * 
 */

oscar.Util.Plugin.Download.WCSService = new oscar.BaseClass(
		oscar.Util.Plugin.Download,
		{
			pluginType : "OGC:WCS-1.1.0-http-get-coverage",
			icon : "ui-icon-wcs-download",
			initialize : function(options) {
				oscar.Util.Plugin.Download.prototype.initialize.apply(this,
						[ options ]);

			},
			/**
			 * Method: createDatabase
			 * 
			 * This method creates the initial database to use in the download
			 * widget.
			 */
			createDatabase : function() {
				this.database = new oscar.Util.Database();
				this.database.addTable("sources", [ "id", "title", "bbox",
						"abstract", "fk_capabilities", "dataType" ]);
				this.database.addTable("capabilities", [ "capabilities" ]);
			},

			/**
			 * Method: sendRequest
			 * 
			 * This method sends the GetCapabilities request to the WCS service.
			 */
			sendRequest : function() {
				var params = {
					request : "GetCapabilities",
					service : "WCS",
					version : "1.1.0"
				}
				this.wcsRequest = OpenLayers.Request.GET({
					url : $$.trim(this.link.url),
					params : params,
					async : false,
					success : this.success,
					scope : this
				});
			},

			/**
			 * Method: success
			 * 
			 * Called when the response was successful.
			 */
			success : function(response) {
				var reader = new oscar.Format.WCSCapabilities();
				var capabilities = reader.read(response.responseXML);
				var capIndex = this.database.addRecord("capabilities", {
					capabilities : capabilities
				});
				coverages = oscar.Util.Metadata.getCoverages(capabilities);
				for ( var c in coverages) {
					var coverage = coverages[c];
					var bbox = new OpenLayers.Bounds(
							coverage.wgs84BoundingBox.west,
							coverage.wgs84BoundingBox.south,
							coverage.wgs84BoundingBox.east,
							coverage.wgs84BoundingBox.north);
					var transformedBounds = bbox.clone();
					transformedBounds.transform(new OpenLayers.Projection(
							"EPSG:4326"), this.map.getProjectionObject());
					var record = {
						"id" : coverage.identifier,
						"title" : coverage.title,
						"abstract" : coverage["abstract"],
						"bbox" : transformedBounds,
						"fk_capabilities" : capIndex,
						"dataType" : "wcs"
					}
					this.database.addRecord("sources", record);
				}
			},

			/**
			 * @Override
			 * @see oscar.Util.Plugin
			 */
			play : function() {
				this.createDatabase();
				this.sendRequest();
				try {
					this.map.getControlsByClass("oscar.Control.DataDiscovery")[0].events
							.triggerEvent("closed");
				} catch (err) {
					/**
					* If the control didn't exist the array would be empty. 
					* Keep calm and carry on.
					*/
				}

				var title = cswget.title(this.record)
						|| cswget.identifier(this.record);

				this.ctrl = new oscar.Control.DataDiscovery(this.database, {
					closable : true,
					showAbstract : false,
					query : title
				});
				this.ctrl.events.on({
					"closed" : function() {
						this.map.removeControl(this.ctrl);
					},
					scope : this
				});
				this.map.addControl(this.ctrl);
			},
			CLASS_NAME : "oscar.Util.Plugin.Download.WCSService"
		});

oscar.getPluginManager().register(oscar.Util.Plugin.Download.WCSService.prototype.pluginType,
	oscar.Util.Plugin.Download.WCSService
);