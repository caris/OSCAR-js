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
 * Class: oscar.Format.OGC.wfs
 * 
 * Methods used for reading elements defined in the OGC WFS namespace.
 */
oscar.Format.OGC.wfs = {

	/**
	 * Method: read_cap_OutputFormats
	 * 
	 * Reads the OutputFormats node.
	 */
	read_cap_OutputFormats : function(featureType, node) {
		var outputFormats = {
			formats : []
		}
		this.runChildNodes(outputFormats, node);
		featureType.outputFormats = outputFormats;
	},

	/**
	 * Method: read_cap_Format
	 * 
	 * Reads the Format node.
	 */
	read_cap_Format : function(obj, node) {
		var format = this.getChildValue(node);
		if (format) {
			obj.formats.push(format);
		}
	},
	/**
	 * Method: read_cap_MetadataURL
	 * 
	 * Reads the MetadataURL node.
	 */
	read_cap_MetadataURL : function(obj, node) {
		if (!obj.metadataUrls)
			obj.metadataUrls = [];
		var url = this.getChildValue(node);
		if (url.length == 0)
			return;
		var metadata = {
			url :url,
			type :this.getAttributeNS(node, "", "type"),
			format :this.getAttributeNS(node, "", "format")
		};
		obj.metadataUrls.push(metadata);
	},
	/**
	 * Method: read_cap_DefaultSRS
	 * 
	 * Reads the DefaultSRS node.
	 */
	read_cap_DefaultSRS:function(obj,node) {
		if (!obj.srss) {
			obj.srss = [];
		}
		obj.srss.push(this.getChildValue(node))
	},
	
	/**
	 * Method: read_cap_OtherSRS
	 * 
	 * Reads the OtherSRS node.
	 */
	read_cap_OtherSRS:function(obj,node) {
		if (!obj.srss) {
			obj.srss = [];
		}
		obj.srss.push(this.getChildValue(node))
	},
	
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Format.OGC.wfs
	 */
	CLASS_NAME :"oscar.Format.OGC.wfs"
};