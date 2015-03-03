/**
 * Class: oscar.ogc.CatalogueService
 * 
 * Used to represent a catalogue service.
 */
oscar.ogc.CatalogueService = new oscar.BaseClass(oscar.ogc.BaseService, {
	defaultSearchFields:[
		"csw:AnyText"
	],
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