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