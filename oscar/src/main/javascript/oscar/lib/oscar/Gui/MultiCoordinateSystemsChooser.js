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
 * Class: oscar.Gui.MultiCoordinateSystemsChooser
 * 
 * The multiple coordinate systems chooser allows the user to choose more than
 * one coordinate systems at a time. It lists all the available coordinate
 * systems in a paginated table and use a checkbox to show the
 * selected/unselected state for each coordinate system. The selected coordinate
 * systems will move to the top of the table automatically. The chooser also has
 * an autocomplete input field that can narrow down the list by searching the
 * coordinate systems against their code and description. A reset button is
 * provided to restore the pre-selected coordinate systems when constructing the
 * chooser.
 * 
 * Inherits from: 
 * - <oscar.Gui.MultiItemChooserTable>
 * 
 * @deprecated
 * 
 */
oscar.Gui.MultiCoordinateSystemsChooser = oscar.BaseClass(oscar.Gui.MultiItemChooserTable,	{
	
	/**
	 * Constructor: oscar.Gui.MultiCoordinateSystemChooser
	 * 
	 * Parameters: 
	 * div - {String} The tag id that the multiItemChooserTable will be attached to.
	 * preSelectedItemsIn - {Array(String)} The items that will be selected by default.
	 * DataSourceIn - {YAHOO.util.XHRDataSource} The data source the SRSs come from.
	 * codeFieldKeyIn - {String} the key of the code field in resultList returned by the data source.
	 * descriptionFieldKeyIn - {String} the key of the description field in resultList returned by the data source. 
	 * requestParameter - {String} parameters of the request.
	 */
	initialize:function(div, preSelectedItemsIn, DataSourceIn, codeFieldKeyIn, descriptionFieldKeyIn, requestParameter) {
		oscar.Gui.MultiItemChooserTable.prototype.initialize.apply(this, [div, preSelectedItemsIn, DataSourceIn, {
			scrollable : false,
			width : "700px",
			height : "200px",
			initialRequest : '?' + requestParameter + '' + '&IECachePatch' + new Date().getTime(),
			paginator : null,
			selectionMode : "standard"
			}, [ {
				key : "check",
				label : " ",
				sortable : true,
				sortOptions: { sortFunction: this.checkboxSortFunction },
				formatter : "checkbox",
				width : 30
			}, {
				key : codeFieldKeyIn,
				label : oscar.i18n("srsCodeColumnLabel"),
				sortable : false,
				isCheckboxCol : true,
				width : 150
			}, {
				key : descriptionFieldKeyIn,
				label : oscar.i18n("srsDescriptionColumnLabel"),
				sortable : false,
				width : 480
			} ],
			requestParameter,
			{checkAllDisplay: false,
			 numPageLinks: 10},
			]);
		// load the selected SRSs
		this.getItems("");
	},
 
	 /**
	  * Method: getSRSsSelections
	  * Returns the items selected.
	  * 
	  * returns: 
	  * {Array} Array for selected coordinate systems.
	  * 
	  */
	 getSRSsSelections : function() {
		 return this.getItemsSelections();
	 },
		
	 /**
	 * Constant: CLASS_NAME
	 *  - oscar.Gui.MultiCoordinateSystemsChooser
	 */
	CLASS_NAME : "oscar.Gui.MultiCoordinateSystemsChooser"
});