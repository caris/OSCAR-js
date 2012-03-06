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
 * Class: oscar.Format.OXF.v2
 * 
 * Methods for reading OXF (Oscar eXchange Format) configuration objects. 
 * This class is not to be instantiated directly.
 * 
 */

oscar.Format.OXF.v2 = oscar.BaseClass( {
	/**
	 * Property: filters 
	 * Used to parse different components of an OXF string.
	 */
	filters : {
		themes : function(obj, data) {
			if (!obj.themes)
				obj.themes = [];
			for ( var i = 0; i < data.length; i++) {
				var theme = new oscar.ox.Theme();
				this.runProps(theme, data[i]);
				obj.themes.push(theme);
			}
		},
		layers : function(obj, data) {
			if (!obj.layers)
				obj.layers = [];
			for ( var i = 0; i < data.length; i++) {
				var layer = new oscar.ox.Layer();
				this.runProps(layer, data[i]);
				obj.layers.push(layer);
			}
		},
		services : function(obj, data) {
			if (!obj.services) {
				obj.services = new oscar.ox.Services();
			}
			this.runProps(obj.services, data);
		},
		selection : function(obj, data) {
			if (data.length == 0)
				return
			var selectionService = obj.addSelectionService();
			this.runProps(selectionService, data[0]);
		},
		extraction : function(obj, data) {
			if (data.length == 0)
				return
			var extractionService = obj.addExtractionService();
			this.runProps(extractionService, data[0]);
		},
		serviceEntries : function(obj, data) {
			for ( var i = 0; i < data.length; i++) {
				var se = new oscar.ox.ServiceEntry(data[i]);
				obj.addServiceEntry(se);
			}
		}
	},
	/**
	 * Constructor: oscar.Format.OXF.v2
	 * 
	 * Creates an instance of one of the subclasses.
	 * 
	 * options - {Object} An optional object whose properties will be set on
	 * this instance.
	 */
	initialize : function(options) {

	},

	/**
	 * APIMethod: read
	 * 
	 * Reads an OXF configuration object.
	 */
	read : function(data) {
		var obj = {};
		this.runProps(obj, data);
		return obj;
	},
	/**
	 * Method: runProps
	 * 
	 * Iterates through the properties of an object to see if there are any
	 * parsing filters to be applied.
	 */
	runProps : function(obj, data) {
		for ( var props in data) {
			var filter = this.filters[props];
			if (filter) {
				filter.apply(this, [ obj, data[props] ]);
			} else {
				obj[props] = data[props];
			}
		}
	},
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Format.OXF.v2
	 */
	CLASS_NAME :"oscar.Format.OXF.v2"

});