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
 * Class: oscar.Format.WMTSCapabilities.v1_0_0 
 * 
 * Read WMTS Capabilities version 1.0.0.
 * 
 * Inherits from: 
 * 
 * - <OpenLayers.Format.XML>
 */

oscar.Format.WMTSCapabilities.v1_0_0 = oscar.BaseClass(
		oscar.Format.WMTSCapabilities.v1, oscar.Format.OGC.ows.v1_1_0, {
			/**
			 * Constructor: oscar.Format.WMTSCapabilities.v1_0_0
			 */
			initialize : function(options) {
				oscar.Format.WMTSCapabilities.v1.prototype.initialize.apply(
						this, [ options ]);
				this.options = options;
			},
			/**
			 * Method: getProcessor
			 */
			getProcessor : function(childNode) {
				var local = childNode.nodeName.split(":").pop();
				var nsObj = this[childNode.prefix] || this;
				var processor = nsObj["read_cap_" + local]
						|| this["read_cap_" + local];
				return processor;
			},
			/**
			 * Method: read_cap_Contents
			 * 
			 * Reads the Contents node.
			 */
			read_cap_Contents : function(capabilities, node) {
				capabilities.contents = {};
				this.runChildNodes(capabilities.contents, node);
			},
			/**
			 * Method: read_cap_Layer
			 * 
			 * Reads the Layer node.
			 */
			read_cap_Layer : function(contents, node) {
				if (!contents.layers)
					contents.layers = [];
				var layer = {};
				this.runChildNodes(layer, node);
				contents.layers.push(layer);
			},

			/**
			 * Method: read_cap_Format
			 * 
			 * Reads the Format node.
			 */
			read_cap_Format : function(obj, node) {
				obj.format = this.getChildValue(node);
			},
			/**
			 * Method: read_cap_ResourceURL
			 * 
			 * Reads the ResourceURL ndoe.
			 */
			read_cap_ResourceURL : function(obj, node) {
				if (!obj.resources)
					obj.resources = [];
				var resource = {};
				resource.format = this.getAttributeNS(node, "", "format");
				resource.resourceType = this.getAttributeNS(node, "",
						"resourceType");
				resource.template = this.getAttributeNS(node, "", "template");

				obj.resources.push(resource);
			},
			/**
			 * Method: read_cap_Themes
			 * 
			 * Reads the Themes node.
			 */
			read_cap_Themes : function(capabilities, node) {
				capabilities.themes = [];
				this.runChildNodes(capabilities.themes, node);
			},
			/**
			 * Method: read_cap_Theme
			 * 
			 * Reads the Theme node.
			 */
			read_cap_Theme : function(obj, node) {
				var theme = {};
				this.runChildNodes(theme, node);
				obj.push(theme);
			},
			/**
			 * Method: read_cap_LayerRef
			 * 
			 * Reads the LayerRef node.
			 */
			read_cap_LayerRef : function(obj, node) {
				if (!obj.layerRef)
					obj.layerRef = [];
				var val = this.getChildValue(node);
				obj.layerRef.push(val);
			},
			/**
			 * Method: read_cap_TileMatrixSet
			 * 
			 * Reads the TileMatrixSet node.
			 */
			read_cap_TileMatrixSet : function(contents, node) {
			},
			/**
			 * Constant: CLASS_NAME
			 * - oscar.Format.WMTSCapabilities.v1_0_0
			 */

			CLASS_NAME :"oscar.Format.WMTSCapabilities.v1_0_0"
		});