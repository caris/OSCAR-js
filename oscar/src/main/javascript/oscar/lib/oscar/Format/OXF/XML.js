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
oscar.Format.OXF.XML = oscar.BaseClass(OpenLayers.Format.XML, {
	/**
	 * Property: defaultPrefix
	 * 
	 * default namespace for the xml nodes.
	 */
    defaultPrefix:"ox",
    /**
     * Constructor: new oscar.Format.OXF.XML()
     */
    initialize:function(options) {
        OpenLayers.Format.XML.prototype.initialize.apply(this,[options]);
    },
    /**
     * APIMethod: read
     * 
     * Parameters:
     * 
     * - {String} or {XMLDocument}
     * 
     * Returns:
     * 
     * - {oscar.ox} configuration object.
     */
    read:function(data) {
        if(typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this,[data]);
        }
        if(data && data.nodeType ==9) {
            data = data.documentElement;
        }
        var obj = new oscar.ox();
        this.readNode(data,obj);
        return obj;
    },
    
    /**
     * List of node readers.
     */
    readers: {
        "ox": {
            "configuration":function(node,obj) {
                obj.version = node.getAttribute("version");
                this.readChildNodes(node,obj);
            },
            "themes":function(node,obj) {
                this.readChildNodes(node,obj);
            },
            "theme":function(node,obj) {
                var theme = new oscar.ox.Theme();

				theme.parameters = {};
				var nZoom = parseInt(node.getAttribute("numzoomlevels"));
				theme.parameters.numzoomlevels = (isNaN(nZoom))?16:nZoom;
				var bColor = node.getAttribute("bgColor");
				theme.parameters.backgroundColor = (bColor==null)? "#fff":bColor;
				
                obj.addTheme(theme);
                this.readChildNodes(node,theme);
            
            },
            "srs":function(node,obj) {
                var srs = this.getChildValue(node);
                obj.srs = srs;
            },
            "name":function(node,obj) {
                obj.name = this.getChildValue(node);
            },

            "covers":function(node,obj){
            	var covers = [];
            	this.readChildNodes(node,covers)
                obj.covers = covers;
            },
            "cover":function(node,cArr){
            	var cover = {};
            	cover.type = node.getAttribute("type");
            	cover.minX = parseFloat(node.getAttribute("minX"));
            	cover.minY = parseFloat(node.getAttribute("minY"));
            	cover.maxX = parseFloat(node.getAttribute("maxX"));
            	cover.maxY = parseFloat(node.getAttribute("maxY"));
            	cArr.push(cover);
            },
            "layers":function(node,obj){
                this.readChildNodes(node,obj);
            },
            "layer":function(node,obj){
                var layer = new oscar.ox.Layer();
                obj.addLayer(layer);
                this.readChildNodes(node,layer);
            },
            "urls":function(node,obj){
                this.readChildNodes(node,obj);
            },
            "url":function(node,obj){
                var url = this.getChildValue(node);
                obj.addUrl($$.trim(url));
            },
            "format":function(node,obj){
                obj.format = this.getChildValue(node);
            },
            "baseLayer":function(node,obj){
                
            },
            "layerType":function(node,obj){
               obj.layerType = this.getChildValue(node);
            },
            "dataLayers":function(node,obj){
                this.readChildNodes(node,obj);
            },
            "dataLayer":function(node,obj){
                var dLayer = new oscar.ox.DataLayer();
                obj.addDataLayer(dLayer);
                this.readChildNodes(node,dLayer);
            },
            "layerName":function(node,obj){
                var layerName = this.getChildValue(node);
                obj.layerName = layerName;
            },
            "tileOrigin":function(node,obj) {
                var tOrigin = this.getChildValue(node);
                obj.tileOrigin = tOrigin.split(",");
            },
            "tileFullExtent":function(node,obj) {
                var fullExtent = this.getChildValue(node);
                obj.tileFullExtent = fullExtent.split(",");
            },
            "requestType":function(node,obj) {
                obj.requestType = this.getChildValue(node);
            },
            "tileMatrixSet":function(node,obj) {
                obj.tileMatrixSet = this.getChildValue(node);
            },
            "parameter":function(node,obj){
                var pName = node.getAttribute("name");
                var pValue = node.getAttribute("value");
                obj.parameters[pName]=pValue;
            },
            "services":function(node,obj){
                obj.services = new oscar.ox.Services();
                this.readChildNodes(node,obj.services);
            },
            "service":function(node,obj){
                var serviceType = node.getAttribute("type");
                var service =null;
                switch (serviceType) {
                    case "extraction":
                        service = obj.addExtractionService();
                        break;
                    case "selection":
                        service = obj.addSelectionService();
                        break;
                }
                
                this.readChildNodes(node,service);
            },
            "serviceEntry":function(node,obj){
                var serviceEntry = new oscar.ox.ServiceEntry();
                serviceEntry.serviceType = node.getAttribute("type");
                serviceEntry.version = node.getAttribute("version");
                serviceEntry.format = node.getAttribute("format");
                this.readChildNodes(node,serviceEntry);
                obj.addServiceEntry(serviceEntry);
            },
            "identifiers":function(node,obj){
                
                this.readChildNodes(node,obj);
            },
            "identifier":function(node,obj){
                var identifier = this.getChildValue(node);
                obj.identifiers.push(identifier);
            }
        }
    },
    
    /**
     * Constant: CLASS_NAME
     */
    CLASS_NAME:"oscar.Format.OXF.XML"
});