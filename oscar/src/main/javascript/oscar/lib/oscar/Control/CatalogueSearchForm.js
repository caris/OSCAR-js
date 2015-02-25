/*
 * CARIS oscar - Open Spatial Component ARchitecture
 * 
 * Copyright 2012 CARIS <http://www.caris.com>
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
/**
 * Class: oscar.Control.CatalogueSearchForm
 * 
 * Inherits from: - <oscar.Control>
 * 
 */

 oscar.Control.CatalogueSearchForm  = oscar.BaseClass(oscar.Control, {
        EVENT_TYPES : [ "search" ],
        events:null,
        initialize:function(options) {
            this.EVENT_TYPES = this.EVENT_TYPES.concat(oscar.Control.prototype.EVENT_TYPES);
        oscar.Control.prototype.initialize.apply(this, [ options ]);
                this.catalogueService = this.catalogueServices[0];
        },
        performSearch:function(queryString) {
                this.searchHandler.search(queryString);
        },
        setMap : function(map) {
        oscar.Control.prototype.setMap.apply(this, [ map ]);
    },
        draw:function(options) {
                oscar.Control.prototype.draw.apply(this,arguments);
                this.form = $$("<form onSubmit='return false;'></form>");
                $$(this.div).append(this.form);
        },
        addHelp:function(container) {
                whatsThis = new oscar.Gui.Info();
                whatsThis.appendTo(container);
                whatsThis.events.on({
                        'whatsthis':this.showHelp,
                        scope:this
                });
        },
        CLASS_NAME:'oscar.COntrol.CatalogueSearchForm'
 });