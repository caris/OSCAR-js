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
 * Class: oscar.Gui.MultiItemChooserTable
 * 
 * The multiple item chooser allows the user to choose multiple items at the same time. 
 * It lists all the available items in a paginated table and uses a CheckBox to show the 
 * selected/unselected state for each. The chooser also has an AutoComplete input field
 * that can narrow down the list by searching the items. A reset button is provided to 
 * restore the pre-selected items when constructing the chooser.
 * 
 * @deprecated
 */
oscar.Gui.MultiItemChooserTable = oscar.BaseClass({
	/**
	 * Constant: EVENT_TYPES
	 * {Array(String)} supported events.
	 * 
	 * clicked - Triggered by checkbox clicked.
	 * resetClicked - Triggered by reset button clicked.
	 */
	EVENT_TYPES:["clicked","resetClicked"],
	/**
	 * Property: events
	 */
	events:null,
	/**
	 * Property: DataSource
	 * The YUI data source.
	 */
	DataSource : null,

	/**
	 * Property: DataTable
	 * The YUI data table.
	 */
	DataTable : null,

	/**
	 * Property: autoComplete
	 * The YUI auto complete widget.
	 */
	autoComplete : null,

	/**
	 * Property: ItemsSelection
	 * Array for selected objects.
	 */
	ItemsSelections : null,
	
	/**
	 * Property: preSelectedItems
	 * Array of pre-selected items when the chooser is created.
	 */
	preSelectedItems : null,
	
	/**
	 * Property: sortOnCheck
	 * {Boolean) - Automatically sorts the table when the checkbox is clicked.
	 */
	sortOnCheck:true,
	
	/**
	 * Property: paginator
	 * Object - the paginator object.
	 */
	paginator : null,
	
	/**
	 * Property: rowsPerPage
	 * {Number} Number of items to show for the paginator.
	 *
	 */
	rowsPerPage:8,
	
	/**
	 * Prperty: rowsPerPage
	 * {Number} - Number of page links to show in the paginator.
	 */
	numPageLinks:5,
	
	/**
	 * Property: columnDefs
	 * {Array} Array of column definitions.
	 */
	columnDefs : null,
	
	/**
	 * Property: dataTableConfig
	 * {Array} Table Configuration.
	 */
	dataTableConfig : null,
	
	/**
	 * Property: paginatorPanel
	 * {HTMLDivElement} The Paginator Panel.
	 */
	paginatorPanel : null,
	
	/**
	 * Property: container
	 * {String} The main div element where we append all the sub elements.
	 */
	container : null,
	
	/**
	 * Property: requestParameter
	 * 
	 * {String} We don't want to force the user to use our parameter, lets give him the option. 
	 */
	requestParameter : "filter",
	
	/**
	 * Property: checkAllDisplay
	 * 
	 * {Boolean} Flag to indicate whether or not to display the check all checkbox.  
	 */
	checkAllDisplay : true,
	
	/**
	 * Property: resetButtonDisplay
	 * 
	 * {Boolean} Flag to indicate whether or not to display the reset button.  
	 */
	resetButtonDisplay : true,
	
	/**
	 * Property: autoCompletePanel
	 * 
	 * {HTMLDivElement} The autocomplete panel consists of the inputbox,
	 *                  clearFilter and reset buttons.
	 */
	autoCompletePanel : null,
	
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
			MSG_SORTDESC: oscar.i18n("MICT_MSG_SORTDESC")
		};
	},	
	
	/**
	 * Constructor: oscar.Gui.MultiItemChooserTable
	 * 
	 * Parameters: 
	 * container - The tag id that the multiItemChooserTable will be attached to.
	 * preSelectedItemsIn - The items that will be selected by default.
	 * DataSourceIn - The data source the SRSs come from.
	 * dataTableConfig - The datatable's configuration parameters.
	 * columnDefs - The column definition configuration.
	 * requestParameterIn - The request parameter used in the getItems method.
	 * options - {Object} An optional object whose properties will be set on
	 * 			 this instance.
	 */
	initialize : function(container, preSelectedItemsIn, DataSourceIn,
			dataTableConfig, columnDefs, requestParameterIn, options) {
		if (options)
			OpenLayers.Util.extend(this, options);
		
		this.dataTableConfig = this.getDefaultTableConfiguration();
		OpenLayers.Util.extend(this.dataTableConfig,dataTableConfig);
		this.events = new OpenLayers.Events(this, null,
				this.EVENT_TYPES, false, {
					includeXY :true
				});	
		this.container = container;
		this.preSelectedItems = preSelectedItemsIn;
		this.ItemsSelections = preSelectedItemsIn.slice(0); //copy the array		
		this.DataSource = DataSourceIn;
		this.columnDefs = columnDefs;
		this.requestParameter = requestParameterIn;
		this.inputBoxElement = null;
		this.checkAllLabel = null;
		
		this.buildAutoComplete();
		if (this.checkAllDisplay) this.buildCheckAll();
		this.buildPaginator();
		this.buildTableChooser();
		
	},
	
	/**
	 * Method: buildAutoComplete
	 * 
	 * Builds the AutoComplete widget and the reset button.
	 */
	buildAutoComplete:function() {
		//Create the div container for the autocomplete
		this.autoCompletePanel = document.createElement('div');
		this.autoCompletePanel.setAttribute("class","oscar_Gui_MultiItemChooserTable_autoComplete");
		this.autoCompletePanel.setAttribute("id",OpenLayers.Util.createUniqueID("mict_autoComplete"));

        //Create div for autocomplete input
        var inputPanel = document.createElement('span');
        inputPanel.setAttribute("class","oscar_Gui_MultiItemChooserTable_inputPanel");
        inputPanel.setAttribute("id",OpenLayers.Util.createUniqueID("mict_inputPanel"));
        // Create div for the autocomplete container.
        var filterContainerPanel = document.createElement('div');
        filterContainerPanel.setAttribute("class","oscar_Gui_MultiItemChooserTable_filterContainer");
        filterContainerPanel.setAttribute("id",OpenLayers.Util.createUniqueID("filterContainer"));
        // Create label element
        var inputBoxLabel = document.createElement("label");
        inputBoxLabel.setAttribute("class","oscar_Gui_MultiItemChooserTable_autocomplete_label");
        inputBoxLabel.setAttribute("id",OpenLayers.Util.createUniqueID("mict_autocomplete_label"));
        inputBoxLabel.setAttribute("for","autoCompleteInputBox");
        inputBoxLabel.innerHTML = oscar.i18n("mict_autocomplete_label");
        //Create input element
        this.inputBoxElement = document.createElement("input");
        this.inputBoxElement.setAttribute("class","oscar_Gui_MultiItemChooserTable_autocomplete_input");
        this.inputBoxElement.setAttribute("id",OpenLayers.Util.createUniqueID("mict_autocomplete_input"));
        this.inputBoxElement.value = oscar.i18n("mict_autocomplete_label");
        oscar.jQuery(this.inputBoxElement).addClass("mict_input_default");
        oscar.jQuery(this.inputBoxElement).addClass("mict_input_inactive");
        var onFocus = function() {
        	return function(e) {
        		if(this.value == oscar.i18n("mict_autocomplete_label")) {
        			this.value = "";
        			oscar.jQuery(this).removeClass("mict_input_inactive");
        		}
        	};
        }
        var onBlur = function(obj) {
        	return function(e) {
        		if(obj.inputBoxElement.value.length==0) {
        			obj.inputBoxElement.value =oscar.i18n("mict_autocomplete_label");
        			oscar.jQuery(obj.inputBoxElement).addClass("mict_input_inactive");
        			if(obj.clearFilterElement){
        				// return the icon to the 'disabled' grey
        				obj.clearFilterElement.removeClass("oscar_Gui_MultiItemChooserTable_clearFilter");
        				obj.clearFilterElement.applyClass("oscar_Gui_MultiItemChooserTable_clearFilter_disabled");
        			}
        		}
        	}
        }
        this.inputBoxElement.onfocus = onFocus();
        this.inputBoxElement.onblur = onBlur(this);

        // Append element to the panel
        inputPanel.appendChild(this.inputBoxElement);
		this.autoCompletePanel.appendChild(inputPanel);

		// Create the 'Reset' button
		if(this.resetButtonDisplay) this.createResetClickableLabel();
		// Create the 'Clear Filter' button
		this.createClearFilterClickableLabel();
		
		var breaker = document.createElement("div");
		breaker.setAttribute("style","clear:both");
		this.autoCompletePanel.appendChild(breaker);

		// Append the objects to the this.container main div object.
        $(this.container).appendChild(this.autoCompletePanel);
		
        // Create the query listing and include in an autoComplete widget.
		var acFunction = function(obj) {
			return function(e) {
				if (this.value != "") {
					obj.clearFilterElement.removeClass("oscar_Gui_MultiItemChooserTable_clearFilter_disabled");
					obj.clearFilterElement.applyClass("oscar_Gui_MultiItemChooserTable_clearFilter");
				}
				obj.getItems(this.value)
			};
		}
		this.inputBoxElement.onkeyup=acFunction(this);
	},

	/**
	 * Method: createClearFilterClickableLabel
	 * 
	 * Creates a clear filter clickableLabel.
	 */
	createClearFilterClickableLabel : function() {
		// Create div for Clear Filter image (Clickable label).
		var clearFilterPanel = document.createElement('span');
		clearFilterPanel.setAttribute("class","oscar_Gui_MultiItemChooserTable_clearFilterPanel");
		clearFilterPanel.setAttribute("id",OpenLayers.Util.createUniqueID("mict_clearFilterPanel"));
		
		var lbl = ""; 
        var id = OpenLayers.Util.createUniqueID("mict_clearFilter_icon");
		this.clearFilterElement = new oscar.Gui.ClickableLabel(lbl, {
			style :"block",
			ref :id
		});
		this.clearFilterElement.events.on( {
			"labelClicked": this.clearFilter,
			scope: this
		});
		this.clearFilterElement.applyClass("oscar_Gui_MultiItemChooserTable_clearFilter_disabled");
		var tooltipValue = oscar.i18n("mict_clearFilter_icon");
		this.clearFilterElement.setTooltip(tooltipValue);
		
		// Append element to the panel
		this.clearFilterElement.appendTo(clearFilterPanel);
		this.autoCompletePanel.appendChild(clearFilterPanel);
	},
	
	/**
	 * Method: createResetClickableLabel
	 * 
	 * Creates a reset clickableLabel.
	 */
	createResetClickableLabel : function() {
		// Create div for reset image (Clickable label).
		var resetPanel = document.createElement('span');
		resetPanel.setAttribute("class","oscar_Gui_MultiItemChooserTable_resetPanel");
		resetPanel.setAttribute("id",OpenLayers.Util.createUniqueID("mict_resetPanel"));
		
		var lbl = ""; 
        var id = OpenLayers.Util.createUniqueID("mict_reset_icon");
		this.resetElement = new oscar.Gui.ClickableLabel(lbl, {
			style :"block",
			ref :id
		});
		this.resetElement.events.on( {
			"labelClicked": this.resetTable,
			scope: this
		});
		this.resetElement.applyClass("oscar_Gui_MultiItemChooserTable_resetTable_disabled");
		var tooltipValue = oscar.i18n("mict_reset_icon");
		this.resetElement.setTooltip(tooltipValue);
		
		// Append element to the panel
		this.resetElement.appendTo(resetPanel);
		this.autoCompletePanel.appendChild(resetPanel);
	},
	
	/**
	 * Method: buildCheckAll
	 * 
	 * Builds a checkbox and a label that will check all the elements.
	 */
	buildCheckAll : function() {
		
		//Create the div container for the checkAll checkbox
		var checkAllPanel = document.createElement('div');
		checkAllPanel.setAttribute("class","oscar_Gui_MultiItemChooserTable_checkAll_Panel");
		checkAllPanel.setAttribute("id",OpenLayers.Util.createUniqueID("mict_checkAll_Panel"));
		
		var lbl = ""; 
        var id = OpenLayers.Util.createUniqueID("mict_checkAll_checkbox");
		this.checkAllElement = new oscar.Gui.ClickableLabel(lbl, {
			style :"block",
			ref :id
		});
		this.checkAllElement.events.on( {
			"labelClicked" :this.toggleAllCheckBoxes,
			scope :this
		});
		this.checkAllElement.appendTo(checkAllPanel);
				
		// Create label element
        var checkAllLabel = document.createElement("label");
        checkAllLabel.setAttribute("class","oscar_Gui_MultiItemChooserTable_checkAll_label");
        checkAllLabel.setAttribute("id",OpenLayers.Util.createUniqueID("mict_checkAll_label"));
        checkAllLabel.setAttribute("for","autoCompleteInputBox"); // assign to checkbox.
        checkAllLabel.innerHTML = oscar.i18n("mict_checkAll_label");
        
        // Append element to the panel
        checkAllPanel.appendChild(checkAllLabel);

		// Append the objects to the this.container main div object.
        $(this.container).appendChild(checkAllPanel);
	},

	/**
	 * Method: toggleAllCheckBoxes 
	 * Checks or unchecks all the elements inside the data table.
	 * 
	 * Parameters: 
	 * obj - {<oscar.Gui.ClickableLabel>} 
	 */
	toggleAllCheckBoxes : function(obj) {
		
		// Verify if the checkbox is checked or not, then set the image accordingly.
		var boolChecked = this.checkAllElement.count % 2;
		
		// Loop through the records and add them to an array to set the selected items.
		var selectedItems = new Array();
		records = this.DataTable.getRecordSet().getRecords();
   		for (i=0; i < records.length; i++) {
   			this.DataTable.getRecordSet().updateKey(records[i], "check", boolChecked);
   			selectedItems.push(records[i].getData(this.getCheckboxCol()));
   		}
   		
   		// This sets the selected items on the MultiItemChooserTable
   		if (boolChecked){
   			this.setCheckAllImage("All");
   			this.setItemsSelections(selectedItems);
   			
   		}else {
   			this.setCheckAllImage("None");
   			this.setItemsSelections([]);
   		}

   		this.DataTable.refreshView();
   		this.events.triggerEvent("clicked",this.ItemsSelections);
   		return false;
	},
	
	/**
	 * APIMethod: setCheckAllImage
	 * Sets the CSS (Class) on the 'Select All' Image Checkbox.
	 * 
	 * Parameters:
	 * {className} - the state of the "Checkbox" ['All', 'None', 'Partial'] if left 
	 * 				 blank, the method will determine the state from the DataTable.
	 */
	setCheckAllImage : function(className) {
		
		if(className == null){
			var className = "";
			var state = this.isAllCheckboxesSelected()
			if (state == 0){
				className = "None";
			}else if (state == 1){
				className = "All";
			}else {
				className = "Partial";
			};
		}
		
		//If the state is set to None, reset the counter in the ClickableLabel object. 
		if (className.toLowerCase() == "none") {
			this.checkAllElement.reset();
		}
		
		this.checkAllElement.removeClass("oscar_Gui_MultiItemChooserTable_checkAll" +
				" oscar_Gui_MultiItemChooserTable_checkAll_none" +
				" oscar_Gui_MultiItemChooserTable_checkAll_partial oscar_Gui_MultiItemChooserTable_checkAll_all");
		this.checkAllElement.applyClass("oscar_Gui_MultiItemChooserTable_checkAll "
			 + "oscar_Gui_MultiItemChooserTable_checkAll_" + className.toLowerCase());
	},
	
	/**
	 * APIMethod: isAllCheckboxesSelected
	 * 
	 * Verifies that all the checkboxes are selected so that we can set the 
	 * 'CheckAll' checkbox to a partial selection.
	 * 
	 * Returns: 
	 *  0 - {Number} No items are selected. 
	 *  1 - {Number} All items are selected. 
	 *  -1 - {Number} Some items are selected.
	 */
	isAllCheckboxesSelected : function() {

		var countSelected = 0;
		var records = this.DataTable.getRecordSet().getRecords();

	    for (i=0; i < records.length; i++) {
	        // verify each individual input check box for selection
	    	if (records[i].getData().check){
	            countSelected++;
	        }
	    }
	    
    	if( countSelected == 0){
    		// no items selected.
    		return 0;
    	} else if( countSelected == records.length){
    		// all items selected
            return 1;
        } else{
        	// some of the items are selected
        	return -1;
        };
	},
	

	/**
	 * Method: buildPaginator
	 * 
	 * Builds the paginator at the bottom of the data table. Needs
	 * to be created and passed into the data table constructor.
	 */
	buildPaginator:function() {
		//Create the div container for the paginator
		this.paginatorPanel = document.createElement('div');
		this.paginatorPanel.id = OpenLayers.Util.createUniqueID("mict_paginatorPanel");
        this.paginatorPanel.setAttribute("class","oscar_Gui_MultiItemChooserTable_paginatorPanel");
        
		//paginator
		this.paginator =  new YAHOO.widget.Paginator(
				{ rowsPerPage : this.rowsPerPage,
				  pageLinks: this.numPageLinks,
				  containers : this.paginatorPanel,
	              firstPageLinkLabel: oscar.i18n("first"),
	              lastPageLinkLabel: oscar.i18n("last"),
	              previousPageLinkLabel: oscar.i18n("previous"),
	              nextPageLinkLabel: oscar.i18n("next"),
	              alwaysVisible:false
		});
	},
	
	/**
	 * Method: buildTableChooser
	 * 
	 * Constructs the data table.
	 */
	buildTableChooser:function() {
		//Create the div container for the table chooser
		var tableChooserPanel = document.createElement('div');
		tableChooserPanel.id = OpenLayers.Util.createUniqueID("tableChooser");
        tableChooserPanel.setAttribute("class","oscar_Gui_MultiItemChooserTable_multiItemChooserTable");
        
        this.dataTableConfig.paginator = this.paginator;
        
		// Create the SRSs data table.
        var ctx = this;
		this.DataTable = new YAHOO.widget.DataTable(tableChooserPanel, this.columnDefs, this.DataSource, this.dataTableConfig);
		this.DataTable.subscribe("rowMouseoverEvent", this.DataTable.onEventHighlightRow);
		this.DataTable.subscribe("rowMouseoutEvent", this.DataTable.onEventUnhighlightRow);
		this.DataTable.subscribe("rowClickEvent", this.DataTable.onEventSelectRow);
		
		//Append this object to the this.container main div object.
        $(this.container).appendChild(tableChooserPanel);
        
		//Append this object to the this.container main div object.
        $(this.container).appendChild(this.paginatorPanel);
		
		// Catch checkbox event, add checked row to array, remove unchecked row from array
		this.DataTable.subscribe('checkboxClickEvent', function(e) {
			var recordSet = this.getRecordSet();
			var checkboxClicked = e.target;
			var currentRow = this.getRecord(checkboxClicked);
			currentRow.setData("check", checkboxClicked.checked);
			var currColumn = this.getColumn(checkboxClicked);
			var newItem = currentRow.getData(ctx.getCheckboxCol())
			if (checkboxClicked.checked) {
				ctx.ItemsSelections.push(newItem);
			} else {
				for (var k=ctx.ItemsSelections.length-1;k>-1;k--) {
					if (ctx.compareObj(ctx.ItemsSelections[k],newItem)) {
						ctx.ItemsSelections.splice(k, 1);
					}
				};				
			};			
			
			ctx.events.triggerEvent("clicked",ctx.ItemsSelections);
			
			// if the user modified the table selections, enable the resetTable button.
			if(ctx.resetButtonDisplay){
				ctx.enableResetButton();
			}
			
			if (ctx.checkAllDisplay) {
				ctx.setCheckAllImage();		
			}
			
			if(ctx.sortOnCheck) { 
				this.sortColumn(currColumn, "yui-dt-desc");
			}		
		});
		
		this.DataTable.subscribe('radioClickEvent', function(e) {
			var recordSet = this.getRecordSet();
			var checkboxClicked = e.target;
			var currentRow = this.getRecord(checkboxClicked);
			currentRow.setData("check", checkboxClicked.checked);
			var currColumn = this.getColumn(checkboxClicked);
			var newItem = currentRow.getData(ctx.getCheckboxCol())
			if (checkboxClicked.checked) {
				ctx.ItemsSelections= [newItem];
			}
			ctx.events.triggerEvent("clicked",ctx.ItemsSelections);
		});		
	},
	

	/**
	 * Method: setCheckboxes
	 * 
	 * Set the checkboxes in the data table. If a Item is in the
	 * ItemsSelections, set its checkbox to true. Otherwise, set its
	 * checkbox to false.
	 */
	setCheckboxes : function() {
		var records = this.DataTable.getRecordSet().getRecords();
		//initialize the checkboxes
		for ( var k = 0; k < records.length; k++) {
			records[k].setData("check", false);
		}
		//set the selected checkboxes
		var selectedItem;
		var curItem;
		for (var i = 0; i < this.ItemsSelections.length; i++) {
			selectedItem = this.ItemsSelections[i];
			for ( var k = 0; k < records.length; k++) {
				curItem = records[k].getData(this.getCheckboxCol());
				if (this.compareObj(selectedItem,curItem)) {
					records[k].setData("check", true);
					continue;
				}
			}
		}
		this.DataTable.render();
	},
	
	/**
	 * Method: compareObj
	 * 
	 * Does a strict compare on two objects.
	 * Returns true if objects are identical.
	 * 
	 * Parameters: 
	 * obj1 - {Object}
	 * obj2 - {Object}
	 */
	compareObj : function(obj1,obj2) {
		if(obj1 === obj2.toString()) {
			return true
		}
		return false;
		
	},

	/**
	 * Method: getCheckboxCol
	 * 
	 * Get the check box column name in the data table.
	 */
	getCheckboxCol : function() {
		var cols=this.columnDefs;
		for(var i=0; i<cols.length; i++){
			if(cols[i].isCheckboxCol){
				return cols[i].key;
			}
		}
	},
	
    /**
     * Method: checkboxSortFunction 
     * Custom sorting function for comparing two SRS checkboxes.
     *
     * Parameters: 
     * a - {Object} First sort argument.
     * b - {Object} Second sort argument.
     * desc - {Boolean} True if sort direction is descending, false if
     *        sort direction is ascending.
     * field - the field to compare.
     * 
     * Returns:  
     * {Number}
     */	
	checkboxSortFunction : function(a, b, desc, field) {
			var checkboxCompare = YAHOO.util.Sort.compare;
		    
			var sorted = checkboxCompare(a.getData(field),b.getData(field), desc);
            if(sorted === 0) {
            	//overided here by reversing a and b so that two SRSs are in the correct order 
            	//if they are both selected or unselected.
                return checkboxCompare(b.getCount(),a.getCount(), desc); 
            }
            else {
                return sorted;
            }
	},	

	/**
	 * Method: getItems 
	 * Queries the server for the Items and populates the table.
	 * 
	 * Parameters: 
	 * query - {String} the request parameter. 
	 * 
	 */
	getItems : function(query) {
		var ctx = this;
		var filterCallBack = function(sRequest, oResponse, oPayload) {
			ctx.DataTable.onDataReturnReplaceRows(sRequest, oResponse, oPayload);
			ctx.setCheckboxes();
			var col = ctx.DataTable.getColumn("check");
			ctx.DataTable.sortColumn(col, "yui-dt-desc");
			ctx.paginator.set("totalRecords", ctx.DataTable.getRecordSet().getRecords().length);
			if (ctx.checkAllDisplay) {
				ctx.setCheckAllImage();
			}
		
		};
		
		var source = "";
		var parameters = {};
		parameters[this.requestParameter] = query;

		var paramString = OpenLayers.Util.getParameterString(parameters);
		       
		if(paramString.length > 0) {
		    var separator = (this.DataSource.liveData.indexOf('?') > -1) ? '&' : '?';
		    source = separator + paramString;
		}

		this.DataSource.sendRequest(source, filterCallBack, this.DataTable);
	},
	
	/**
	 * Method: clearFilter
	 * 
	 * clears the autocompare inputbox
	 */
	clearFilter : function(e) {
		if (this.clearFilterElement.container.className == "oscar_Gui_MultiItemChooserTable_clearFilter") {
			this.inputBoxElement.value = oscar.i18n("mict_autocomplete_label");
			oscar.jQuery(this.inputBoxElement).addClass("mict_input_inactive");
			this.getItems("");
			// return the icon to the 'disabled' grey
			this.clearFilterElement.removeClass("oscar_Gui_MultiItemChooserTable_clearFilter");
			this.clearFilterElement.applyClass("oscar_Gui_MultiItemChooserTable_clearFilter_disabled");
		}
	},
	
	/**
	 * Method: resetTable
	 * 
	 * resets the table to its original selections.
	 */
	resetTable : function(e) {
		if (this.resetElement.container.className == "oscar_Gui_MultiItemChooserTable_resetTable") {
			this.ItemsSelections = this.preSelectedItems.slice(0);
			this.getItems("");
			this.events.triggerEvent("resetClicked");
			// return the icon to the 'disabled' grey
			this.resetElement.removeClass("oscar_Gui_MultiItemChooserTable_resetTable");
			this.resetElement.applyClass("oscar_Gui_MultiItemChooserTable_resetTable_disabled");
		}
	},
	
	/**
	 * APIMethod: getItemsSelections
	 * Gets the selected Items. 
	 * 
	 * Returns: 
	 * ItemsSelections - the array of the selected Items.
	 */
	getItemsSelections : function() {
		return this.ItemsSelections;
	},
	
	/**
	 * APIMethod: setItemsSelections
	 * 
	 * sets the items selections, could be used to clear the selections
	 * if you pass in null.
	 * 
	 * Parameters: 
	 * selections - {Array} Array of the selected items. 
	 */
	setItemsSelections : function(selections){
		this.ItemsSelections = selections;
	},

	
	/**
	 * APIMethod: destroy 
	 * Destroys the DataTable and clears the innerHTML of the container.
	 */
	destroy : function() {
		this.DataTable.destroy();
		$(this.container).innerHTML = "";
	},
	
	/**
	 * APIMethod: enableResetButton 
	 * Enables the reset button, changes the style.
	 */
	enableResetButton : function() {
		this.resetElement.removeClass("oscar_Gui_MultiItemChooserTable_resetTable_disabled");
		this.resetElement.applyClass("oscar_Gui_MultiItemChooserTable_resetTable");
	},
	
	/**
	* Constant: CLASS_NAME
	* - oscar.Gui.MultiItemChooserTable
	*/
	CLASS_NAME : "oscar.Gui.MultiItemChooserTable"
});