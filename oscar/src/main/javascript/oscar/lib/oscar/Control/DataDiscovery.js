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
		"default": {
			fillColor :"#09c",
			fillOpacity:0,
			strokeColor :"#FF0000",
			strokeWidth :1,
			strokeDashstyle :'solid'
		},
		select: {
			fillColor :"#09c",
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
    initialize:function(findCoverages) {
	    oscar.Control.DragPanel.prototype.initialize.apply(this);
		this.findCoverages = findCoverages;
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
		 this.resultsPanel = $$("<div></div>").addClass("resultsPanel");
		 var $mGlass = $$("<div></div>");
		 $mGlass.addClass("magnifyingGlass");
		 searchPanel.append(textEntryPanel);
		 textEntryPanel.append($mGlass);
		 searchPanel.append(this.resultsPanel);
		
		 this.txt = $$("<input>").attr("type","text").addClass("search");
		 this.txt.css("width","200px");
		 textEntryPanel.append(this.txt);
	 
		 var scope = this;
		 $mGlass.click(function() {
			scope.getResults();
		 });
		 
		 this.txt.keyup(function(e) {
			if(e.keyCode && e.keyCode == 13) {
				scope.getResults();
			}
		 });
	     var br = $$("<br>").attr("clear","left");
	     textEntryPanel.append(br);
	     
         this.txt.focus(function() {this.value="";});
		    
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
	},
	
    /**
     * Method: unselectFeature
     * Removes the feature from the map and unselects any feature from the list.
     */
	unselectFeature:function() {
		this.resultsPanel.children().each(function() {
			$$(this).removeClass("selected");
		});
		
	},

	displayResults:function(coverages) {
		this.layer.removeAllFeatures();
		this.resultsPanel.empty();
        var scope=this;
		var resultsCoverage=null;
		for(var r=0;r<coverages.length;r++) {
            var record = coverages[r];
			if(record.bounds) {
				record.feature = this.drawCoverage(record.bounds.clone());
				if(resultsCoverage) {
					resultsCoverage.extend(record.feature.geometry.getBounds().clone());
				} else {
					resultsCoverage=record.feature.geometry.getBounds().clone();
				}
			}
			
            var $recDiv = $$("<div></div>");
            $recDiv.html(record.title || record.id).addClass("result");
            var $dataType = $$("<div></div>");
            $dataType.addClass("wcs");
            $recDiv.prepend($dataType);
			$recDiv.data("record",record);
			
            $recDiv.click(function() {
                var $this = $$(this);
                scope.unselectFeature();
                $this.addClass("selected");
                scope.discoverPanel.accordion("option", "active",1);
				$this.data("record");
                scope.loadCoverage($this.data("record"));
                
            });
            this.resultsPanel.append($recDiv);
        }
		if(resultsCoverage) {
			this.map.zoomToExtent(resultsCoverage);
		}
	},
	
	drawCoverage:function(bounds) {
		bounds = oscar.Util.transform(bounds,new OpenLayers.Projection("EPSG:4326"),this.map.getProjectionObject());
		var feat = new OpenLayers.Feature.Vector(bounds.toGeometry());
		this.layer.addFeatures(feat);
		return feat;
	},
	
	/**
	 * Method: getResults
	 * 
	 * Uses the database object to obtain an array of the available results.
	 */
	
	getResults:function() {
		this.unselectFeature();
		var query = this.txt.val().trim();	
		var findCoverage = new oscar.Request.OGC.WCS.FindCoverage(
			this.findCoverages.url,
			this.map.getExtent(),
			this.map.getProjection().toString(),
			query
		);
		findCoverage.events.on({
			"success":function(e) {
				this.displayResults(e.coverages);
			},
			"failure":function(e) {
				this.displayResults([]);
				$$("<div></div>").append(e).dialog({title:oscar.i18n("Error")});
			},
			scope:this
		});
		findCoverage.get();
	},
	
	loadCoverage:function(coverage) {

		if(this.downloadOptions == null) {
	    	this.downloadOptions = new oscar.Gui.DownloadOptions({map:this.map,serviceParams:this.findCoverages});
	    	this.downloadOptions.events.on({"serviceReady":this.queueDownload,scope:this});
	    	this.downloadOptions.appendTo(this.optionsPanel);
	    }
	    this.downloadOptions.setCoverage(coverage);
	
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
	},
	/**
	 * Method: checkLayer
	 * This will check to see if a layer has already been created
	 * to display features.
	 */
	checkLayer:function() {
		this.layer = new OpenLayers.Layer.Vector("Results",{displayInLayerSwitcher:false});
		this.layer.hidden = true;
		var defaultStyle = OpenLayers.Util.applyDefaults(this.styles["default"],OpenLayers.Feature.Vector.style["default"]);
		var selectStyle = OpenLayers.Util.applyDefaults( this.styles.select, OpenLayers.Feature.Vector.style["select"]);
		selectStyle.cursor = "";
		var temporaryStyle = OpenLayers.Util.applyDefaults( this.styles.temporary, OpenLayers.Feature.Vector.style["temporary"]);
		this.layer.styleMap = new OpenLayers.StyleMap( {
			"default":defaultStyle,
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
		this.map.events.un({"moveend":this.getResults,scope:this});
		
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

    	this.discoverPanel.accordion("option", "active",2);

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