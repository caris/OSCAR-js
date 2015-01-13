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
		oscar.Util.Plugin.Download.Options,
		{
			pluginType : "OGC:WCS-1.1.0-http-get-capabilities",
			icon : "ui-icon-wcs-download",
			cropControl:null,
			downloadOptions:{},
			initialize : function(options) {
				oscar.Util.Plugin.Download.Options.prototype.initialize.apply(this,
						[ options ]);
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
				
				var baseUrl = $$.trim(this.link.url).split("?")[0];
				
				this.wcsRequest = OpenLayers.Request.GET({
					url : baseUrl,
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
				this.capabilities = reader.read(response.responseXML);
				var coverage = null;
				
				var url = oscar.Util.Metadata.getOperationHref(
				this.capabilities, "DescribeCoverage");

				OpenLayers.Request.GET({
					url:$$.trim(url),
					async:false,
					params: {
						request:"DescribeCoverage",
						service:"WCS",
						version:"1.1.0",
						identifiers:this.record.dataIdentifier
					},
					success:function(resp) {
						var reader = new oscar.Format.WCSDescribeCoverage();
						coverage = reader.read(resp.responseXML);
					},
					scope:this
				});
				this.coverageDescription = coverage.coverageDescription;
			},
			
			destroy:function() {
				this.map.removeLayer(this.previewLayer);
				for(var i=0;i<this.plugins.length;i++) {
					this.plugins[i].destroy();
				}
			},

			/**
			 * @Override
			 * @see oscar.Util.Plugin
			 */
			play : function() {
				oscar.Util.Plugin.Download.Options.prototype.play.apply(this);
				this.sendRequest();
				this.showPreviewLayer();
				this.buildInformationPanel();
				this.buildMetadataPanel();
				this.buildDownloadOptionsPanel();
			},
			buildInformationPanel:function() {
				var $panel = $$("<div></div>");
				
				var title = this.record.title[0].value || this.record.identifier[0].value;
				var abs = this.record["abstract"][0];
				$panel = $$("<div></div>");
				var $header = $$("<h2></h2>").html(title);
				var $abstract = $$("<p></p>").html(abs);
				$panel.append($header);
				$panel.append($abstract);
				this.addOption($panel);
			
			},
			buildDownloadOptionsPanel:function() {
				this.$panel = $$("<div></div>");
				var $header = $$("<h2></h2>").html("Download Options");
				$header.css("border-bottom","1px solid black");
				this.$panel.append($header);
				this._createFormatList();
				this._createCRSList();
				this._createFields();
				this._createResolution();
				this._createToolButtons();
				this.addOption(this.$panel);
			},
			_createToolButtons:function() {
				var scope = this;
			
				var $btnPanel = $$("<div></div>");
				$btnPanel.addClass("buttonsPanel");
				this.cropTool = $$("<span></span>");
				this.cropTool.addClass("dOption crop");
				
				this.cropTool.attr("title",oscar.i18n("Crop"));
				
				$btnPanel.append(this.cropTool);
				
				this.downloadTool = $$("<span></span>");
				this.downloadTool.addClass("dOption queueDownload");
				$btnPanel.append(this.downloadTool);
				
				this.downloadTool.click($$.proxy(this.prepareDownload,this));
				
				this.cropControl = new oscar.Control.Box();
				this.map.addControl(this.cropControl);
				this.cropControl.events.on({
					'done':function(geom) {
						var geometry_boundry = geom.getBounds();
						this.downloadOptions.bbox = geometry_boundry;
						this.cropControl.deactivate();
					},
					scope:this
				});
				
				this.cropTool.click(function() {
					scope.cropControl.activate();
				});
				this.$panel.append($btnPanel);
			},
			prepareDownload:function() {
				var GetCoverageOp = oscar.Util.Metadata.getOperation(this.capabilities,"GetCoverage");

				var isServiceStorageAllowed = function(op) {
					for(var i=0;i<op.parameters.length;i++) {
						var param = op.parameters[i];
						if(param.name.toLowerCase("store")) {
							for(var j=0;j<param.values.length;j++) {
								if(param.values[j].toLowerCase() == "true") {
									return true;
								}
							}
							
						}
					}
					return false;
				};
				
				var selectedBounds = this.downloadOptions.bbox;
				var longitude = parseFloat(this.$input_x.val());
				var latitude = parseFloat(this.$input_y.val());
				if(latitude > 0) {
					latitude *= -1;
				}
				var format = this.selectedFormat;

				//convert the crs to urn;
				var projection = new OpenLayers.Projection(this.selectedCRS);
				var isGeographicCRS = oscar.Util.isGeographicCRS(projection);
				var urn = oscar.Util.EpsgConversion.epsgToUrn(projection.projCode);
				
				//Does the bounds need to be transformed
				if(projection.projCode != this.map.getProjection()) {
					selectedBounds = selectedBounds.clone().transform(this.map.getProjectionObject(),projection);
				}
				
				longitude/= oscar.Util.getMetersConversionFactor(projection);
				latitude/=oscar.Util.getMetersConversionFactor(projection);
				
				var bbox = selectedBounds.toArray(isGeographicCRS);
				bbox.push(urn);
				
				var offsets = [];
				if(isGeographicCRS) {
					offsets.push(latitude);
					offsets.push(longitude);
				} else {
					offsets.push(longitude);
					offsets.push(latitude);
				}
				
				if(this.gridType == "urn:ogc:def:method:WCS:1.1:2dGridIn2dCrs") {
					offsets.splice(1,0,0,0);
				}
				
				var url = GetCoverageOp.dcp.http.get;
				var qStringParams = {
					"version":"1.1.0",
					"service":"WCS",
					"request":"GetCoverage",
					"store":isServiceStorageAllowed(GetCoverageOp),
					"identifier":this.record.dataIdentifier,
					"format":this.selectedFormat,
					"BoundingBox":bbox.toString(),
					"GridOrigin":this.gridOrigin.toString(),
					"GridOffsets":offsets.toString(),
					"RangeSubset":"Depth:nearest",
					"GridBaseCRS":urn,
					"GridType":this.gridType
				};
				
				var $div = $$("<div></div>")
				$div.addClass("md_loadingActive");
				this.$panel.append($div);
				
				OpenLayers.Request.GET({
					url:url,
					params:qStringParams,
					scope:this,
					success:function(resp) {
						this.transformResult($div,resp);
					},
					failure:function(a) {
						
					},
				});
			},
			transformResult:function($div,resp) {
				var xml = resp.responseXML;
				var xsl = null;
				OpenLayers.Request.GET( {
					url :oscar._getScriptLocation() + "resources/CoverageDownload.xsl",
					async:false,
					success : function(resp) {
						xsl = resp.responseXML;
					},
					scope :this
				});
				$div.removeClass("md_loadingActive");
				
				var transformation = oscar.Util.Transform.transform(xml,xsl);
				var $btns = $$("<div></div>");
				
				$btns.append(transformation);
				$div.append($btns);
				$btns.find("a").each(function() {
					var $this = $$(this);
					var icon = $this.attr("data-class");
					$this.button({
						icons: {
							primary: icon
						},
						text:false,
						label:"&nbsp;"
					}).click(function() {
						var url = $this.attr("href");
						oscar.Util.downloadFromService(url,"123-456");
						return false;
					});
				});
				
			},
			_createResolution:function() {
				var projection = new OpenLayers.Projection(this.coverageDescription.domain.spatialDomain.gridCRS.gridBaseCRS);
				this.gridType = "urn:ogc:def:method:WCS:1.1:2dSimpleGrid"  
				this.gridOrigin = "0 0";
				var gridOffsets = "0 0";
				
				if(this.coverageDescription.domain.spatialDomain.gridCRS.gridOrigin) {
					this.gridOrigin = this.coverageDescription.domain.spatialDomain.gridCRS.gridOrigin;
				}
				
				this.gridOrigin = this.gridOrigin.split(" ");
				
				if(this.coverageDescription.domain.spatialDomain.gridCRS.gridType) {
					this.gridType = this.coverageDescription.domain.spatialDomain.gridCRS.gridType;
				}
				
				if(this.coverageDescription.domain.spatialDomain.gridCRS.gridOffsets) {
					gridOffsets = this.coverageDescription.domain.spatialDomain.gridCRS.gridOffsets;
				}
				
				var offsets = oscar.Util.getGridOffsets(gridOffsets);
				var xy={x:0,y:0};
				
				//Are the offsets in XY or YX order?
				if(oscar.Util.isGeographicCRS(projection)) {
					xy.x = parseFloat(offsets[1]) * oscar.Util.getMetersConversionFactor(projection);
					xy.y = parseFloat(offsets[0]) * oscar.Util.getMetersConversionFactor(projection);
				} else {
					xy.x = parseFloat(offsets[0]) * oscar.Util.getMetersConversionFactor(projection);
					xy.y = parseFloat(offsets[1]) * oscar.Util.getMetersConversionFactor(projection);
				}
				
				var $resolution = $$("<h3></h3>").html("Resolution");
				var $label_x = $$("<label><label>").html("Longitude:");
				var $label_y = $$("<label><label>").html("Latitude:");
				this.$input_x = $$("<input/>");
				this.$input_y = $$("<input/>");
				this.$input_x.val(xy.x);
				this.$input_y.val(xy.y);
				this.$panel.append($resolution);
				this.$panel.append($label_x);
				this.$panel.append(this.$input_x);
				this.$panel.append($$("<br/>"));
				this.$panel.append($label_y);
				this.$panel.append(this.$input_y);
			},
			_createFormatList:function() {
				var outputFormats = this.coverageDescription.supportedFormats;
				var simpleFormats = [];
				for(var i=0;i<outputFormats.length;i++) {
					simpleFormats.push(oscar.Util.convertFormat(outputFormats[i]));
				}
				var $format = $$("<h3></h3>").html("Format");
				var $select = $$("<select></select");
				for(var i=0;i< simpleFormats.length;i++) {
					var $opt = $$("<option></option>").html(simpleFormats[i]);
					$opt.attr("value",outputFormats[i]);
					$select.append($opt);
				}
				this.$panel.append($format);
				this.$panel.append($select);
				$select.change($$.proxy(function(event) {
					this.setSelectedFormat($$(event.target));
				},this));
				$select.prop('selectedIndex', 0);
				this.setSelectedFormat($select);
			},
			setSelectedFormat:function(select) {
				this.selectedFormat = select.val();
			},
			setSelectedCRS:function(select) {
				this.selectedCRS = select.val();
			},
			_createCRSList:function() {
				supportedCRSList = this.coverageDescription.supportedCRS;
				var projections = [];
				var $select = $$("<select></select>");
				$select.attr("id","crs");
				for(var i=0;i<supportedCRSList.length;i++) {
					var crs = oscar.Util.CoordinateReferences.getReference(supportedCRSList[i]);
					var ref = new OpenLayers.Projection(crs.code);
					var $opt = $$("<option></option>").html(crs.code);
					$opt.attr("value",crs.code);
					projections.push(crs);
					$select.append($opt);
				}
				$select.change($$.proxy(function(event){
					this.setSelectedCRS($$(event.target));
				},this));
				
				$select.prop('selectedIndex', 0);
				this.setSelectedCRS($select);
				
				var $crs = $$("<h3></h3>").html("Coordinate Reference System");
				this.$panel.append($crs);
				this.$panel.append($select);
			},
			_createFields:function() {
				//create a table row to return.
				var createFieldRow = function(field) {
					var $row = $$("<tr></tr>");
					var $checkbox_cell = $$("<td></td>");
					var $field_label_cell = $$("<td></td>");
					var $field_interpolation_cell = $$("<td></td>");
					
					var identifier = field.identifier;
					var defaultMethod = field.interpolationMethods.defaultMethod;
					var methods = field.interpolationMethods.methods;
					
					//Create the field checkbox
					var $field_checkbox = $$("<input/>");
					$field_checkbox.attr("type","checkbox");
					$checkbox_cell.append($field_checkbox);
					
					//Create the field label
					var $field_label = $$("<label></label>").html(identifier);
					$field_label_cell.append($field_label);
					
					
					//Create the field interpolation methods dropdown.
					var $select_interpolation = $$("<select></select>");
					for(var i=0;i<methods.length;i++) {
					var method = methods[i];
					var $option = $$("<option></option>").html(method);
					if(method == defaultMethod) {
						$option.attr("selected","true");
					}
					$select_interpolation.append($option);
					$field_interpolation_cell.append($select_interpolation);
					
					}
					
					$row.append($checkbox_cell);
					$row.append($field_label_cell);
					$row.append($field_interpolation_cell);
					
					return $row;
				};
			
				var fields = this.coverageDescription.range.fields
				var $fields = $$("<h3></h3>").html("Fields");
				var $table = $$("<table></table");
				for( var f in fields) {
					var field = fields[f];
					$table.append(createFieldRow(field));
				}
				this.$panel.append($fields);
				this.$panel.append($table);

			},
			buildMetadataPanel:function() {
				var $panel = $$("<div></div>");
				var $header = $$("<h2></h2>").html("Metadata");
				$header.css("border-bottom","1px solid black");
				$panel.append($header);
				var $metadata_btns = $$("<div></div>");
				$metadata_btns.css("text-align","center");
				
				var btns = [];
				btns.unshift({
					protocol:oscar.Util.Plugin.Download.GetRecordByIdView.prototype.pluginType,
					url:this.catalogueService.getUrl(oscar.ogc.CatalogueService.prototype.GETRECORDBYID,"POST")
				});
				
				btns.unshift({
					protocol:oscar.Util.Plugin.Download.GetRecordById.prototype.pluginType,
					url:this.catalogueService.getUrl(oscar.ogc.CatalogueService.prototype.GETRECORDBYID,"POST")
				});
				
				this.plugins = [];
				
				for(var i=0;i<btns.length;i++) {
					var link = btns[i];
					var plugin = oscar.getPluginManager().getPluginFor(link.protocol);
					if(plugin) {
						var icon = plugin.getIcon() || "ui-icon-disk";
						plugin.setOptions({link:link,map:this.map,record:this.record,catalogueService:this.catalogueServices});
						plugin.drawTo($metadata_btns);
						if(plugin.getPluginType() == oscar.Util.Plugin.Download.GetRecordByIdView.prototype.pluginType) {
							plugin.play();
						}
						
						this.plugins.push(plugin);
					}
				}
				
				$panel.append($metadata_btns);
				this.addOption($panel);
			},
			showPreviewLayer:function() {
				var isPreviewSupported = function(formats) {
					for(var i=0;i<formats.length;i++) {
						if(formats[i] == "image/png") {
							return true;
						}
					}
					return false;
				}
				if(!isPreviewSupported(this.coverageDescription.supportedFormats)) {
					return;
				}
				var GetCoverageOp = oscar.Util.Metadata.getOperation(this.capabilities,"GetCoverage");
				this.previewLayer = new oscar.Layer.GetCoveragePreview(
				this.coverageDescription.identifier,
				oscar.PreviewCoverageProxy,
				{
					identifier : this.coverageDescription.identifier,
					serviceEndpoint : GetCoverageOp.dcp.http.get,
					rangeSubset : "Depth:linear",
					version : "1.1.0"
				}, {
					isBaseLayer : false,
					singleTile:true
				});
				var layers = this.map.layers;
				this.map.addLayer(this.previewLayer);
			
			},
			CLASS_NAME : "oscar.Util.Plugin.Download.WCSService"
		});

oscar.getPluginManager().register(oscar.Util.Plugin.Download.WCSService.prototype.pluginType,
	oscar.Util.Plugin.Download.WCSService
);