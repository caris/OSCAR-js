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
oscar.QueryType = new oscar.BaseClass({
    TEXT : 1,
    SPATIAL : 2,
    query : null,
    type : null,
    initialize : function(type, query, options) {
        if (this.options) {
            OpenLayers.Util.extend(this, options);
        }
        this.type = type;
        this.query = query;
    },
    toFilter : function() {
        switch (this.type) {
            case 1:
                return this._buildTextualFilter();
            case 2:
                return this._buildSpatialFilter();
            default:
                return null;
        }
    },
    _buildTextualFilter : function() {
        var formatter = new OpenLayers.Format.CQL();
        return formatter.read(this.query);
    },
    _buildSpatialFilter : function() {
        var spatial_filter = new OpenLayers.Filter.Comparison({
            type : OpenLayers.Filter.Spatial.BBOX,
            property : "ows:BoundingBox",
            value : this.query.spatial,
            projection : this.query.projection
        });
        return spatial_filter;
    },
    CLASS_NAME : "oscar.Query"
});
