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
        for ( var child in children) {
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
        try {
            proc = this.readers[childNode.prefix][childNode.localName];
        } catch (err) {
            proc = this["read_cap_" + childNode.localName]
        }
        return proc || this["read_cap_" + childNode.localName];
    },
    CLASS_NAME : "oscar.Format.CSW.v2_0_2.Capabilities"
});