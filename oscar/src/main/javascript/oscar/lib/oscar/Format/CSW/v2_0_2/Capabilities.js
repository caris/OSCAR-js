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
 * Class: oscar.Format.CSW.v2_0_2.Capabilities
 * 
 * Formatter for reader the capabilities response for a Catalogue service.
 */
oscar.Format.CSW.v2_0_2.Capabilities = new oscar.BaseClass(OpenLayers.Format.XML, oscar.Format.OGC.ows.v1_0_0, oscar.Format.OGC.Filter.v1_1_0, {
    initialize : function() {
    },
    read : function(data) {
        if (typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.apply(this, [ data ]);
        }
        var obj = {};
        var root = data.documentElement;
        this.runChildNodes(obj, root);
        return obj;
    },
    runChildNodes : function(obj, node) {
        var children = node.childNodes;
        var child, processor;
        for (var child=0;child<children.length;child++) {
            childNode = children[child];
            if (childNode.nodeType == 1) {
                processor = this.getProcessor(childNode);
                if (processor) {
                    processor.apply(this, [ obj, childNode ]);
                }
            }
        }
    },
    getProcessor : function(childNode) {
        var proc = null;
        var localName = (childNode.localName) ? childNode.localName : childNode.baseName;
        try {
            proc = this.readers[childNode.prefix][localName];
        } catch (err) {
            proc = this["read_cap_" + localName]
        }
        return proc || this["read_cap_" + localName];
    },
    CLASS_NAME : "oscar.Format.CSW.v2_0_2.Capabilities"
});