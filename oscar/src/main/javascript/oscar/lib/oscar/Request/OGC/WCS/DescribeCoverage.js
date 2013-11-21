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
 * Class: DescribeCoveragae
 * 
 * This class handles WCS DescribeCoverage requests.
 */

oscar.Request.OGC.WCS.DescribeCoverage=new oscar.BaseClass(oscar.Request.OGC.WCS,{
	identifiers:null,
	version:"1.1.0",
	initialize:function(url,identifiers,options){
		var params = OpenLayers.Util.extend({}, {
			request:this.getRequest(),
			version:this.version,
			identifiers:identifiers
		});
		
		oscar.Request.OGC.WCS.prototype.initialize.apply(this,[
			url,
			params,
			options
		]);
	},
	success:function(resp) {
		var parser = new oscar.Format.WCSDescribeCoverage({
			version:this.version
		});
		results = parser.read(resp.responseText);
		this.events.triggerEvent("success",results);
	},
	getRequest:function() {
		return "DescribeCoverage"
	},
	CLASS_NAME:"oscar.Request.OGC.WCS.DescribeCoverage"
});