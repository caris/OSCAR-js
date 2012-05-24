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
 * Class: oscar.Control.DataDiscovery
 * 
 * This control is used to allow users to search for data on the map and 
 * provided a way for them to download or extract the data.
 * 
 */

oscar.Control.DataDiscovery = oscar.BaseClass(oscar.Control.DragPanel, {
	autoActivate:true,
	/**
	 * APIProperty: tooltipText
	 * 
	 * {String} - translation key or text to use for the Theme Switcher tool tip. Default is ThemeSwitcherToolTip.
	 */
	tooltipText:"DataDiscoverySearchToolTip",
	/**
	 * APIProperty: titleText
	 * 
	 * {String} - translation key or text to use for the Theme Switcher title. Default is ThemeSwitcherTitle.
	 */
	titleText:"DataDiscoverySearchTitle",
	/**
	 * APIProperty: iconClass
	 * 
	 * {String} - css class to use for the icon of the widget.
	 */
	iconClass :"",
	/**
	 * APIProperty: closed
	 * 
	 * {Boolean} - Chooses if the widget should be open or closed initially. Default is false.
	 */
	closed:false,
	/**
	 * APIProperty: resizable
	 * 
	 * {Boolean} - Chooses if the widget is allowed to be resized. Default is true.
	 */
	resizable:false,
	/**
	 * APIProperty: collapsible
	 * 
	 * {Boolean} - Chooses if the widget can be collapsed. Default is true.
	 */
	collapsible:true,
	
	/**
	 * APIProperty: database
	 * {oscar.Util.Database} - The database object to use for searching.
	 */
	
	database:null,
	
	/**
	 * APIProperty: styles
	 * 
	 * {Object} - Used to select and crop style.
	 */
	
	styles: {
		select: {
			fillColor :"#fff",
			strokeColor :"#000",
			strokeWidth :1,
			strokeDashstyle :'solid',
			opacity :0.1
		},
		temporary: {
			fillColor :"#ace",
			strokeColor :"#000",
			strokeWidth :1,
			strokeDashstyle :'dash',
			opacity :0.1
		}
	},
	
	/**
	 * Constructor: oscar.Control.DataDiscovery
	 * 
	 * Parameters:
	 * 
	 *  db - {oscar.Util.Database} The database of results for searching.
	 */
    initialize:function(db) {
	    oscar.Control.DragPanel.prototype.initialize.apply(this);
	    this.database = db;
	    this.database.events.on({"dbupdated":this.dbupdated,scope:this});
	},
	dbupdated:function(e) {
	},
	/**
	 * Method: setMap
	 * 
	 *  Parameters: 
	 *  
	 *  map - {OpenLayers.Map}
	 *  
	 */
    setMap:function(map) {
	    oscar.Control.prototype.setMap.apply(this,[map]);
	    this.map.events.on({"moveend":this.displayResults,scope:this});
	    this.checkLayer();
	},
	
	/**
	 * Method: draw
	 * 
	 * Draws the control.
	 */
	draw:function() {
		oscar.Control.DragPanel.prototype.draw.apply(this);
		this.buildDiscoverPanels();
	    return this.div;
	},
	
	/**
	 * Method: buildDiscoveryPanel
	 * 
	 * Creates the different panels for the control.
	 */
	buildDiscoverPanels:function() {
		 this.discoverPanel = $$("<div></div>").addClass("discoverPanel");
         
         /* build the search header and panel */
		 var searchHeader = $$("<h3></h3>");
         var searchHeaderAnchor = $$("<a></a>").attr("href","#").html(oscar.i18n("Search"));
         searchHeader.append(searchHeaderAnchor);
         var searchPanel = $$("<div></div>").addClass("searchPanel");

		 /* build the download options header and panel */
         var optionsHeader = $$("<h3></h3>");
         var optionsHeaderAnchor = $$("<a></a>").attr("href","#").html(oscar.i18n("DownloadOptions"));
         optionsHeader.append(optionsHeaderAnchor);
		 this.optionsPanel = $$("<div></div>").addClass("optionsPanel");
		 
         /* build the download queue header and panel */
         this.queueHeader = $$("<h3></h3>");
         var queueHeaderAnchor = $$("<a></a>").attr("href","#").html(oscar.i18n("DownloadQueue"));
         this.queueHeader.append(queueHeaderAnchor);
		 this.queuePanel = $$("<div></div>").addClass("queuePanel");
         
         /* add everything to the main panel */
		 $$(this.discoverPanel).append(searchHeader);
		 $$(this.discoverPanel).append(searchPanel);
		 $$(this.discoverPanel).append(optionsHeader);
		 $$(this.discoverPanel).append(this.optionsPanel);
		 $$(this.discoverPanel).append(this.queueHeader);
		 $$(this.discoverPanel).append(this.queuePanel);
         
         
		 
		 var textEntryPanel = $$("<div></div>");
		 textEntryPanel.css({
			 'padding':'2px 2px 2px 2px'
		 });
		 var reset = $$("<div></div>");
		 this.resultsPanel = $$("<div></div>").addClass("resultsPanel");
		 reset.addClass("oscar_Gui_MultiItemChooserTable_resetTable_disabled");
		 reset.addClass("reset");
		 var $mGlass = $$("<span></span>");
		 $mGlass.addClass("magnifyingGlass");
		 searchPanel.append($mGlass);
		 searchPanel.append(textEntryPanel);
		 searchPanel.append(this.resultsPanel);
		
		 this.txt = $$("<input>").attr("type","text").addClass("search");
		 this.txt.css("width","200px");
		 textEntryPanel.append(this.txt);
		 textEntryPanel.append(reset);
		 
		 var scope = this;
		
		 reset.click(function() {
			 scope.reset();
		 });
	     
	     var br = $$("<br>").attr("clear","left");
	     textEntryPanel.append(br);
	     
         this.txt.focus(function() {this.value="";});
         

         this.txt.keyup(function(e) {
             switch (e.keyCode) {
	            case 13:
	            case 16:
	            case 16:
	            case 17:
	            case 18:
	                return;
	            }
                scope.displayResults();
         });
			 
		    
         var icons = {
                    header: "ui-icon-circle-arrow-e",
                    headerSelected: "ui-icon-circle-arrow-s"
                };
         oscar.jQuery(this.discoverPanel).accordion({
             collapsible:false,
             animated:false,
             icons:icons
         });
         OpenLayers.Event.observe(this.discoverPanel, "mousedown", function(e) {
                OpenLayers.Event.stop(e, true);
             });

         OpenLayers.Event.observe(this.discoverPanel, "click", function(e) {
                OpenLayers.Event.stop(e, true);
         });
         $$(this.content).append(this.discoverPanel);
         this.getResults();
	},
	
    /**
     * Method: unselectFeature
     * Removes the feature from the map and unselects any feature from the list.
     */
	unselectFeature:function() {
		this.resultsPanel.children().each(function() {
			$$(this).removeClass("selected");
		});
		this.layer.removeAllFeatures();
	},
	/**
	 * Method: reset
	 * Resets the search options and zooms the map to the max extent.
	 */
	reset:function() {
	    this.unselectFeature();
	    this.txt.val("");
	    this.map.zoomToMaxExtent();
	    this.displayResults();
	},
	
	
	/**
	 * Method: getResults
	 * 
	 * Uses the database object to obtain an array of the available results.
	 */
	
	getResults:function() {
        var scope=this;
        var columns = this.database.tables["sources"].columns;
		var records = this.database.tables["sources"].records;
		for(var r=0;r<records.length;r++) {
            var record = records[r];
            var $recDiv = $$("<div></div>");
            $recDiv.html(record.title || record.id).addClass("result");
            var $dataType = $$("<div></div>");
            $dataType.addClass(record.dataType);
            $recDiv.prepend($dataType);
            for(var c=0;c<columns.length;c++) {
                var column = columns[c];
                $recDiv.data(column,record[column]);
            }
            $recDiv.click(function() {
                var $this = $$(this);
                scope.unselectFeature();
                $this.addClass("selected");
                scope.discoverPanel.accordion("activate",1);
                scope.drawFeature($this);
                
            });
            $recDiv.hide();
            this.resultsPanel.append($recDiv);
        }
        this.displayResults();
	},
	/**
	 * Method: displayResults
	 * 
	 * Uses the array of results and validates it against any text entry
	 * in the text field and the current extent of the map to decide if a
	 * result should be displayed.
	 */
	displayResults:function(e) {
        var scope = this;
        var query = this.txt.val().trim();
        this.resultsPanel.children().each(function() {
            var $this = $$(this);
            var mapViewPort = scope.map.getExtent();
            var isInRange = (mapViewPort.containsBounds($this.data("bbox")) ||
                mapViewPort.intersectsBounds($this.data("bbox")));
            
            var textFound = (query.length == 0 || 
					$this.data("id").toLowerCase().contains(query.toLowerCase()) || 
					$this.data("title").toLowerCase().contains(query.toLowerCase())
			);
            
            if(isInRange && textFound) {
                $this.show();
            } else {
                $this.hide();
            }
        });
	},	
	/**
	 * Method: drawFeature
	 * Once the feature is selected in the results panel this will display 
	 * the feature on the map while activating the Download Options panel.
	 * 
	 */
	drawFeature:function($div) {
        var bbox = $div.data("bbox");
		if(this.layer && this.layer.features.length > 0) {
			this.layer.removeAllFeatures();
		}
        var feat = new OpenLayers.Feature.Vector(bbox.toGeometry());
        feat.div = $div;
        this.layer.addFeatures(feat);
	    this.layer.events.triggerEvent("loadend");
	    
	    
	    var scope = this;
	    setTimeout(function(){
			var selectFeature = scope.map.getControlsByClass("oscar.Control.SelectFeature")[0];
			selectFeature.ctrl.unselectAll();
			selectFeature.ctrl.select(feat);
	    },0);
	    
	    var viewPort = this.map.getExtent();
	    if(viewPort.containsBounds(bbox)) {
	    	this.map.zoomToExtent(bbox);
	    }
	    if(this.downloadOptions == null) {
	    	this.downloadOptions = new oscar.Gui.DownloadOptions({db:this.database,map:this.map});
	    	this.downloadOptions.events.on({"serviceReady":this.queueDownload,scope:this});
	    	this.downloadOptions.appendTo(this.optionsPanel);
	    }
	    this.downloadOptions.setFeature(feat);
	},
	/**
	 * Method: activate
	 * Called when activated.
	 */
	activate:function() {
		oscar.Control.prototype.activate.apply(this);
		if(this.div) {
			  oscar.jQuery(this.div).fadeIn();
		}
		this.checkLayer();
		this.displayResults();
	},
	/**
	 * Method: checkLayer
	 * This will check to see if a layer has already been created
	 * to display features.
	 */
	checkLayer:function() {
		if(this.layer) return;
		this.layer = new OpenLayers.Layer.Vector("Results");
		this.layer.hidden = true;
		var selectStyle = OpenLayers.Util.applyDefaults( this.styles.select, OpenLayers.Feature.Vector.style["select"]);
		selectStyle.cursor = "";

		var temporaryStyle = OpenLayers.Util.applyDefaults( this.styles.temporary, OpenLayers.Feature.Vector.style["temporary"]);
		this.layer.styleMap = new OpenLayers.StyleMap( {
			"select":selectStyle,
			"temporary":temporaryStyle
		});
	    
	    this.map.addLayer(this.layer);	    
	},
	/**
	 * Method: deactivate
	 * Called when the control is deactivated
	 */
	deactivate:function() {
		this.map.events.un({"moveend":this.displayResults,scope:this});
		
		if(this.layer &&
				this.layer.map != null) {
		 this.map.removeLayer(this.layer);
		 this.layer = null;
		}
        if(this.div) {
            oscar.jQuery(this.div).fadeOut();
      }
        oscar.jQuery(this.div).empty();
        
        
		
        oscar.Control.prototype.deactivate.apply(this);
    },
    /**
     * Method: queueDownload
     * This adds a download service to the download queue panel.
     */
    queueDownload:function(service) {

    	this.discoverPanel.accordion("activate",2);

    	if(this.queuePanel.children().length>0) {
            this.queuePanel.prepend(service.draw());
        } else {
        	this.queuePanel.append(service.draw());
        }
    	

    },
    /**
     * Constant: CLASS_NAME
     */
    CLASS_NAME:"oscar.Control.DataDiscovery"
});