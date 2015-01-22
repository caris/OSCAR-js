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
 * Class: oscar.Handler.CSW
 * 
 * Executes CSW requests 
 * 
 * Inherits from:
 *  - <oscar.Handler>
 * 
 */

oscar.Handler.CSW = new oscar.BaseClass(oscar.Handler,{
	TEXT:1,
	SPATIAL:2,
    DEFAULT_SEARCH_PARAMETERS: {
        request:"GetRecords",
        service:"csw",
        version:"2.0.2",
        resultType:"results",
        outputSchema:"http://www.opengis.net/cat/csw/2.0.2",
        maxRecords:10,
        startPosition:1
    },
    EVENT_TYPES:["beforeSearch","afterSearch","success","failure"],
    catalogue:null,
    initialize:function(catalogueService,options) {
		if($$.isArray(catalogueService)) {
			this.catalogue = catalogueService[0];
		} else {
			this.catalogue = catalogueService;
		}
        this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES,
        false, {
            includeXY :true
        });
		if(this.catalogue.isSetDefaultOutputSchema()) {
			this.DEFAULT_SEARCH_PARAMETERS.outputSchema = this.catalogue.getDefaultOutputSchema();
		}
		
        if(options) {
            if(options.DEFAULT_SEARCH_PARAMETERS) {
                OpenLayers.Util.extend(this.DEFAULT_SEARCH_PARAMETERS,options.DEFAULT_SEARCH_PARAMETERS);
            }
        }
    },
    setMap:function(map) {
        this.map = map;
    },
    search:function(query,parameters) {
        this.events.triggerEvent("beforeSearch");
        if(parameters) {
            this.parameters = parameters;
        } else {
        this.parameters = {};
        OpenLayers.Util.extend(this.parameters,this.DEFAULT_SEARCH_PARAMETERS);
        }
        this.query = query;
        this.createFilter(this.parameters)
        var formatter = new OpenLayers.Format.CSWGetRecords();
        var scope = this;
        OpenLayers.Request.POST({
            url: this.catalogue.getUrl(oscar.ogc.CatalogueService.prototype.GETRECORDS, "POST"),
            success:this.success,
            failure:this.failure,
            data:formatter.write(this.parameters),
            scope:this
        });
    },
    success:function(resp) {
        this.events.triggerEvent("afterSearch");
        var formatter = new OpenLayers.Format.CSWGetRecords();
        this.results = formatter.read(resp.responseXML);
        this.results.SearchParameters = this.parameters;
        this.events.triggerEvent("success",this.results);
    },
    failure:function() {
        this.events.triggerEvent("afterSearch");
    },
    createFilter:function(parameters) {
		
		var csw_query = {
			"ElementSetName":{
				"value":"full"
			}
		}
		var filters = [];
		
		if(this.query.q.length > 0) {
			var text_filter = new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.LIKE,
				property:"csw:AnyText",
				value:this.query.q
			});
			filters.push(text_filter);
		}
		
		if(this.query.spatial) {
			var spatial_filter = new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Spatial.BBOX,
				property:"ows:BoundingBox",
				value:this.query.spatial,
				projection:this.map.getProjection()
			});
			filters.push(spatial_filter);
		}
		
		var filter = null;
		if(filters.length >1) {
			filter = new OpenLayers.Filter.Logical({
				type:OpenLayers.Filter.Logical.AND,
				filters:filters
			});

		} else if(filters.length == 1) {
			filter = filters[0];
		}
		
		if(filter) {
			csw_query["Constraint"] = {
				"version":"1.1.0",
				"Filter":filter
			}
		}
		
		parameters.Query = csw_query;
    },
    next:function() {
        var info = this.results.SearchResults;
        var parameters = {};
        OpenLayers.Util.extend(parameters,this.parameters);
        parameters.startPosition = info.nextRecord;
        var newStartPosition = info.nextRecord;
        if(newStartPosition > info.numberOfRecordsMatched) {
         return;
        }
        parameters.startPosition = newStartPosition;
        
        this.search(this.query,parameters);
    },
    previous:function() {
        var info = this.results.SearchResults;
		var matched = info.numberOfRecordsMatched;
		var returned = info.numberOfRecordsReturned;
		var next = info.nextRecord;
		
		var parameters = {};
        OpenLayers.Util.extend(parameters,this.parameters);
		if(next > 0) {
			parameters.startPosition = next - returned - this.DEFAULT_SEARCH_PARAMETERS.maxRecords;
		} else {
			parameters.startPosition = matched - returned +1 - this.DEFAULT_SEARCH_PARAMETERS.maxRecords;
		}
		if(parameters.startPosition < 0) parameters.startPosition = 1;
        this.search(this.query,parameters);
    },
    CLASS_NAME:"oscar.Handler.CSW"
});