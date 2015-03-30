/*
 * CARIS oscar - Open Spatial Component ARchitecture
 * 
 * Copyright 2014 CARIS <http://www.caris.com>
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
/**
 * Class: oscar.Handler.CSW
 * 
 * Executes CSW requests
 * 
 * Inherits from: - <oscar.Handler>
 * 
 */

oscar.Handler.CSW = new oscar.BaseClass(oscar.Handler, {
    DEFAULT_SEARCH_PARAMETERS : {
        request : "GetRecords",
        service : "csw",
        version : "2.0.2",
        resultType : "results",
        outputSchema : "http://www.opengis.net/cat/csw/2.0.2",
        maxRecords : 10,
        startPosition : 1
    },
    EVENT_TYPES : [ "beforeSearch", "afterSearch", "advancedSearch", "displayfilter", "success", "failure" ],
    catalogue : null,
    initialize : function(catalogueService, options) {
        if ($$.isArray(catalogueService)) {
            this.catalogue = catalogueService[0];
        } else {
            this.catalogue = catalogueService;
        }
        this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES, false, {
            includeXY : true
        });
        if (this.catalogue.isSetDefaultOutputSchema()) {
            this.DEFAULT_SEARCH_PARAMETERS.outputSchema = this.catalogue.getDefaultOutputSchema();
        }
        
        if (options) {
            if (options.DEFAULT_SEARCH_PARAMETERS) {
                OpenLayers.Util.extend(this.DEFAULT_SEARCH_PARAMETERS, options.DEFAULT_SEARCH_PARAMETERS);
            }
        }
    },
    setMap : function(map) {
        this.map = map;
    },
    search : function(query) {
        this.parameters = OpenLayers.Util.extend({}, this.DEFAULT_SEARCH_PARAMETERS);

        var csw_query = {
            "ElementSetName" : {
                "value" : "full"
            }
        }

        var filter = filter = query.toFilter();;
        if (filter) {
            csw_query["Constraint"] = {
                "version" : "1.1.0",
                "Filter" : filter
            }
        }
        
        this.parameters.Query = csw_query;
        this.createRequest();
    },
    createRequest : function() {
        this.events.triggerEvent("beforeSearch");
        var formatter = new OpenLayers.Format.CSWGetRecords();
        var data = formatter.write(this.parameters);
        OpenLayers.Request.POST({
            url : this.catalogue.getUrl(oscar.ogc.CatalogueService.prototype.GETRECORDS, "POST"),
            success : this.success,
            failure : this.failure,
            data : data,
            scope : this
        });
    },
    success : function(resp) {
        this.events.triggerEvent("afterSearch");
        var formatter = new OpenLayers.Format.CSWGetRecords();
        this.results = formatter.read(resp.responseXML);
        this.results.SearchParameters = this.parameters;
        this.events.triggerEvent("success", this.results);
    },
    failure : function() {
        this.events.triggerEvent("failure");
    },
    next : function() {
        var info = this.results.SearchResults;
        this.parameters.startPosition = info.nextRecord;
        var newStartPosition = info.nextRecord;
        if (newStartPosition > info.numberOfRecordsMatched) {
            return;
        }
        this.parameters.startPosition = newStartPosition;
        this.createRequest();
    },
    previous : function() {
        var info = this.results.SearchResults;
        var matched = info.numberOfRecordsMatched;
        var returned = info.numberOfRecordsReturned;
        var next = info.nextRecord;
        
        if (next > 0) {
            this.parameters.startPosition = next - returned - this.DEFAULT_SEARCH_PARAMETERS.maxRecords;
        } else {
            this.parameters.startPosition = matched - returned + 1 - this.DEFAULT_SEARCH_PARAMETERS.maxRecords;
        }
        if (this.parameters.startPosition < 0)
            this.parameters.startPosition = 1;
        
        this.createRequest();
    },
    
    jumpTo : function(record) {
        this.parameters.startPosition = record;
        this.createRequest();
    },
    CLASS_NAME : "oscar.Handler.CSW"
});