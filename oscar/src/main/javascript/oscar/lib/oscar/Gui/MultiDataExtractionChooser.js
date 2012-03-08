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
 * Class: oscar.Gui.MultiDataExtractionChooser
 * 
 * The Oscar MultiDataExtractionChooser widget.
 * 
 * Inherits from: 
 * - <oscar.Gui.MultiItemChooserTable>
 * 
 * @deprecated
 */
oscar.Gui.MultiDataExtractionChooser = oscar.BaseClass( {

	/**
	 * Property: clearSelections
	 * {Boolean} flag to reset the checkboxes when user selects another data connection.
	 */
	clearSelections: true,
	
	/**
	 * Constructor: oscar.Gui.MultiDataExtractionChooser
	 * 
	 * Parameters: 
	 * div - {String} The tag id that the multiItemChooserTable filter is attached to. 
	 * mdec_type - {String} whether it's a WCS or a WFS, helps in determining what to put in the header of the data table. 
	 * preSelectedItemsIn - {Array(String)} The items that will be selected by default. 
	 * extractionConnections - {Array(Object)} The data connections that will be used to create the radio button list.
	 * DataSourceIn - {YAHOO.util.XHRDataSource} The data source the SRSs come from.
	 * idFieldKeyIn - {String} the key of the id field in resultList returned by the data source.
	 * titleFieldKeyIn - {String} the key of the description field in resultList returned by the data source. 
	 * requestParameter - {String} The request parameter used in the getItems method.
	 */
	initialize:function(div, mdec_type, preSelectedItemsIn, extractionConnections, DataSourceIn, idFieldKeyIn, titleFieldKeyIn, requestParameter) {
		
		this.preSelectedItemsIn = preSelectedItemsIn;
		this.DataSourceIn = DataSourceIn;
		this.requestParameter = requestParameter;
		
		if (div){
			this.container = div;
		} else {
			var globalDiv = document.createElement("div");
			globalDiv.setAttribute("id",OpenLayers.Util.createUniqueID("MultiDataExtractionChooser"));
			this.container = globalDiv;
		}
		
		if (mdec_type.toLowerCase() == "wcs"){
			titleHeaderText = oscar.i18n("mdec_coverage_type");
		} else {
			titleHeaderText = oscar.i18n("mdec_feature_type");
		}
	
		this.columnDefs = [ {
			key : "check",
			label : "",
			sortable : true,
			sortOptions: { sortFunction: this.checkboxSortFunction },
			formatter : "checkbox",
			width : 30
		},{
	        key : idFieldKeyIn,
	        label : "Id",
	        sortable : false,
	        hidden:true,
	        isCheckboxCol : true, 
	        width : 50
	    }, {
	        key : titleFieldKeyIn,
	        label : titleHeaderText,
	        sortable : false,
	        width : 300
	    }];
	    
		if (extractionConnections.length > 0) {
			this.buildDataConnList(extractionConnections);
			this.buildMultiItemChooserTable();
		} else {
			return null;
		}
		
	},
	
	/**
	 * Method : setDatasource 
	 * Sets the data source of the data table. Used when querying to populate it.
	 * 
	 * Parameters: 
	 * datasource - {YAHOO.util.XHRDataSource} the data source object.
	 */
	setDatasource: function(datasource){
        this.mict.DataSource=datasource;
    },
	
	/**
	 * Method: buildDataConnList
	 * 
	 * Build a list of data connections with radio buttons. This method builds
	 * the left hand side of the data extraction widget.
	 * 
	 * Parameters: 
	 * extractionConnections - {Array(Object)} Array of objects. Each object contains a pair of id and name of 
	 * 							an extraction connection.
	 */
    buildDataConnList : function(extractionConnections) {

    	var ctx = this;
    	var selectedRadioButton = null;
    	
    	//Create the div container for the radio button group
		var radioButtonPanel = document.createElement('div');
		oscar.jQuery(radioButtonPanel).addClass(this.CLASS_NAME.replace(/\./g, "_") + "_radioPanel");
		radioButtonPanel.setAttribute("id",OpenLayers.Util.createUniqueID("mdec_radioPanel"));

		//Create the div container for the data connection element
		var dataConnectionItem = document.createElement('div');
		oscar.jQuery(dataConnectionItem).addClass(this.CLASS_NAME.replace(/\./g, "_") + "_dataConnItem");
		dataConnectionItem.setAttribute("id",OpenLayers.Util.createUniqueID("mdec_dataConnItem"));
		
		//Create a name for the radio button group. The name must be different between the WFS and WCS
		//radio button groupings, but the same for the 'None' and data connection options.
		radioButtonGroupName = OpenLayers.Util.createUniqueID("extractionConnections");
		
		// Build a radio button for the none option.
		var noneLabel = document.createElement("label");
		noneLabel.innerHTML = oscar.i18n("mdec_data_connection_none");
		noneLabel.setAttribute("class","oscar_Gui_MultiDataExtractionTable_dataConnection_label");
		
		// IE7 Hack, must do a try catch and create the radio with the name attribute intact.
		try {
			radioDataConnection = document.createElement('<input type="radio" name="'+radioButtonGroupName+'" />');
		}catch(err){
			radioDataConnection = document.createElement('input');
			radioDataConnection.setAttribute("type","radio");
			radioDataConnection.setAttribute("name",radioButtonGroupName);
		}
		radioDataConnection.setAttribute("id",OpenLayers.Util.createUniqueID("mdec_dataextraction_radiobuttton"));		
		radioDataConnection.setAttribute("class","oscar_Gui_MultiDataExtractionTable_dataConnection_radio");
		radioDataConnection.setAttribute("value","None");
		radioDataConnection.setAttribute("dataConnName","None"); //replace with translated text.
		dataConnectionItem.appendChild(radioDataConnection);
		dataConnectionItem.appendChild(noneLabel);
		radioButtonPanel.appendChild(dataConnectionItem);
		
		//Bind events to radio button
		var context = {
				radioButtonElements: radioDataConnection,
				ctx: this
	        }
		
		//The Mouse click events for the radio buttons.
		var e = null;
		if(document.createEvent){
			e = document.createEvent("MouseEvents"); //Good Browsers
			e.initMouseEvent("click", true, true, window,
				    0, 0, 0, 0, 0, false, false, false, false, 0, null);
			radioDataConnection.dispatchEvent(e);
		}else if(document.createEventObject) {
			e = document.createEventObject("MouseEvents"); //IE Hack
			e.button = 1; // left button is down
			radioDataConnection.fireEvent('onclick', e);
		}else{
			return // Other browsers do nothing
		}
		
		var click = function(obj) {
		    return function(e) {
		    	ctx.changeExtractionContents(obj);
		    };
		}

		radioDataConnection.onclick = click({radioButtonElements: radioDataConnection,
								ctx: this});

		//build list of radio buttons with arrayList of data connections from viewer config.
		for(var i=0;i<extractionConnections.length;i++) {

			//Create Div and Label for the data connection panel
			var dataConnectionLabel = document.createElement('label');
			dataConnectionLabel.innerHTML = oscar.i18n("mdec_data_connections");
			oscar.jQuery(dataConnectionLabel).addClass(this.CLASS_NAME.replace(/\./g, "_") + "_dataConnLabel");
			dataConnectionItem.setAttribute("id",OpenLayers.Util.createUniqueID("mdec_dataConnLabel"));
			
			//Create the div container for the data connection element
			var dataConnectionItem = document.createElement('div');
			oscar.jQuery(dataConnectionItem).addClass(this.CLASS_NAME.replace(/\./g, "_") + "_dataConnItem");
			dataConnectionItem.setAttribute("id",OpenLayers.Util.createUniqueID("mdec_dataConnItem"));

			// IE7 Hack, must do a try catch and create the radio with the name attribute intact.
			try {
				radioDataConnection = document.createElement('<input type="radio" name="'+radioButtonGroupName+'" />');
			}catch(err){
				radioDataConnection = document.createElement('input');
				radioDataConnection.setAttribute("type","radio");
				radioDataConnection.setAttribute("name",radioButtonGroupName);
			}
			radioDataConnection.setAttribute("id",OpenLayers.Util.createUniqueID("mdec_dataextraction_radiobuttton"));
			radioDataConnection.setAttribute("class","oscar_Gui_MultiDataExtractionTable_dataConnection_radio");
			radioDataConnection.setAttribute("value",extractionConnections[i].id);
			radioDataConnection.setAttribute("dataConnName",extractionConnections[i].name);
			var newLabel = document.createElement("label");
			newLabel.innerHTML = extractionConnections[i].name;
			newLabel.setAttribute("class","oscar_Gui_MultiDataExtractionTable_dataConnection_label");
			dataConnectionItem.appendChild(radioDataConnection);
			dataConnectionItem.appendChild(newLabel);
			radioButtonPanel.appendChild(dataConnectionItem);
			
			//Bind events to radio button
			var context = {
					radioButtonElements: radioDataConnection,
					ctx: ctx
		        }
			
			//The Mouse click events for the radio buttons.
			var e = null;
			if(document.createEvent){
				e = document.createEvent("MouseEvents"); //Good Browsers
				e.initMouseEvent("click", true, true, window,
					    0, 0, 0, 0, 0, false, false, false, false, 0, null);
				radioDataConnection.dispatchEvent(e);
			}else if(document.createEventObject) {
				e = document.createEventObject("MouseEvents"); //IE Hack
				e.button = 1; // left button is down
				radioDataConnection.fireEvent('onclick', e);
			}else{
				return // Other browsers do nothing
			}
			
			var click = function(obj) {
			    return function(e) {
			    	ctx.changeExtractionContents(obj);
			    };
			}

			radioDataConnection.onclick = click({radioButtonElements: radioDataConnection,
									ctx: this});
		}
		
		//append the div to the page container
		$(this.container).appendChild(dataConnectionLabel);
		$(this.container).appendChild(radioButtonPanel);
	},
	
	/**
	 * Method: buildMultiItemChooserTable
	 * 
	 * Created the DataTable part of the MultiDataExtractionChooser.
	 */
	buildMultiItemChooserTable : function(){
		
		//Create Div and Label for the data connection panel
		var mictPanel = document.createElement('div');
		mictPanel.setAttribute("id",OpenLayers.Util.createUniqueID("mdec_multiDataItemChooser"));
		mictPanel.setAttribute("class","oscar_Gui_MultiDataExtractionTable__MultiDataItemChooser");
		
		//append the container to the tab before we attach the multiitemchoosertable to it.
		$(this.container).appendChild(mictPanel);
		
		this.mict = new oscar.Gui.MultiItemChooserTable (mictPanel.id, this.preSelectedItemsIn, this.DataSourceIn, {
			scrollable : false,
			width : "100%",
			height : "200px",
			initialRequest : '?' + this.requestParameter + '' + '&IECachePatch' + new Date().getTime(),
			paginator : null,
			selectionMode : "standard"
			},
			this.columnDefs,
			this.requestParameter
			);
		
		// Event listener for the reset button click of the MultiItemChooserTable
		this.mict.events.on({"resetClicked":this.resetDataConnection,scope:this});
	},
	
	/**
	 * APIMethod: setDefaultDataConnection
	 * Sets the default data connection. This method is to be called after the 
	 * DataExtraction widget is rendered.
	 * 
	 * Parameters: 
	 * dataConnName - {String} name of a data connection.
	 * radioElementName - {String} name of an radio button element to be accessed.
	 */
	setDefaultDataConnection : function(dataConnName, radioElementName) {
		// retrieve the array of radio buttons. IE7 Hack, when we don't support IE7 anymore,
		// use getElementsbyName.
		var tag = "input";
		var dataConnRdoBtn = this.getElementsByName_iefix(tag,radioElementName);
		//Cycle through the array to find out which one is the selected
		for(var i=0; i < dataConnRdoBtn.length; i++){
			var dataConnectionNameAttribute = dataConnRdoBtn[i].getAttribute("dataConnName");
			if (dataConnectionNameAttribute == dataConnName){
				// Retrieve the ID of the default radio button for the reset method.
				this.defaultDataConnectionId = dataConnRdoBtn[i].getAttribute("Id");
				// IE 7 Hack
				dataConnRdoBtn[i].setAttribute("checked", true);
				dataConnRdoBtn[i].checked = "checked";
				dataConnRdoBtn[i].defaultChecked = true;
				this.clearSelections = false;
				dataConnRdoBtn[i].onclick();
			}
		}
	},
	
	/**
	 * Method: getElementsByName_iefix
	 * Need this method because IE7 doesn't support 
	 * @param tag
	 * @param name
	 * @returns {Array}
	 */
	getElementsByName_iefix : function(tag, name) {
	     
	     var elem = document.getElementsByTagName(tag);
	     var arr = new Array();
	     for(i = 0,iarr = 0; i < elem.length; i++) {
	          att = elem[i].getAttribute("name");
	          if(att == name) {
	               arr[iarr] = elem[i];
	               iarr++;
	          }
	     }
	     return arr;
	},
	
	/**
	 * Method: getContainer
	 * Returns the div container of the extraction widget. 
	 * 
	 * Returns:
	 * {Object} the div container.
	 */
	getContainer : function() {
		return this.container;
	},
	
    /**
     * Method : changeExtractionContents 
     * Change the extraction contents for the currently selected extraction connection. Removes any
     * contents that were selected using the previously selected connection (extraction contents are 
     * limited to one connection per theme).
     * 
     * Parameters: 
     * context - {Object}
     */
	changeExtractionContents : function(context) {
		
    	// loop though all the radio buttons to see which one is checked.
		var dataConnRdoBtn = document.getElementsByName(context.radioButtonElements.name);
    	for(var i=0;i<dataConnRdoBtn.length;i++) {
            if (dataConnRdoBtn[i].checked){
            	context.ctx.loadExtractionContents(context.radioButtonElements);
            	break;
            }
    	}
    },
    
    /**
     * Method: loadExtractionContents 
     * Loads the extraction contents for the current WFS/WCS.
     * 
     * Parameters: 
     * selectedRadioButton - {Object} the selected radio button.
     */
    loadExtractionContents : function(selectedRadioButton) {

        try {
            this.contentsRequest(selectedRadioButton.value, selectedRadioButton.getAttribute("dataconnname"),
                    this.mict.DataTable);
        } catch(err) {}
    },
    
    /**
     * Method: contentsRequest 
     * This method sends an AJAX request to the server to get a data connection's contents.
     * 
     * Parameters: 
     * dataConnectionId - the id of the data connection.
     * dataConnectionName - The name of the data connection.
     * YUIDataTable - {YAHOO.widget.DataTable}
     */
    contentsRequest : function(dataConnectionId, dataConnectionName, YUIDataTable) {
    	
    	var fieldsDef = [];
		// Cycle through the column definitions and retrieve the keys.
		for(i = 0; i < this.columnDefs.length; i++){
			fieldsDef.push("{key : \"" + this.columnDefs[i].key + "\"}");
		}
	
        var contentsDataSource = new YAHOO.util.XHRDataSource('themeAction_findDataConnContents.action?dataConnectionId=' + dataConnectionId);
        contentsDataSource.responseType = YAHOO.util.XHRDataSource.TYPE_JSON;
        contentsDataSource.connXhrMode = "queueRequests";
        contentsDataSource.responseSchema = {
        resultsList : "Response.Results",
        fields : [{key : "check"},{key : "id"},{key : "title"}]
        }; 
    	
        // Added this flag check since we want to clear the selections when somebody clicks on a different data connection.
        if (this.clearSelections != false) {
        	this.setExtractionSelections([]);
        	//Since we cleared the selections, change the checkAll image to None Selected.
        	this.mict.setCheckAllImage("None");
        } else {
        	this.clearSelections = true;
        }
        
    	// clear the layers from the YUI data table. *** replace with onDataReturnReplaceRows
        YUIDataTable.getRecordSet().reset();
        YUIDataTable.render();
        var msg = this.mict.getDefaultTableConfiguration()["MSG_LOADING"];
        YUIDataTable.showTableMessage(msg);
        
        if(this!=null){
        	this.setDatasource(contentsDataSource);
        	this.mict.getItems("");
        }
    },
		
    /**
   	 * Method: getExtractionSelections
   	 * Returns the items selected.
   	 * 
   	 * Returns: 
   	 * {Array} the items selected.
   	 */
   	getExtractionSelections : function() {
    	return this.mict.getItemsSelections();
   	},
   	 
   	 /**
   	  * Method: setExtractionSelections
   	  * 
   	  * Parameters: 
   	  * selections - {Array} extraction selections. 
   	  */
   	 setExtractionSelections : function(selections) {
   		this.mict.setItemsSelections(selections);
   	 },
   	 
   	 /**
   	  *  Method: getRadioButtonsArrayName
   	  *  Returns the radio button group name.
   	  *  
   	  *  Returns: 
   	  *  {String} name attribute of HTML input element. 
   	  */
   	 getRadioButtonsNameAttribute : function() {
   		return radioDataConnection.getAttribute("name");
   	 },
   	 
    /**
  	 * Method: resetDataConnection 
  	 * resets the data connection to its original selection.
  	 */
    	resetDataConnection : function(e) {
  		var defaultDataConnection = document.getElementById(this.defaultDataConnectionId);
  		defaultDataConnection.checked = true;
 		this.clearSelections = false;
 		defaultDataConnection.onclick();
  	},
 	
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Gui.MultiDataExtractionChooser
	 */
	CLASS_NAME : "oscar.Gui.MultiDataExtractionChooser"
});