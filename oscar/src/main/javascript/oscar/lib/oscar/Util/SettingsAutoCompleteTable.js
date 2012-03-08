/*
 * CARIS oscar - Open Spatial Component ARchitecture
 *
 * Copyright 2012 CARIS <http://www.caris.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Class: oscar.Util.SettingsAutoCompleteTable
 * 
 * @deprecated
 */
oscar.Util.SettingsAutoCompleteTable = oscar.BaseClass({
	
    filterTag: null,
    displayTag: null,
    tableDisplayTag: null,
    
    /*
	 * The YUI data source.
	 */
    settingsDataSource: null,

    /*
	 * The YUI data table.
	 */
    settingsDataTable: null,
    
    /*
	 * The YUI auto complete widget.
	 */
    autoComplete: null,
    
    /**
	 * Property: dataTableConfig
	 * {Array} Table Configuration.
	 */
	dataTableConfig : null,
    
    /**
	 * Method: getDefaultTableConfiguration
	 * 
	 * Returns: 
	 * {Object} the object containing default settings for the data table.
	 */
	getDefaultTableConfiguration:function() {
		return {
			MSG_EMPTY:oscar.i18n("MICT_MSG_EMPTY"),
			MSG_ERROR:oscar.i18n("MICT_MSG_ERROR"),
			MSG_LOADING:oscar.i18n("MICT_MSG_LOADING"),
			MSG_SORTASC:oscar.i18n("MICT_MSG_SORTASC"),
			MSG_SORTDESC: oscar.i18n("MICT_MSG_SORTDESC"),
            scrollable:true, 
            width:"700px", 
            height:"300px",
            initialRequest: '?filter=' + YAHOO.util.Dom.get(filterTag).value + '&IECachePatch' + new Date().getTime()
		};
	},	
    
    initialize:function(filterTagIn, displayTagIn, tableDisplayTagIn) {
    	    
		filterTag = filterTagIn;
   	    displayTag = displayTagIn;
   	    tableDisplayTag = tableDisplayTagIn;
    	
   	    /*
		 * Add the custom formatter to the shortcuts.
		 */ 
   	    YAHOO.widget.DataTable.Formatter.statusFormatter= this.statusFormatter;
   	    YAHOO.widget.DataTable.Formatter.resetFormatter= this.resetFormatter;

        // Create a data source for the autoComplete to use.
    	    
   	    settingsDataSource = new YAHOO.util.XHRDataSource('getSettings');
	    settingsDataSource.responseType = YAHOO.util.XHRDataSource.TYPE_JSON;
	    settingsDataSource.connXhrMode = "queueRequests";
	    settingsDataSource.responseSchema = {
	             resultsList:"Response.Results",
	             fields:[
	             {key:"id"}, 
	             {key:"name"},
	             {key:"value"},
	             {key:"defaultValue"},
	             {key:"type"}
	             ]
	     };
        var autoCompleteDataSource = new YAHOO.util.FunctionDataSource(this.getSettings);  
        autoCompleteDataSource.queryMatchContains = true;  

        // Initialize the autocomplete widget, must have min length
        // set to 0 to manually clear the list.
        autoComplete = new YAHOO.widget.AutoComplete(filterTag, 
        		displayTag, autoCompleteDataSource);
        autoComplete.minQueryLength = 0;  

        // These external objects are used to pass the table data between
        // the ajaxUpdateValue and ajaxResetValue handlers.
        var tableUpdateCallback = null;
        var tableUpdateNewValue = null;
        var tableUpdateRecord = null;
        var tableResetRecord = null;
        
        /*
		 * This object wraps the request and callback logic for updating a
		 * value.
		 */
        var ajaxUpdateValue = {
	        handleSuccess:function(o) {
        		settingsDataSource.sendRequest('?filter=' + document.getElementById(filterTag).value, 
        			settingsDataTable.onDataReturnInitializeTable, settingsDataTable);
        		tcb = o.argument.tblCallback;
	    		tnv = o.argument.tblNewValue;
	    		var record = o.argument.tblRecord;
	    		var recordIdx = settingsDataTable.getRecordIndex(record)
	    		var data = record.getData(recordIdx);        		
	    		
	    		var r = YAHOO.lang.JSON.parse(o.responseText);
	    		
	    		if (r.Response.Results.status == true) {
	    			settingsDataTable.updateRow(record, data);
	    			displayMessage("info", r.Response.Results.message);
	    			tcb(true, tnv);
	    			settingsDataTable.render();
	    		} else {
	    			displayMessage("error", r.Response.Results.message);
	    			tcb(false);
	    		}
    		},
        	handleFailure:function(o) {
        		YAHOO.log("Failed to process XHR transaction.", "error");
        	},
        	startRequest:function(tableCallback, tableNewValue) {
        		ajaxUpdateCallback.argument.tblCallback = tableCallback;
        		ajaxUpdateCallback.argument.tblNewValue = tableNewValue;
        		ajaxUpdateCallback.argument.tblRecord = this.getRecord();
        		
        		var id = this.getRecord().getData('id');
        		YAHOO.util.Connect.asyncRequest('GET', 
        				'updateSetting?settingId=' + id + 
        				'&settingValue=' + tableNewValue, ajaxUpdateCallback);
        	}
        }
        
        /*
		 * This object wraps the request and callback logic for resetting a
		 * value.
		 */
        var ajaxResetValue = {
	        handleSuccess:function(o) {
	    	 	var record = o.argument.tblRecord;
	    	 	var recordIdx = settingsDataTable.getRecordIndex(record)
	    		var data = record.getData(recordIdx);        	
	    	 	
	        	var r = YAHOO.lang.JSON.parse(o.responseText);
	        	
	          	if (r.Response.Results.status == true) {
					data['value'] = data['defaultValue'];
	    			settingsDataTable.updateRow(record, data);
	    			displayMessage("info", r.Response.Results.message);
	    			settingsDataTable.render();
	          	} else {
	          		displayMessage("error", r.Response.Results.message);
	          	}
	    	},
        	handleFailure:function(o) {
              	YAHOO.log("Failed to process XHR transaction.", "error");
            },
            startRequest:function(record) {
            	ajaxResetCallback.argument.tblRecord = record;
            	
            	YAHOO.util.Connect.asyncRequest('GET', 
            			'resetSetting?settingId=' + record.getData('id'), 
            			ajaxResetCallback);
            }
        }
              
        // This will handle the response for the update action.
        var ajaxUpdateCallback = {
        	success:ajaxUpdateValue.handleSuccess,         
            failure:ajaxUpdateValue.handleFailure,
            scope:ajaxUpdateValue,
            argument:{tblCallback: tableUpdateCallback, 
        		tblNewValue: tableUpdateNewValue, tblRecord: tableUpdateRecord}
        };
              
        // This will handle the response for the reset action.
        var ajaxResetCallback = {
        	success:ajaxResetValue.handleSuccess,         
            failure:ajaxResetValue.handleFailure,
            scope:ajaxResetValue,
            argument:{tblRecord: tableResetRecord}
        };
        
        // Define the columns for the settings table.
        var settingColumnDefs = [
            {key:"name", 
             label:oscar.i18n("nameColumnLabel"),
             sortable:true,
             width:200},
            {key:"status",
             label:oscar.i18n("statusColumnLabel"),
             formatter:"statusFormatter",
             sortable:false,
             width:80},
            {key:"type",
             label:oscar.i18n("typeColumnLabel"),
             sortable:false,
             width:140},
            {key:"value",
           	 label:oscar.i18n("valueColumnLabel"),
             sortable:true,
             editor:new YAHOO.widget.TextboxCellEditor(
            		 {asyncSubmitter:ajaxUpdateValue.startRequest,LABEL_SAVE:oscar.i18n("saveButtonLabel"),
            			 LABEL_CANCEL:oscar.i18n("cancelButtonLabel")}), 
             width:170},
            {key:"reset",
           	 label:oscar.i18n("resetColumnLabel"),
             formatter:"resetFormatter",
             sortable:false,
             width:50}
        ];

        // Create an instance of the settings table wrapper.
        // Initialize the data source for the settings table.
	    settingsDataSource = new YAHOO.util.XHRDataSource('getSettings');
	    settingsDataSource.responseType = YAHOO.util.XHRDataSource.TYPE_JSON;
	    settingsDataSource.connXhrMode = "queueRequests";
	    settingsDataSource.responseSchema = {
	             resultsList:"Response.Results",
	             fields:[
	             {key:"id"}, 
	             {key:"name"},
	             {key:"value"},
	             {key:"defaultValue"},
	             {key:"type"}
	             ]
	    };

   	    this.dataTableConfig = this.getDefaultTableConfiguration();
        // Create the settings table.
        settingsDataTable = new YAHOO.widget.DataTable(tableDisplayTag, 
        		settingColumnDefs, settingsDataSource, this.dataTableConfig);

        /*
		 * Custom listener that highlights the editable cell.
		 */
        var highlightEditableCell = function(oArgs) {
            var elCell = oArgs.target;
            if(YAHOO.util.Dom.hasClass(elCell, "yui-dt-editable")) {
                this.highlightCell(elCell);
            }
        };

        /*
		 * Custom listener that detects if the reset button was clicked. If so,
		 * open a confirmation dialog.
		 */

        var resetValue = function(oArgs) {
        	
        	var target = oArgs.target;
        	var column = this.getColumn(target);
        	
        	// Limit the check to events on the reset column.
        	if(column.key == 'reset') {
        		var record = this.getRecord(target);
            	// Has the value been modified?
        		if(record.getData('value') != record.getData('defaultValue')) {
        			var confirmBox = new oscar.Gui.ConfirmDialog(
        					oscar.i18n("confirmBoxHeader"),
        					oscar.i18n("confirmReset"), {
        				yesCallback : function() {
        			        ajaxResetValue.startRequest(record);
                        	confirmBox.hide();
        				},
        				noCallback : function() {
        					confirmBox.hide();
        				}
        			});
        	    }
        	}
        }
        
        // Register the listeners to the events.
        settingsDataTable.subscribe("cellMouseoverEvent", highlightEditableCell);
        settingsDataTable.subscribe("cellMouseoutEvent", settingsDataTable.onEventUnhighlightCell);
        settingsDataTable.subscribe("cellClickEvent", settingsDataTable.onEventShowCellEditor);
        settingsDataTable.subscribe("cellClickEvent", resetValue);
        
        /*
		 * Display a given message in either the jsMessage or jsError div tags.
		 */
        var displayMessage = function(level, message) {
        	if(level == "error") {
            	YAHOO.util.Dom.get('jsMessage').innerHTML = '';
            	YAHOO.util.Dom.get('jsError').innerHTML = '<ul><li><span>' + message + '</span></li></ul>';
        	} else {
        		YAHOO.util.Dom.get('jsError').innerHTML = '';
            	YAHOO.util.Dom.get('jsMessage').innerHTML = '<ul><li><span>' + message + '</span></li></ul>';
        	}
        };
        
        return {
            oDS: settingsDataSource,
            oDT: settingsDataTable
        };
    },
    
    /*
	 * Method that queries the server for the settings. Bound to the settings
	 * data table.
	 */
    getSettings : function(query) {  
       settingsDataSource.sendRequest('?filter=' + query,  
               settingsDataTable.onDataReturnInitializeTable, settingsDataTable);
    },
    
    /*
	 * Method that creates a formatter used to indicate whether the default
	 * value has been changed.
	 */
    statusFormatter : function(elCell, oRecord, oColumn, oData) { 
       if(oRecord.getData("value") == oRecord.getData("defaultValue")) { 
           YAHOO.util.Dom.replaceClass(elCell.parentNode, "default", "modified"); 
           elCell.innerHTML = oscar.i18n("default");
       } else { 
           YAHOO.util.Dom.replaceClass(elCell.parentNode, "modified", "default"); 
           elCell.innerHTML = oscar.i18n("modified");
       } 
    },
    
    /*
	 * Method that resets formatter used to indicate whether the default value
	 * has been changed.
	 */
    resetFormatter : function(elCell, oRecord, oColumn, oData) { 
       if(oRecord.getData("value") == oRecord.getData("defaultValue")) { 
           YAHOO.util.Dom.replaceClass(elCell.parentNode, "default", "modified"); 
           elCell.innerHTML = '';
       } else { 
           YAHOO.util.Dom.replaceClass(elCell.parentNode, "modified", "default");
           elCell.innerHTML = '<div align="center"><a href="#"><img src="../images/configmanager/content_reset.png"/></a></div>'; 
       }
    },
    
    resetTable : function() {
    	settingsDataSource.sendRequest('?filter=', 
                settingsDataTable.onDataReturnInitializeTable, settingsDataTable);
    },
    
    CLASS_NAME :"oscar.Util.SettingsAutoCompleteTable"
});