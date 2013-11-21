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
 * Class: WCSFindCoverage
 * 
 * This is a formatter class for reading FindCoverage responses.
 */

oscar.Format.WCSFindCoverage = oscar.BaseClass(OpenLayers.Format.XML, {
	read:function(data) {
		if (typeof data == "string") {
			data = OpenLayers.Format.XML.prototype.read.apply(this,
			[ data ]);
		}
		var root = data.documentElement
		var coverages = {};
		this.runChildNodes(coverages,root);
		return coverages;
	},
	runChildNodes:function(obj,node) {
		var children = node.childNodes;
		for(var i=0;i<children.length;++i) {
			child = children[i];
			if(child.nodeType == 1) {
				processor = this.readers[child.nodeName.split(":").pop()];
				if(processor) {
					processor.apply(this,[obj,child]);
				}
			}
		}
	},
	readers: {
		"CoverageSummary":function(obj,node) {
			if(obj.coverages==null) {
				obj.coverages=[];
			}
			var summary = {title:null,identifiers:null}
			this.runChildNodes(summary,node);
			obj.coverages.push(summary);
			
		},
		"Title":function(obj,node) {
			obj.title = this.getChildValue(node);
		},
		"Identifier":function(obj,node) {
			obj.identifier =this.getChildValue(node);
		},
		"WGS84BoundingBox":function(obj,node) {
			var bbox = [];
			this.runChildNodes(bbox,node);
			obj.bounds = new OpenLayers.Bounds(bbox[0],
				bbox[1],
				bbox[2],
				bbox[3]
			);
		},
		"LowerCorner":function(arr,node) {
			var xy = this.getChildValue(node).split(" ");
			arr.push(parseFloat(xy[0]));
			arr.push(parseFloat(xy[1]));
			
		},
		"UpperCorner":function(arr,node){
			var xy = this.getChildValue(node).split(" ");
			arr.push(parseFloat(xy[0]));
			arr.push(parseFloat(xy[1]));
		}
	},
	CLASS_NAME:"oscar.Format.WCSFindCoverage"
});