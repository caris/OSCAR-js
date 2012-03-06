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
 * Class: oscar.Format.WCSDescribeCoverage.v1_0_0
 * 
 * Reads a WCS DescribeCoverage document version 1.0.0
 * 
 * Inherits from:
 * 
 * <oscar.Format.WCSDescribeCoverage.v1>
 */
oscar.Format.WCSDescribeCoverage.v1_0_0 = oscar.BaseClass(
		oscar.Format.WCSDescribeCoverage.v1, {
			/**
			 * Constructor: oscar.Format.WCSDescribeCoverage.v1_0_0
			 */
			initialize : function(options) {
			},

			/**
			 * Method: read_cap_CoverageDescription
			 * 
			 * Reads the CoverageDescription node.
			 */
			read_cap_CoverageOffering : function(obj, node) {
				if (!obj.coverageDescription)
					obj.coverageDescription = {};
				this.runChildNodes(obj.coverageDescription, node);
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
			 * Reads the keyword node.
			 */
			read_cap_Keyword : function(obj, node) {
				var keyword = this.getChildValue(node);
				obj.push(keyword);
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
			 * Method:read_cap_Domain
			 * 
			 * Reads the Domain node.
			 */
			read_cap_Domain : function(coverDesc, node) {
				if (!coverDesc.domain) {
					coverDesc.domain = {};
				}

				this.runChildNodes(coverDesc.domain, node)
			},
			/**
			 * Method:read_cap_SpatialDomain
			 * 
			 * Reads the SpatialDomain node.
			 */
			read_cap_SpatialDomain : function(domain, node) {
				if (!domain.spatialDomain)
					domain.spatialDomain = {};

				this.runChildNodes(domain.spatialDomain, node);
			},
			/**
			 * Method:read_cap_GridCRS
			 * 
			 * Reads the GridCRS node.
			 */
			read_cap_GridCRS : function(spatialDomain, node) {
			},
			/**
			 * Method:read_GridBaseCRS
			 * 
			 * Reads the GridBaseCRS node.
			 */
			read_cap_GridBaseCRS : function(gridCRS, node) {
			},
			/**
			 * Method: read_cap_GridType
			 * 
			 * Reads the GridType node.
			 */
			read_cap_GridType : function(gridCRS, node) {
			},
			/**
			 * Method: read_cap_GridOffsets
			 * 
			 * Reads the GridOffsets node.
			 */
			read_cap_GridOffsets : function(gridCRS, node) {
			},
			/**
			 * Method: read_cap_GridCS
			 * 
			 * Reads the GridCS node.
			 */
			read_cap_GridCS : function(gridCRS, node) {
			},

			/**
			 * Method: read_cap_AllowedValues
			 * 
			 * Reads the AllowedValues node.
			 */
			read_cap_AllowedValues : function(obj, node) {
			},
			/**
			 * Method: read_cap_WGS84BoundingBox
			 * 
			 * Reads the WG84BoundingBox node.
			 */
			read_cap_WGS84BoundingBox : function(obj, node) {
				this.read_cap_BoundingBox(obj, node);
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
			 * Method: read_cap_SupportedCRS
			 * 
			 * Reads the SupportedCRS node.
			 */
			read_cap_SupportedCRS : function(obj, node) {
				if (!obj.supportedCRS) {
					obj.supportedCRS = [];
				}
				var crs = this.getChildValue(node);
				obj.supportedCRS.push(crs);
			},
			/**
			 * Method: read_cap_Range
			 * 
			 * Reads the Range node.
			 */
			read_cap_Range : function(obj, node) {
				obj.range = {};
				this.runChildNodes(obj.range, node);
			},
			/**
			 * Method: read_cap_Field
			 * 
			 * Reads the Field node.
			 */
			read_cap_Field : function(obj, node) {
				if (!obj.fields)
					obj.fields = [];
				var field = {};
				this.runChildNodes(field, node);
				obj.fields.push(field);
			},
			/**
			 * Constant: CLASS_NAME
			 * - oscar.Format.WCSDescribeCoverage.v1_0_0
			 */
			CLASS_NAME :"oscar.Format.WCSDescribeCoverage.v1_0_0"
		});