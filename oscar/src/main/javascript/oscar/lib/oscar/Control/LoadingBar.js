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
* Class: oscar.Control.LoadingBar
* A loading bar panel.
* 
* Inherits from:  
* - <oscar.Control>
* 
*/

oscar.Control.LoadingBar = oscar.BaseClass(oscar.Control,{
	initialize:function(options) {
		oscar.Control.prototype.initialize.apply(this,[options]);
	},
	
	draw:function(px) {
		OpenLayers.Control.prototype.draw.apply(this, arguments);
		$$(this.div);
		this.hide();
		return this.div;
	},
	
	show:function() {
		$$(this.div).show();
	},
	
	hide:function() {
		$$(this.div).hide();
	},
	
	CLASS_NAME:"oscar.Control.LoadingBar"
});