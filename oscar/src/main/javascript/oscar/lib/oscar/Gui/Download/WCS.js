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
 * @requires oscar.Gui.Download
 */

/**
 * Class: oscar.Gui.Download.WCS
 * 
 * This is a small GUI widget for executing AJAX requests for downloading
 * from a web coverage service. 
 * 
 * Inherits from:
 * - <oscar.Gui.Download>
 */

oscar.Gui.Download.WCS = oscar.BaseClass(oscar.Gui.Download, {
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
	 * APIProperty: events
	 * 
	 * {<OpenLayers.Events>} An events object that handles all
	 * events on the label.
	 */
    events:null,
    /**
	 * Constant: EVENT_TYPES
	 * {Array(String)} Supported application event types. 
	 * 
	 * Register a listener for a particular event with the following syntax:
	 *   
	 * > wcs.events.register(type, obj, listener); 
	 * 
	 * Supported ClickableLabel event types:
	 * 
	 * xmlReceived - Triggered when the xml is received from the service.
	 *                 
	 * xslReceived - Triggered when the xsl for transformation is received.
	 */
    EVENT_TYPES:["xmlReceived","xslReceived"],
    
    /**
     * Property: wcsRequest 
     * {OpenLayers.Request.GET} - Handles the GetCoverage request.
     * 
     */
    wcsRequest:null,
    /**
     * Property: hasXML
     * {Boolean} - If the GetCoverage request returns successfully this is set to true.
     */
    hasXML:false,
    /**
     * Property: xslRequest 
     * {OpenLayers.Request.GET} - Handles the xslt request.
     * 
     */    
    xslRequest:null,
    /**
     * Property: hasXSL
     * {Boolean} - If the xslt request returns successfully this is set to true.
     */
    hasXSL:false,
    
    
    /**
	 * Constructor: oscar.Gui.Download.WCS
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
        this.events = new OpenLayers.Events(this, null,
				this.EVENT_TYPES, false, {
					includeXY :true
				});
        this.events.register("xmlReceived", this, this.checkExternalRequests);
        this.events.register("xslReceived", this, this.checkExternalRequests);
        this.isEMLDownload = this.url.contains("store=false"); 
        
        
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
     this.content.appendChild(this.txt);
     this.content.appendChild(this.transformedDiv);
     
     if(this.title == null) {
        this.title = prompt("Download Name:","default");
     }
     this.txt.innerHTML = this.title;
     this.txt.title = this.title;
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
    	if(!this.isEMLDownload) {
	        this.wcsRequest = OpenLayers.Request.GET( {
	            url :this.url,
	            async:true,
	            parameters:this.parameters,
	            success :this.xmlObtained,
	            failure : this.requestFail,
	            scope:this
	        });
	        
	        this.xslRequest = OpenLayers.Request.GET( {
	            url :oscar._getScriptLocation() + "resources/GetCoverage.xsl",
	            async:true,
	            success : this.xslObtained,
	            failure : this.requestFail,
	            scope :this
	        });
    	} else {
    		//fake a download
    		var span = document.createElement("span");
    		$$(span).addClass("dCoverage");
    		$$(this.grfx).addClass("downloadReady");
            this.transformedDiv.appendChild(span);
            var scope = this;
            OpenLayers.Event.observe(span, "click", function(e) {
            	scope.gotoUrl("dCoverage",scope.url);
            });
    	}
    },
    
    /**
     * Method: xslObtained
     * Called when the xsl request has completed successfully. 
     */
    xslObtained:function(resp) {
        this.xsl = resp.responseXML;
        this.hasXSL = true;
        this.events.triggerEvent("xslReceived");
    },
    /**
     * Method: xmlObtained
     * Called when the GetCoverage request has completed successfully. 
     */
    xmlObtained:function(resp) {
        this.xml = resp.responseXML;
        this.hasXML = true;
        this.events.triggerEvent("xmlReceived");
    },
    /**
     * Method: checkExternalRequests
     * Called from xslObtained and xmlObtained methods. Will call the
     * transform method if both responses are valid.
     */
    checkExternalRequests:function(e) {
    	if(this.hasXSL && this.hasXML) {
    		this.transform();
    	}
    },
    
    /**
     * Method: transform
     * 
     * Called from the checkExternalRequests method. This method transforms 
     * the received xml against the received xsl to display in the widget. 
     */
    transform:function() {
        var results = oscar.Util["Transform"].transform(this.xml,
            this.xsl);
        var pHolder = document.createElement("div");
        if (typeof results == "string") {
            pHolder.innerHTML = results;
        } else {
            pHolder.appendChild(results);
        }
        
        var scope = this;
        var fadeIn = function() {
        	scope.transformedDiv.innerHTML = pHolder.innerHTML;
            var children = oscar.jQuery(scope.transformedDiv).children();
            for(var i=0;i<children.length;i++) {
                var child = children[i];
                var href= child.attributes['href'].value;
                var onclick = function(classType, url) {
                    return function() {
                        scope.gotoUrl(classType, url);
                    }
                }
                child.onclick = onclick(child.attributes['class'].value, href);
            }
            oscar.jQuery(scope.grfx).addClass("downloadReady");
            oscar.jQuery(this.content).addClass("ready");
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
                var iFrame = document.createElement("iframe");
                oscar.jQuery(iFrame).addClass("dmIFrame");
                document.body.appendChild(iFrame);
                iFrame.src = url;
               break;
            case "dMetadata":
                this.downloadFromService(url,"metadata.xml");
                break;
        }
    },
    /**
     * Method: requestFail
     * Called when the GetCoverage or xslt requests have failed.
     */
    requestFail:function(resp) {
    	if(this.xslRequest!= null) {
    		this.xslRequest.abort();
    	}
    	if(this.wcsRequest != null) {
    		this.wcsRequest.abort();
    	}
        var scope = this;
        var fadeIn = function() {
            scope.txt.innerHTML = "Download Cancelled";
            oscar.jQuery(scope.grfx).addClass("downloadCancelled");
            oscar.jQuery(scope.content).fadeIn("fast");
        }
        oscar.jQuery(this.content).fadeOut("fast",fadeIn);
    },
    
    CLASS_NAME:"oscar.Gui.Download.WCS"
});