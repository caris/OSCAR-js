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
 * Class: oscar.Layer.GetCoveragePreview
 * 
 * Inherits from: 
 * - <OpenLayers.Layer.WMS>
 */

oscar.Layer.GetCoveragePreview = oscar.BaseClass(OpenLayers.Layer.WMS, {
	initialize:function(name,url,params,options) {
		params.FORMAT="image/png";
		OpenLayers.Layer.WMS.prototype.initialize.apply(this,[name,url,params,options]);
	},
	getFullRequestString:function(newparams,altUrl) {
		var resolution = this.map.getResolution();
		newparams.GRIDOFFSETS = resolution + "," + (resolution*-1);
		newparams.IDENTIFIER = this.params.IDENTIFIER;
		newparams.SERVICEENDPOINT = this.params.SERVICEENDPOINT;
		newparams.RANGESUBSET = this.params.RANGESUBSET;
		newparams.GRIDBASECRS = oscar.Util.EpsgConversion.epsgToUrn(this.map.getProjection())
		
		return OpenLayers.Layer.WMS.prototype.getFullRequestString.apply(this,[newparams,altUrl]);
	},
	CLASS : "oscar.Layer.GetCoveragePreview"
})