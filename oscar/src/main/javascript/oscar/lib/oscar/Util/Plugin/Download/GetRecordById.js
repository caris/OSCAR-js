oscar.Util.Plugin.Download.GetRecordById = new oscar.BaseClass(oscar.Util.Plugin.Download, {
    pluginType : "OGC:CSW-2.0.0-http-get-record-by-id",
    icon : "ui-icon-arrowthickstop-1-s",
    defaultOutputSchema : "http://www.isotc211.org/2005/gmd",
    outputSchema : null,
    initialize : function(options) {
        oscar.Util.Plugin.Download.prototype.initialize.apply(this, [ options ]);
    },
    getOutputSchema : function() {
        if (this.outputSchema == null) {
            return this.defaultOutputSchema;
        }
        return this.outputSchema;
    },
    /**
     * @Override
     * @see oscar.Util.Plugin
     */
    play : function() {
        url = oscar.Util.buildUrl(this.link.url, {
            request : "GetRecordById",
            service : "CSW",
            version : "2.0.2",
            id : this.record.identifier[0].value,
            outputSchema : this.getOutputSchema()
        });

        downloadGui = new oscar.Gui.Download();
        downloadGui.downloadFromService(url, this.record.identifier[0].value, oscar.ISOMetadataDownloadProxy);
    },
    CLASS_NAME : "oscar.Util.Plugin.Download.GetRecordById"
});

oscar.getPluginManager().register(oscar.Util.Plugin.Download.GetRecordById.prototype.pluginType, oscar.Util.Plugin.Download.GetRecordById);