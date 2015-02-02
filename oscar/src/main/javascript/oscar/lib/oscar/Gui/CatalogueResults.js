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
 * Class: oscar.Gui.CatalogueResults 
 * 
 * Inherits from:  
 * - <OpenLayers.Gui>
 * 
 */

oscar.Gui.CatalogueResults = new oscar.BaseClass(oscar.Gui,{
    EVENT_TYPES:["next","previous"],
    features:[],
    map:null,
	catalogueServices:null,
	buttons:[],
    initialize:function(options) {
        oscar.Gui.prototype.initialize.apply(this,[options]);
        this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES,
            false, {
            includeXY :true
        });
        this.appendTo(this.parent);
    },
    draw:function() {
        oscar.Gui.prototype.draw.apply(this);
        this._buildLayout();
        var scope = this;
        setTimeout(function() {
            scope.layout = $$(scope.div).layout({
				west:{
					initHidden:true,
					slidable:true,
					closable:false,
					resizable:false,
					hideTogglerOnSlide:true,
					allowOverflow:false
				}
			});
			scope.layout.allowOverflow();
        },0);
    },
	toggleOptionsMode:function(optionsContainer) { 
		if(this.layout.state.west.isClosed) {
			this.layout.sizePane("west","100%");
			this.layout.show("west");
			this.layout.west.pane.append(optionsContainer);
		} else {
			this.layout.hide("west");
			this.layout.west.pane.empty();
		}
	},
	addOption:function(jDiv) {
		this.optionsContainer.center.pane.append(jDiv);
	},
    _buildLayout:function() {
		var build_ele = function (name,classArray) {
			var element = $$("<"+name+"></"+name+">");
			if(classArray) {
				for(var i=0;i<classArray.length;i++) {
					element.addClass(classArray[i]);
				}
			}
			return element;
		}
		
		
		/**
		* This panel will be used when entering an "alternate" mode. To
		* provide additional functionality for the calling protocol.
		**/
		var mode_panel = build_ele("div",["ui-layout-west"]);
		mode_panel.slimScroll();
		/**
		* This panel is used to display initial results from the query
		**/
		var results_panel = build_ele("div",["ui-layout-center"]);
		
		
		/**
		* These panels are used to facilitate in the display of the query results
		**/
		var pagination_panel = build_ele("div",["ui-layout-north"]);
		var results_list_panel = build_ele("div",["ui-layout-center"]);

		var scope = this;
		$$(this.div).append(mode_panel);
		$$(this.div).append(results_panel);

		
		results_panel.append(pagination_panel);
		results_panel.append(results_list_panel);
		results_panel.layout({
			resizable:false,
			north: {
				closable:false,
			},
			center: {
			},
			center__showOverflow:true,
		});
		
		this.$searchInfo = $$("<div>&nbsp;</div>");
        this.$previous = $$("<button>Previous</button>");
        this.$next = $$("<button>Next</button>");
		
		        var scope = this;
        this.$buttons = $$("<div></div>");
        this.$buttons.css({
            "position":"relative"
        });
        this.$buttons.append(this.$searchInfo);
        this.$next.button({
            icons : {
                primary : "ui-icon-triangle-1-e"
            },
            text : false,
            disabled:true
        }).click(function() {
            scope.events.triggerEvent("next");
        });
        this.$next.css({
            "position":"absolute",
            "right":"0px"
        });
        
        this.$previous.button({
            icons : {
                primary : "ui-icon-triangle-1-w"
            },
            text : false,
            disabled:true
        }).click(function() {
            scope.events.triggerEvent("previous");
        }); 

        this.$previous.css({
            "position":"relative",
            "left":"0px"
        });
        
        this.$searchInfo.css({
            "position":"absolute",
            "left":"35px",
            "top":"2px",
            "width":"162px",
            "height":"25px",
            "text-align":"center"
        });
        this.$searchInfo.addClass("searchResultInformation");
        this.$buttons.append(this.$next);
        this.$buttons.append(this.$previous);
        pagination_panel.append(this.$buttons);
        this.$buttons.css("visibility","hidden");
		
		this.results = $$("<div></div>");
        results_list_panel.append(this.results);
    },
	clearResults:function() {
		this.results.empty();
		this.$searchInfo.empty();
		var feat_layer = map.getLayersByName("results")[0];
		if(feat_layer) {		
			feat_layer.removeAllFeatures();
		}
	},
    showResults:function(results) {
        this.clearResults();
        var records = results.records;
        this.showSearchInfo(results.SearchResults);
        if(records.length == 0) {
            this.$searchInfo.html(oscar.i18n("map.information.no.records.found"));
            return;
        }
        var features_array = [];
        for(var r in  records) {
            var record = records[r];
            if(record.bounds) {
				var recordProjection = record.projection || "EPSG:4326";
				var crs = oscar.Util.CoordinateReferences.getReference(recordProjection);
				
				var projection = new OpenLayers.Projection(crs.code);
				var bbox = record.bounds.toArray(oscar.Util.isGeographicCRS(projection))

				if(oscar.Util.isGeographicCRS(projection)) {
					record.bounds = OpenLayers.Bounds.fromArray(bbox);
				}

				projection = new OpenLayers.Projection("EPSG:4326");

                var feature = oscar.Util.boundsToFeature(record.bounds,projection,this.map);
				record.feature = feature.clone();
				features_array.push(record.feature);
            }
            this.addRecordToResultList(record);
        }
		
		features_array.sort(function(feature_a,feature_b) {
			if(feature_a.geometry.getArea() < feature_b.geometry.getArea()) {
				return 1;
			} else if(feature_a.geometry.getArea() > feature_b.geometry.getArea()) {
				return -1;
			} else {
				return 0;
			}
		});
		
		this.renderFeaturesToMap(features_array);
        $$(this.div).layout().resizeAll();
        this.results.slimScroll({
            height:"100%",
            scrollTo:0
        });
		$$(window).resize($$.proxy(function(){
			this.results.slimScroll({
            height:"100%",
            scrollTo:0
        });
		},this));
    },
    showSearchInfo:function(info) {
		var matched = info.numberOfRecordsMatched;
		var returned = info.numberOfRecordsReturned;
		var next = info.nextRecord;
        this.$buttons.css("visibility","visible");

        var str = "";
		 var start = (info.nextRecord !=0)? info.nextRecord - info.numberOfRecordsReturned:1;
		if(next > 0) {
			start = next - returned;
		} else {
			start = matched - returned +1;
		}
        str+=start;
        to = start + returned - 1;
        if(to > info.numberOfRecordsMatched) {
			to = info.numberOfRecordsMatched
		};
        str+= " - " + to;
        str+= " of " + info.numberOfRecordsMatched;
		
		if(to != matched) {
			this.$next.button("enable");
		} else {
			this.$next.button("disable");
		}

        if(start != 1) {
            this.$previous.button("enable");
		}
        else {
            this.$previous.button("disable");
		}
		
        this.$searchInfo.html(str);
    },
    enablePagination:function(info) {
        
    },
    fadeInUI:function() {
    $$(".searching").show();
        $$(".searching").fadeOut();
        $$(this.div).fadeTo("fast",1);
        
    },

    fadeOutUI:function() {
        $$(".searching").fadeIn();
        $$(this.div).fadeTo("fast",0.2);
        
    },
    renderFeaturesToMap:function(features) {
		var feat_layer = map.getLayersByName("results")[0];
		
		if(!feat_layer) {
			var styleMap = new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
					fillColor:"#0f0f0f",
					fillOpacity : 0.01,
					strokeWidth : 0,
					strokeColor : "#0f0f0f",
					strokeOpacity : 0.3
                }),
                "select": new OpenLayers.Style({
					strokeColor:"#004580",
					fillColor:"#0f0f0f",
					fillOpacity : 0.01,
					fillOpacity : 0.01,
					strokeOpacity : 1,
					strokeWidth:2
                })
            });
			
			feat_layer = new OpenLayers.Layer.Vector("results", {
				styleMap : styleMap,
				renderers: ['Canvas', 'VML'],
				wrapDateLine:true,
				projection:map.getProjectionObject()
			});
			var scope = this;
			feat_layer.events.on({
				"featureselected":function(event) {
					var feature = event.feature;
					if(feature.record_div) {
						scope.overRecord($$(feature.record_div).data("record"));
					}
				},
				
				"featureunselected":function(event) {
					var feature = event.feature;
					if(feature.record_div) {
						scope.blurRecord($$(feature.record_div).data("record"));
					}
				}
			});
			map.addLayer(feat_layer);
			var scope = this;
			var select = new OpenLayers.Control.SelectFeature(
				feat_layer,
				{
					click:true,
					hover:true,
					callbacks:{
						"click":$$.proxy(function(feature){
							if(feature.record_div) {
								this.focusRecord($$(feature.record_div).data("record"));
							}
						},scope)
					}
				});
			map.addControl(select);
			select.activate();
			select.handlers.feature.stopDown = false;
		}
		feat_layer.addFeatures(features);
		map.zoomToExtent(feat_layer.getDataExtent());
    },
    addRecordToResultList:function(record) {
        var $result = $$("<div class='result'></div");
        $result.css("position","relative");
        var $title = $$("<div class='title'></div>");
        var $abs = $$("<div class='abs'></div>");
        $result.append($title);
        $result.append($abs);
        var title = cswget.title(record) || cswget.identifier(record);
        var abs = cswget.abs(record);
        $title.html(title);
        $title.attr("title",title);
        $abs.html(abs);
        $abs.attr("title",abs);
        this.results.append($result);
        $result.data("record",record);
		record.container = $result;
		if(record.feature) {
			if(!record.feature.record_div) {
				record.feature.record_div = $result;
			}
		}
		/*
			Display the link data here. We should create wizards to handle
			the different protocol cases.
		*/
		$result.append(this.createLinksPanel(record));
		
        this.attachMouseEvents($result,record);
        

    },
	createLinksPanel:function(record) {
		var $div = $$("<div></div>");
		
		//here is where we are going to add the default protocol for GetRecordById
		
		if(record.links == null ||
			record.links.length == 0) {
			record.links = [];
		}
		
		record.links.unshift({
			protocol:oscar.Util.Plugin.Download.GetRecordByIdView.prototype.pluginType,
			url:this.catalogueServices[0].getUrl(oscar.ogc.CatalogueService.prototype.GETRECORDBYID,"POST")
		});
		
		record.links.unshift({
			protocol:oscar.Util.Plugin.Download.GetRecordById.prototype.pluginType,
			url:this.catalogueServices[0].getUrl(oscar.ogc.CatalogueService.prototype.GETRECORDBYID,"POST")
		});
		
		for(var i=0;i<record.links.length;i++) {
			var link = record.links[i];
			var plugin = oscar.getPluginManager().getPluginFor(link.protocol);
			if(plugin) {
				plugin.setOptions({link:link,map:this.map,record:record,catalogueService:this.catalogueServices[0],parent:this});
				plugin.drawTo($div);
			}
		}
		return $div;
	},
	overRecord:function(record) {
		record.container.switchClass("","over",100);
		record.container.children().each(function() {
			var $this = $$(this);
			$this.addClass("over");
		});
	},
	blurRecord:function(record) {
		record.container.switchClass("over","",100),
		record.container.children().each(function() {
			var $this = $$(this);
			$this.removeClass("over");
		});

	},
	focusRecord:function(record) {
		var $this = record.container;
           $this.parent().children().each(function() {
            var $local = $$(this);
            $local.removeClass("active");
           });
           
           $this.addClass("active");
           if(record.feature) {
				map.zoomToExtent(record.feature.geometry.getBounds());
           }
	},
    attachMouseEvents:function($resultDiv,record) {
		var scope = this;
		$resultDiv.mouseenter(function(e) {
			if(record.feature) {
				var ctrl = scope.map.getControlsByClass(OpenLayers.Control.SelectFeature.prototype.CLASS_NAME)[0];
				ctrl.select(record.feature);
			}
        });
        
        $resultDiv.mouseleave(function(e) {
            if(record.feature) {
				var ctrl = scope.map.getControlsByClass(OpenLayers.Control.SelectFeature.prototype.CLASS_NAME)[0];
				ctrl.unselect(record.feature);

            }
        });
        var scope = this;
        $resultDiv.click(function(e) {
			scope.focusRecord(record);
        });
		
		this.map.events.on({
			"mouseout":function(evt) {
				try {
					var ctrl = map.getControlsByClass(OpenLayers.Control.SelectFeature.prototype.CLASS_NAME)[0];
					ctrl.unselectAll();
				} catch (err) {
					oscar.debug.error(err);       			
				}
			}
		});		
    
    },
    CLASS_NAME:"oscar.Gui.CatalogueResults"
});

var cswget = {
    title:function(r) {
        if(r.title) {
            try {
                if($$.isArray(r.title)) {
                    return r.title[0].value;
                } else {
                    return r.title;
                }
            
            } catch (err) {
                return null;
            }
        }
    },
	abs:function(r) {
        if(r["abstract"]) {
            try {
                if($$.isArray(r["abstract"])) {
					if(r["abstract"][0].value) 
						return r["abstract"][0].value;
					else 
						return r["abstract"][0];
                } else {
                    return r["abstract"];
                }
            } catch (err) {
                return null;
            }
        }
    },
    projection:function(r) {
    
    },
    bounds:function(r) {
    
    },
    identifier:function(r) {
        if(r.identifier) {
            try {
                return r.identifier[0].value;
            } catch(err) {
                return null;
            }
        }
    
    }
}