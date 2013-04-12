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
(function() {
	/**
	 * Namespace: oscar
	 * 
	 * The oscar object provides the oscar namespace for all the components
	 * within the framework.
	 */
	var singleFile = (typeof oscar == "object" && oscar.singleFile);
	window.oscar = {
			/**
			 * Property: _imagePath
			 * {String} Relative path to the images directory. 
			 */
		_imgPath:null,
		_scriptName: (!singleFile) ? "lib/oscar.js" : "oscar.js",
        _scriptLocation:null,
        _getScriptLocation: function () {
			if(this._scriptLcoation!=null) {
				return this._scriptLocation;
			}
            var scriptName = oscar._scriptName;
         
            var scripts = document.getElementsByTagName('script');
            for (var i=0, len=scripts.length; i<len; i++) {
                var src = scripts[i].getAttribute('src');
                if (src) {
                	var index = src.indexOf(this._scriptName);
                	if(index > -1) {
                		this._scriptLocation =src.substring(0,index);
                		break;
                	}
                }
            }
            return this._scriptLocation;
         },
         /**
          * Method: getImagePath
          * {String} Returns the default location for the images.
          */
         getImagePath:function() {
        	 return this._imgPath || (oscar._getScriptLocation() + "images/");
          }	
    };
	/*
	 * Override the jQuery method
	 */
	/**
	 * Property: oscar.jQuery
	 * Provides access to the jQuery library
	 * > 
	 * > Usage: oscar.jQuery('selector') or $$('selector')
	 */
	oscar.jQuery = jQuery.noConflict();
	
	/**
	 * Property: $$
	 * Provides access to the jQuery library
	 * > 
	 * > Usage: $$('selector')
	 */
	
	window.$$ = oscar.jQuery;
	
	/**
	 * Property: DownloadHost
	 */
	oscar.DownloadHost=null;

	if(!singleFile) {
		var jsfiles = new Array(
            "oscar/Util.js",
            "oscar/Types/BaseClass.js",
            "oscar/Types/Global.js",
            "oscar/Types/Bounds.js",
            "oscar/Types/Size.js",
            "oscar/Types/Theme.js",
            "oscar/ox/ox.js",
            "oscar/Gui.js",
            "oscar/Gui/Dialog.js",
            "oscar/Gui/AlertDialog.js",
            "oscar/Gui/ConfirmDialog.js",
            "oscar/Gui/SelectionTable.js",
            "oscar/Gui/ThemeManager.js",
            "oscar/Gui/ThemeManagerViewer.js",
            "oscar/Gui/KeywordVocabularyTable.js",
            "oscar/Gui/ComboBox.js",
            "oscar/SelectionHandler.js",
            "oscar/Handler/WFSRequest.js",
            "oscar/Control.js", 
            "oscar/Control/ArgParser.js",
            "oscar/Control/Extractor.js",
            "oscar/Control/PanZoomBar.js",
            "oscar/Control/Permalink.js",
            "oscar/Control/ThemeSwitcher.js",
            "oscar/Control/ToolBar.js",
            "oscar/Control/Select.js",
            "oscar/Control/ClearSelection.js",
            "oscar/Control/Print.js",
            "oscar/Control/MetaData.js",
            "oscar/Control/PermaLink.js",
            "oscar/Control/PreviousView.js",
            "oscar/Control/OverviewMap.js",
            "oscar/Control/ThemeManager.js",
            "oscar/Control/OXFConfigManager.js",
            "oscar/Layer.js",
            "oscar/Layer/POILayer.js",
            "oscar/Layer/WMTS.js",
            "oscar/Util/Capabilities.js",
            "oscar/Util/ConfigManager.js",
            "oscar/Util/ConfirmBox.js",
            "oscar/Util/AlertBox.js",
            "oscar/Util/SelectControl.js",
            "oscar/Util/SettingsAutoCompleteTable.js",
            "oscar/Util/MultiCoordinateSystemsChooser.js",
            "oscar/Util/StatusChecker.js",
            "oscar/Util/DivSelect.js",
            "oscar/Util/DivSelectOption.js",
            "oscar/Format.js",
            "oscar/Lang.js",
            "oscar/lang.dictionary.js",
            "oscar/Popup/FramedCloud.js",
            "oscar/Map.js",
            "oscar/Map2.js",
            "oscar/Util/CoordinateSystemAutoComplete.js"
        ); // etc.

    	
    
    
        var agent = navigator.userAgent;
        var docWrite = (agent.match("MSIE") || agent.match("Safari"));
        if(docWrite) {
            var allScriptTags = new Array(jsfiles.length);
        }
        host = oscar._getScriptLocation() + "lib/";  
        for (var i=0, len=jsfiles.length; i<len; i++) {
            if (docWrite) {
                allScriptTags[i] = "<script src='" + host + jsfiles[i] +
                                   "'></script>"; 
            } else {
            	var s = document.createElement("script");
                s.src = host + jsfiles[i];
                var h = document.getElementsByTagName("head").length ? 
                           document.getElementsByTagName("head")[0] : 
                           document.body;
                           
                h.appendChild(s);
            }
        }
        if (docWrite) {
            document.write(allScriptTags.join(""));
        }
        
        oscar.jQuery = jQuery.noConflict();
	}
	
})();
/**
 * Constant: VERSION_NUMBER
 */
oscar.VERSION_NUMBER = "12.0.5-GA";