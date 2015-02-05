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
 * Class: oscar.Format.WFSCapabilities.v2_0_0
 * 
 * Reads a WFS version 2.0.0 capabilities document.
 * 
 * Inherits from:
 * 
 * <OpenLayers.Format.WFSCapabilities.v1>
 * 
 */
oscar.Format.WFSCapabilities.v2_0_0 = oscar.BaseClass(oscar.Format.WFSCapabilities.v1, oscar.Format.OGC.ows.v1_1_0, {
    /**
     * Constructor
     */
    initialize : function(options) {
        oscar.Format.WFSCapabilities.v1.prototype.initialize.apply(this, [ options ]);
    },
    /**
     * Method: getProcessor
     */
    getProcessor : function(childNode) {
        var local = childNode.nodeName.split(":").pop();
        var nsObj = this[childNode.prefix] || this;
        var processor = nsObj["read_cap_" + local] || this["read_cap_" + local];
        return processor;
    },

    read_cap_DefaultCRS : function(obj, node) {
        obj.DefaultCRS = this.getChildValue(node);
    },

    read_cap_OtherCRS : function(obj, node) {
        if (!obj.OtherCRS)
            obj.OtherCRS = [];
        obj.OtherCRS.push(this.getChildValue(node));
    },

    read_cap_MetadataURL : function(obj, node) {
        if (!obj.metadataURLs) {
            obj.metadataURLs = []
        }
        obj.metadataURLs.push(this.getAttributeNS(node, "http://www.w3.org/1999/xlink", "href"));
    },

    /**
     * Constant: CLASS_NAME - oscar.Format.WFSCapabilities.v2_0_0
     */
    CLASS_NAME : "oscar.Format.WFSCapabilities.v2_0_0"
});