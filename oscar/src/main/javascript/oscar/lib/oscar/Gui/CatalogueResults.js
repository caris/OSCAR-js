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
        this.buildLayout();
        var scope = this;
        setTimeout(function() {
            var x = $$(scope.div).layout({
                closable:false,
                resizable:false,
                center__showOverflow:true,
                onresize:function() {
                    scope.results.slimScroll({
                        height:"auto",
                        scrollTo:0
                    });
                }
            });
        },0);
    },
    buildLayout:function() {
        this.layout = {
            north:null,
            center:null
        }
        this.layout.north = $$("<div></div");
        this.layout.north.addClass("ui-layout-north");
        this.layout.center = $$("<div></div");
        this.layout.center.addClass("ui-layout-center");
        $$(this.div).append(this.layout.north);
        $$(this.div).append(this.layout.center);
        this.results = $$("<div></div>");
        this.layout.center.append(this.results);
        this.$searchInfo = $$("<div>&nbsp;</div>");
        this.$previous = $$("<button>Previous</button>");
        this.$next = $$("<button>Next</button>");
        var $results = $$(this.div);
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
        this.layout.north.append(this.$buttons);
        this.$buttons.css("visibility","hidden");
        
        
        
    },
    showResults:function(results) {
        this.layout.center.scrollTop();
        this.results.empty();
        var layer = map.getLayersByName("results")[0].removeAllFeatures();
        this.features = [];
        var records = results.records;
        this.showSearchInfo(results.SearchResults);
        if(records.length == 0) {
            this.$searchInfo.html(oscar.i18n("map.information.no.records.found"));
            return;
        }
        var features = [];
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

                var features = oscar.Util.boundsToFeatures(record.bounds,projection,this.map);
				var clones = []
				for(var f in features) {
					var feat = features[f].clone();
					feat.style= {
						strokeColor:"#004580",
						fillOpacity:0.0,
						strokeWidth:2
					};
					
					clones.push(feat);
				}
				record.features=clones;
				$$.merge(this.features,features);
            }
            this.addRecordToResultList(record);
        }
        this.renderFeaturesToMap();
        $$(this.div).layout().resizeAll();
        this.results.slimScroll({
            height:"auto",
            scrollTo:0
        });

    },
    showSearchInfo:function(info) {
        var nextDisabled=(info.nextRecord > info.numberOfRecordsMatched || info.nextRecord == 0)?true:false;
        if(nextDisabled) 
            this.$next.button("disable");
        else 
            this.$next.button("enable");

        var previousDisabled=(info.nextRecord - info.numberOfRecordsReturned -1 <=0)?true:false;
        if(previousDisabled) 
            this.$previous.button("disable");
        else 
            this.$previous.button("enable");
        
        this.$buttons.css("visibility","visible");

        var str = "";
        var start = (info.nextRecord !=0)? info.nextRecord - info.numberOfRecordsReturned:1;
        str+=start;
        to = start + (info.numberOfRecordsReturned-1);
        if(to > info.numberOfRecordsMatched) to = info.numberOfRecordsMatched;
        str+= " - " + to;
        str+= " of " + info.numberOfRecordsMatched;
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
    renderFeaturesToMap:function() {
		var layer = map.getLayersByName("results")[0];
        if(this.features.length == 0) return;
		
		//extract the geometries from the features
		var geometryArray=oscar.Util.extractGeometriesFromFeatures(this.features);
		//attempt to combine geometries
		geometryArray = oscar.Util.combineGeometries(geometryArray);
		//flip the array and go in reverse 
		geometryArray = oscar.Util.combineGeometries(geometryArray.reverse());

		/**
		Create a new set of features from combined geometries to 
		display on the map.
		**/
		for(var i = 0;i<geometryArray.length;i++) {
			var feature = new OpenLayers.Feature.Vector(geometryArray[i]);
			layer.addFeatures(feature);
		}
		map.zoomToExtent(layer.getDataExtent());

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
		
		/*
			Display the link data here. We should create wizards to handle
			the different protocol cases.
		*/
		$result.append(this.createLinksPanel(record));
		
        this.attachMouseEvents($result,record);
        

    },
	createLinksPanel:function(record) {
		var $div = $$("<div></div>");
		if(record.links == null ||
			record.links.length == 0) return $div;
		for(var i=0;i<record.links.length;i++) {
			var link = record.links[i];
			var plugin = oscar.getPluginManager().getPluginFor(link.protocol);
			if(plugin) {
				var icon = plugin.getIcon() || "ui-icon-disk";
				plugin.setOptions({link:link,map:this.map,record:record});
				$button = $$("<button></button").html(link.protocol);
				$button.data("plugin",plugin);
				$button.button({
					icons: {
						primary:icon
					},
					text:false
				}).click(function() {
					$$(this).data("plugin").play();
				});
				$div.append($button);
			}
		}
		return $div;
	},
    attachMouseEvents:function($resultDiv,record) {
        $resultDiv.mouseenter(function(e) {
        if(record.features) {
            var layer = map.getLayersByName("results")[0];
            layer.addFeatures(record.features);
        }
        var $this = $$(this);
        $this.switchClass("","over",100);
        //$this.addClass("over");
        $this.children().each(function() {
            var $this = $$(this);
            $this.addClass("over");
            });
        });
        
        $resultDiv.mouseleave(function(e) {
            if(record.features) {
                var layer = map.getLayersByName("results")[0];
                layer.removeFeatures(record.features);
            }
            var $this = $$(this);
            $this.switchClass("over","",100);
            $this.children().each(function() {
                var $this = $$(this);
                $this.removeClass("over");
            });
        });
        
        $resultDiv.click(function(e) {
           var $this = $$(this);
           $this.parent().children().each(function() {
            var $local = $$(this);
            $local.removeClass("active");
           });
           
           $this.addClass("active");
           if(record.features) {
				var bounds = record.features[0].geometry.getBounds();
				for(var i = 1;i<record.features.length;i++) {
					bounds.extend(record.features[i].geometry.getBounds());
				}
				map.zoomToExtent(bounds);
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