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
 * Class: oscar.Format.OGC.ows
 * 
 * Methods used for reading elements defined in the OWS (OGC Web Services) namespace.
 */

oscar.Format.OGC.ows ={};


oscar.Format.OGC.ows.v1_0_0 = {
	/**
	 * Method: read_cap_ServiceIdentification
	 * 
	 * Reads the ServiceIdentification node.
	 */
	read_cap_ServiceIdentification : function(capabilities, node) {
		capabilities.serviceIdentification = {};
		this.runChildNodes(capabilities.serviceIdentification, node);
	},
	/**
	 * Method: read_cap_ServiceProvider
	 * 
	 * Reads the ServiceProvider node.
	 */
	read_cap_ServiceProvider : function(capabilities, node) {
		capabilities.serviceProvider = {};
		this.runChildNodes(capabilities.serviceProvider, node);
	},
	/**
	 * Method: read_cap_ProviderName
	 * 
	 * Reads the ProviderName node.
	 */
	read_cap_ProviderName : function(serviceProvider, node) {
		serviceProvider.providerName = this.getChildValue(node);
	},
	/**
	 * Method: read_cap_ProviderSite
	 * 
	 * Reads the ProviderSite node.
	 */
	read_cap_ProviderSite : function(serviceProvider, node) {
		var href = this.getAttributeNS(node, "http://www.w3.org/1999/xlink",
				"href");
		if (href) {
			serviceProvider.providerSite = href;
		}
	},
	/**
	 * Method: read_cap_ServiceContact
	 * 
	 * Reads the ServiceContact node.
	 */
	read_cap_ServiceContact : function(serviceProvider, node) {
		serviceProvider.serviceContact = {};
		this.runChildNodes(serviceProvider.serviceContact, node);
	},
	/**
	 * Method: read_cap_IndividualName
	 * 
	 * Reads the IndividualName node.
	 */
	read_cap_IndividualName : function(serviceContact, node) {
		serviceContact.individualName = this.getChildValue(node);
	},
	/**
	 * Method: read_cap_PositionName
	 * 
	 * Reads the PositionName node.
	 */
	read_cap_PositionName : function(serviceContact, node) {
		serviceContact.positionName = this.getChildValue(node);
	},
	/**
	 * Method: read_cap_ContactInfo
	 * 
	 * Reads the ContactInfo node.
	 */
	read_cap_ContactInfo : function(serviceContact, node) {
		serviceContact.contactInfo = {};
		this.runChildNodes(serviceContact.contactInfo, node);
	},
	/**
	 * Method: read_cap_Phone
	 * 
	 * Reads the Phone node.
	 */
	read_cap_Phone : function(contactInfo, node) {
		if (!contactInfo.phone) {
			contactInfo.phone = {};
		}
		this.runChildNodes(contactInfo.phone, node);
	},
	/**
	 * Method: read_cap_Voice
	 * 
	 * Reads the Voice node.
	 */
	read_cap_Voice : function(phone, node) {
		phone.voice = this.getChildValue(node);
	},
	/**
	 * Method: read_cap_Facsimile
	 * 
	 * Reads the Voice node.
	 */
	read_cap_Facsimile : function(phone, node) {
		phone.facsimile = this.getChildValue(node);
	},

	/**
	 * Method: read_cap_Address
	 * 
	 * Reads the Address node.
	 */
	read_cap_Address : function(contactInfo, node) {
		contactInfo.address = {};
		this.runChildNodes(contactInfo.address, node);
	},
	
	/**
	 * Method: read_cap_DeliveryPoint
	 * 
	 * Reads the DeliveryPoint node, which is the street address.
	 */
	read_cap_DeliveryPoint : function(contactInfo, node) {
		contactInfo.deliveryPoint = this.getChildValue(node);
	},
	
	/**
	 * Method: read_cap_City
	 * 
	 * Reads the City node.
	 */
	read_cap_City : function(address, node) {
		address.city = this.getChildValue(node);
	},
	/**
	 * Method: read_cap_AdministrativeArea
	 * 
	 * Reads the AdministrativeArea node.
	 */
	read_cap_AdministrativeArea : function(address, node) {
		address.administrativeArea = this.getChildValue(node);
	},
	/**
	 * Method: read_cap_Country
	 * 
	 * Reads the Country node.
	 */
	read_cap_Country : function(address, node) {
		address.country = this.getChildValue(node);
	},
	/**
	 * Method: read_cap_ElectronicMailAddress
	 * 
	 * Reads the ElectronicMailAddress node.
	 */
	read_cap_ElectronicMailAddress : function(address, node) {
		address.electronicMailAddress = this.getChildValue(node);
	},
	/**
	 * Method: read_cap_OnlineResource
	 * 
	 * Reads the OnlineResource node.
	 */
	read_cap_OnlineResource : function(contactInfo, node) {
		var href = this.getAttributeNS(node, "http://www.w3.org/1999/xlink",
				"href");
		if (href) {
			contactInfo.onlineResource = href;
		}
	},
	/**
	 * Method: read_cap_Title
	 * 
	 * Reads the Title node.
	 */
	read_cap_Title : function(obj, node) {
		obj.title = this.getChildValue(node);
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
	 * Method: read_cap_Abstract
	 * 
	 * Reads the Abstract node.
	 */
	read_cap_Abstract : function(obj, node) {
		obj['abstract'] = this.getChildValue(node);
	},
	/**
	 * Method: read_cap_Keywords
	 * 
	 * Reads the Keywords node.
	 */
	read_cap_Keywords : function(obj, node) {
		obj.keywords = [];
		this.runChildNodes(obj.keywords, node);
	},
	/**
	 * Method: read_cap_Keyword
	 * 
	 * Reads the Keyword node.
	 */
	read_cap_Keyword : function(obj, node) {
		var keyword = this.getChildValue(node);
		obj.push(keyword);
	},
	/**
	 * Method: read_cap_ServiceType
	 * 
	 * Reads the ServiceType node.
	 */
	read_cap_ServiceType : function(obj, node) {
		obj.serviceType = this.getChildValue(node);
	},
	/**
	 * Method: read_cap_OperationsMetadata
	 * 
	 * Reads the OperationsMetadata node.
	 */
	read_cap_OperationsMetadata : function(capabilities, node) {
		capabilities.operationsMetadata = {};
		this.runChildNodes(capabilities.operationsMetadata, node);
	},
	/**
	 * Method: read_cap_Operation
	 * 
	 * Reads the Operation node.
	 */
	read_cap_Operation : function(obj, node) {
		var operation = this.getAttributeNS(node, "", "name");
		obj[operation] = {};
		this.runChildNodes(obj[operation], node);
	},
	/**
	 * Method: read_cap_DCP
	 * 
	 * Reads the DCP node.
	 */
	read_cap_DCP : function(obj, node) {
		if (!obj.dcp)
			obj.dcp = {};
		this.runChildNodes(obj.dcp, node);
	},
	/**
	 * Method: read_cap_HTTP
	 * 
	 * Reads the HTTP node.
	 */
	read_cap_HTTP : function(obj, node) {
		if (!obj.http)
			obj.http = {};
		this.runChildNodes(obj.http, node);
	},
	/**
	 * Method: read_cap_Get
	 * 
	 * Reads the Get node.
	 */
	read_cap_Get : function(obj, node) {
		var href = this.getAttributeNS(node, "http://www.w3.org/1999/xlink",
				"href");
		if (href) {
			obj.get = href;
		}
	},
	/**
	 * Method: read_cap_Post
	 * 
	 * Reads the Post node.
	 */
	read_cap_Post : function(obj, node) {
		var href = this.getAttributeNS(node, "http://www.w3.org/1999/xlink",
				"href");
		if (href) {
			obj.post = href;
		}
	},

	/**
	 * Method:read_cap_Parameter
	 * 
	 * Reads the Parameter node.
	 */
	read_cap_Parameter : function(obj, node) {
		if (!obj.parameters)
			obj.parameters = [];

		var parameter = {};
		parameter.name = this.getAttributeNS(node, "", "name");
		this.runChildNodes(parameter, node);
		obj.parameters.push(parameter);
	},

	/**
	 * Method:reaed_cap_Value
	 * 
	 * Reads the Value node.
	 */
	read_cap_Value : function(obj, node) {
		if (!obj.values)
			obj.values = [];
		var value = this.getChildValue(node);
		obj.values.push(value);
	},

	/**
	 * Method: read_cap_AllowedValues
	 * 
	 * Reads the AllowedValues node.
	 */
	read_cap_AllowedValues : function(obj, node) {
		this.runChildNodes(obj, node);
	},
	/**
	 * Method: read_cap_WGS84BoundingBox
	 * 
	 * Reads the WGS84BoundingBox node.
	 */
	read_cap_WGS84BoundingBox : function(obj, node) {
		obj.wgs84BoundingBox = {};
		this.runChildNodes(obj.wgs84BoundingBox, node);

	},
	/**
	 * Method: read_cap_BoundingBox
	 * 
	 * Reads the BoundingBox node.
	 */
	read_cap_BoundingBox : function(obj, node) {
		if (!obj.boundingBoxes) {
			obj.boundingBoxes = [];
		}
		var bbox = {};
		var crs = this.getAttributeNS(node, "", "crs");
		bbox.crs = crs;
		this.runChildNodes(bbox, node);
		obj.boundingBoxes.push(bbox);
	},
	/**
	 * Method: read_cap_LowerCorner
	 * 
	 * Reads the LowerCorner node.
	 */
	read_cap_LowerCorner : function(obj, node) {
		var leftBottom = this.getChildValue(node).split(' ');
		obj.west = leftBottom[0];
		obj.south = leftBottom[1];
	},
	/**
	 * Method: read_cap_UpperCorner
	 * 
	 * Reads the UpperCorner node.
	 */
	read_cap_UpperCorner : function(obj, node) {
		var rightTop = this.getChildValue(node).split(' ');
		obj.east = rightTop[0];
		obj.north = rightTop[1];
	},

	/**
	 * Method: read_cap_Metadata
	 * 
	 * Reads the Metadata node
	 */
	read_cap_Metadata : function(obj, node) {
		if (!obj.metadataUrls)
			obj.metadataUrls = [];
		var url = this.getAttributeNS(node, "http://www.w3.org/1999/xlink",
				"href");
		if (url.length == 0)
			return;
		var metadata = {
			url :url,
			type :"",
			format :""
		};
		obj.metadataUrls.push(metadata);

	},

	/**
	 * Constant: CLASS_NAME
	 * - oscar.Format.OGC.ows
	 */
	CLASS_NAME :"oscar.Format.OGC.ows.v1_0_0"
};
oscar.Format.OGC.ows.v1_1_0 = {};

OpenLayers.Util.extend(oscar.Format.OGC.ows.v1_1_0,oscar.Format.OGC.ows.v1_0_0);

OpenLayers.Util.extend(oscar.Format.OGC.ows.v1_1_0,{
	read_cap_Title:function(obj,node) {
		if(!obj.title) obj.title = {};
		var lang = null;
			lang = this.getAttributeNS(node,"http://www.w3.org/XML/1998/namespace","lang");
		if(lang!=null && lang.length > 0) {
			obj.title[lang] = this.getChildValue(node);
		} else {
			obj.title = this.getChildValue(node);
		}
	},
	CLASS_NAME :"oscar.Format.OGC.ows.v1_1_0"
});

oscar.Format.OGC.owcs = oscar.Format.OGC.ows.v1_0_0;