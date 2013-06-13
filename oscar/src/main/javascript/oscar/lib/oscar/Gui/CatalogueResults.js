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
    },
    showResults:function(results) {
        $$(this.div).empty();
        $$(this.div).scrollTop(0);
        var layer = map.getLayersByName("results")[0].removeAllFeatures();
        this.features = [];
        var records = results.records;
        for(var r in  records) {
            var record = records[r];
            var feature = this.getFeatureFromRecord(record);
            
            record.feature = feature.clone();
            
            if(feature.geometry.getArea() > 0) {
                this.features.push(feature);
            }
            this.addRecordToResultList(record);
        }
        this.renderFeaturesToMap();
    },
    showSearchInfo:function(info) {
        var $div = $$(this.div);
        var $infoDiv = $$("<div></div");
        $div.append($infoDiv);
    },
    enablePagination:function(info) {
        var nextRecord = info.nextRecord;
        var $previous = $$("<button>Previous</button>");
        var $next = $$("<button>Next</button>");
        var $results = $$(this.div);
        $results.append($previous);
        $results.append($next);
        var scope = this;
        
        var nextDisabled=(info.nextRecord > info.numberOfRecordsMatched)?true:false;
        $next.button({
            icons : {
                primary : "ui-icon-triangle-1-e"
            },
            text : false,
            disabled:nextDisabled
        }).click(function() {
            scope.events.triggerEvent("next");
        });
        $next.css({"float":"right"});
        
        var previousDisabled=(info.nextRecord - info.numberOfRecordsReturned -1 <=0)?true:false;
        $previous.button({
            icons : {
                primary : "ui-icon-triangle-1-w"
            },
            text : false,
            disabled:previousDisabled
        }).click(function() {
            scope.events.triggerEvent("previous");
        });
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
        var newGeoms = [];
        var geomArray = []
        for(var f in this.features) {
            geomArray.push(this.features[f].geometry);
        }

        for(var f in this.features) {
            var feature = this.features[f];
            feature.style= {
                fillColor:"#0a0a0a",
                fillOpacity:0.3,
                strokeWidth:2
            };
            
            if(!oscar.Util.mergeToExistingGeometry(newGeoms,feature.geometry)) {
                newGeoms.push(feature.geometry);
            }
        }
        var masterFeature = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.MultiPolygon(newGeoms),
            {name:"merged"}
        );

        var layer = map.getLayersByName("results")[0];
        layer.addFeatures(masterFeature);
        map.zoomToExtent(masterFeature.geometry.getBounds());        
    
    },
    addRecordToResultList:function(record) {
        var $results = $$(this.div);
        var $result = $$("<div class='result'></div");
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
        $results.append($result);
        $result.data("record",record);
        
        this.attachMouseEvents($result,record);
        

    },
    attachMouseEvents:function($resultDiv,record) {
        $resultDiv.mouseenter(function(e) {
        var layer = map.getLayersByName("results")[0];
        layer.addFeatures(record.feature);

        var $this = $$(this);
        $this.addClass("over");
        $this.children().each(function() {
            var $this = $$(this);
            $this.addClass("over");
            });
        });
        
        $resultDiv.mouseleave(function(e) {
            var layer = map.getLayersByName("results")[0];
            layer.removeFeatures(record.feature);

            var $this = $$(this);
            $this.removeClass("over");
            $this.children().each(function() {
                var $this = $$(this);
                $this.removeClass("over");
            });
        });
        
        $resultDiv.click(function(e) {
           map.zoomToExtent(record.feature.geometry.getBounds());
        });
    
    },
    getFeatureFromRecord:function(record) {
        var proj = record.projection || "EPSG:4326";
        var crs = oscar.Util.CoordinateReferences.getReference(proj);
        
        var source = new OpenLayers.Projection(crs.code);
        var destination = new OpenLayers.Projection("EPSG:900913")
        var bounds = record.bounds.clone();
        var polygon = bounds.toGeometry();
        if(map.getProjectionObject().getCode() != source.getCode()) { //transform it
            polygon.transform(source,destination);
        }
        
        var feature = new OpenLayers.Feature.Vector(polygon,{"name":"temp"});
        feature.style= {
            strokeColor:"#004580",
            fillOpacity:0.0,
            strokeWidth:2
        };
        return feature;
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
                    return r["abstract"][0].value;
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