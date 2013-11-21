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
 * Class: OGC
 * 
 * This is a base OGC request class.
 */
oscar.Request.OGC=new oscar.BaseClass(oscar.Request,{
	request:null,
	version:"1.0.0",
	initialize:function(url,params,options) {
		if(!params.version) {
			params.version = this.version;
		}
		oscar.Request.prototype.initialize.apply(this,[url,params,options]);
	},
	/**
	 * APIMethod: getService
	 * 
	 * Returns the service used for the request. This is to be overridden by all
	 * sub classes.
	 */
	getService:function() {
		oscar.debug(this.CLASS_NAME + " must implement the getService function");
		return null;
	},
	CLASS_NAME:"oscar.Request.OGC"
});