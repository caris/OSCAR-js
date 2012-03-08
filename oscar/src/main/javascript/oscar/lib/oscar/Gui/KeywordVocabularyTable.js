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
 * Class: oscar.Gui.KeywordVocabularyTable
 * 
 * The Keyword-Vocabulary table for INSPIRE services.
 * 
 * @deprecated
 * 
 */

oscar.Gui.KeywordVocabularyTable = oscar.BaseClass({	
	/**
	 * Property: tableDisplayTag
	 * 
	 * The div tag for the Keyword-Vocabulary table
	 */
	tableDisplayTag : null,
	
	/**
	 * Property: preSavedKeywords
	 * 
	 * {Array} - pre-saved keywords
	 */
	preSavedKeywords : null,
	
	/**
	 * Property: preSavedVocabularies
	 * 
	 * {Array} - pre-saved vocabularies
	 */
	preSavedVocabularies : null,
	
	/**
	 * Property: kwDataTable
	 * 
	 * {Object} - the keyword table object. 
	 */
	kwDataTable : null,	

	/**
	 * Property: tableContent
	 * 
	 * {Object} - the content of the keyword table. It contains an
	 *            array of keywords and an array of vocabularies.
	 */
	tableContent : null,
	
	/**
	 * Constructor: oscar.Gui.KeywordVocabularyTable
	 * 
	 * tableDisplayTag - the Div tag which the KeywordVocabularyTable will be attached to.
	 * preSavedKeywords - pre-saved keywords for an existing service.
	 * preSavedVocabularies - pre-saved vocabularies for an existing service.
	 */
	initialize : function(tableDisplayTag, preSavedKeywords, preSavedVocabularies) {
		this.tableDisplayTag = tableDisplayTag;
		this.preSavedKeywords = preSavedKeywords;
		this.preSavedVocabularies = preSavedVocabularies;
		this.tableContent = {keywords:{}, vocabularies:{}};
		YAHOO.widget.DataTable.Formatter.customBtnFormatter = this.customBtnFormatter;
		this.buildKeywordVocabularyTable(this.preSavedKeywords, this.preSavedVocabularies);
	},
	
	/**
	 * Method: customBtnFormatter
	 * 
	 * The custom button formatter tailored for this widget.
	 */	
	customBtnFormatter : function(elLiner, oRecord, oColumn, oData) {
		if(oRecord._oData.Keyword){
			elLiner.innerHTML = '<div class="KeywordVocabularyTableDeleteRow"></div>';
		} else {
			elLiner.innerHTML = '<div class="KeywordVocabularyTableAddRow"></div>';
		}
	},
	
	/**
	 * Method: buildKeywordVocabularyTable
	 * 
	 * Build the keyword-vocabulary table.
	 * 
	 * Parameters: 
	 * keywords - pre-saved keywords for an existing service.
	 * vocabularies - pre-saved vocabularies for a existing service.  
	 */
	buildKeywordVocabularyTable : function(keywords, vocabularies) {
		var kwDataSource;
		if((keywords.length < 1) || (keywords.length == 1 && keywords[0] == "")) {
			kwDataSource = new YAHOO.util.DataSource([ {Keyword : "", Vocabulary : ""} ]);
		} else {
			var data = []
			for(var i = 0; i < keywords.length; i++){
				data[i] = {Keyword : keywords[i], Vocabulary : vocabularies[i]};
			}
			data.push({Keyword : "", Vocabulary : ""});			
			kwDataSource = new YAHOO.util.DataSource(data);
		}
		kwDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
		kwDataSource.responseSchema = {fields : [ "Keyword", "Vocabulary", "button" ]};
		
		var kwColumnDefs = [{
			key : "Keyword",
			label : oscar.i18n("metadataKeywordLabel"),
			sortable : false,
			width : 240,
			editor : new YAHOO.widget.TextboxCellEditor()
		}, {
			key : "Vocabulary",
			label : oscar.i18n("metadataVocabularyLabel"),
			sortable : false,
			width : 390,
			editor : new YAHOO.widget.TextboxCellEditor()
		}, {
			key : "button",
			label : "", 
			formatter : "customBtnFormatter", 
			width : 16
		}];
		
		var ctx = this;
		kwDataTable = new YAHOO.widget.DataTable(this.tableDisplayTag, kwColumnDefs, kwDataSource, {});
		kwDataTable.subscribe("cellMouseoverEvent", function(e) {ctx.highlightEditableCell(e)});
		kwDataTable.subscribe("cellMouseoutEvent", kwDataTable.onEventUnhighlightCell);
		kwDataTable.subscribe("cellClickEvent", kwDataTable.onEventShowCellEditor);
		kwDataTable.subscribe("cellClickEvent", function(e){ctx.cellClicked(e)});	
	},
	
	/**
	 * Method: highlightEditableCell
	 * 
	 * Highlight editable cell when mouse moves over.
	 */
	
	highlightEditableCell : function(oArgs) {
		var elCell = oArgs.target;
		if (YAHOO.util.Dom.hasClass(elCell, "yui-dt-editable")) {
			kwDataTable.highlightCell(elCell);
		}
	},
	
	/**
	 * Method: cellClicked
	 * 
	 * Will be invoked when a table cell is clicked.
	 */
	cellClicked : function(oArgs) {
		var target = oArgs.target;
		var record = kwDataTable.getRecord(target);
    	var column = kwDataTable.getColumn(target);
    	var index = kwDataTable.getRecordIndex(record);
    	if(column.key == 'button') {
    		var innerHtml = target.innerHTML;
    		if(innerHtml.indexOf("KeywordVocabularyTableAddRow")!= -1){
    			// plus button clicked
    			target.innerHTML = '<div class="KeywordVocabularyTableDeleteRow"></div>';
    			this.addRow(index+1);
    		}else{
    			// remove button clicked
    			this.deleteRow(index);
    			if(kwDataTable.getRecordSet().getLength()==0){
    				// all rows have been removed, add an empty row;
    				this.addRow(0);
    			}
    			
    		}
    	}
	},

	/**
	 * Method: addRow
	 * 
	 * Added an empty row.
	 * 
	 * Parameters:
	 * index - the index for the row to be added.
	 */
	addRow : function(index) {
		var oData = {Keyword:"", Vocabulary:"", button:null};
		kwDataTable.addRow(oData, index);
	},
	
	/**
	 * Method: deleteRow
	 * 
	 * Delete a row.
	 * 
	 * Parameters:
	 * index - the index for the row to be added.
	 */
	deleteRow : function(index) {
		kwDataTable.deleteRow(index);
	},
	
	/**
	 * Method: getTableContent
	 * 
	 * Returns: 
	 * {Object} - content of the table.
	 */
	getTableContent : function(){
		var recordSet = kwDataTable.getRecordSet();
		var keyword, keywords=[], vocabularies=[];
		for(var index = 0; index < recordSet.getLength(); index++){
			keyword = recordSet.getRecord(index).getData("Keyword")
			if(keyword != ""){
				// save the record only when keyword is not empty
				keywords.push(recordSet.getRecord(index).getData("Keyword"));
				vocabularies.push(recordSet.getRecord(index).getData("Vocabulary"));
			}
		}
		this.tableContent.keywords = keywords;
		this.tableContent.vocabularies = vocabularies;
		
		return this.tableContent;
	},

	/**
	 * Constant: CLASS_NAME 
	 * 	- oscar.Gui.KeywordVocabularyTable
	 */
	CLASS_NAME : "oscar.Gui.KeywordVocabularyTable"
});
