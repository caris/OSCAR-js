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

		var id = oscar.Util.Metadata.getFeatureTypesById(this.capabilities.capabilities,this.feature.div.data("id"));

		this.makeFormatList(div,outputFormats);
		this.makeCRSList(div,id.srss || [id.srs]);
		var opURL = null
		try {
			opUrl = GetFeatureOp.dcp.http.get;
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
			crsReferences.push(oscar.Util.CoordinateReferences.getReference(crss[i]));
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
            	    if(crsReferences[i].code.toLowerCase().contains(term.toLowerCase())) {
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
		}).data("autocomplete")._renderItem=function(ul,item) {
	        var li = document.createElement("li");
            return oscar.jQuery(li).data( "item.autocomplete", item )
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
	 * Method: makeFieldList
	 * 
	 * Creates a button to display a list to select fields for extraction from 
	 * a Web Coverage Service.
	 */
	makeFieldList:function(div,fields) {
		var scope = this;
		var fieldDiv = document.createElement("div");
		
        $$(fieldDiv).css({position:'relative','margin-top':'5px'});
		div.appendChild(fieldDiv);
		var arr = [];
		for(var i in fields) {
			arr.push(fields[i].identifier);
		}
		
		$$(fieldDiv).append($$("<label></label>").html(oscar.i18n("Fields") +": ").addClass("heading"));
		var fieldAdjustment = document.createElement("a");
		fieldAdjustment.innerHTML = oscar.i18n("Fields");
		fieldDiv.appendChild(fieldAdjustment);
		var d = $$("<div></div>");
		$$(d).addClass("ui-fields");
		$$(d).hide();
		for(var i=0;i<arr.length;i++) {
			var fieldItem = $$("<div>");
			var input = $$("<input type='checkbox'>");
			if(i==0) {
				input.attr("checked",true);
			}
			var lbl = $$("<label>");
			lbl.text(arr[i]);
			$$(fieldItem).append(input);
			$$(fieldItem).append(lbl);
			$$(d).append(fieldItem);
		}
		
		
		
		
		oscar.jQuery(d).insertAfter(fieldAdjustment);
		oscar.jQuery(fieldAdjustment).button({
        	icons: {
        		primary: "ui-icon-triangle-1-s"
        	},
        	text: false
        }).click(function() {
        	oscar.jQuery(d).fadeToggle("slow");
    		
        });
		
		
        this.defaultOptions.field = arr[0]
		
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
				var fields = coverageDescription.coverageDescription.range.fields;
				supportedCRSs = coverageDescription.coverageDescription.supportedCRS;
				supportedFormats = coverageDescription.coverageDescription.supportedFormats;
				this.makeFormatList(div,supportedFormats);
				this.makeCRSList(div,supportedCRSs);
				this.makeFieldList(div,fields);
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
    		var urn = oscar.Util.EpsgConversion.epsgToUrn("ESPG:4326");
    		var bounds = this.defaultOptions.bbox;
    		var localBbox = null;
			var sUrn = oscar.Util.EpsgConversion.epsgToUrn("EPSG:4326");
			if(this.map.getProjectionObject().projCode != "EPSG:4326") {
				var sProj = this.map.getProjectionObject();
				var dProj = new OpenLayers.Projection("EPSG:4326");
				localBbox=bounds.transform(sProj,dProj).toArray();
				sProj = null;
				dProj = null;
			} else {
				localBbox = bounds.toArray();
			}
			
			var urn = this.defaultOptions.crs;
			if (urn.indexOf("::") == -1) {
				urn = oscar.Util.EpsgConversion.epsgToUrn(urn);
			}
    		var localparams = {
    			request:"GetCoverage",
    			store:this.defaultOptions.store,
    			GridBaseCRS:urn,
    			identifier:this.defaultOptions.id,
    			RangeSubset:"contents",
    			BoundingBox:localBbox + ","+ sUrn,
    			format:this.defaultOptions.format,
    			RangeSubset:this.defaultOptions.field
    		}
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