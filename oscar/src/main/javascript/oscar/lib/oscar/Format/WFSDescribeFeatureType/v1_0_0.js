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
 * Class: oscar.Format.WFSDescribeFeatureType.v1_0_0 
 * 
 * Read WFS DescribeFeatureType version 1.0.0
 * 
 * Inherits from: 
 * 
 * <OpenLayers.Format.XML>
 */

oscar.Format.WFSDescribeFeatureType.v1_0_0 = oscar.BaseClass(
		oscar.Format.WFSDescribeFeatureType.v1, {
			/**
			 * Constructor: oscar.Format.WFSDescribeFeatureType.v1_0_0
			 */
			initialize : function(options) {
				oscar.Format.WFSDescribeFeatureType.v1.prototype.initialize.apply(
						this, [ options ]);
				this.options = options;
			},
			/**
			 * Method: getProcessor
			 */
			getProcessor : function(childNode) {
				var local = childNode.nodeName.split(":").pop();
				var processor = this["read_DesFeatureType_" + local];
				return processor;
			},
			/**
			 * Method: read_DesFeatureType_schema
			 * 
			 * Reads the schema node.
			 */
			read_DesFeatureType_schema : function(FeatureTypes, node) {
				FeatureTypes.Schema = {};
				this.runChildNodes(FeatureTypes.Schema, node);
			},
			/**
			 * Method: read_DesFeatureType_import
			 * 
			 * Reads the import node.
			 */
			read_DesFeatureType_import : function(Schema, node) {
				Schema.Import = {};
				var importNode ={"namespace":"", "schemaLocation":""};
				importNode.namespace = node.getAttribute("namespace");
				importNode.schemaLocation = node.getAttribute("schemaLocation");
				Schema.Import = importNode;
			},			
			/**
			 * Method: read_DesFeatureType_complexType
			 * 
			 * Reads the complexType node.
			 */
			read_DesFeatureType_complexType : function(Schema, node) {
				if (!Schema.ComplexType)
					Schema.ComplexType = {};
				var complexType = {};
				this.runChildNodes(complexType, node);
				Schema.ComplexType = complexType;
			},
			/**
			 * Method: read_DesFeatureType_complexContent
			 * 
			 * Reads the complexContent node.
			 */
			read_DesFeatureType_complexContent : function(ComplexType, node) {
				if (!ComplexType.ComplexContent)
					ComplexType.ComplexContent = {};
				var complexContent = {};
				this.runChildNodes(complexContent, node);
				ComplexType.ComplexContent = complexContent;
			},
			/**
			 * Method: read_DesFeatureType_extension
			 * 
			 * Reads the extension node.
			 */
			read_DesFeatureType_extension : function(obj, node) {
				if (!obj.Extension)
					obj.Extension = {};
				var extension = {};
				this.runChildNodes(extension, node);
				obj.Extension = extension;
			},
			/**
			 * Method: read_DesFeatureType_sequence
			 * 
			 * Reads the sequence node.
			 */
			read_DesFeatureType_sequence : function(obj, node) {
				if (!obj.Sequence)
					obj.Sequence = {};
				var sequence = {};
				this.runChildNodes(sequence, node);
				obj.Sequence = sequence;
			},
			/**
			 * Method: read_DesFeatureType_element
			 * 
			 * Reads the element node.
			 */
			read_DesFeatureType_element : function(obj, node) {
				if (!obj.Elements)
					obj.Elements = [];
				var element = {"name":"", "type":""};
				element.name = node.getAttribute("name");
				element.type = node.getAttribute("type");
				obj.Elements.push(element);
			},
			/**
			 * Constant: CLASS_NAME
			 * - oscar.Format.WFSDescribeFeatureType.v1_0_0
			 */

			CLASS_NAME :"oscar.Format.WFSDescribeFeatureType.v1_0_0"
		});