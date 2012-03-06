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
 * Class: oscar.Format.WCSDescribeCoverage.v1
 * 
 * Reads a WCS DescribeCoverage document version 1.0
 * 
 * Inherits from:
 * 
 * <OpenLayers.Format.XML>
 */
oscar.Format.WCSDescribeCoverage.v1 = oscar.BaseClass(OpenLayers.Format.XML, {
	/**
	 * Constructor: oscar.Format.WCSDescribeCoverage.v1
	 */
	initialize : function(options) {
		OpenLayers.Format.XML.prototype.initialize.apply(this, [ options ]);
		this.options = options;
	},
	/**
	 * Method:read
	 * 
	 */
	read : function(data) {
		if (typeof data == "string") {
			data = OpenLayers.Format.XML.prototype.read.apply(this, [ data ]);
		}
		var capabilities = {};
		var root = data.documentElement;
		this.runChildNodes(capabilities, root);
		return capabilities;
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
				processor = this["read_cap_"
						+ childNode.nodeName.split(":").pop()];
				if (processor) {
					processor.apply(this, [ obj, childNode ]);
				}
			}
		}
	},
	
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Format.WCSDescribeCoverage.v1
	 */
	CLASS_NAME :"oscar.Format.WCSDescribeCoverage.v1"
});