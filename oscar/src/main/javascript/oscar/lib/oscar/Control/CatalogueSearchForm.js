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
 * Class: oscar.Control.CatalogueSearchForm 
 * 
 * Inherits from:  
 * - <oscar.Control>
 * 
 */

oscar.Control.CatalogueSearchForm = oscar.BaseClass(oscar.Control,{
    EVENT_TYPES:["search"],
    form:null,
    basicSearch:true,
    handler:null,
    ui:null,
    initialize:function(options) {
        this.EVENT_TYPES = oscar.Control.CatalogueSearchForm.prototype.EVENT_TYPES.concat(oscar.Control.prototype.EVENT_TYPES);
        oscar.Control.prototype.initialize.apply(this,[options]);
        this.events.register("search",this,this.search);
        
    },
    setMap:function(map) {
        oscar.Control.prototype.setMap.apply(this,[map]);
    },
    draw:function() {
        this.div = oscar.Control.prototype.draw.apply(this,arguments);
        this.form = $$("<form onSubmit='return false;'></form>");
        this.input = $$("<input type='text' id='q' size='50' value=''>");
        this.input.button().css({
            'text-align' : 'left',
            'outline' : 'none',
            'cursor' : 'text'
        });
        if(this.defaultText) {
            this.input.val(this.defaultText);
        }
        this.form.append(this.input);
        this.button = $$("<button></button").html(oscar.i18n("Search"));
        this.form.append(this.button);
        var scope = this;
        this.button.button({
            icons : {
                primary : "ui-icon-search"
            },
            text : false
        }).click(function() {
            var criteria = {
                q:scope.input.val(),
                spatial:scope.map.getExtent()
            };
            if(scope.basicSearch) {
            } else {}//advanced
            scope.events.triggerEvent("search",criteria);
        });
        
        
        $$(this.div).append(this.form);
        return this.div;
    },
    CLASS_NAME:"oscar.Control.CatalogueSearchForm"
});