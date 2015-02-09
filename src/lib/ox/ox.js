/*
 * CARIS oscar - Open Spatial Component ARchitecture
 * 
 * Copyright 2012 CARIS <http://www.caris.com>
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
 * Class: oscar.ox
 * 
 * Namespace object for Oscar eXchange object.
 */
oscar.ox = oscar.BaseClass({
    /**
     * Property: version
     */
    version : null,

    /**
     * Constructor: oscar.ox
     * 
     * Parameters: options - {Object} An optional object whose properties will
     * be set on this instance.
     */
    initialize : function(options) {
        OpenLayers.Util.extend(this, options);
        this.themes = [];
    },

    /**
     * Method: addTheme
     * 
     * Parameters: oxTheme - {<oscar.ox.Theme>} a theme object.
     */
    addTheme : function(oxTheme) {
        this.themes.push(oxTheme);
    },
    /**
     * Constant: CLASS_NAME - oscar.ox
     */
    CLASS_NAME : "oscar.ox"
});

/**
 * Class: oscar.ox.Theme
 * 
 * This class represents a Theme from Oscar eXchange Format
 * 
 */
oscar.ox.Theme = oscar.BaseClass({
    /**
     * APIProperty: layers
     */
    layers : null,
    /**
     * APIProperty: selectionLayers
     */
    selectionLayers : null,
    /**
     * APIProperty: displayOrder
     */
    displayOrder : -1,
    /**
     * Property: id
     */
    id : 0,
    /**
     * APIProperty: name
     */
    name : null,
    /**
     * APIProperty: srs
     */
    srs : null,
    /**
     * APIProperty: projection
     */
    projection : null,
    /**
     * APIProperty: isActive
     */
    isActive : false,
    /**
     * APIProperty: services
     */
    services : null,
    /**
     * APIProperty: covers
     */
    covers : null,
    /**
     * Constructor: oscar.ox.Theme
     * 
     * Parameters: options - {Object} An optional object whose properties will
     * be set on this instance.
     */
    initialize : function(options) {
        this.layers = [];
        this.selectionLayers = [];
        this.covers = [];
        OpenLayers.Util.extend(this, options);
    },
    /**
     * APIMethod: addLayer
     * 
     * Adds an {<oscar.ox.Layer>} to the theme object.
     * 
     * Parameters: oxLayer - {<oscar.ox.Layer>} the layer to be added.
     */
    addLayer : function(oxLayer) {
        this.layers.push(oxLayer);
        if (oxLayer.layerType == "SELECTION")
            this.selectionLayers.push(oxLayer);
    },
    /**
     * APIMethod: hasSelectionService
     * 
     * Returns: {Boolean} whether a selection service is available.
     */
    hasSelectionService : function() {
        return (this.services && this.services.selection) ? true : false;
    },
    /**
     * APIMethod: getSelectionService
     * 
     * Returns: {Object} *serviceEntries* the selection service.
     */
    getSelectionService : function() {
        if (this.hasSelectionService())
            return this.services.selection.serviceEntries;
        else
            return null;
    },
    /**
     * APIMethod: getSelectionService
     * 
     * Returns: {Array} *oscar.ogc.CatalogueService* An array of catalogue
     * services.
     */
    getCatalogueService : function() {
        if (this.hasCatalogueService()) {
            var services = [];
            for (var i = 0; i < this.services.catalogue.serviceEntries.length; i++) {
                services.push(new oscar.ogc.CatalogueService(this.services.catalogue.serviceEntries[i]));
            }
            return services;
        } else {
            return [];
        }
    },
    /**
     * APIMethod: hasCatalogueService
     * 
     * Returns: {Boolean} whether a catalogue service is available.
     */
    hasCatalogueService : function() {
        return (this.services && this.services.catalogue) ? true : false;
    },
    /**
     * APIMethod: hasExtractionService
     * 
     * Returns: {Boolean} whether an extraction service is available.
     */
    hasExtractionService : function() {
        return (this.services && this.services.extraction) ? true : false;
    },
    /**
     * APIMethod: getExtractionService
     * 
     * Returns: {Object} *serviceEntries* the extraction service.
     */
    getExtractionService : function() {
        if (this.hasExtractionService())
            return this.services.extraction.serviceEntries;
        else
            return null;
    },
    getProjection : function() {
        return this.projection;
    },
    /**
     * APIMethod: getDefaultCover
     * 
     * Returns: {Object} a default cover or null.
     */
    getDefaultCover : function() {
        return this.getCover("DEFAULT");
    },

    /**
     * APIMethod: getMaxCover
     * 
     * Returns: {Object} the max extent cover.
     */
    getMaxCover : function() {
        return this.getCover("MAX");
    },
    /**
     * Method: getCover
     * 
     * Parameters: type - {String} Type of cover: MAX or DEFAULT
     * 
     * Returns: {<OpenLayers.Bounds>} the cover object or null.
     */
    getCover : function(type) {
        for (var i = 0; i < this.covers.length; i++) {
            if (this.covers[i].type == type) {
                return new OpenLayers.Bounds(this.covers[i].minX, this.covers[i].minY, this.covers[i].maxX, this.covers[i].maxY)
            }
        }
        return null;
    },

    /**
     * Method: buildMap Calls the toMapLayer for each of the layers in the theme
     * to be added to the map.
     * 
     * Parameters: map - OpenLayers.Map
     */
    buildMap : function(map) {
        if (this.displaySRS) {
            try {
                var mPosition = map.getControlsByClass("OpenLayers.Control.MousePosition")[0];
                mPosition.displayProjection = new OpenLayers.Projection(this.displaySRS);

            } catch (err) {

            }
        }

        var numLayers = this.layers.length;
        for (var lIndex = 0; lIndex < numLayers; lIndex++) {
            var tLayer = this.layers[lIndex];
            if (!tLayer.baseLayer) {
                tLayer.baseLayer = (lIndex == 0) ? true : false;
            }
            var objType = tLayer.toMapLayer(map);

        }

    },
    /**
     * Constant: CLASS_NAME - oscar.ox.Theme
     */
    CLASS_NAME : "oscar.ox.Theme"
});

