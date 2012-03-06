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
 * Class: oscar.Format.WCSCapabilities.v1_0_0
 * 
 * Reads a WCS Capabilities document version 1.0.0
 * 
 * This class will call methods from the <oscar.Format.OGC.ows> and
 * <oscar.Format.OGC.wcs> classes to keep capabilities objects consistent.
 * 
 * Inherits from:
 * 
 * <oscar.Format.WCSCapabilities.v1>
 * 
 */
oscar.Format.WCSCapabilities.v1_0_0 = oscar.BaseClass(

oscar.Format.WCSCapabilities.v1, oscar.Format.OGC.ows.v1_0_0,oscar.Format.OGC.wcs, {
	/**
	 * Constructor: oscar.Format.WCSCapabilities.v1_0_0
	 */
	initialize : function(options) {

	},
	/**
	 * Method: nsRef
	 * 
	 * This method will call the 'methodName' provided by the 'namespace'
	 * passing along the object and node. Allows for the code to use methods
	 * already defined in their respective namespaces to read these nodes.
	 */
	nsRef : function(namespace, methodName, obj, node) {
		//var processor = oscar.Format.OGC[namespace]["read_cap_" + methodName];
		var processor = this["read_cap_"+methodName];
		if (processor)
			processor.apply(this, [ obj, node ]);
	},
	/**
	 * Method: read_cap_Service
	 * 
	 * Reads the Service node.
	 */
	read_cap_Service : function(obj, node) {
		this.nsRef("ows", "ServiceIdentification", obj, node);
	},
	/**
	 * Method: read_cap_metadataLink
	 * 
	 * Reads the metadataLink node.
	 */
	read_cap_metadataLink : function(obj, node) {
	},
	/**
	 * Method: read_cap_description
	 * 
	 * Reads the description node.
	 */
	read_cap_description : function(obj, node) {
		this.nsRef("ows", "Abstract", obj, node);
	},
	/**
	 * Method: read_cap_name
	 * 
	 * Reads the name node.
	 */
	read_cap_name : function(obj, node) {
		this.nsRef("ows", "ServiceType", obj, node);
	},
	/**
	 * Method: read_cap_label
	 * 
	 * Reads the label node.
	 */
	read_cap_label : function(obj, node) {
		this.nsRef("ows", "Title", obj, node);
	},
	/**
	 * Method: read_cap_keywords
	 * 
	 * Reads the keywords node.
	 */
	read_cap_keywords : function(obj, node) {
		this.nsRef("ows", "Keywords", obj, node);
	},
	/**
	 * Method: read_cap_keyword
	 * 
	 * Reads the keyword node.
	 */
	read_cap_keyword : function(obj, node) {
		this.nsRef("ows", "Keyword", obj, node);
	},
	/**
	 * Method: read_cap_responsibleParty
	 * 
	 * Reads the responsibleParty node.
	 */
	read_cap_responsibleParty : function(obj, node) {
		this.nsRef("ows", "ServiceProvider", obj, node);
	},
	/**
	 * Method: read_cap_individualName
	 * 
	 * Reads the individualName node.
	 */
	read_cap_individualName : function(obj, node) {
		this.nsRef("ows", "IndividualName", obj, node);
	},
	/**
	 * Method: read_cap_positionName
	 * 
	 * Reads the positionName node.
	 */
	read_cap_positionName : function(obj, node) {
		this.nsRef("ows", "PositionName", obj, node);
	},
	/**
	 * Method: read_cap_organisationName
	 * 
	 * Reads the organisationName node.
	 */
	read_cap_organisationName : function(obj, node) {
		this.nsRef("ows", "ProviderName", obj, node);
	},
	/**
	 * Method: read_cap_contactInfo
	 * 
	 * Reads the contactInfo node.
	 */
	read_cap_contactInfo : function(obj, node) {
		this.nsRef("ows", "ServiceContact", obj, node);
	},
	/**
	 * Method: read_cap_phone
	 * 
	 * Reads the phone node.
	 */
	read_cap_phone : function(obj, node) {
		this.nsRef("ows", "Phone", obj, node);
	},
	/**
	 * Method: read_cap_address
	 * 
	 * Reads the address node.
	 */
	read_cap_address : function(obj, node) {
		this.nsRef("ows", "Address", obj, node);
	},
	/**
	 * Method: read_cap_city
	 * 
	 * Reads the city node.
	 */
	read_cap_city : function(obj, node) {
		this.nsRef("ows", "City", obj, node);
	},
	/**
	 * Method: read_cap_country
	 * 
	 * Reads the country node.
	 */
	read_cap_country : function(obj, node) {
		this.nsRef("ows", "Country", obj, node);
	},
	/**
	 * Method: read_cap_electronicMailAddress
	 * 
	 * Reads the electronicMailAddress node.
	 */
	read_cap_electronicMailAddress : function(obj, node) {
		this.nsRef("ows", "ElectronicMailAddress", obj, node);
	},
	/**
	 * Method: read_cap_onlineResource
	 * 
	 * Reads the onlineResource node.
	 */
	read_cap_onlineResource : function(obj, node) {
		this.nsRef("ows", "OnlineResource", obj, node);
	},
	/**
	 * Method: read_cap_fees
	 * 
	 * Reads the fees node.
	 */
	read_cap_fees : function(obj, node) {
	},
	/**
	 * Method: read_cap_accessConstraints
	 * 
	 * Reads the accessConstraints node.
	 */
	read_cap_accessConstraints : function(obj, node) {
	},
	/**
	 * Method: read_cap_Capability
	 * 
	 * Reads the Capability node.
	 */
	read_cap_Capability : function(obj, node) {
		this.nsRef("ows", "OperationsMetadata", obj, node);
	},
	/**
	 * Method: read_cap_Request
	 * 
	 * Reads the Request node.
	 */
	read_cap_Request : function(obj, node) {
		this.runChildNodes(obj, node);
	},
	/**
	 * Method: read_cap_GetCapabilities
	 * 
	 * Reads the GetCapabilities node.
	 */
	read_cap_GetCapabilities : function(obj, node) {
		obj[node.nodeName] = {};
		this.runChildNodes(obj[node.nodeName], node);
	},
	/**
	 * Method: read_cap_GetCoverage
	 * 
	 * Reads the GetCoverage node.
	 */
	read_cap_GetCoverage : function(obj, node) {
		obj[node.nodeName] = {};
		this.runChildNodes(obj[node.nodeName], node);
	},	

	/**
	 * Method: read_cap_Get
	 * 
	 * Reads the Get node.
	 */
	read_cap_Get : function(obj, node) {
		var temp = {};
		this.runChildNodes(temp, node);
		obj["Get"] = temp.OnlineResource;
	},
	/**
	 * Method: read_cap_OnlineResource
	 * 
	 * Reads the OnlineResource node.
	 */
/**
	read_cap_OnlineResource : function(obj, node) {
		this.nsRef("ows", "OnlineResource", obj, node);
	},
**/	
	/**
	 * Method: read_cap_DescribeCoverage
	 * 
	 * Reads the DescribeCoverage node.
	 */
	read_cap_DescribeCoverage : function(obj, node) {
		obj[node.nodeName] = {};
		this.runChildNodes(obj[node.nodeName], node);
	},
	/**
	 * Method: read_cap_Post
	 * 
	 * Reads the Post node.
	 */
	read_cap_Post : function(obj, node) {
		var temp = {};
		this.runChildNodes(temp, node);
		obj["Post"] = temp.OnlineResource;
	},
	/**
	 * Method: read_cap_Exception
	 * 
	 * Reads the Exception node.
	 */
	read_cap_Exception : function(obj, node) {
	},
	/**
	 * Method: read_cap_Format
	 * 
	 * Reads the Format node.
	 */
	read_cap_Format : function(obj, node) {
	},
	/**
	 * Method: read_cap_ContentMetadata
	 * 
	 * Reads the ContentMetadata node.
	 */
	read_cap_ContentMetadata : function(obj, node) {
		this.nsRef("wcs", "Contents", obj, node);
	},
	/**
	 * Method: read_cap_CoverageOfferingBrief
	 * 
	 * Reads the CoverageOfferingBrief node.
	 */
	read_cap_CoverageOfferingBrief : function(obj, node) {
		this.nsRef("wcs", "CoverageSummary", obj, node);
	},
	/**
	 * Method: read_cap_lonLatEnvelope
	 * 
	 * Reads the lonLatEnvelope node.
	 */
	read_cap_lonLatEnvelope : function(obj, node) {
		obj.wgs84BoundingBox = {};
		var bbox=[];
		this.runChildNodes(bbox, node);
		obj.wgs84BoundingBox.west=bbox[0];
		obj.wgs84BoundingBox.south=bbox[1];
		obj.wgs84BoundingBox.east=bbox[2];
		obj.wgs84BoundingBox.north=bbox[3];
	},
	/**
	 * Method: read_cap_pos
	 * 
	 * Reads the pos node.
	 */
	read_cap_pos: function(bbox,node) {
		var lonLat = this.getChildValue(node).split(" ");
		bbox.push(lonLat[0]);
		bbox.push(lonLat[1]);
	},
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Format.WCSCapabilities.v1_0_0
	 */
	CLASS_NAME :"oscar.Format.WCSCapabilities.v1_0_0"
});