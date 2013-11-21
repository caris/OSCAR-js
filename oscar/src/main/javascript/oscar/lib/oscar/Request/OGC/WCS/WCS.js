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
 * Class: oscar.Request.OGC.WCS
 * 
 * This is base class for all WCS related requests.
 */

oscar.Request.OGC.WCS=new oscar.BaseClass(oscar.Request.OGC,{
	/**
	 * Property: service
	 * 
	 * Default WCS Servioce
	 */
	service:"WCS",
	initialize:function(url,params,options) {
		OpenLayers.Util.extend(params,{
			service:this.getService()
		});
		oscar.Request.OGC.prototype.initialize.apply(this,[
			url,
			params,
			options
		]);
	},
	/**
	 * 
	 */
	getService:function() {
		return "WCS";
	},
	/**
	 * APIMethod: getRequest
	 * 
	 * Returns the request type. This is to be overridded by all subclasses.
	 */
	getRequest:function() {
		oscar.debug(this.CLASS_NAME + " must implement the getRequest function");
		return null;
	},
	CLASS_NAME:"oscar.Request.OGC.WCS"
});