/**
 * Class: oscar.ox.Layer
 * 
 * This class represents a Layer from Oscar eXchange Format.
 * 
 */
oscar.ox.Layer = oscar.BaseClass({
    /**
     * APIProperty: baseLayer
     */
    baseLayer : false,
    /**
     * APIProperty: displayOrder
     */
    displayOrder : null,
    /**
     * APIProperty: dataLayers
     */
    dataLayers : null,
    /**
     * APIProperty: layerId
     */
    layerId : null,
    /**
     * APIProperty: layerType
     */
    layerType : null,
    /**
     * APIProperty: name
     */
    name : null,
    /**
     * APIProperty: parameters
     */
    parameters : null,
    /**
     * APIProperty: urls
     */
    urls : null,
    /**
     * Constructor: oscar.ox.Layer
     * 
     * Parameters: options - {Object} An optional object whose properties will
     * be set on this instance.
     */
    initialize : function(options) {
        this.dataLayers = [];
        this.parameters = {};
        this.urls = [];
        OpenLayers.Util.extend(this, options);
    },
    /**
     * APIMethod: addDataLayer Adds an {<oscar.ox.DataLayer>} object to the
     * dataLayers array.
     * 
     * Parameters: dataLayer - an {<oscar.ox.DataLayer>} object.
     */
    addDataLayer : function(dataLayer) {
        if (!this.dataLayers)
            this.dataLayers = [];

        this.dataLayers.push(dataLayer);
    },
    /**
     * APIMethod: addUrl Adds a url source to the urls object.
     * 
     * Parameters: url - {String} a url String.
     * 
     */
    addUrl : function(url) {
        if (!this.urls)
            this.urls = [];
        this.urls.push(url)
    },
    /**
     * APIMethod: toMapLayer
     * 
     * Returns: {Object} *olLayer* which inherits from <OpenLayers.Layer> and is
     * able to be added to an <OpenLayers.Map> object.
     */
    toMapLayer : function(map) {
        layerNamesArr = [];
        for (var i = 0; i < this.dataLayers.length; i++) {
            layerNamesArr.push(this.dataLayers[i].layerName);
        }
        var olLayer = null;
        var onEvents = null;
        switch (this.layerType) {
        case "GOOGLE_PHYSICAL":
            olLayer = new OpenLayers.Layer.Google("Google Physical", {
                type : G_PHYSICAL_MAP,
                sphericalMercator : true
            });

            break;
        case "GOOGLE_STREETS":
            olLayer = new OpenLayers.Layer.Google("Google Streets", {
                type : G_NORMAL_MAP,
                sphericalMercator : true
            });
            break;

        case "GOOGLE_HYBRID":
            olLayer = new OpenLayers.Layer.Google("Google Hybrid", {
                type : G_HYBRID_MAP,
                sphericalMercator : true
            });
            break;
        case "GOOGLE_SATELLITE":
            olLayer = new OpenLayers.Layer.Google("Google Satellite", {
                type : G_SATELLITE_MAP,
                sphericalMercator : true
            });
            break;
        case "MARKER":
            var externalProjection = null;
            if (this.parameters.srs) {
                externalProjection = new OpenLayers.Projection(this.parameters.srs);
            } else {
                externalProjection = new OpenLayers.Projection("EPSG:4326");
            }
            var olLayer = null;
            var layerOptions = {
                projection : map.getProjectionObject(),
                formatOptions : {
                    externalProjection : externalProjection,
                    internalProjection : map.getProjectionObject()
                }
            };
            var formatType = this.parameters.formatType.toLowerCase();
            switch (formatType) {

            case "georss_simple":
                var style = new OpenLayers.Style({
                    externalGraphic : this.parameters.iconUri
                });
                var rule = new OpenLayers.Rule({
                    symbolizer : {
                        pointRadius : 30
                    },
                    filter : new OpenLayers.Filter.Comparison({
                        type : OpenLayers.Filter.Comparison.LIKE,
                        property : "title",
                        value : "*powder*"
                    })
                });
                rule.filter.value2regex("*");

                var elseRule = new OpenLayers.Rule({
                    elseFilter : true,
                    symbolizer : {
                        pointRadius : 20
                    }
                });

                style.addRules([ elseRule ]);

                olLayer = null;

                olLayer = new OpenLayers.Layer.Vector(this.name, {
                    setMap : function() {
                        OpenLayers.Layer.Vector.prototype.setMap.apply(this, arguments);
                        this.protocol.format.internalProjection = this.map.projection;
                    },
                    strategies : [ new OpenLayers.Strategy.Fixed() ],
                    protocol : new OpenLayers.Protocol.HTTP({
                        url : this.urls[0],
                        format : new OpenLayers.Format.GeoRSS({
                            extractStyles : false,
                            externalProjection : new OpenLayers.Projection("EPSG:4326"),
                            createFeatureFromItem : function(item) {
                                var feature = OpenLayers.Format.GeoRSS.prototype.createFeatureFromItem.apply(this, arguments);
                                return feature;
                            }
                        })
                    }),
                    styleMap : new OpenLayers.StyleMap({
                        "default" : style,
                        "select" : new OpenLayers.Style({
                            pointRadius : 35
                        })
                    })
                });

                olLayer.events.on({
                    "featureselected" : function(evt) {
                        var feature = evt.feature;
                        var pHolder = document.createElement("div");
                        var header = document.createElement("div");
                        header.innerHTML = feature.attributes['title'];
                        var p = document.createElement("p");
                        p.innerHTML = oscar.Util.parseText(feature.attributes['description']);
                        pHolder.appendChild(header);
                        pHolder.appendChild(p);
                        html = p.innerHTML;
                        var popup = new oscar.FramedCloud("id", feature.geometry.getBounds().getCenterLonLat(), null, pHolder.innerHTML, null, true);
                        popup.autoSize = true;
                        feature.popup = popup;
                        feature.layer.map.addPopup(popup);
                    },
                    "featureunselected" : function(evt) {
                        var feature = evt.feature;
                        feature.layer.map.removePopup(feature.popup);
                        feature.popup = null;
                    },

                    scope : this
                });

                break;
            case "kml":
                olLayer = null;
                var style = new OpenLayers.Style({
                    externalGraphic : this.parameters.iconUri,
                    pointRadius : 20
                });
                olLayer = new OpenLayers.Layer.Vector(this.name, {
                    setMap : function() {
                        OpenLayers.Layer.Vector.prototype.setMap.apply(this, arguments);
                        this.protocol.format.internalProjection = this.map.projection;
                    },
                    strategies : [ new OpenLayers.Strategy.Fixed() ],
                    protocol : new OpenLayers.Protocol.HTTP({
                        url : this.urls[0],
                        format : new OpenLayers.Format.KML({
                            extractStyles : true,
                            externalProjection : new OpenLayers.Projection("EPSG:4326")
                        })
                    }),
                    styleMap : new OpenLayers.StyleMap({
                        "default" : style,
                        "select" : new OpenLayers.Style({
                            pointRadius : 35
                        })
                    })
                });

                olLayer.events.on({
                    "beforefeaturesadded" : function(evt) {
                        for ( var f in evt.features) {
                            var feat = evt.features[f];
                            if (feat.geometry.CLASS_NAME != "OpenLayers.Geometry.Point") {
                                var lonlat = feat.geometry.getBounds().getCenterLonLat();
                                var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
                                feat.geometry = point;
                            }
                        }
                    },
                    "featureselected" : function(evt) {
                        var feature = evt.feature;
                        var pHolder = document.createElement("div");
                        var header = document.createElement("div");
                        header.innerHTML = oscar.Util.parseText(feature.attributes['name']);
                        var p = document.createElement("p");
                        p.innerHTML = oscar.Util.parseText(feature.attributes['description']);
                        pHolder.appendChild(header);
                        pHolder.appendChild(p);

                        html = oscar.Util.parseText(feature.attributes['description']);
                        var popup = new oscar.FramedCloud("id", feature.geometry.getBounds().getCenterLonLat(), null, pHolder.innerHTML, null, true);
                        popup.autoSize = true;
                        feature.popup = popup;
                        feature.layer.map.addPopup(popup);
                    },
                    "featureunselected" : function(evt) {
                        var feature = evt.feature;
                        feature.layer.map.removePopup(feature.popup);
                        feature.popup = null;
                    },

                    scope : this
                });
                break;
            case "youtube":
                onEvents = {
                    "featureselected" : function(evt) {
                        var feature = evt.feature;
                        var pHolder = document.createElement("div");
                        var header = document.createElement("div");
                        header.innerHTML = feature.attributes['title'];
                        var youtubeString = 'http://www.youtube.com/embed/';
                        var fid = feature.fid.substring(feature.fid.lastIndexOf("/") + 1);
                        html = '<iframe width="480" height="390" src="' + youtubeString + fid + '" frameborder="0" allowfullscreen></iframe>';
                        var p = document.createElement("p");
                        p.innerHTML = html;
                        pHolder.appendChild(header);
                        pHolder.appendChild(p);

                        html = feature.attributes['description'];
                        var popup = new oscar.FramedCloud("id", feature.geometry.getBounds().getCenterLonLat(), null, pHolder.innerHTML, null, true);
                        popup.autoSize = true;
                        feature.popup = popup;
                        feature.layer.map.addPopup(popup);
                    },
                    "featureunselected" : function(evt) {
                        var feature = evt.feature;
                        feature.layer.map.removePopup(feature.popup);
                        feature.popup = null;
                    },
                    scope : this
                };
            case "flickr":
                if (onEvents == null) {
                    onEvents = null;
                }
            case "picasa":
                var style = new OpenLayers.Style({
                    externalGraphic : "${thumbnail}"
                });
                var rule = new OpenLayers.Rule({
                    symbolizer : {
                        pointRadius : 30
                    },
                    filter : new OpenLayers.Filter.Comparison({
                        type : OpenLayers.Filter.Comparison.LIKE,
                        property : "title",
                        value : "*powder*"
                    })
                });
                rule.filter.value2regex("*");

                var elseRule = new OpenLayers.Rule({
                    elseFilter : true,
                    symbolizer : {
                        pointRadius : 20
                    }
                });

                style.addRules([ elseRule ]);

                olLayer = new OpenLayers.Layer.Vector(this.name, {
                    setMap : function() {
                        OpenLayers.Layer.Vector.prototype.setMap.apply(this, arguments);
                        this.protocol.format.internalProjection = this.map.projection;
                    },
                    strategies : [ new OpenLayers.Strategy.Fixed() ],
                    protocol : new OpenLayers.Protocol.HTTP({
                        url : this.urls[0],
                        format : new OpenLayers.Format.GeoRSS({
                            externalProjection : new OpenLayers.Projection("EPSG:4326"),
                            createFeatureFromItem : function(item) {
                                var feature = OpenLayers.Format.GeoRSS.prototype.createFeatureFromItem.apply(this, arguments);
                                var thumbnail = this.getElementsByTagNameNS(item, "*", "thumbnail")[0].getAttribute("url");
                                feature.attributes.thumbnail = thumbnail;
                                return feature;
                            }
                        })
                    }),
                    styleMap : new OpenLayers.StyleMap({
                        "default" : style,
                        "select" : new OpenLayers.Style({
                            pointRadius : 35
                        })
                    })
                });

                if (onEvents == null) {
                    onEvents = {
                        "featureselected" : function(evt) {
                            var feature = evt.feature;
                            html = feature.attributes['description'];
                            var popup = new oscar.FramedCloud("id", feature.geometry.getBounds().getCenterLonLat(), null, html, null, true);
                            popup.autoSize = true;
                            feature.popup = popup;
                            feature.layer.map.addPopup(popup);
                        },
                        "featureunselected" : function(evt) {
                            var feature = evt.feature;
                            feature.layer.map.removePopup(feature.popup);
                            feature.popup = null;

                        },

                        scope : this
                    };
                }
                olLayer.events.on(onEvents);
                break;
            }
            break;
        case "OSM":
            olLayer = new OpenLayers.Layer.OSM(this.name);
            break;
        case "WMS":
            var params = {};
            params.layers = layerNamesArr;
            params.format = (this.format) ? this.format : "image/png";
            params.transparent = true;
            if (this.parameters.version)
                params.version = this.parameters.version;
            olLayer = new OpenLayers.Layer.WMS(this.name, this.urls, params, {
                wrapDateLine : false,
                buffer : 0,
                isBaseLayer : this.baseLayer
            });
            break;
        case "WMTS":
            olLayer = new OpenLayers.Layer.WMTS({
                name : this.name,
                url : this.urls[0],
                layer : this.dataLayers[0].layerName,
                matrixSet : this.tileMatrixSet,
                tileOrigin : new OpenLayers.LonLat(this.tileOrigin[0], this.tileOrigin[1]),
                tileFullExtent : new OpenLayers.Bounds(this.tileFullExtent[0], this.tileFullExtent[1], this.tileFullExtent[2], this.tileFullExtent[3]),
                style : "default",
                requestEncoding : "REST",
                format : this.format,
                isBaseLayer : this.baseLayer,
                buffer : 0
            });
            break;
        }
        ;

        if (olLayer != null) {
            map.addLayer(olLayer);
        }
    },
    /**
     * Constant: CLASS_NAME - oscar.ox.Layer
     */
    CLASS_NAME : "oscar.ox.Layer"
});

