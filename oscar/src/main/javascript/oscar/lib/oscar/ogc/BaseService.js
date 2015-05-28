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
oscar.ogc.BaseService = new oscar.BaseClass({
    serviceEntry : null,
    autoload : true,
    defaultVersion : "2.0.2",
    capabilities : null,
    initialize : function(serviceEntry, options) {
        this.serviceEntry = serviceEntry;
        OpenLayers.Util.extend(this, options);
        if (this.autoload) {
            this.loadCapabilities();
        }
    },
    /**
     * Method: loadCapabilities
     * 
     * Loads the capabilities of the service.
     */
    loadCapabilities : function() {
        var params = {
            request : "GetCapabilities",
            service : "CSW",
            version : (this.version) ? this.version : this.defaultVersion
        }
        OpenLayers.Request.GET({
            url : this.serviceEntry.url,
            async : false,
            params : params,
            success : function(r) {
                var cswFormat = new oscar.Format.CSW();
                this.capabilities = cswFormat.read(r.responseXML);
            },
            failure : function() {
                console.log("Unable to retreive capabilities from " + this.serviceEntry.url);
            },
            scope : this
        });
    },
    /**
     * APIMethod: getUrl
     * 
     * Parameters:
     * 
     * operation The operation. method The method to get the url for. GET, POST
     * currently supported.
     * 
     * 
     * 
     */
    getUrl : function(operation, method) {
        method = method.toLowerCase();
        var url = "";
        var op = this.capabilities.operationsMetadata[operation];
        switch (method) {
        case "get":
            url = op.dcp.http.get;
            break;
        case "post":
            url = op.dcp.http.post;
            break;
        default:
        }
        return url;
    },
    /**
     * CLASS_NAME
     */
    CLASS_NAME : "oscar.ogc.BaseService"
});