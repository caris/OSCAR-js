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
 * Class: oscar.FramedCloud
 * 
 * Inherits from: 
 * - <OpenLayers.Popup.FramedCloud>
 */

oscar.FramedCloud = oscar.BaseClass(OpenLayers.Popup.FramedCloud, {
	/**
	 * Property: positionBlocks
	 * {Object} Hash of different position blocks, keyed by relativePosition
	 *          two-character code string (ie "tl", "tr", "bl", "br")
	 */
	positionBlocks : {
		"tl" : {
			'offset' :new OpenLayers.Pixel(51, 4),
			'padding' :new OpenLayers.Bounds(8, 40, 8, 9),
			'blocks' : [ { // top-left
						size :new OpenLayers.Size('auto', 'auto'),
						anchor :new OpenLayers.Bounds(0, 51, 22, 0),
						position :new OpenLayers.Pixel(0, 0)
					}, { //top-right
						size :new OpenLayers.Size(22, 'auto'),
						anchor :new OpenLayers.Bounds(null, 50, 0, 0),
						position :new OpenLayers.Pixel(-638, 0)
					}, { //bottom-left
						size :new OpenLayers.Size('auto', 19),
						anchor :new OpenLayers.Bounds(0, 32, 22, null),
						position :new OpenLayers.Pixel(0, -631)
					}, { //bottom-right
						size :new OpenLayers.Size(22, 18),
						anchor :new OpenLayers.Bounds(null, 32, 0, null),
						position :new OpenLayers.Pixel(-638, -632)
					}, { // stem
						size :new OpenLayers.Size(80, 40),
						anchor :new OpenLayers.Bounds(null, 0, 0, null),
						position :new OpenLayers.Pixel(0, -681)
					} ]
		},
		"tr" : {
			'offset' :new OpenLayers.Pixel(-54, 4),
			'padding' :new OpenLayers.Bounds(8, 40, 8, 9),
			'blocks' : [ { // top-left
						size :new OpenLayers.Size('auto', 'auto'),
						anchor :new OpenLayers.Bounds(0, 51, 22, 0),
						position :new OpenLayers.Pixel(0, 0)
					}, { //top-right
						size :new OpenLayers.Size(22, 'auto'),
						anchor :new OpenLayers.Bounds(null, 50, 0, 0),
						position :new OpenLayers.Pixel(-638, 0)
					}, { //bottom-left
						size :new OpenLayers.Size('auto', 19),
						anchor :new OpenLayers.Bounds(0, 32, 22, null),
						position :new OpenLayers.Pixel(0, -631)
					}, { //bottom-right
						size :new OpenLayers.Size(22, 19),
						anchor :new OpenLayers.Bounds(null, 32, 0, null),
						position :new OpenLayers.Pixel(-638, -631)
					}, { // stem
						size :new OpenLayers.Size(80, 40),
						anchor :new OpenLayers.Bounds(0, 0, null, null),
						position :new OpenLayers.Pixel(-215, -681)
					} ]
		},
		"bl" : {
			'offset' :new OpenLayers.Pixel(41, -24),
			'padding' :new OpenLayers.Bounds(8, 9, 8, 40),
			'blocks' : [ { // top-left
						size :new OpenLayers.Size('auto', 'auto'),
						anchor :new OpenLayers.Bounds(0, 21, 22, 32),
						position :new OpenLayers.Pixel(0, 0)
					}, { //top-right
						size :new OpenLayers.Size(22, 'auto'),
						anchor :new OpenLayers.Bounds(null, 21, 0, 32),
						position :new OpenLayers.Pixel(-638, 0)
					}, { //bottom-left
						size :new OpenLayers.Size('auto', 21),
						anchor :new OpenLayers.Bounds(0, 0, 22, null),
						position :new OpenLayers.Pixel(0, -629)
					}, { //bottom-right
						size :new OpenLayers.Size(22, 21),
						anchor :new OpenLayers.Bounds(null, 0, 0, null),
						position :new OpenLayers.Pixel(-638, -629)
					}, { // stem,
						size :new OpenLayers.Size(80, 40),
						anchor :new OpenLayers.Bounds(null, null, 0, 0),
						position :new OpenLayers.Pixel(-100, -674)
					} ]
		},
		"br" : {
			'offset' :new OpenLayers.Pixel(-61, -24),
			'padding' :new OpenLayers.Bounds(8, 9, 8, 40),
			'blocks' : [ { // top-left
						size :new OpenLayers.Size('auto', 'auto'),
						anchor :new OpenLayers.Bounds(0, 21, 22, 32),
						position :new OpenLayers.Pixel(0, 0)
					}, { //top-right
						size :new OpenLayers.Size(22, 'auto'),
						anchor :new OpenLayers.Bounds(null, 21, 0, 32),
						position :new OpenLayers.Pixel(-638, 0)
					}, { //bottom-left
						size :new OpenLayers.Size('auto', 21),
						anchor :new OpenLayers.Bounds(0, 0, 22, null),
						position :new OpenLayers.Pixel(0, -629)
					}, { //bottom-right
						size :new OpenLayers.Size(22, 21),
						anchor :new OpenLayers.Bounds(null, 0, 0, null),
						position :new OpenLayers.Pixel(-638, -629)
					}, { // stem
						size :new OpenLayers.Size(80, 40),
						anchor :new OpenLayers.Bounds(0, null, null, 0),
						position :new OpenLayers.Pixel(-310, -674)
					} ]
		}
	},
	/**
	 * Property: imageSize
	 */
	imageSize :new OpenLayers.Size(676, 736),
	/**
	 * Constructor: oscar.FramedCloud
	 * 
	 * Parameters: 
	 * id - {String} a unique id of the popup. If null is passed an identifier will be automatically generated.
	 * lonlat - {OpenLayers.LonLat} a longitude and latitude pair. The position on the map the popup will be shown.
	 * contentSize - {OpenLayers.Size} a width/height pair size of the content.
	 * contentHTML - {String} the HTML content to be displayed inside the popup.
	 * anchor - {Object} object to which we�ll anchor the popup.
	 * closeBox - {Boolean} whether to display a close box inside the popup. 
	 * closeBoxCallback - {Function} Function to be called on closeBox click.
	 */
	initialize : function(id, lonlat, contentSize, contentHTML, anchor,
			closeBox, closeBoxCallback) {
		OpenLayers.Popup.FramedCloud.prototype.initialize
				.apply(this, arguments);
		this.imageSrc = oscar.getImagePath()
				+ "cloud_popup_relative_outlined_a.png";
	},
	/**
	 * APIMethod: destroy
	 */
	destroy : function() {
		OpenLayers.Popup.FramedCloud.prototype.destroy.apply(this, arguments);
	},
	/**
	 * Constant: CLASS_NAME
	 *  - oscar.Popup.FramedCloud 
	 */
	CLASS_NAME :'oscar.Popup.FramedCloud'
});