/**
 * Class: oscar.ox.DataLayer
 * 
 * This class represents a DataLayer from Oscar eXchange Format.
 */
oscar.ox.DataLayer = oscar.BaseClass({
    /**
     * APIProperty: id
     */
    id : null,
    /**
     * APIProperty: index
     */
    index : null,
    /**
     * APIProperty: layerName
     */
    layerName : null,
    /**
     * Constructor: oscar.ox.DataLayer
     * 
     * Parameters: options - {Object} An optional object whose properties will
     * be set on this instance.
     */
    initialize : function(options) {
        OpenLayers.Util.extend(this, options);
    },

    /**
     * Constant: CLASS_NAME - oscar.ox.DataLayer
     */
    CLASS_NAME : "oscar.ox.DataLayer"
});

/**
 * Class: oscar.ox.Services
 */
oscar.ox.Services = oscar.BaseClass({
    /**
     * Property: selection
     */
    selection : null,
    /**
     * Property: extraction
     */
    extraction : null,

    catalogue : null,

    /**
     * Constructor: oscar.ox.Services
     */
    initialize : function() {

    },
    /**
     * Method: addSelectionService
     * 
     * returns: {Object} the newly created selection service.
     */
    addSelectionService : function() {
        this.selection = new oscar.ox.SelectionService();
        return this.selection;
    },
    /**
     * Method: addExtractionService
     * 
     * returns: {Object} the newly created extraction service.
     */
    addExtractionService : function() {
        this.extraction = new oscar.ox.ExtractionService();
        return this.extraction;
    },
    /**
     * Method: addCatalogueService
     * 
     * returns: {Object} the newly created catalogue service.
     */
    addCatalogueService : function() {
        this.catalogue = new oscar.ox.CatalogueService();
        return this.catalogue;
    },

    /**
     * Constant: CLASS_NAME - oscar.ox.Services
     */
    CLASS_NAME : "oscar.ox.Services"
});

