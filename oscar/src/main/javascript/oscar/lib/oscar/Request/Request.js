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
 * Class: Request
 * 
 * This is a base Request class
 */

oscar.Request=new oscar.BaseClass({
	url:null,
	EVENT_TYPES:["success","failure"],
	events:null,
	params:null,
	properties:{},
	initialize:function(url,params,options){
		this.url = url,
		this.params = params;
		OpenLayers.Util.extend(this.properties,options);
		this.events = new OpenLayers.Events(this, null,
			this.EVENT_TYPES, false, {
				includeXY :false
		});
	},
		_success:function(resp) {
		try {
			$$("*").removeClass("olCursorWait");
		} catch (err) {oscar.debug(err.message);}
		this.success(resp);
	},
	_failure:function(resp) {
		try {
			$$("*").removeClass("olCursorWait");
		} catch (err) {oscar.debug(err.message);}
		this.events.triggerEvent("failure");
	},
	get:function() {
		OpenLayers.Util.extend(this.properties,{
			url:this.url,
			params:this.params,
			success:this._success,
			failure:this._failure,
			scope:this
		});
		try {
			$$("*").addClass("olCursorWait");
		} catch (err) {oscar.debug(err.message);}
		OpenLayers.Request.GET(this.properties);
		
	},
	CLASS_NAME:"oscar.Request"
});