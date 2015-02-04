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
				this.events.on({
					"enterMode":function() {
						try{
							this.map.getLayersByName("results")[0].setVisibility(false);
						} catch(err){}
					},
					"exitMode":function() {
						try{
							this.map.getLayersByName("results")[0].setVisibility(true);
						} catch(err){}
					},
					scope:this
				});
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
					timeout:1000,
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
					timeout:1000,
					scope:this
				});
				this.coverageDescription = coverage.coverageDescription;
			},
			
			/**
			* @Override
			* @see oscar.Util.Plugin
			*/
			play : function() {
				oscar.Util.Plugin.Download.Options.prototype.play.apply(this);
				this.sendRequest();
				this.setDefaultDownloadOptions();
				this.showPreviewLayer();
				this.buildInformationPanel();
				this.buildDownloadOptionsPanel();
			},
			setDefaultDownloadOptions:function() {
				var spatialDomain = this.coverageDescription.domain.spatialDomain;
				for(var i=0;i<this.coverageDescription.domain.spatialDomain.boundingBoxes.length;i++) {
					var bbox = this.coverageDescription.domain.spatialDomain.boundingBoxes[i];
					if(bbox.crs == this.coverageDescription.domain.spatialDomain.gridCRS.gridBaseCRS) {
						this.downloadOptions.bbox = new OpenLayers.Bounds(bbox.west,bbox.south,bbox.east,bbox.north);
					}
				}
			},
			buildInformationPanel:function() {
				var $panel = $$("<div></div>");
				var title = this.record.title[0].value || this.record.identifier[0].value;
				this.setTitle(title);
				var abs = this.record["abstract"][0];
				$panel = $$("<div></div>");
				var $abstract = $$("<p></p>").html(abs);
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
				var styleMap = new OpenLayers.StyleMap({
					"default": new OpenLayers.Style({
						strokeDashstyle:"dash",
						fillColor:"#0f0f0f",
						fillOpacity : 0.5,
						strokeWidth : 0,
						strokeColor : "#0f0f0f",
						strokeOpacity : 0
					})
				});
				var crop_layer = new OpenLayers.Layer.Vector("wcs-polygon-preview", {
					styleMap:styleMap,
					renderers: ['Canvas', 'VML'],
					wrapDateLine:true,
					projection:this.map.getProjectionObject()
				});
				this.map.addLayer(crop_layer);			
				this.events.on({
					"exitMode":function() {
						this.map.removeLayer(crop_layer);
					},
					scope:this
				});
			
				var $btnPanel = $$("<div></div>");
				$btnPanel.addClass("buttonsPanel");
				
				var $crop_button = $$("<button></button?").html("Crop");
				var $download_button = $$("<button></button?").html("Download");
				$btnPanel.append($crop_button);
				$btnPanel.append($download_button);
				$btnPanel.append($download_button);
				
				$crop_button.button({
					icons:{
						primary:"ui-icon-crop"
					},
					text:false
				}).click($$.proxy(function() {
					this.cropControl.activate();
				},this));
				
				
				$download_button.button({
					icons:{
						primary:"ui-icon-prepare"
					},
					text:false
				}).click($$.proxy(this.prepareDownload,this));

				this.cropControl = new oscar.Control.Box();
				this.map.addControl(this.cropControl);
				this.cropControl.events.on({
					'done':function(geom) {
						if(this.cropFeature) {
							crop_layer.removeFeatures(this.cropFeature);

						}
						this.cropFeature = new OpenLayers.Feature.Vector(geom);
						crop_layer.addFeatures(this.cropFeature);
						//crop_layer.drawFeature(this.cropFeature);
						this.downloadOptions.bbox = geom.getBounds().clone();
						this.cropControl.deactivate();
					},
					scope:this
				});
				this.$panel.append($btnPanel);
				var $header = $$("<h2></h2>").html("Download Results");
				$header.css("border-bottom","1px solid black");
				this.$panel.append($header);
				this.results_panel = $$("<div></div>");

				this.$panel.append(this.results_panel);
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
				
				var longitude = parseFloat(this.downloadOptions.gridOffsets.longitude);
				var latitude = parseFloat(this.downloadOptions.gridOffsets.latitude);
				if(latitude > 0) {
					latitude *= -1;
				}
				var format = this.selectedFormat;

				//convert the crs to urn;
				var projection = new OpenLayers.Projection(this.downloadOptions.crs.code);
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
					"format":this.downloadOptions.format,
					"BoundingBox":bbox.toString(),
					"GridOrigin":this.downloadOptions.gridOrigin.toString(),
					"GridOffsets":offsets.toString(),
					"RangeSubset":"Depth:nearest",
					"GridBaseCRS":urn,
					"GridType":this.downloadOptions.gridType
				};
				
				
				var $div = $$("<div></div>")
				$div.css({
					"border-bottom":"1px solid black",
					"padding-bottom":"3px",
					"width":"100%"
				});
				$div.addClass("md_loadingActive");
				this.results_panel.prepend($div);
				
				OpenLayers.Request.GET({
					url:url,
					params:qStringParams,
					scope:this,
					success:function(resp) {
						this.transformResult($div,qStringParams,resp);
					},
					failure:function(a) {
						
					},
				});
			},
			transformResult:function($div,params,resp) {
			
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

				var $timestamp = $$("<div></div>").html(new Date());
				var $format = $$("<div></div>").html("Format:"+params.format);
				var $crs = $$("<div></div>").html("CRS:" + params.GridBaseCRS);
				$div.append($format);
				$div.append($crs);
				$div.append($timestamp);
				
				
				var transformation = oscar.Util.Transform.transform(xml,xsl);
				var $btns = $$("<div></div>");
				$btns.css({
					"text-align":"left"
				});
				
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
				this.downloadOptions.gridType = "urn:ogc:def:method:WCS:1.1:2dSimpleGrid"  
				this.downloadOptions.gridOrigin = "0 0";
				var gridOffsets = "0 0";
				
				if(this.coverageDescription.domain.spatialDomain.gridCRS.gridOrigin) {
					this.downloadOptions.gridOrigin = this.coverageDescription.domain.spatialDomain.gridCRS.gridOrigin;
				}
				
				this.downloadOptions.gridOrigin = this.downloadOptions.gridOrigin.split(" ");
				
				if(this.coverageDescription.domain.spatialDomain.gridCRS.gridType) {
					this.downloadOptions.gridType = this.coverageDescription.domain.spatialDomain.gridCRS.gridType;
				}
				
				if(this.coverageDescription.domain.spatialDomain.gridCRS.gridOffsets) {
					gridOffsets = this.coverageDescription.domain.spatialDomain.gridCRS.gridOffsets;
				}
				
				var offsets = oscar.Util.getGridOffsets(gridOffsets);
				this.downloadOptions.gridOffsets = {longitude:0,latitude:0};
				
				//Are the offsets in XY or YX order?
				if(oscar.Util.isGeographicCRS(projection)) {
					this.downloadOptions.gridOffsets.longitude = parseFloat(offsets[1]) * oscar.Util.getMetersConversionFactor(projection);
					this.downloadOptions.gridOffsets.latitude = parseFloat(offsets[0]) * oscar.Util.getMetersConversionFactor(projection);
				} else {
					this.downloadOptions.gridOffsets.longitude = parseFloat(offsets[0]) * oscar.Util.getMetersConversionFactor(projection);
					this.downloadOptions.gridOffsets.latitude = parseFloat(offsets[1]) * oscar.Util.getMetersConversionFactor(projection);
				}
				
				var $resolution = $$("<h3></h3>").html("Resolution");
				var $label_longitude = $$("<label><label>").html("Longitude:");
				var $label_latitude = $$("<label><label>").html("Latitude:");
				
				this.$input_longitude = $$("<input/>").change($$.proxy(function(event){
					var $this = $$(event.target);
					this.downloadOptions.gridOffsets.longitude = parseFloat($this.val());
				},this));
				
				this.$input_latitude = $$("<input/>").change($$.proxy(function(event){
					var $this = $$(event.target);
					this.downloadOptions.gridOffsets.latitude = parseFloat($this.val());
				},this));
				
				this.$input_longitude.val(this.downloadOptions.gridOffsets.longitude)
				this.$input_latitude.val(this.downloadOptions.gridOffsets.latitude);
				
				$label_longitude.append($$("<br/>")).append(this.$input_longitude);
				var style = {
					"display":"block",
					"font-weight":"bold",
					"margin-bottom":"5px"
				};
				$label_longitude.css(style);
				$label_latitude.append($$("<br/>")).append(this.$input_latitude);
				$label_latitude.css(style);
				
				
				
				this.$panel.append($resolution);
				this.$panel.append($label_longitude);
								this.$panel.append($label_latitude);
			},
			_createFormatList:function() {
				var scope = this;
				var outputFormats = this.coverageDescription.supportedFormats;
				var simpleFormats = [];
				for(var i=0;i<outputFormats.length;i++) {
					simpleFormats.push({
						label:oscar.Util.convertFormat(outputFormats[i]),
						value:outputFormats[i]
					});
				}
				var $format = $$("<h3></h3>").html("Format");
				
				var $format_input = $$("<input/>");
				$format_input.attr("readonly","readonly");
				$format_input.val(simpleFormats[0]);
				$format_input.css("cursor","pointer");
				this.$panel.append($format);
				
				this.$panel.append($format_input);
				$format_input.autocomplete({
					minLength:0,
					source:simpleFormats,
					select:$$.proxy(function(event,ui){
						var $this = $$(event.target);
						$this.val(ui.item.label);
						this.downloadOptions.format=ui.item.value
						return false;
					},this)
				}).focus(function(){
					$$(this).autocomplete("search","");
				}).click(function(){
					$$(this).focus();
				});
	
				$format_input.val(simpleFormats[0].label);
				this.downloadOptions.format=simpleFormats[0].value;
			},
			_createCRSList:function() {
				var gridBaseReference = oscar.Util.CoordinateReferences.getReference(this.coverageDescription.domain.spatialDomain.gridCRS.gridBaseCRS);
				var scope = this;
				supportedCRSList = this.coverageDescription.supportedCRS;
				var projections = [];
				for(var i=0;i<supportedCRSList.length;i++) {
					var crs = oscar.Util.CoordinateReferences.getReference(supportedCRSList[i]);
					projections.push(crs);
				}
				
				var $crs_input = $$("<input/>");
				$crs_input.css({
					"cursor":"pointer",
					"width":"90%"
				});
				
				var $crs = $$("<h3></h3>").html("Coordinate Reference System");
				this.$panel.append($crs);
				this.$panel.append($crs_input);
				var scope = this;
				$crs_input.autocomplete({
					minLength:0,
					source:function(request,response) {
						var matches=[];
						for(var i in projections) {
							var projection = projections[i];
							if(request.term.length > 0) {
								var q = request.term.toLowerCase();
								if(projection.description.toLowerCase().indexOf(q) != -1 || projection.code.toLowerCase().indexOf(q) != -1) {
									matches.push(projection);
								} else {
									$crs_input.val(scope.downloadOptions.crs.description);
								}
							} else {
								matches.push(projection);
							}
						}
						response(matches);
					},
					select:$$.proxy(function(event,ui) {
						var $this = $$(event.target);
						$this.val(ui.item.description);
						this.downloadOptions.crs=ui.item;
						return false;
					},this)
				}).focus(function(){
					$$(this).autocomplete("search","");
				}).click(function(){
					$$(this).focus();
				}).blur(function(event){
					if($$(event.target).val().length == 0) {
						$crs_input.val(this.downloadOptions.crs.description);
					}
				}).data('ui-autocomplete')._renderItem = function(ui,item) {
					return $$("<li></li>").data("ui-autocomplete-item",item).append("<a>" + item.code + "<br/>" + item.description + "</a>").appendTo(ui);
				}
				$crs_input.val(gridBaseReference.description);
				this.downloadOptions.crs=gridBaseReference;
			},
			_createFields:function() {
				//create a table row to return.
				this.downloadOptions.fields=[];
				var createFieldRow = function(field,isDefaultField,scope) {
					var numeric_id = Math.round(Math.random() * 1000);
					
					var $row = $$("<tr></tr>");
					var $checkbox_cell = $$("<td></td>");
					var $field_label_cell = $$("<td></td>");
					var $field_interpolation_cell = $$("<td></td>");
					
					var identifier = field.identifier;
					var defaultMethod = field.interpolationMethods.defaultMethod;
					var methods = field.interpolationMethods.methods;
					
					//Create the field checkbox
					var $field_checkbox = $$("<input/>");
					$field_checkbox.click($$.proxy(function(event){
						this.updateFields($$(event.target));
					},scope));
					
					var checkbox_id = field.identifier +"_"+numeric_id + "_" + "checkbox";
					var select_id = field.identifier +"_"+numeric_id + "_" + "select"
					$field_checkbox.attr("type","checkbox");
					$field_checkbox.attr("id",checkbox_id);
					$field_checkbox.attr("data-field",field.identifier);
					$field_checkbox.attr("data-interpolation",select_id);
					$checkbox_cell.append($field_checkbox);
					
					//Create the field label
					var $field_label = $$("<label></label>").html(identifier);
					$field_label_cell.append($field_label);
					
					
					//Create the field interpolation methods dropdown.
					var $select_interpolation = $$("<select></select>");
					$select_interpolation.attr("id",select_id);
					$select_interpolation.attr("data-checkbox",checkbox_id);
					for(var i=0;i<methods.length;i++) {
						var method = methods[i];
						var $option = $$("<option></option>").html(method);
						$option.val(method);
						if(method == defaultMethod) {
							$option.attr("selected","selected");
						}
						$select_interpolation.append($option);
						$field_interpolation_cell.append($select_interpolation);
					}

					$select_interpolation.change($$.proxy(function(event){
						var $this = $$(event.target);
						var $checkbox = $$("#"+$this.attr("data-checkbox"));
						this.updateFields($checkbox);
					},scope));
					
					$row.append($checkbox_cell);
					$row.append($field_label_cell);
					$row.append($field_interpolation_cell);
					if(isDefaultField) {
						setTimeout(function(){
							$field_checkbox.click();
						},500);
					}
					return $row;
				};
			
				var fields = this.coverageDescription.range.fields
				var $fields = $$("<h3></h3>").html("Fields");
				var $table = $$("<table></table");
				this.$panel.append($fields);
				this.$panel.append($table);
				for(var i=0;i<fields.length;i++) {
					var field = fields[i];
					isDefaultField = (i==0)?true:false;
					$table.append(createFieldRow(field,isDefaultField,this));
				}
				

			},
			updateFields:function($checkbox) {
				var $select = $$("#"+$checkbox.attr("data-interpolation"));
				var field = {
					name:$checkbox.attr("data-field"),
					interpolation:$select.val()
				}
				if($checkbox.is(":checked")) {
					var select_id = $checkbox.attr("data-field") + "_"+$checkbox.attr("data-numeric-id")+"_select";
					var $interpolation = $$("#"+select_id);
					
					var found = false;
					for(var i=0;i<this.downloadOptions.fields.length;i++) {
						var existingField = this.downloadOptions.fields[i];
						if(existingField.name == field.name) {
							existingField.interpolation = field.interpolation;
							found = true;
							break;
						}
					}
					if(!found) {
						this.downloadOptions.fields.push(field);
					}
				} else {
					for(var i=0;i<this.downloadOptions.fields.length;i++) {
						var existingField = this.downloadOptions.fields[i];
						if(existingField.name == field.name) {
							this.downloadOptions.fields.splice(i,1);
						}
					}
				}
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
				if(isPreviewSupported(this.coverageDescription.supportedFormats)) {
					var GetCoverageOp = oscar.Util.Metadata.getOperation(this.capabilities,"GetCoverage");
					var previewLayer = new oscar.Layer.GetCoveragePreview(
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
					previewLayer.events.on({
						"loadstart":function() {
							try {
								this.map.getControlsByClass("oscar.Control.LoadingBar")[0].show();
							} catch(err){}
						},
						"loadend":function() {
							try {
								this.map.getControlsByClass("oscar.Control.LoadingBar")[0].hide();
							} catch(err){}
						},
						scope:this
					
					});
					this.map.addLayer(previewLayer);
					this.events.on({
						"exitMode":function() {
							this.map.removeLayer(previewLayer);
						},
						scope:this
					});
				} else {
					this.showPolyPreviewLayer();
				}
			},
			showPolyPreviewLayer:function() {
				var styleMap = new OpenLayers.StyleMap({
					"default": new OpenLayers.Style({
						fillColor:"#0f0f0f",
						fillOpacity : 0.01,
						strokeWidth : 0,
						strokeColor : "#0f0f0f",
						strokeOpacity : 0.3
					})
				});
				var poly_layer = new OpenLayers.Layer.Vector("wcs-polygon-preview", {
					styleMap:styleMap,
					renderers: ['Canvas', 'VML'],
					wrapDateLine:true,
					projection:map.getProjectionObject()
				});
				this.map.addLayer(poly_layer);
			
				var t = this.record.feature.clone();
				poly_layer.addFeatures(t);
				
				this.events.on({
					"exitMode":function() {
						this.map.removeLayer(poly_layer);
					},
					scope:this
				});
			},
			CLASS_NAME : "oscar.Util.Plugin.Download.WCSService"
		});

oscar.getPluginManager().register(oscar.Util.Plugin.Download.WCSService.prototype.pluginType,
	oscar.Util.Plugin.Download.WCSService
);