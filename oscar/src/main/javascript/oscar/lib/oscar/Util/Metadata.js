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
 * Class: oscar.Util.Metadata
 * 
 * Methods to extract items from a capabilities document.
 */
oscar.Util.Metadata = {
	WFS : "WFS",
	WMS : "WMS",
	WMTS : "WMTS",
	WCS : "WCS",
	/**
	 * APIMethod: getServiveTitle
	 * 
	 * Returns the title of a service
	 * 
	 * Parameter:
	 * 
	 * capabilities - {Object}
	 */
	getServiceTitle : function(capabilities) {
		var service = this.getService(capabilities);
		var title = service.title || service.Title || service.serviceType
				|| oscar.i18n("NotAvailable");
		if (title.length == 0) {
			title = oscar.i18n("NotAvailable");
		}
		if (typeof title == 'object') {
			var defaultTitle = title[OpenLayers.Lang.getCode()] || title['en'];
			title = defaultTitle;
		}
		return title;
	},
	/**
	 * APIMethod: getServiceAbstract
	 * 
	 * Returns the abstract of a service
	 * 
	 * Parameter:
	 * 
	 * capabilities - {Object}
	 */
	getServiceAbstract : function(capabilities) {
		var serviceAbstract = null;
		if (capabilities.serviceIdentification) {
			serviceAbstract = capabilities.serviceIdentification['abstract']
					|| oscar.i18n("NotAvailable");
		} else {
			serviceAbstract = capabilities.service['abstract']
					|| oscar.i18n("NotAvailable");
		}
		return serviceAbstract;
	},
	/**
	 * APIMethod: getServiceKeywords
	 * 
	 * Returns the keywords of a service
	 * 
	 * Parameter:
	 * 
	 * capabilities - {Object}
	 */
	getServiceKeywords : function(capabilities) {
		var serviceKeywords = null;
		if (capabilities.serviceIdentification) {
			serviceKeywords = capabilities.serviceIdentification.keywords
					|| oscar.i18n("NotAvailable");
		}
		return serviceKeywords;

	},
	/**
	 * APIMethod: getServiceType
	 * 
	 * Returns the type of service
	 * 
	 * Parameter:
	 * 
	 * capabilities - {Object}
	 */
	getServiceType : function(capabilities) {
		var service = this.getService(capabilities);
		var serviceType = service.name || service.serviceType.value || service.serviceType;
		if (serviceType.indexOf("WMS")!=-1) {
			return "WMS"
		} else if (serviceType.indexOf("WFS")!=-1) {
			return "WFS";
		} else if (serviceType.indexOf("WMTS")!=-1) {
			return "WMTS";
		} else if (serviceType.indexOf("WCS")!=-1) {
			return "WCS";
		} else
			return serviceType;

	},
	/**
	 * APIMethod: getService
	 * 
	 * Returns the service
	 * 
	 * Parameter:
	 * 
	 * capabilities - {Object}
	 */
	getService : function(capabilities) {
		return capabilities.service || capabilities.serviceIdentification;
	},
	/**
	 * APIMethod: getLayers
	 * 
	 * Parameter:
	 * 
	 * capabilities Returns the layers of a service
	 */
	getLayers : function(capabilities) {
		try {
			var layers = capabilities.capability.layers;
		} catch (err) {
		}
		return layers;
	},
	/**
	 * APIMethod: getFeatureTypes
	 * 
	 * Returns the feature types of a service
	 * 
	 * Parameter:
	 * 
	 * capabilities
	 */
	getFeatureTypes : function(capabilities) {
		return capabilities.featureTypeList.featureTypes;

	},
	/**
	 * APIMethod: getFeatureTypesById
	 * 
	 * Returns the feature types of a service with a specific id
	 * 
	 * Parameter:
	 * 
	 * capabilities id
	 */
	getFeatureTypesById : function(capabilities, id) {
		for ( var f in capabilities.featureTypeList.featureTypes) {
			var feature = capabilities.featureTypeList.featureTypes[f];
			if (feature.name == id) {
				return feature;
			}
		}
		return null;

	},

	/**
	 * APIMethod: getCoverages
	 * 
	 * Returns the coverages node of a wcs service
	 * 
	 * Parameter:
	 * 
	 * capabilities - {Object}
	 * 
	 */

	getCoverages : function(capabilities) {
		return capabilities.contents.coverages;
	},

	/**
	 * APIMethod: getParameters
	 * 
	 * Parameters: capabilities - Capabilities object. operationString - Name of
	 * the operation string, i.e. "GetFeature". parameterName - Name of the
	 * parameter, i.e. "outputFormat".
	 */
	getParameters : function(capabilities, operationString, parameterName) {
		var operation = null;
		if (capabilities.operationsMetadata) {
			operation = capabilities.operationsMetadata[operationString];
		} else if (capabilities.capability.request) {
			operation = capabilities.capability.request[operationString]
					|| capabilities.capability.request[operationString
							.toLowerCase()];
		}
		if (operation.parameters) { // ows 1.1.0 or greater
			for(var prop in operation.parameters) {
				if($$.inArray(prop,parameterName)!= -1) {
					return operation.parameters[prop];
				}
			}
			for ( var i = 0; i < operation.parameters.length; i++) {
				var op = operation.parameters[i];
				for ( var j = 0; j < parameterName.length; j++) {
					if (op.name.toLowerCase() == parameterName[j].toLowerCase()) {
						return op.values;
					}
				}
				if (operation.parameters[i].name == parameterName) {
					return operation.parameters[i].values;
				}
			}
		} else { // ows 1.0.0 support
			for ( var p in operation) {
				for ( var i = 0; i < parameterName.length; i++) {
					if (p.toLowerCase() == parameterName[i].toLowerCase()) {
						return operation[p];
					}
				}
			}
		}

		return [];
	},

	/**
	 * 
	 * 
	 * 
	 */
	getIdentifierMetadataUrls : function(identifier) {
		var metadataUrls = identifier.metadataURLs || identifier.metadataUrls
				|| [];
		return metadataUrls;
	},
	/**
	 * APIMethod: getContent
	 * 
	 * Returns the content of a service
	 * 
	 * Parameter:
	 * 
	 * capabilities - {Object}
	 */
	getContent : function(capabilities) {
		return capabilities.contents.layers;
	},
	/**
	 * APIMethod: getThemes
	 * 
	 * Returns the Themes object of a WMTS Service
	 * 
	 * Parameter:
	 * 
	 * capabilities - {Object}
	 */
	getThemes : function(capabilities) {
		return capabilities.themes;
	},

	/**
	 * APIMethod: getOperation
	 * 
	 * Returns a service operation
	 * 
	 * Parameters:
	 * 
	 * capabilities - {object} Capabilities Object
	 * 
	 * operation - {String} Name of the Operation (GetFeature, GetMap, GetTile,
	 * etc.)
	 */
	getOperation : function(capabilities, operation) {
		if (capabilities.operationsMetadata) {
			return capabilities.operationsMetadata[operation];
		} else if (capabilities.capability.request) {
			operation = operation.toLowerCase();
			return capabilities.capability.request[operation];
		}
		return null;
	},
	/**
	 * Method: getServiceHref
	 * 
	 * @deprecated - Use getOperationHref
	 */

	getServiceHref : function(serviceType, capabilities) {
		return oscar.Util.Metadata.getOperationHref(serviceType, capabilities);
	},
	/**
	 * APIMethod: getOperationHref
	 * 
	 * Returns the url of the service operations
	 * 
	 * Return Type: {String}
	 * 
	 * Parameters:
	 * 
	 * capabilities - {Object}
	 * 
	 * operation - {String} Name of the Operation (GetFeature, GetMap, GetTile,
	 * etc.)
	 * 
	 */
	getOperationHref : function(capabilities, operation) {
		var op = oscar.Util.Metadata.getOperation(capabilities, operation);
		if (!op)
			return "";
		if (op.href) {
			if (typeof op.href == "object") {
				return op.href["get"];
			} else {
				return op.href;
			}
		} else {
			try {
				return op.dcp.http["get"];
			} catch (err) {
				return "";
			}
		}
	},
	/**
	 * APIMethod: getContactInformation
	 * 
	 * Parameter:
	 * 
	 * capabilities - {Object}
	 */
	getContactInformation : function(capabilities) {
		var contactInformation = null;
		var find = function(obj) {
			var keyArray = [ "serviceProvider", "contactInformation" ];
			var reference = null;
			for ( var prop in obj) {
				for ( var i = 0; i < keyArray.length; i++) {
					if (prop == keyArray[i])
						return reference = obj[prop];
				}
				if (typeof obj[prop] == "object") {
					reference = find(obj[prop]);
					if (reference != null)
						break;
				}
			}
			return reference;
		};
		var contactInformation = find(capabilities, "serviceProvider");
		if (capabilities.serviceProvider) {
			contactInformation = {};
			OpenLayers.Util.extend(contactInformation,
					capabilities.serviceProvider);
		}
		return contactInformation;
	},
	/**
	 * Constant CLASS_NAME
	 */
	CLASS_NAME : "oscar.Util.Metadata"
};