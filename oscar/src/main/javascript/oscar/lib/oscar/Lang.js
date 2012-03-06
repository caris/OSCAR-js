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
 * Class: oscar.Lang
 * 
 * This class will provide additional functionality to the OpenLayers.Lang
 * class. It will be used as an entry point for products to include their own
 * translation definitions.
 */

oscar.Lang = {
	/**
	 * Method: addTranslation
	 * 
	 * This method will append a key/value pair to a Language object and return
	 * the object. If the Language object does not exist it will create one.
	 * 
	 * Parameters: 
	 * code - {String}
	 * key - {String}
	 * value - {String}
	 * 
	 * Returns: 
	 * library - {Object} The dictionary object.
	 */
	addTranslation : function(code, key, value) {
		var library = oscar.Lang.getDictionary(code);
		if (key && value) {
			library[key] = value;
		}
		return library;
	},
	
	/**
	 * Method: getDictionary 
	 * Get the dictionary.
	 * 
	 * Parameters: 
	 * code - {String}
	 * 
	 */
	getDictionary : function(code) {
		var dictionary = OpenLayers.Lang[code];
		if(!dictionary) {
			OpenLayers.Lang[code] = {};
		}
		return OpenLayers.Lang[code];
	},
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Lang
	 */
	CLASS_NAME :"oscar.Lang"
};
/**
 * API Method: oscar.addi18n
 * Alias for <oscar.Lang.addTranslation>
 * Parameters:
 * 
 * code - {String} The dictionary to add the key / value pair to.
 * key - {String} The key for an i18n string value in the dictionary.
 * value - {String} The value for the key.
 * 
 * Returns:
 * {Object} The dictionary object. 
 */
oscar.addi18n = oscar.Lang.addTranslation;
oscar.i18n = OpenLayers.i18n; 
