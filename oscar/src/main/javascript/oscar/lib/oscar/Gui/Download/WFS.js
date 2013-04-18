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
 * Class: oscar.Gui.Download.WFS
 * 
 * Download widget for executing WFS GetFeature requests for download.
 * from a web coverage service. 
 * 
 * Inherits from:
 * - <oscar.Gui.Download>
 */

oscar.Gui.Download.WFS = oscar.BaseClass(oscar.Gui.Download, {
	/**
	 * APIProperty: autoStart
	 * {Boolean} - Should the requests start immediately after the draw method call. Defaults to true.
	 * 
	 */
	autoStart: true,
	/**
	 * APIProperty: title
	 * The text to be displayed for the download  reference.
	 */
    title:null,

    /**
	 * Constructor: oscar.Gui.Download.WFS
	 * 
	 * Parameters: 
	 * url - The url of the web coverage service.
	 * parameters - {Object} Key:Value pair parameters for a GetCoverage request. 
	 * options - {Object} An optional object whose properties will be set on
	 * 			 this instance.
	 */
    initialize:function(url,parameters,options) {
        OpenLayers.Util.extend(this,options);
        this.url = url;
        this.parameters = parameters;
        var paramString = OpenLayers.Util.getParameterString(this.parameters);
		paramString = unescape(paramString);
		if (paramString.length > 0) {
			var separator = (this.url.indexOf('?') > -1) ? '&' : '?';
			this.url += separator + paramString;
		}

        
    },
    
    /**
     * APIMethod: draw
     * 
     * Creates the DOM elmements to display the widget on screen.
     * 
     * Returns:
     *  A DOM element.
     */
    draw:function() {
     var scope = this;
     this.div = document.createElement("div");
     this.contentContainer = document.createElement("div");
     this.div.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME);
     var className = this.CLASS_NAME.replace(/\./g, "");
     oscar.jQuery(this.div).addClass(className);
     
     this.content = document.createElement("div");
     oscar.jQuery(this.content).addClass("downloadContainer");
     this.grfx = document.createElement("div");
     this.content.appendChild(this.grfx);
     oscar.jQuery(this.grfx).addClass("animatedDownload");
     this.txt = document.createElement("div");
     oscar.jQuery(this.txt).addClass("dmTextContainer");
      
     this.transformedDiv = document.createElement("div");
     oscar.jQuery(this.transformedDiv).addClass("dContainer");
     
     downloadButton = $$("<span></span>").addClass("ui-icon-disk-save").attr("title",oscar.i18n("saveButtonLabel"));
     
     
     $$(this.transformedDiv).append(downloadButton);

     downloadButton.click(function(e) {
    	 scope.prepDownloadParams();
	 });
     
     this.content.appendChild(this.txt);
     this.content.appendChild(this.transformedDiv);
     
     if(this.title == null) {
        this.title = prompt("Download Name:","default");
     }
     this.txt.innerHTML = this.title;
     this.txt.title = this.title;
     this.txt.alt= this.title;
     this.div.appendChild(this.content);
     this.disableClick();
     
     if(this.autoStart) {
    	 var scope = this;
    	 var f = function() {
    		 scope.initRequests();
    	 }
    	 setTimeout(f,500);
     }
     
     return this.div;
    },
    
    /**
     * Method: prepDownloadParams
     * 
     * Method for preparing the parameters for the download functionality.
     */
    prepDownloadParams: function() {
		var filename = this.title + ".";
		var format = new String(this.parameters["outputFormat"]);
		
		if(format.toLowerCase().indexOf("gml") > -1) {
			filename+="xml";
		} else if (format.toLowerCase().indexOf("kml") > -1) {
			filename+="kml";
		} else if (format.toLowerCase().indexOf("json") > -1) {
			filename+="json";
		} else if (format.toLowerCase().indexOf("shape") > -1) {
			filename+="zip";
		} else { //anything else
			filename+=format.toLowerCase();
		}
		
		this.downloadFromService(this.url,filename);
    },
    
    
    /**
     * Method: disableClick
     * 
     * Called from the draw method. This method disables
     * calls through the element to the map.
     */
    disableClick:function() {
        OpenLayers.Event.observe(this.div, "mousedown", function(e) {
    			OpenLayers.Event.stop(e, true);
    	 });
         return;
         oscar.jQuery(this.div).draggable( {
            containment :"parent",
            start : function(event, ui) {
                oscar.jQuery(this).addClass("olDragDown");
            },
            stop : function(event, ui) {
                oscar.jQuery(this).removeClass("olDragDown");
            }
         });  
   
    },
    
    /**
     * APIMethod: initRequests
     * 
     * Called from the constructor. Sends off the requests for GetCoverage and 
     * the stylesheet to for transformation.
     */
    initRequests:function() {
    	this.transform();
    	return;
    },
    
    transform:function() {
        var scope = this;
        var fadeIn = function() {
            oscar.jQuery(scope.grfx).addClass("downloadReady");
            oscar.jQuery(scope.content).addClass("ready");
            oscar.jQuery(scope.content).fadeIn("fast");
        }
        oscar.jQuery(this.content).fadeOut("fast",fadeIn);    
    },

    /**
     * Method: gotoUrl
     * Called when the coverage and metadata icons are clicked. Will trigger a
     * window or iframe to spawn allowing download of a coverage or viewing
     * of the metadata.
     * 
     */
    gotoUrl:function(classType, url) {
        switch(classType) {
            case "dCoverage":
                var filename = url.substring(url.lastIndexOf("/")+1);
				this.downloadFromService(url,filename);
				break;
            case "dMetadata":
                window.open(url);
                break;
        }
    },
    /**
     * Method: requestFail
     * Called when the GetCoverage or xslt requests have failed.
     */
    requestFail:function(resp) {
        var scope = this;
        var fadeIn = function() {
            scope.txt.innerHTML = "Download Cancelled";
            oscar.jQuery(scope.grfx).addClass("downloadCancelled");
            oscar.jQuery(scope.content).fadeIn("fast");
        }
        oscar.jQuery(this.content).fadeOut("fast",fadeIn);
    },
    
    CLASS_NAME:"oscar.Gui.Download.WFS"
});