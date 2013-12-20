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
 * Class: GetAttributes
 * 
 * This class handles GetAttributes requests.
 */

oscar.Request.OGC.WCS.GetAttributes = new oscar.BaseClass(oscar.Request.OGC.WCS, {
	xsltLocation:oscar._getScriptLocation() + "resources/GetAttributes.xsl",
	initialize:function(url,identifier,options) {
		var parameters = this.getParameters();
		if(identifier) {
			OpenLayers.Util.extend(parameters, {
				"identifier":identifier
			});
		}
		oscar.Request.OGC.WCS.prototype.initialize.apply(this,[
			url,parameters,options
		]);
	},
	success:function(resp) {
		var result = (resp.responseXML)?resp.responseXML:resp.responseText;
		var $html = this._transformResults(result);
		this.events.triggerEvent("success",$html);
	},
	
	/**
	 * Method: _transformResults
	 * 
	 * This method makes a request to the GetAttributes xsl transformation stylesheet
	 * and transforms the response xml into html which will then be passed on with the 
	 * success event.
	 * 
	 * Parameters: 
	 * 
	 * xml - The response xml from the GetAttributes operation.
	 */
	_transformResults:function(xml) {
		var xslt=null;
		OpenLayers.Request.GET({
			url:this.xsltLocation,
			async:false,
			success:function(resp) {
				xslt = resp.responseXML;
			},
			failure:function(resp) {
				oscar.debug("Unable to obtain xslt at " + this.xsltLocation);
			},
			scope:this
		});

		if(!xslt) {
			return $$("<div></div>");
		} 
		var html = oscar.Util.Transform.transform(xml,xslt);
		return $$(html);
	},
	
	/**
	 * Method: getRequest
	 * 
	 * Returns the GetAttributes request value.
	 */
	getRequest:function() {
		return "GetAttributes";
	},
	
	/**
	 * Method: getParamters
	 * 
	 * Returns the parameters object containing the request and version.
	 */
	getParameters:function() {
		return {
			"request":this.getRequest(),
			"version":"1.1.0"
		}
	},
	
	/**
	 * Constant: CLASS_NAME
	 * 
	 * The Class name.
	 */
	CLASS_NAME:"oscar.Request.OGC.WCS.GetAttributes"
});