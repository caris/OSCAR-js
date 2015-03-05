/*
 * CARIS oscar - Open Spatial Component ARchitecture
 *
 * Copyright 2014 CARIS <http://www.caris.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
oscar.Util.Parser = new oscar.BaseClass({
	EVENT_TYPES:['parseerror','parsesuccess'],
	events:null,
	initialize:function(parser) {
		this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES, false);
		this.parser = parser;
		this.parser.yy.parseError = $$.proxy(this.parseError,this);
	},
	parse:function(str) {
		this.parser.parse(str);
		this.events.triggerEvent('parsesuccess',str);
	},	
	parseError:function(msg,hash) {
		this.events.triggerEvent('parseerror',hash);
		throw new oscar.Util.ParserError('parser error', hash);
	},
	CLASS_NAME:"oscar.Util.Parser"
});

oscar.Util.ParserError = function(msg,hash) {
	this.msg = msg;
	this.hash = hash;

},
oscar.Util.ParserError.prototype = new Error;
