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
 * Class: oscar.Format.OGC.wcs
 * 
 * Methods used for reading elements defined in the OGC WCS namespace.
 */
oscar.Format.OGC.wcs = {

	/**
	 * Method: read_cap_Contents
	 * 
	 * Reads the Contents node.
	 */
	read_cap_Contents : function(obj, node) {
		obj.contents = {};
		this.runChildNodes(obj.contents, node);
	},

	/**
	 * Method: read_cap_CoverageSummary
	 * 
	 * Reads the CoverageSummary node.
	 */
	read_cap_CoverageSummary : function(contents, node) {
		if (!contents.coverages)
			contents.coverages = [];
		var coverageSummary = {};
		this.runChildNodes(coverageSummary, node);
		contents.coverages.push(coverageSummary);
	},
	/**
	 * Method: read_cap_Identifier
	 * 
	 * Reads the Identifier node.
	 */
	read_cap_Identifier : function(obj, node) {
		obj.identifier = this.getChildValue(node);
	},
	/**
	 * Method: read_cap_SupportedFormat
	 * 
	 * Reads the SupportedFormat node.
	 */
	read_cap_SupportedFormat : function(contents, node) {
		if (!contents.supportedFormats)
			contents.supportedFormats = [];
		var format = this.getChildValue(node);
		contents.supportedFormats.push(format);
	},
	/**
	 * Method: read_cap_Domain
	 * 
	 * Reads the Domain node.
	 */
	read_cap_Domain : function(coverDesc, node) {
		if(!coverDesc.domain) {coverDesc.domain = {};}
		
		this.runChildNodes(coverDesc.domain,node)
	},
	/**
	 * Method: read_cap_SpatialDomain
	 * 
	 * Reads the SpatialDomain node.
	 */
	read_cap_SpatialDomain : function(domain, node) {
		if(!domain.spatialDomain) domain.spatialDomain={};
		
		this.runChildNodes(domain.spatialDomain,node);
	},
	
	/**
	 * Method: read_cap_SupportedCRS
	 * 
	 * Reads the SupportedCRS node
	 */
	read_cap_SupportedCRS : function(obj,node) {
		if(!obj.supportedCRS) {obj.supportedCRS = [];}
		var crs = this.getChildValue(node);
		obj.supportedCRS.push(crs);
	},
	
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Format.OGC.wcs
	 */
	CLASS_NAME :"oscar.Format.OGC.wcs"
};