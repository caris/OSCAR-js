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
 * Class: oscar.ogc.CatalogueService
 * 
 * Used to represent a catalogue service.
 */
oscar.ogc.CatalogueService = new oscar.BaseClass(oscar.ogc.BaseService, {
    defaultSearchFields : [ "csw:AnyText" ],
    GETRECORDBYID : "GetRecordById",
    GETRECORDS : "GetRecords",
    initialize : function(serviceEntry, options) {
        oscar.ogc.BaseService.prototype.initialize.apply(this, [ serviceEntry, options ]);
    },
    /**
     * APIMethod: isSetDefaultOutputSchema
     * 
     * Returns: true or false if there is a default output schema value set.
     */
    isSetDefaultOutputSchema : function() {
        if (this.serviceEntry.attributes && this.serviceEntry.attributes.outputSchema) {
            return true;
        }
    },
    /**
     * APIMethod: getDefaultOutputSchema
     * 
     * Returns: String The default output schema.
     */
    getDefaultOutputSchema : function() {
        if (this.serviceEntry.attributes && this.serviceEntry.attributes.outputSchema) {
            return this.serviceEntry.attributes.outputSchema;
        }
    },
    CLASS_NAME : "oscar.ogc.CatalogueService"
});