/**
 * Class: oscar.ox.Service
 * 
 * Represents a type of Service containing an array of ServiceEntry objects.
 */
oscar.ox.Service = oscar.BaseClass({

    /**
     * APIProperty: serviceEntries
     * 
     * An array of <oscar.ox.ServiceEntry> objects.
     */
    serviceEntries : null,

    /**
     * Constructor: oscar.ox.Service
     * 
     * Parameters: options - {Object} An optional object whose properties will
     * be set on this instance.
     */
    initialize : function(options) {
        this.serviceEntries = [];
    },

    /**
     * Method: addServiceEntry
     * 
     * Parameters: serviceEntry - {oscar.ox.ServiceEntry} object.
     */
    addServiceEntry : function(serviceEntry) {
        if (serviceEntry.CLASS_NAME && serviceEntry.CLASS_NAME == "oscar.ox.ServiceEntry")
            this.serviceEntries.push(serviceEntry.clone());
    },
    /**
     * APIMethod: getServiceEntries
     * 
     * Returns an array of service entry objects.
     * 
     * Returns: {Array} - An array of <oscar.ox.ServiceEntry> objects.
     */
    getServiceEntries : function() {
        return this.serviceEntries
    },

    /**
     * APIMethod: getServiceEntry
     * 
     * Returns a specified service entry.
     * 
     * Parameters: index - {Number} The index of the <oscar.ox.ServiceEntry> to
     * return.
     * 
     * Returns: {oscar.ox.ServiceEntry} - A ServiceEntry object.
     */
    getServiceEntry : function(index) {
        return this.serviceEntries[index];
    },
    /**
     * Constant: CLASS_NAME - oscar.ox.Service
     */
    CLASS_NAME : "oscar.ox.Service"
});

