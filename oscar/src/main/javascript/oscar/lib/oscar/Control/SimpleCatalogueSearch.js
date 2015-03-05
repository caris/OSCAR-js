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

oscar.Control.SimpleCatalogueSearch = oscar.BaseClass(oscar.Control.CatalogueSearchForm, {
    BANG : /!e/,
    form : null,
    basicSearch : true,
    handler : null,
    help : "help/simple-search.html",
    spatialSearch : null,
    initialize : function(options) {
        oscar.Control.CatalogueSearchForm.prototype.initialize.apply(this, arguments);
        this.spatialSearch = new oscar.Control.Box({
            allowPanning : false,
            keyMask : OpenLayers.Handler.MOD_CTRL
        });
        this.spatialSearch.events.on({
            "done" : this.buildSpatial,
            scope : this
        });
        
        this.events.on({
            "search" : this.preprocessQuery,
            scope : this
        });
    },
    helpLocation : function() {
        return oscar._getScriptLocation() + this.help;
    },
    preprocessQuery : function(query) {
        // check for advanced search flag.
        if (this.bangLookup(query) || query.trim().length === 0) {
            return;
        }
        
        // build the query filter string
        var queryArray = [];
        for (var i = 0; i < this.catalogueService.defaultSearchFields.length; i++) {
            var queryString = "";
            queryString += this.catalogueService.defaultSearchFields[i] + " LIKE ";
            queryString += "'" + query + "'";
            queryArray.push(queryString);
        }
        this.searchHandler.events.triggerEvent("displayfilter", queryArray.join(" OR "));
        this.performSearch(queryArray.join(" OR "));
    },
    bangLookup : function(query) {
        var hasMatch = function(text, pattern) {
            if (pattern instanceof RegExp) {
                return pattern.exec(text);
            } else {
                return pattern(text);
            }
        };
        var hasBang = false;
        while ((matches = hasMatch(query, this.BANG))) {
            if (!hasBang) {
                hasBang = true;
            }
            var match = matches[0];
            query = query.replace(match, "").trim();
        }
        if (hasBang) {
            this.searchHandler.events.triggerEvent("advancedSearch", query.trim());
            return true;
        }
        return false;
    },
    draw : function() {
        oscar.Control.CatalogueSearchForm.prototype.draw.apply(this, arguments);
        this.input = $$("<input type='text' id='q' size='50' value=''>");
        this.input.button().css({
            'text-align' : 'left',
            'outline' : 'none',
            'cursor' : 'text'
        });
        if (this.defaultText) {
            this.input.val(this.defaultText);
        }
        this.map.addControl(this.spatialSearch);
        this.spatialSearch.activate();
        this.form.append(this.input);
        this.button = $$("<button></button").html(oscar.i18n("Search"));
        
        this.form.append(this.button);
        this.form.append(this.spatialButton);
        this.addHelp("Help", this.form);
        
        var scope = this;
        this.button.button({
            icons : {
                primary : "ui-icon-search"
            },
            text : true
        }).click($$.proxy(function() {
            
            this.events.triggerEvent("search", this.input.val());
        }, this));
        
        return this.div;
    },
    toggleFeatureSelection : function(forceDeactivate) {
        var selFeatures = this.map.getControlsByClass("OpenLayers.Control.SelectFeature");
        for (var i = 0; i < selFeatures.length; i++) {
            if (forceDeactivate) {
                selFeatures[i].deactivate();
            } else {
                selFeatures[i].activate();
            }
        }
    },
    buildSpatial : function(geom) {
        var query = {
            spatial : geom.getBounds(),
            projection : this.map.getProjection(),
            type : oscar.Handler.CSW.prototype.SPATIAL
        }
        var criteria = new oscar.QueryType(oscar.QueryType.prototype.SPATIAL, query);
        this.searchHandler.search(criteria);
    },
    CLASS_NAME : "oscar.Control.SimpleCatalogueSearch"
});