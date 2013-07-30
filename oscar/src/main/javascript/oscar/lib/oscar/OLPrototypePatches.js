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
 * This file contains patches for OpenLayers objects
 */

/**
 * Method: outerBoundaryIs
 * 
 * Reads the outerBoundaryIs node from a GML3 response
 */
OpenLayers.Format.GML.v3.prototype.readers["gml"].outerBoundaryIs = function(node,obj) {
		  this.readChildNodes(node,obj);
		  obj.outer = obj.components[0];
	};


OpenLayers.Format.WFSCapabilities.v1_0_0.prototype.readers["wfs"]["LatLongBoundingBox"]  = function(node,obj) {
	var boundingBox = {};
	var maxx= node.getAttribute("maxx");
	var maxy= node.getAttribute("maxy");
	var minx= node.getAttribute("minx");
	var miny= node.getAttribute("miny");
	var bounds = new OpenLayers.Bounds(minx,miny,maxx,maxy);
	obj.bounds = bounds;
}