/**
 * Class: oscar.ox.SelectionService
 * 
 * Represents the selection service from Oscar eXchange Format.
 * 
 * Inherits from: <oscar.ox.Service>
 */
oscar.ox.SelectionService = oscar.BaseClass(oscar.ox.Service, {
    /**
     * Constructor: oscar.ox.SelectionService
     * 
     * Parameters: options - {Object} An optional object whose properties will
     * be set on this instance.
     */
    initialize : function(options) {
        oscar.ox.Service.prototype.initialize.apply(this, [ options ]);
    },
    /**
     * Constant: CLASS_NAME - oscar.ox.SelectionService
     */
    CLASS_NAME : "oscar.ox.SelectionService"
});

oscar.ox.CatalogueService = oscar.BaseClass(oscar.ox.Service, {
    /**
     * Constructor: oscar.ox.SelectionService
     * 
     * Parameters: options - {Object} An optional object whose properties will
     * be set on this instance.
     */
    initialize : function(options) {
        oscar.ox.Service.prototype.initialize.apply(this, [ options ]);
    },
    /**
     * Constant: CLASS_NAME - oscar.ox.CatalogueService
     */
    CLASS_NAME : "oscar.ox.CatalogueService"
});

/**
 * Class: oscar.ox.ExtractionService
 * 
 * Represents the extraction service from Oscar eXchange Format.
 * 
 * Inherits from: <oscar.ox.Service>
 */
