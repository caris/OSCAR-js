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
 * Class: oscar.Control.DataExtractor
 * 
 * This control loads the capabilities documents for the extraction services and will
 * launch the DataDiscovery control when activated. 
 * 
 * 
 */

oscar.Control.DataExtractor = oscar.BaseClass(oscar.Control, {
	/**
	 * Property: type
	 * The type of the control
	 */
	type :OpenLayers.Control.TYPE_TOGGLE,
	/**
	 * Property: database
	 * {oscar.Util.Database} - contains the results of the capabilities documents
	 * for quick searching.
	 */
	database:null,
	/**
	 * Constructor: new oscar.Control.DataExtractor
	 */
	initialize:function(theme) {
        OpenLayers.Control.prototype.initialize.apply(this);
        this.theme = theme;
        this.database=new oscar.Util.Database();
        this.database.addTable("sources",["id","title","bbox","abstract","fk_capabilities","dataType"]);
        this.database.addTable("capabilities",["capabilities"]);
        this.extractionServices = this.theme.getExtractionService();
        for(var s in this.extractionServices) {
	        var service = this.extractionServices[s];
	        var proc = this["load_"+ service.serviceType.toLowerCase()];
	        if(proc) {
	            proc.apply(this,[service]);
	        } else {
	            
	        }
        }
	},
	/**
	 * Method: activate:
	 * Called when the control is activated
	 */
    activate : function() {
        oscar.Control.prototype.activate.apply(this);
        if(this.ctrl) {
            this.ctrl.activate();
        } else {
           this.ctrl = new oscar.Control.DataDiscovery(this.database)
           this.map.addControl(this.ctrl);
        }
    },
    /**
     * Method: deactivate
     * Called when the control is deactivated.
     */
    deactivate : function() {
    	if(this.ctrl) {
	    	this.ctrl.deactivate();
	    	this.ctrl =null;
    	}
        oscar.Control.prototype.deactivate.apply(this);
        
    },
    /**
     * Method: load_wcs
     * This method will load a wcs capabilities document and store the results
     * in the database.
     */
    load_wcs: function(service) {
	    var params = {
	    	    request:"GetCapabilities",
	    	    service:"WCS",
	    	    version:"1.1.0"
	    }
        var success= function(response) {
        	var reader = new oscar.Format.WCSCapabilities();
            var capabilities = reader.read(response.responseXML);
            var capIndex = this.database.addRecord("capabilities", {capabilities:capabilities});
            coverages = oscar.Util.Metadata.getCoverages(capabilities);
            for (var c in coverages) {
                var coverage = coverages[c];
                if(!oscar.Util.isFeatureInArray(coverage.identifier,service.identifiers)) continue;
                var bbox = this.getBoundingBox(coverage.wgs84BoundingBox,"EPSG:4326");
                var record = {
                	"id":coverage.identifier,
                	"title":coverage.title,
                	"abstract":coverage["abstract"],
                	"bbox":bbox,
                	"fk_capabilities":capIndex,
                	"dataType":"wcs"
                }
                var pk = this.database.addRecord("sources",record);
            }
        };
        this.wcsRequest = OpenLayers.Request.GET( {
            url :service.url,
            params:params,
            async:true,
            success :success,
            failure : this.requestFail,
            scope:this
        });
    },
    /**
     * Method: load_wfs
     * This method will load a wfs capabilities document and store the results
     * in the database.
     */    
    load_wfs: function(service) {
        var success= function(response) {
        	var reader = new oscar.Format.WFSCapabilities();
            var capabilities = reader.read(response.responseXML);
            var capIndex = this.database.addRecord("capabilities", {capabilities:capabilities});
            features = oscar.Util.Metadata.getFeatureTypes(capabilities);
            for (var f in features) {
                var feature = features[f];
                if(!oscar.Util.isFeatureInArray(feature.name,service.identifiers)) continue;
                /*
                 * if there is more than one srs then it is 1.1.0 or higher and the the
                 * wgs84boundingbox element is in EPSG:4326
                 */
                var srs = feature.srs || "EPSG:4326";
                var bbox = this.getBoundingBox(feature.wgs84BoundingBox,srs);
                var record = {
                    "id":feature.name,
                    "title":feature.title,
                    "abstract":feature["abstract"],
                    "bbox":bbox,
                    "fk_capabilities":capIndex,
                    "dataType":"wfs"
                }
                var pk = this.database.addRecord("sources",record);
            }
        };
        var params = {
			"service":service.serviceType,
			"version":service.version,
			"request":"GetCapabilities"
        }
        this.wfsRequest = OpenLayers.Request.GET( {
            url :service.url,
            params:params,
            async:true,
            success :success,
            failure : this.requestFail,
            scope:this
        });
    },
    /**
     * Method: getBoundingBox
     * Takes a bbox object and returns a projected bounding box if need be.
     */
	getBoundingBox:function(bbox,srs) {
	    var objBbox = new OpenLayers.Bounds(
	            bbox.west, bbox.south, bbox.east,
	            bbox.north);
	    if(this.map.projection.projCode!=srs) {
	        var proj = new OpenLayers.Projection(srs);
	        objBbox.transform(proj,this.map.projection);
	    }
	    return objBbox;
	},
    /**
     * Method: requestFail
     * Called when a capabilities request fails to load.
     */
    requestFail:function(resp) {
    },
    /**
     * Constant: CLASS_NAME
     */
    CLASS_NAME :"oscar.Control.DataExtractor"
});