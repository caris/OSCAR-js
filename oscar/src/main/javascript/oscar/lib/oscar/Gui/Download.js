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
 * @requires oscar.Gui
 */
/**
 * Class: oscar.Gui.Download
 *
 * Parent class for the Download gui elements.
 * 
 * Inherits from:
 * - <oscar.Gui>
 */


oscar.Gui.Download = oscar.BaseClass(oscar.Gui, {
	/**
	 * Constructor:
	 * Not to be called directly.
	 */
    initialize:function() {
		oscar.Gui.prototype.initialize.apply(this);
    },
    /**
     * Method: downloadFromService
     * 
     * Creates a hidden iframe to post a url to allow the Save As dialog
     * to be used when downloading from a service.
     */
    downloadFromService:function(url,filename) {
    	if(oscar.DownloadHost) {
			var form = document.createElement("form");
			var formName = OpenLayers.Util.createUniqueID("randomForm");
			form.name = formName;
			form.action = oscar.DownloadHost;
			form.method="POST";
			var iUrl = document.createElement("input");
			iUrl.name="url";
			iUrl.tyle="text";
			iUrl.value = url;
			form.appendChild(iUrl);
			var iFilename= document.createElement("input");
			iFilename.name="filename";
			iFilename.tyle="text";
			iFilename.value = filename;
			form.appendChild(iFilename);
			document.body.appendChild(form);
			form.submit();
   	 } else {
   		 	window.open(url, "abc123","width=640,height=480,menuBar=yes,location=false,scrollbars=yes");
   	 }
    },
    /**
     * Constant: CLASS_NAME
     */
    CLASS_NAME:"oscar.Gui.Download"
});