oscar.ox.ExtractionService = oscar.BaseClass(oscar.ox.Service, {
    /**
     * Constructor: oscar.ox.ExtractionService
     * 
     * Parameters: options - {Object} An optional object whose properties will
     * be set on this instance.
     */
    initialize : function(options) {
        oscar.ox.Service.prototype.initialize.apply(this, [ options ]);
    },
    /**
     * Constant: CLASS_NAME - oscar.ox.ExtractionService
     */
    CLASS_NAME : "oscar.ox.ExtractionService"
});

/**
 * Class: oscar.ox.ServiceEntry
 * 
 * An object containing connection information for a service.
 * 
 */
oscar.ox.ServiceEntry = oscar.BaseClass({
    /**
     * APIProperty: url
     * 
     * {String} The URL of the service.
     */
    url : null,
    /**
     * APIProperty: version
     * 
     * {String} The version of the service.
     */
    version : null,
    /**
     * APIProperty: serviceType
     * 
     * {String} Type of the service.
     */
    serviceType : null,
    /**
     * APIProperty: format
     * 
     * {String}
     */
    format : null,
    /**
     * APIProperty: identifiers
     * 
     * {Array{String}}
     * 
     */
    identifiers : null,
    /**
     * APIProperty: geometryName
     * 
     * {String} the geometry property name of the current server.
     */
    geometryName : null,
    /**
     * Constructor: oscar.ox.ServiceEntry
     * 
     * Parameters: options - {Object} An optional object whose properties will
     * be set on this instance.
     */
    initialize : function(options) {
        this.identifiers = [];
        this.geometryName = "";
        if (options) {
            OpenLayers.Util.extend(this, options);
        }
    },

    addUrl : function(url) {
        this.url = url;
    },

    /**
     * Method: clone
     */
    clone : function() {
        var props = {};
        OpenLayers.Util.extend(props, this);
        return new oscar.ox.ServiceEntry(props);
    },
    /**
     * Constant: CLASS_NAME - oscar.ox.ServiceEntry
     */
    CLASS_NAME : "oscar.ox.ServiceEntry"
});
