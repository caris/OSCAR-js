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
 * Class: oscar.Handler.WFS
 * 
 * Executes WFS requests based on selection layers of a theme.
 * 
 * Inherits from:
 *  - <oscar.Handler>
 * 
 */

oscar.Handler.WFS = oscar.BaseClass(oscar.Handler, {
	/**
	 * Constant: EVENT_TYPES
	 * 
	 * complete - Triggered when all requests have been completed. Passes the layer object reference.  
	 * requestComplete - Triggered when a request has completed. Used
	 * 					 internally. 
	 * beforeStart - Triggered when the requests are about to start.
	 * clean - Triggered by this.clean() method.
	 */
	EVENT_TYPES : [ 'complete', 'requestComplete', 'beforeStart', 'clean' ],
	/**
	 * Property: events 
	 * 
	 * {<OpenLayers.Events>) An events object that handles all events in the handler.
	 */
	events :null,
	/**
	 * Property: singleRequest 
	 * 
	 * Specifies if a source will send a request per feature type or combine 
	 * them for a single request.
	 */
	singleRequest :false,
	/**
	 * APIProperty: requestCounter 
	 * 
	 * {Integer} Keeps track of the number of requests being executed.
	 */
	requestCounter :0,
	/**
	 * Property: feats 
	 * 
	 * An array container to hold the features from all requests.
	 */
	feats :null,
	/**
	 * Property: map 
	 * 
	 * Reference to the map object.
	 */
	map :null,

	/**
	 * Property: dialog
	 * 
	 * Reference to the dialog object.
	 */
	dialog:null,

	/**
	 * Constructor: oscar.Handler.WFS 
	 * 
	 * Parameters: 
	 * 
	 * map - <Oscar.Map> A reference to a <Oscar.Map> object. 
	 * options - {Object} An optional object whose properties will be set on
	 * 			 this instance.
	 * 
	 */
	initialize : function(map, options) {
		this.feats = [];
		this.map = map;
		OpenLayers.Util.extend(this, options);
		this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES,
				false, {
					includeXY :true
				});
		this.events.register("requestComplete", this, this.requestComplete);
		this.events.register("clean", this, this.clean);
	},
	/**
	 * APIMethod: execute 
	 * 
	 * Launches a GetFeature request to obtain features from a WFS service.
	 * 
	 * Parameters: 
	 * geom - <OpenLayers.Geometry> object.
	 * theme - <oscar.ox.Theme> object.
	 */
	execute : function(geom, theme) {
		this.events.triggerEvent('beforeStart');
		 this.events.triggerEvent("clean");
		var selectionService = theme.getSelectionService();
		for ( var i = 0; i < selectionService.length; i++) {
			var serviceEntry = selectionService[i];
			if(serviceEntry.geometryName == ""){
				serviceEntry.geometryName = this.doDescribeFeatureTypeRequest(serviceEntry, geom, theme);
			}else{
				this.doGetFeatureRequest(serviceEntry, geom, theme);
			}
		}
	},
	/**
	 * Method: doDescribeFeatureTypeRequest
	 * 
	 * This method launches an AJAX DescribeFeatureType request against a WFS service, parses 
	 * the returned document, retrieves the service geometry property name and assign it 
	 * to the ServiceEntry object. 
	 * 
	 * Parameters: 
	 * serviceEntry - reference to a {<oscar.ox.ServiceEntry>} object.
	 * geom - reference to a {<OpenLayers.Geometry>} object.
	 * theme - reference to a {<oscar.ox.Theme>} object.
	 */
	doDescribeFeatureTypeRequest : function(serviceEntry, geom, theme){
		var params = {
			service : "WFS",
			request : "DescribeFeatureType",
			version : serviceEntry.version
		};
		var onSuccess = function(resp){
			serviceEntry.schema = new OpenLayers.Format.WFSDescribeFeatureType().read(resp.responseXML); 
			this.doGetFeatureRequest(serviceEntry, geom, theme);
		 }
		 var onFail = function(resp) {
			 this.events.triggerEvent("requestComplete");
		 }
		 OpenLayers.Request.GET({
			 url:serviceEntry.url,
			 params:params,
			 success:onSuccess,
			 fail:onFail,
			 scope:this
		 });
	},
	
	
	buildProtocol:function(serviceEntry, geom, theme) {

        var sFilter = new OpenLayers.Filter.Spatial( {
	        type :OpenLayers.Filter.Spatial.BBOX,
	        value:this.getBounds(geom),
	        projection :theme.srs
	    });
        
        var featTypes = [];
        
        for(var el in serviceEntry.identifiers) {
			var feat = serviceEntry.identifiers[el];
            if(feat.indexOf(serviceEntry.schema.targetPrefix) > -1) {
                feat = feat.split(":")[1];
            }
            featTypes.push(feat);
		}
		var formatOptions = {extractAttributes:true};
		formatOptions.srsName = theme.srs;
        if(serviceEntry.version != "1.0.0") {
            formatOptions.xy = (this.map.projection.proj.projName=="longlat")? false :true;
        }
        formatOptions.autoConfig = true;
        formatOptions.singleFeatureType = false
		var protocol = new OpenLayers.Protocol.WFS({
			url:serviceEntry.url,
	        version:serviceEntry.version,
	        featureType:featTypes.toString(),
	        geometryName:serviceEntry.schema.featureTypes[0].properties[0].name,
	        featureNS:serviceEntry.schema.targetNamespace,
            featurePrefix:serviceEntry.schema.targetPrefix,
	        formatOptions:formatOptions,
	        filter:sFilter,
	        scope:this
	    });

        return protocol;
    },
	
	/**
	 * Method: doGetFeatureRequest
	 * 
	 * Executes an AJAX GetFeature request to a WFS service. 
	 * 
	 * Parameters: 
	 * serviceEntry - reference to a {<oscar.ox.ServiceEntry>} object.
	 * geom - reference to a {<OpenLayers.Geometry>} object.
	 * theme -reference to a {<oscar.ox.Theme>} object.
	 */
	doGetFeatureRequest : function(serviceEntry, geom, theme){

        var protocol = this.buildProtocol(serviceEntry, geom, theme);
		
		var now = new Date();
		var hour = now.getHours();
		var minutes = now.getMinutes();
		var ampm = (hour > 12)?"am":"pm";
		
		this.layer = new OpenLayers.Layer.Vector("@ " + hour + ":" + minutes + " " + ampm,{
			strategies: [new OpenLayers.Strategy.Fixed()],
			protocol:protocol,
            temporary:true,
            displayInLayerSwitcher:false
		});
		
		this.layer.events.on({
			"featureselected":function(evt) {
				var feature = evt.feature;
	            var str = "<table>";
	            for(var key in feature.attributes) {
	                  var attr = feature.attributes[key];
	                  str+="<tr><td>" + key;
	                  str+="</td><td>" + attr+"</td></tr>";
	            }
		        str+="</table>";
		        var popup = new oscar.FramedCloud("id", feature.geometry
		                  .getBounds().getCenterLonLat(), null, str, null,
		                  true);
		        popup.autoSize=false;
		        feature.popup = popup;
		        feature.layer.map.addPopup(popup); 
				
			},
			"featureunselected":function(evt) {
				var feature = evt.feature;
	            feature.layer.map.removePopup(feature.popup);
	            feature.popup=null;
			},
            "beforefeatureremoved":function(evt) {
                feature = evt.feature;
                if (feature.popup) {
                    feature.layer.map.removePopup(feature.popup);
                    feature.popup=null;
                }
			},
			"loadstart":function() {
				this.showDialog();
			},
			"loadend":function() {
				this.events.triggerEvent("requestComplete");
			},
			scope:this
		});
        
		this.map.addLayer(this.layer);
	},
    /**
     * Method: getBounds
	 * 
	 * Takes a {<OpenLayers.Geometry>} object and returns the bounds for it. If the Geometry is a
	 * Point object it will create a small Bounds object from a 2x2 pixel box.
	 * 
	 * Parameters:
	 * geom - {<OpenLayers.Geometry>} The geometry object to get the bounds for.
	 * 
	 * Returns: 
	 * {<OpenLayers.Bounds>} Bounds object of the geometry.
     */
    getBounds : function(geom) {
        if(geom.CLASS_NAME !== "OpenLayers.Geometry.Point") {
            return geom.getBounds();
        }

        // Get the pixel location of the point geometry and build a bbox
        // around it.
        var pixel = this.map.getPixelFromLonLat(new OpenLayers.LonLat(
                geom.x, geom.y));
        var topRight = this.map.getLonLatFromPixel(
                new OpenLayers.Pixel(pixel.x + 2, pixel.y + 2));
        var botLeft = this.map.getLonLatFromPixel(
                new OpenLayers.Pixel(pixel.x - 2, pixel.y - 2));
        
        var lRing = new OpenLayers.Geometry.LinearRing();
        lRing.addComponent(new OpenLayers.Geometry.Point(botLeft.lon,botLeft.lat));
        lRing.addComponent(new OpenLayers.Geometry.Point(topRight.lon,topRight.lat));
        var poly = new OpenLayers.Geometry.Polygon([lRing]);
        return poly.getBounds();

    },
    
    /**
	 * Method: showDialog
	 * Shows the selection dialog. 
	 */
	showDialog:function() {
		this.dialog = new oscar.Gui.Dialog("Selection", {
			draggable :true,
			modal :false,
			width :250,
			height :100,
			zIndex :2001,
			fixedcenter :false
		});
		this.dialog.setHeader(oscar.i18n("Loading"));
		this.dialog.setContent(oscar.i18n("Please Wait"));
		this.dialog.show();
	},	    
	requestComplete : function() {
			if(this.dialog) {
				this.dialog.hide();
				this.dialog = null;
			}
			try {
			if(this.layer.features.length > 0) {
				this.events.triggerEvent("complete", this.layer);
			}
			}catch (err){}

	},

    clean:function() {
        if (this.layer) {
            this.layer.removeAllFeatures();
		}
    },	
	
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Handler.WFS
	 */
	CLASS_NAME :"oscar.Handler.WFS"
});