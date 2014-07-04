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
 * Class: oscar.Gui.DownloadOptions
 *
 * This GUI class is used to display download options for WFS and WCS contents.
 * 
 */

oscar.Gui.DownloadOptions = oscar.BaseClass(oscar.Gui, {
	/**
	 * APIProperty: db
	 * The database containing the object references
	 */
	db:null,
	/**
	 * Property: capabilities
	 * The current capabilities object
	 */
	capabilities:null,
	/**
	 * Property: serviceType
	 * The type of service
	 */
	serviceType:null,
	
	/**
	* Property: showAbstract
	* Show the abstract of the feature selected. Defaults to true.
	**/
	showAbstract:true,
	/**
	 * Property: feature
	 * 
	 */
	feature:null,
	/**
	 * Property: defaultOptions
	 */
	defaultOptions:null,
	/**
	 * APIProperty: EVENT_TYPES
	 */
	EVENT_TYPES:["serviceReady"],
	/**
	 * APIProperty: events
	 */
	events:null,
	/**
	 * Constructor: new oscar.Gui.DownloadOptions
	 */
	initialize:function(options) {
		oscar.Gui.prototype.initialize.apply(this,arguments);
		this.defaultOptions = {};
        this.events = new OpenLayers.Events(this, null,
				this.EVENT_TYPES, false, {
					includeXY :false
        });
        
	},
	/**
	 * Method: draw
	 * Creates the interface panel.
	 */
	draw:function() {
		oscar.Gui.prototype.draw.apply(this);
		oscar.jQuery(this.div).addClass("options");		
        OpenLayers.Event.observe(this.div, "mousedown", function(e) {
			OpenLayers.Event.stop(e, true);
        });
        OpenLayers.Event.observe(this.div, "click", function(e) {
			OpenLayers.Event.stop(e, true);
        });

		return this.div;
	},
	/**
	 * Method: redraw
	 * Created the gui elements to be displayed.
	 */
	redraw:function() {
		this.div.innerHTML = "";
		var infoPanel = document.createElement("div");
		this.div.appendChild(infoPanel);
		oscar.jQuery(infoPanel).addClass("info");
		var featureTitle = document.createElement("span");
		var featureAbstract = document.createElement("p");
		infoPanel.appendChild(featureTitle);
		infoPanel.appendChild(featureAbstract);
		featureTitle.innerHTML = this.feature.div.data("title") || this.feature.div.data("id");
		if(!this.feature.div.data("abstract") || this.feature.div.data("abstract").length == 0) {
			featureAbstract.innerHTML = "";
		} else {
			featureAbstract.innerHTML = this.feature.div.data("abstract");
		}
		
		if(!this.showAbstract) {
			$$(infoPanel).css("display","none");
		}
		
		this.buildDownloadOptions();

	},
	/**
	 * Method: deactivate
	 * 
	 */
	deactivate:function() {
		if(this.cropTool) {
			this.cropTool.deactivate();
		}
	},
	
	buildDownloadOptions:function() {
		var scope = this;
		this.defaultOptions = {};
		
		var userConfigPanel = document.createElement("div");
		userConfigPanel.id = "userConfigPanel";
		this.div.appendChild(userConfigPanel);
		
		
		
		var buttonsPanel = document.createElement("div");
		oscar.jQuery(buttonsPanel).addClass("buttonsPanel");
		this.div.appendChild(buttonsPanel);
	
		this.cropDiv = document.createElement("span");
		oscar.jQuery(this.cropDiv).addClass("dOption crop");
		this.cropDiv.setAttribute("title",oscar.i18n("Crop"));
		buttonsPanel.appendChild(this.cropDiv);
		
		var downloadDiv = document.createElement("span");
		downloadDiv.setAttribute("title",oscar.i18n("AddToQueue"));
		oscar.jQuery(downloadDiv).addClass("dOption queueDownload");
		buttonsPanel.appendChild(downloadDiv);		
	
		
		OpenLayers.Event.observe(downloadDiv, "click", function(e) {
			scope.queueDownload();
        });
		
		OpenLayers.Event.observe(this.cropDiv, "click", function(e) {
			scope.cropTool = new oscar.Control.Box();
			scope.map.addControl(scope.cropTool);
			$$(scope.cropDiv).addClass("active");
			scope.cropTool.activate();
			scope.cropTool.events.on( {
				'done' : function(geom){
					var layer = scope.feature.layer;
					var featureBounds = scope.feature.geometry.getBounds();
					var newBounds = geom.getBounds();
					
					if (!featureBounds.intersectsBounds(newBounds) && !featureBounds.containsBounds(newBounds)) {
						alert("Crop area outside of the bounds");
						return;
					}
					
					if(scope.cropFeature) {
						try {
							layer.removeFeatures(scope.cropFeature);
							scope.cropFeature = null;
						} catch (err){}
					}
					
					scope.cropFeature = newFeature = scope.feature.clone();
					scope.cropFeature .geometry = geom;
					layer.addFeatures(scope.cropFeature);
					layer.drawFeature(scope.cropFeature,"temporary");
					scope.cropTool.deactivate();
					$$(scope.cropDiv).removeClass("active");
					scope.defaultOptions.bbox = geom.getBounds();
				},
				scope : scope
			});
			
        });		
		var proc = this["getOptions_" + this.serviceType];
		if(proc) {
			proc.call(this,userConfigPanel);
		}
		
	},
	
	/**
	 * This function will build the download options for a Web Feature Service
	 * Supports: 
	 *  - Format
	 */
	getOptions_WFS:function(div) {
		this.defaultOptions.service="WFS";
		var GetFeatureOp = oscar.Util.Metadata.getOperation(this.capabilities.capabilities,"GetFeature");
		
		outputFormats = oscar.Util.Metadata.getParameters(
				this.capabilities.capabilities, "GetFeature", ["outputFormat","formats"])
				
		var formats = [];
		if($$.isArray(outputFormats)) {
			formats = outputFormats;
		} else {
			for(var prop in outputFormats) {
				formats.push(prop);
			}
		}


		var id = oscar.Util.Metadata.getFeatureTypesById(this.capabilities.capabilities,this.feature.div.data("id"));

		this.makeFormatList(div,formats);
		this.makeCRSList(div,id.srss || [id.srs]);
		var opURL = null
		try {
			opUrl = GetFeatureOp.dcp.http.get[0].url || GetFeatureOp.dcp.http.get;
		} catch(e) { // wfs 1.0.0 doesn't have dcp so this will throw a null error... 
			opUrl =  GetFeatureOp.href.get;
		}
		this.defaultOptions.operationUrl = opUrl;
		this.defaultOptions.id = this.feature.div.data("id");
		this.defaultOptions.bbox = this.feature.div.data("bbox");
		this.defaultOptions.title = this.feature.div.data("title") || this.feature.div.data("id");
		
	},
	
	/**
	 * Method: makeFormatList
	 * 
	 * Creates a combo box list for selecting formats.
	 */
	makeFormatList:function(div,outputFormats) {
		var scope = this;
		var formatDiv = document.createElement("div");
		var inArray = function(format,arr) {
			for (var i=0;i<arr.length;i++) {
				if(format.toLowerCase() == arr[i].label.toLowerCase()) {
					return true;
				} 
			}
			return false;
		}

		var usedFormats =[];
		for(var f in outputFormats) {
			
			var simpleFormat = oscar.Util.convertFormat(outputFormats[f]);
			if (inArray(simpleFormat,usedFormats)) {
				continue;
			}
			var formatObj = {
					label:simpleFormat,
					value:outputFormats[f]
			}
			usedFormats.push(formatObj);
		}
		$$(div).append($$("<label></label>").html(oscar.i18n("Format") +":").addClass("heading"));
		var input = document.createElement("input");
		input.type = "text";
		formatDiv.appendChild(input);
		$$(input).autocomplete({
			minLength:0,
			source:usedFormats,
			select:function(event,ul) {
				this.value = ul.item.label;
				scope.defaultOptions.format = ul.item.value;
				if(ul.item.value.indexOf("bag") > -1) {
					var ref = oscar.Util.CoordinateReferences.getReference(scope.gridBaseCRS);
					$$(".crsInput").attr("disabled", "disabled");
					$$(".crsButton").attr("disabled", "disabled");
					$$(".crsInput").val(ref.description);
					scope.defaultOptions.crs = scope.gridBaseCRS;                    
				} else {
					$$(".crsInput").removeAttr("disabled");
					$$(".crsButton").removeAttr("disabled");
				}
				return false;
			},
			focus:function(event,ui) {
				this.value = ui.item.label;
				scope.defaultOptions.format = ui.item.value;
				return false;
				
			}
		}).css("width","190px");
		
		oscar.jQuery(input).addClass("foramtListWidth");
		
		var button = document.createElement("button");
		button.innerHTML = oscar.i18n("Format");
        formatDiv.appendChild(button);
        oscar.jQuery(button).insertAfter( input ).button({
        	icons: {
    		primary: "ui-icon-triangle-1-s"
	    	},
	    	text: false        	
        }).removeClass( "ui-corner-all" ).addClass( "ui-corner-right ui-button-icon" ).click(function() {
            // close if already visible
            if ( oscar.jQuery(input).autocomplete( "widget" ).is( ":visible" ) ) {
            	oscar.jQuery(input).autocomplete( "close" );
                return;
            }
            // pass empty string as value to search for, displaying all results
            oscar.jQuery(input).autocomplete( "search", "" );
            oscar.jQuery(input).focus();
        });
        input.value = usedFormats[0].label;
        this.defaultOptions.format = usedFormats[0].value
		div.appendChild(formatDiv);
		
	},
	
	/**
	 * Method: makeCRSList
	 * 
	 * Creates a combo box list for selecting coordinate reference systems.
	 */
	makeCRSList:function(div,crss) {
		var scope = this;
		var crsDiv = document.createElement("div");
		$$(crsDiv).css("margin-top","5px");
		var crsReferences = []
		for(var i=0;i<crss.length;i++) {
			var crs = oscar.Util.CoordinateReferences.getReference(crss[i]);
			//create an instance of the projection so it is ready for use later.
			new OpenLayers.Projection(crs.code);
			crsReferences.push(crs);
		}
		$$(crsDiv).append($$("<label></label>").html(oscar.i18n("srsCodeColumnLabel") +":").addClass("heading"));

		var input = document.createElement("input");
		input.type = "text";
		$$(input).addClass("crsInput");
		crsDiv.appendChild(input);
		oscar.jQuery(input).autocomplete({
			minLength:0,
			source:function(request,response) {
            	var term = request.term;
            	var match = [];
            	for (var i in crsReferences) {
            		if(crsReferences[i].code.toLowerCase().indexOf(term.toLowerCase())!=-1) {
            	    	match.push(crsReferences[i]);
            	    }
            	}
            	response(match);
            	return;
            },
			select:function(event,ul) {
				this.value = ul.item.description;
				scope.defaultOptions.crs = ul.item.code;
				return false;
			},
			focus:function(event,ui) {
				this.value = ui.item.description;
				return false;
				
			}
		}).data("uiAutocomplete")._renderItem=function(ul,item) {
	        var li = document.createElement("li");
            return oscar.jQuery(li).data( "ui-autocomplete-item", item )
            .append( "<a>" + item.code + "<br>" + item.description + "</a>" )
            .appendTo( ul );
            

		};
		
		$$(input).css("width","190px");
		
		var button = document.createElement("button");
		button.innerHTML = oscar.i18n("srsCodeColumnLabel");
		$$(button).addClass("crsButton");
        crsDiv.appendChild(button);
        oscar.jQuery(button).insertAfter( input ).button({
        	icons: {
        		primary: "ui-icon-triangle-1-s"
        	},
        	text: false
        }).removeClass( "ui-corner-all" ).addClass( "ui-corner-right ui-button-icon" ).click(function() {
            // close if already visible
            if ( oscar.jQuery(input).autocomplete( "widget" ).is( ":visible" ) ) {
            	oscar.jQuery(input).autocomplete( "close" );
                return;
            }
            // pass empty string as value to search for, displaying all results
            oscar.jQuery(input).autocomplete( "search", "" );
            oscar.jQuery(input).focus();
        })
        input.value = crsReferences[0].description;
        this.defaultOptions.crs = crsReferences[0].code
		div.appendChild(crsDiv);
		
	},
	/**
	* Method: _createFieldCheckout
	* This method creates the checkbox to display the available fields for the coverage.
	* Parameters:
	* - field - a JSON object representing a field
	*/
	_createFieldCheckbox:function(field) {
		var scope = this;
		var $input = $$("<input type='checkbox'>");
		var id = OpenLayers.Util.createUniqueID(field.identifier);
		$input.attr("id",id);
		$input.attr("value",field.identifier);
		$input.data("field",field.identifier);
		$input.click(function() {
			var $this = $$(this);
			var currentFields = scope.defaultOptions.field;
            var fieldFound = false;
            for(var i=0;i<currentFields.length;i++) {
                var selectedField = currentFields[i];
                if($this.attr("id") == selectedField.attr("id")) {
                    fieldFound = true;
                    currentFields.splice(i,1);
                    break;
                }
            }
            if(!fieldFound) {
                currentFields.push($this);
            }
            scope.defaultOptions.field=currentFields
		}); 
		return $input;
	},
	/**
	* Method: _createInterpolationMethodList
	* This method creates the selection dropdown lists showing the interpolation methods
	* available for the field.
	* Parameters:
	* - field - a JSON object representing a field
	*/
	_createInterploationMethodList:function(field) {
		var $selection = $$("<select></select>");
		var id = OpenLayers.Util.createUniqueID(field.identifier);
		$selection.attr("id",id);
		var defaultMethod = "";
		if(field.interpolationMethods.defaultMethod) {
			defaultMethod = field.interpolationMethods.defaultMethod;
		}
		for(m in field.interpolationMethods.methods) {
			var method = field.interpolationMethods.methods[m];
			var $option = $$("<option></option").html(method);
			if(method == defaultMethod) {
				$option.attr("selected",true);
			}
			$selection.append($option);
		}
		//hide the interpolation method list if none are available.
		if(field.interpolationMethods.methods.length == 0) {
			$selection.css("display","none");
		}
		
		return $selection;
	},
	/**
	 * Method: makeFieldList
	 * 
	 * Creates a button to display a list to select fields for extraction from 
	 * a Web Coverage Service.
	 */
	makeFieldList:function(div,fields) {
		var scope = this;
		//create the div to contain the field list
		var $fieldDiv = $$("<div></div>");
		var $fieldButton = $$("<button></button>").html(oscar.i18n("Fields"));
		$fieldButton.addClass("heading");
		
		var $table = $$("<table></table>");
		$table.css("display","none");
		for(i in fields) {
			var field = fields[i];
			var $row = $$("<tr></tr>");
			var $inputCell = $$("<td></td>");
			var $fieldCell =$inputCell.clone().html(field.identifier);
			$fieldCell.addClass("heading");
			var $selectionCell = $inputCell.clone();

			var $selection = this._createInterploationMethodList(field);

			var $input = this._createFieldCheckbox(field);

			$input.data("selection",$selection);

			if(i==0) {
				$input.attr("checked",true);
				this.defaultOptions.field = new Array($input);
			}

			$row.append($inputCell);
			$inputCell.append($input);
			$row.append($fieldCell);
			$row.append($selectionCell);
			$selectionCell.append($selection);
			
			$table.append($row);
		}
		
		$fieldDiv.append($table);
		$$(div).append($fieldButton);
		$fieldButton.click(function() {
			$table.slideToggle("slow");
		});
		
		
		$$(div).append($fieldDiv);
	},		
	/**
	* Method: makeResolutionFields
	* This method creates the gui elements to display resolution values in the download options panel.
	*/
	makeResolutionFields:function(div) {
		var offsets = oscar.Util.getGridOffsets(this.gridOffsets);
	
		var $resolutionDiv = $$("<div></div>");
		var $xLabel = $$("<label>").html(oscar.i18n("resolution-x") + ":&nbsp;");
		$xLabel.addClass("heading");
		this.$xText = $$("<input type='text' id='' size='5'>");
		var $yLabel = $$("<label>").html(oscar.i18n("resolution-y") + ":&nbsp;");
		$yLabel.addClass("heading");
		this.$yText = $$("<input type='text' id='' size='5'>");
		var $meters = $$("<label></label>").html("&nbsp;"+oscar.i18n("units:meters"));
		$meters.addClass("heading");
		$resolutionDiv.append($xLabel);
		$resolutionDiv.append(this.$xText);

		
		$resolutionDiv.append($meters);
		$resolutionDiv.append($$("<br/>"));
		$resolutionDiv.append($yLabel);
		$resolutionDiv.append(this.$yText);
		$resolutionDiv.append($meters.clone());
		$$(div).append($resolutionDiv);
		var offsetX = parseFloat(offsets[0]);
		var offsetY = parseFloat(offsets[1]);
		var projection = new OpenLayers.Projection(this.gridBaseCRS);
		offsetX *= oscar.Util.getMetersConversionFactor(projection);
		offsetY *= oscar.Util.getMetersConversionFactor(projection);
		this.$xText.val(offsetX);
		this.$yText.val(Math.abs(offsetY));
	},	
	/**
	 * This function will build the download options for a Web Coverage Service
	 * Supports:
	 *  - Format
	 *  - CRS
	 *  - Fields 
	 */

	getOptions_WCS:function(div) {
		this.defaultOptions.service="WCS";
		var loading = document.createElement("div");
		oscar.jQuery(loading).addClass("optionsLoading");
		div.appendChild(loading);

		var GetCoverageOp = oscar.Util.Metadata.getOperation(this.capabilities.capabilities,"GetCoverage");

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
		}
		this.defaultOptions.store = isServiceStorageAllowed(GetCoverageOp);
		
		var url = oscar.Util.Metadata.getOperationHref(
				this.capabilities.capabilities, "DescribeCoverage");

		var params = {
			service :"WCS",
			request :"DescribeCoverage",
			identifiers :this.feature.div.data("id"),
			version :this.capabilities.capabilities.version
		}
		var scope = this;
		var success = function(resp) {
			oscar.jQuery(loading).fadeOut();
			var version = this.capabilities.capabilities.version;
			var reader = new oscar.Format.WCSDescribeCoverage( {
				"version" :version
			});
			var coverageDescription = reader.read(resp.responseXML);
			var fields = null;

			try {
				this.gridBaseCRS = coverageDescription.coverageDescription.domain.spatialDomain.gridCRS.gridBaseCRS;
				
				this.gridType = "urn:ogc:def:method:WCS:1.1:2dSimpleGrid";
				if(coverageDescription.coverageDescription.domain.spatialDomain.gridCRS.gridType) {
					this.gridType = coverageDescription.coverageDescription.domain.spatialDomain.gridCRS.gridType;
				}

				
				if(coverageDescription.coverageDescription.domain.spatialDomain.gridCRS.gridOrigin) {
					this.gridOrigin = coverageDescription.coverageDescription.domain.spatialDomain.gridCRS.gridOrigin;
				} else {
					this.gridOrigin= "0 0";
				}
				if(coverageDescription.coverageDescription.domain.spatialDomain.gridCRS.gridOffsets) {
					this.gridOffsets = coverageDescription.coverageDescription.domain.spatialDomain.gridCRS.gridOffsets;
				} else {
					this.gridOffsets = "0 0";
				}
				var fields = coverageDescription.coverageDescription.range.fields;
				supportedCRSs = coverageDescription.coverageDescription.supportedCRS;
				supportedFormats = coverageDescription.coverageDescription.supportedFormats;
				this.makeFormatList(div,supportedFormats);
				this.makeCRSList(div,supportedCRSs);
				this.makeFieldList(div,fields);
				this.makeResolutionFields(div);
			} catch(err) {
				alert(err.message);
				alert("error in response");
			}

		};

		var request = new OpenLayers.Request.GET( {
			url :url,
            params:params,
            async:true,
            success : success,
            failure : function(resp){},
            scope :this
        });

		this.defaultOptions.operationUrl = GetCoverageOp.dcp.http.get;
		this.defaultOptions.id = this.feature.div.data("id");
		this.defaultOptions.bbox = this.feature.div.data("bbox");
		this.defaultOptions.title = this.feature.div.data("title") || this.feature.div.data("id");
		
		
		
	},
	/**
	 * Method: setFeature
	 * 
	 * Sets the current selected feature.
	 * 
	 * Parameters: 
	 * 
	 * - OpenLayers.Feature
	 */
    setFeature:function(feature) {
    	this.feature = feature;
    	this.getCapabilities();
    	this.redraw();
    },
    
    /**
     * Method: getCapabilites
     * 
     * Uses the curent feature to obtain the reference in the capabilities document.
     * 
     */
    getCapabilities:function() {
    	this.capabilities = this.db.search("capabilities",this.feature.div.data("fk_capabilities"),function(table,query) {
    	     return table.records[query];
    	});
    	this.serviceType = oscar.Util.Metadata.getServiceType(this.capabilities.capabilities);
    },
    
    /**
     * Method: queueDownload
     * 
     * Adds an item to the download queue panel.
     */
    queueDownload:function() {
    	var serviceType = this.defaultOptions.service;
    	var downloadService = null;
    	var params = {
    			service:serviceType,
    			version:this.capabilities.capabilities.version
    	}
    	
    	var buildUrl = function(url, params) {
    		if(!url) {
    			url = "";
    		}
    		var paramString = OpenLayers.Util.getParameterString(params);
    		paramString = unescape(paramString);
			if (paramString.length > 0) {
				var separator = (url.indexOf('?') > -1) ? '&' : '?';
				url += separator + paramString;
			}
			
			return url;
    	}
    	
    	
    	switch (serviceType) {
    	case "WFS":
    		var buildWFSFilter = function(bbox, projection,version,typeNames,crs) {
				var options = {
						version:version,
						featureType:typeNames
				};
				if(version != "1.0.0") {
					options.xy = (projection.proj.projName=="longlat")? false :true;
				}
				if(crs) {
					options.srsName = crs;
				}
				var format = new OpenLayers.Format.WFST(options);
				var sFilter = new OpenLayers.Filter.Spatial( {
			        type :OpenLayers.Filter.Spatial.BBOX,
			        value:bbox,
			        projection:projection.projCode
			    });
				var data = OpenLayers.Format.XML.prototype.write.apply(
			            format, [format.writeNode("wfs:GetFeature",{filter:sFilter})]
			        );
				return data;
			};
		
			var filter = buildWFSFilter(this.defaultOptions.bbox,this.map.projection,this.capabilities.capabilities.version,this.defaultOptions.id,this.defaultOptions.crs);
    		var params = {
    			service:"WFS",
    			request:"GetFeature",
    			srsName: this.defaultOptions.crs,
    			filter:encodeURIComponent(filter),
    			version:this.capabilities.capabilities.version,
    			typename:this.defaultOptions.id,
    			outputFormat:encodeURIComponent(this.defaultOptions.format)    			
    		}
    		
    		var url = this.defaultOptions.operationUrl;
    		var paramString = OpenLayers.Util.getParameterString(params);
    		paramString = unescape(paramString);
			if (paramString.length > 0) {
				var separator = (url.indexOf('?') > -1) ? '&' : '?';
				url += separator + paramString;
			}
    		downloadService = new oscar.Gui.Download.WFS(this.defaultOptions.operationUrl,params,{title:this.defaultOptions.title});
    		break;
    	case "WCS":
			var bounds = this.defaultOptions.bbox;
			var projection = new OpenLayers.Projection(this.defaultOptions.crs);
			var urn = oscar.Util.EpsgConversion.epsgToUrn(projection.projCode);
			var isGeographicCRS = oscar.Util.isGeographicCRS(projection);
			//do I need to transform the boundingbox
			if(projection.projCode != this.map.getProjectionObject().projCode) { //perform transformation
				bounds = bounds.clone().transform(this.map.getProjectionObject(),projection);
			}

			var localBBOX = bounds.toArray(isGeographicCRS);
			
			//get the requested fields / bands to build the range subset
			var fields = this.defaultOptions.field;
			var fieldsArray = new Array();
			for(f in fields) {
				var field = fields[f];
				var $input = $$(field); 
                var fieldName = encodeURI($input.val());
				var select = $$($input.data("selection"));
				var selectValue = select.val();

				if(select.val()!= null) {
					fieldsArray.push(fieldName + ":" + select.val());
				} else {
					fieldsArray.push(fieldName);
				}
			}
			
			var rngSubset="";
            if(fieldsArray.length > 1) {
                rngSubset = fieldsArray.join(";");
            } else {
                rngSubset = fieldsArray.join(" ");
            }
			
			var localparams = {
    			request:"GetCoverage",
    			store:this.defaultOptions.store,
    			GridBaseCRS:urn,
    			identifier:this.defaultOptions.id,
    			BoundingBox:localBBOX + ","+ urn,
    			format:this.defaultOptions.format,
				gridType:this.gridType
    		}
			
			if (fieldsArray.length > 0) {
				localparams.RangeSubset = rngSubset;
			}
			
			/*
			* If the urn value is the same as the gridBaseCRS value then include the grid origin
			*/
			if (urn == this.gridBaseCRS) {
				localparams.GridOrigin=this.gridOrigin.split(" ").join(",")
			} 
			
			//inject the new grid offset values.
			var resX = parseFloat(this.$xText.val());
			var resY = parseFloat(this.$yText.val());
			if(resY > 0) {
				resY*=-1;
			}			
			
			resX /= oscar.Util.getMetersConversionFactor(projection);
			resY /= oscar.Util.getMetersConversionFactor(projection);
			var offsetArray = [];
			if (isGeographicCRS) {
				offsetArray.push(resY);
				offsetArray.push(resX);
			} else {
				offsetArray.push(resX);
				offsetArray.push(resY);
			}
			
			if(this.gridType == "urn:ogc:def:method:WCS:1.1:2dGridIn2dCrs") {
				offsetArray.splice(1,0,0);
				offsetArray.splice(1,0,0);
			}
			localparams.GridOffsets = offsetArray.toString();
			
			OpenLayers.Util.extend(localparams,params);
    		var url = buildUrl(this.defaultOptions.operationUrl,localparams);

    	    downloadService = new oscar.Gui.Download.WCS(url,null,{title:this.defaultOptions.title});
    		break;	
    	}
    	if(downloadService) {
    		this.events.triggerEvent("serviceReady",downloadService);
    	}
    	
    },
    /**
     * Constant: CLASS_NAME
     */
	CLASS_NAME:"oscar.Gui.DownloadOptions"

});