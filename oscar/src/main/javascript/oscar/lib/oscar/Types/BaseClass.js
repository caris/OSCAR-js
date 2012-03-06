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
 * Class: oscar.BaseClass
 * 
 * The base class of all Oscar objects.
 * 
 */
oscar.BaseClass = function() {
    var Class = function() {
    	this.initialize.apply(this, arguments);
    	
    };
    var extended = {};
    var parent;
    for(var i=0, len=arguments.length; i<len; ++i) {
        
        if(typeof arguments[i] == "function") {
            parent = arguments[i].prototype;
        } else {
            
            parent = arguments[i];
        }
        OpenLayers.Util.extend(extended, parent);
    }
    Class.prototype = extended;
    return Class;
};

