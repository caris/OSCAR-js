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
/**
 * Class: oscar.Format.CSW
 * 
 * The base CSW format class.
 */

oscar.Format.CSW = new oscar.BaseClass(OpenLayers.Format.XML, {
    initialize : function(options) {
        OpenLayers.Format.prototype.initialize.apply(this, [ options ]);
        this.options = options;
    },

    read : function(data) {
        if (typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [ data ]);
        }
        var root = data.documentElement;
        var version = this.version || root.getAttribute("version") || this.defaultVersion;
        var rootNodeName = root.nodeName;
        var constr = this.findConstructor(root.nodeName, version);
        if (!constr) {
            throw "Cannot find a CSW " + root.nodeName + " parser for version " + version;
        }
        var parser = new constr(this.options);
        var obj = parser.read(data);
        obj.version = version;
        return obj;
    },
    findConstructor : function(operationType, version) {
        try {
            return oscar.Format.CSW["v" + version.replace(/\./g, "_")][operationType];
        } catch (err) {
            return null;
        }

    },
    CLASS_NAME : "oscar.Format.CSW"
});