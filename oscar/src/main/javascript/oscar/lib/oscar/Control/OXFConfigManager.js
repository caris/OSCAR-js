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
 * Class: oscar.Control.OXFConfigManager
 * 
 * The Oscar OXFConfigManager control offers a <load> method that background loads
 * a remote document and builds <ox>, the Oscar eXchange container object, in accordance 
 * with the Oscar eXchange Format <oscar.Format.OXF.v2>.
 * 
 * Inherits from: 
 * - <OpenLayers.Control>
 *  
 */
oscar.Control.OXFConfigManager = oscar.BaseClass(OpenLayers.Control, {
	/**
	 * APIProperty: ox 
	 * 
	 * The Oscar eXchange objects container.
	 * Please see <oscar.ox>.
	 */
	ox :null,
	
	/**
	 * Constant: EVENT_TYPES
	 * 
	 * haveThemes - triggered when the <ox> Oscar eXchange container is returned successfully.
	 */
	EVENT_TYPES : [ "haveThemes" ],
	
	/**
	 * Property: events
	 */
	events :null,
	
	/**
	 * Property: themeManager 
	 */
	themeManager :null,
	
	/**
	 * Property: defaultThemeId
	 */
	defaultThemeId :-1,
	
	/**
	 * Constructor: oscar.Control.OXFConfigManager
	 * 
	 * Parameters: 
	 * options - {Object} An optional object whose properties will be set on
	 * this instance.
	 */
	initialize : function(options) {
		OpenLayers.Control.prototype.initialize.apply(this, arguments);
		this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES,
				false, {
					includeXY :true
				});
		this.events.register('haveThemes', this, this.applyThemes);
	},
	
	/**
	 * APIMethod: load 
	 * 
	 * Takes a URL as parameter and background load the document from the URL.
	 * 
	 * If load successfully, then read the document and build the Oscar eXchange
	 * container object <ox>. 
	 * 
	 * If load failed, then generates a error alert dialog.
	 * 
	 * Parameters:  
	 * source - {String} the URI of the source document 
	 * 
	 */
	load : function(source) {
		OpenLayers.loadURL(source, null, this, this.success, this.failure)
	},
	
	/**
	 * Method: success
	 * 
	 * Builds the <ox> (Oscar eXchange container) object using the Oscar eXchange objects
	 * such as ox.Theme and ox.Layer etc, and then returns the ox object container.
	 * 
	 * Parameters: 
	 * transport - the returned document from <load>.
	 * 
	 */
	success : function(transport) {
        //lets seee if we have an xml file
        var cType = transport.getResponseHeader("Content-Type");
        var reader=null;
        if( transport.getResponseHeader("Content-Type").contains("xml")) {
        	reader = new oscar.Format.OXF.XML();
        	try{
                this.ox = reader.read(transport.responseXML);
        	} catch(err) {
        		this.failure(null);
        	}
        } else {
            reader = new oscar.Format.OXF();
            try {
    			this.ox = reader.read(transport.responseText);
    			if(this.ox.themes.length==0) {
    				this.failure(null);
                }
            } catch(err) {
                this.failure(null);
                return;
            }
        }
        
		this.events.triggerEvent("haveThemes", this.ox);
	},
	
	/**
	 * Method: failure 
	 * 
	 * This method is called if the request is unsuccessful.
	 * 
	 * Parameters:
	 * 
	 * transport - the returned document from <load>.
	 * 
	 */
	failure : function(transport) {
		new oscar.Gui.AlertDialog(oscar.i18n("Error"), oscar
				.i18n("NoThemesAvailable"), {
			width :300,
			height :100,
			draggable :true
		});
	},
	
	/**
	 * Method: applyThemeToMap 
	 * 
	 * Sets a default themeID.
	 * 
	 * Parameters:
	 * 
	 * themeID - the ID of a theme.
	 */
	applyThemeToMap : function(themeId) {
		this.defaultThemeId = themeId;
	},
	
	/**
	 * Constant: CLASS_NAME
	 * 
	 * - oscar.Control.OXFConfigManager
	 */
	CLASS_NAME :"oscar.Control.OXFConfigManager"
})