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
    DEFAULT_SEARCH_PARAMETERS: {
        request:"GetRecords",
        service:"csw",
        version:"2.0.2",
        resultType:"results",
        outputSchema:"http://www.opengis.net/cat/csw/2.0.2",
        maxRecords:110,
        startPosition:1
    },
    EVENT_TYPES:["beforeSearch","afterSearch","success","failure"],
    catalogue:null,
    initialize:function(catalogueService,options) {
        this.catalogue = catalogueService;
        this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES,
        false, {
            includeXY :true
        });
        
		if(this.catalogue.attributes && this.catalogue.attributes.outputSchema) {
			this.DEFAULT_SEARCH_PARAMETERS.outputSchema = this.catalogue.attributes.outputSchema;
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
            url:this.catalogue.url,
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
        filter = new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.LIKE,
            property:"csw:AnyText",
            value:this.query.q
        });
        parameters.Query = {
                ElementSetName : {
                    value : "full"
                },
                Constraint : {
                    version : "1.1.0",
                    Filter : filter
                }
            }
        if(this.query.q.length ==0) {
            delete parameters.Query.Constraint;
        }
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
        var parameters = {};
        OpenLayers.Util.extend(parameters,this.parameters);
        
        var newStartPosition = info.nextRecord - (this.DEFAULT_SEARCH_PARAMETERS.maxRecords*2)
        if(newStartPosition < 1) {
         newStartPosition = 1;
        }
        parameters.startPosition = newStartPosition;
        
        this.search(this.query,parameters);
    },
    CLASS_NAME:"oscar.Handler.CSW"
});