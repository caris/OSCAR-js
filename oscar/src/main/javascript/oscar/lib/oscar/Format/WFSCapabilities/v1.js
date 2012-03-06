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
 * Class: oscar.Format.WFSCapabilities.v1
 * 
 * Read WFS capabilities version 1.0.
 * 
 * Inherits from:
 * 
 * <OpenLayers.Format.WFSCapabilities.v1>
 * 
 */
oscar.Format.WFSCapabilities.v1 = oscar.BaseClass(
		OpenLayers.Format.WFSCapabilities.v1, {
			/**
			 * Constructor
			 */
			initialize : function(options) {
				OpenLayers.Format.WFSCapabilities.v1.prototype.initialize
						.apply(this, [ options ]);
			},
			/**
			 * Method: runChildNodes
			 */
			runChildNodes : function(obj, node) {
				var children = node.childNodes;
				var childNode, processor;
				for ( var i = 0; i < children.length; ++i) {
					childNode = children[i];
					if (childNode.nodeType == 1) {
						processor = this.getProcessor(childNode);
						if (processor) {
							processor.apply(this, [ obj, childNode ]);
						}
					}
				}
			},
			/**
			 * Method: getProcessor 
			 * 
			 * Parameters:
			 * 
			 * childNode - <XMLNode> Uses the node to obtain the correct method used to
			 * read.
			 */
			getProcessor : function(childNode) {
				var local = childNode.nodeName.split(":").pop();
				processor = this["read_cap_" + local];
				return processor;
			},
			
			/**
			 * Method: read_cap_Name
			 * 
			 * Reads the Name node of a WFS capabilities document
			 */
			read_cap_Name : function(obj,node) {
			    obj.name = this.getChildValue(node);
			},
			
			/**
			 * Method: read_cap_GetCapabilities
			 * 
			 * Reads the GetCapabilities node of a WFS capabilities document
			 */
			read_cap_GetCapabilities : function(obj,node) {
		        var getcapabilities = {
		                href: {}, // DCPType
		                formats: [] // ResultFormat
		            };
		        this.runChildNodes(getcapabilities, node);
		        obj.getcapabilities = getcapabilities;
		       
			},
			
			/**
			 * Method: read_cap_DescribeFeatureType
			 * 
			 * Reads the DescribeFeatureType node of a WFS capabilities document.
			 */
			read_cap_DescribeFeatureType : function(obj,node) {
		        var describefeaturetype = {
		                href: {}, // DCPType
		                formats: [] // ResultFormat
		            };
		        this.runChildNodes(describefeaturetype, node);
		        obj.describefeaturetype = describefeaturetype;
			},			
			/**
			 * Constant: CLASS_NAME
			 * - oscar.Format.WFSCapabilities.v1
			 */
			CLASS_NAME :"oscar.Format.WFSCapabilities.v1"
		});
