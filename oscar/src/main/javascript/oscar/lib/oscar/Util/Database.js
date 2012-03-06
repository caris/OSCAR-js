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
 * Class: oscar.Util.Database
 *
 * This is a utility class to simulate a database.
 * 
 */


oscar.Util.Database = oscar.BaseClass({
	/**
	 * APIProperty: events
	 * 
	 * {OpenLayers.Events) 
	 * 
	 */
	events:null,
	/**
	 * APIProperty: EVENT_TYPES
	 * {Array} - List of events this object will fire.
	 */
	EVENT_TYPES:["dbupdated"],
	/**
	 * Property: tables
	 * {Array} - Contains the tables created.
	 */
	tables:null,
	
	/**
	 * Constructor: new oscar.Util.Database
	 */
    initialize:function(options) {
	   this.tables=[];
        this.events = new OpenLayers.Events(this, null,
                this.EVENT_TYPES, false, {
                    includeXY :false
                });
	},
	/**
	 * APIMethod: addTable
	 * 
	 * Adds a new table to the database object
	 * 
	 * Usage:
	 * 
	 * database.addTable('developers', ['index','name','email']);
	 */
	addTable:function(tableName,columns) {
	    this.tables[tableName]={columns:columns,records:[]};
	},
	
	/**
	 * APIMethod: addRecord
	 * 
	 * Adds a record to a table
	 * 
	 * Parameters:
	 * 
	 * - {String} tableName
	 * - {Array} records
	 * 
	 * Returns: 
	 * 
	 * - The number of records in the table.
	 * 
	 * Usage:
	 * 
	 * database.addRecord('developers',['0,'developer1', 'developer1@caris.com']);
	 * database.addRecord('developers',['1,'developer2', 'developer2@caris.com']);
	 */
	addRecord:function(tableName,data) {
	    var table = this.tables[tableName];
	    if(table) {
	        table.records.push(data);
	        this.events.triggerEvent("dbupdated");
	        return table.records.length - 1;
	    }
	    return -1;
	},
	/**
	 * APIMethod: search
	 * 
	 * Searchs a table based on a user defined query.
	 * 
	 * Parameters:
	 * 
	 * - {String} tableName
	 * - {String} query
	 * - {Function} execute
	 * 
	 * Usage: 
	 * 
	 * database.search('developers','developer1', function(table,query) {
	 * 	var results = [];
	 * 	for(var r in table.records) {
	 * 	  var record = table.records[r];
	 * 	  if(record.name == query) {
	 *      results.push(record);
	 *    }
	 *  }
	 *  return results;
	 * 
	 * });
	 * 
	 */
	search:function(tableName, query,execute) {
	    var table = this.tables[tableName];
	    return execute.call(this,table,query);
	    
	},
	
	/**
	 * Constant: CLASS_NAME
	 */
    CLASS_NAME:"oscar.Util.Database"
});	
