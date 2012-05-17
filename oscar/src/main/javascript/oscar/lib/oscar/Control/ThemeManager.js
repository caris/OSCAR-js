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
 * Class: oscar.Control.ThemeManager
 * 
 * The Oscar ThemeManager control handles the drawing of themes onto a map object.
 * 
 * Inherits from: 
 * - <OpenLayers.Control>
 * 
 */

oscar.Control.ThemeManager = oscar.BaseClass(OpenLayers.Control, {
	/**
	 * Constant: EVENT_TYPES
	 * 
	 * themeAdded - Called when there is a *theme* added.
	 * afterDraw - Called when the *doDraw* method is completed. 
	 */	
	EVENT_TYPES : [ 'themeAdded', 'afterDraw'],
	
	/**
	 * Property: events
	 * 
	 * The *events* object holds registered events for this control.
	 */
	events :null,
	
	/**
	 * Property: defaultThemeIndex
	 */
	defaultThemeIndex :0,
	
	/**
	 * Property: themes 
	 * 
	 * {Array} List of themes <oscar.ox.Theme> of the map.
	 */
	themes : null,
	
	/**
	 * Property: themeLbls
	 * The theme labels
	 */
	themeLbls : null,
	
	/**
	 * Property: themeDlg
	 * The theme dialog.
	 */
	themeDlg :null,
	
	/**
	 * Property: autoDraw
	 */
	autoDraw:false,
	
	/**
	 * Property: layers
	 */
	layers :null,
	
	/**
	 * Property: IS_SPHERICALMERCATOR
	 * 
	 * {Boolean} Should the map act as a mercator-projected map.
	 */
	IS_SPHERICALMERCATOR :null,
	
	/**
	 * Property: guiManager
	 */
	guiManager :null,
	
	/**
	 * Property: controlManager
	 */
	controlManager :null,
	
	/**
	 * Property: activeTheme
	 */
	activeTheme :null,
	
	/**
	 * Property: argParserClass 
	 */
	argParserClass:oscar.Control.ArgParser,
	
	/**
	 * Property: argParser
	 */
	argParser:null,
	
	/**
	 * Constructor: oscar.Control.ThemeManager
	 * 
	 * Parameters: 
	 * options - {Object} An optional object whose properties will be set on
	 *           this instance.
	 */
	initialize : function(options) {
		OpenLayers.Control.prototype.initialize.apply(this, [ options ]);
		OpenLayers.Util.extend(this, options);
		this.themes = [];
		this.themeLbls=[];
		this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES, true,
				{
					includeXY :true
				});
		this.events.register('themeAdded', this, this.themeAdded);
	},
	
	/**
	 * APIMethod: ignoreEvent
	 * 
	 * Ignores an event.
	 *  
	 * Parameters: 
	 * evt - {<OpenLayers.Event>}
	 */
	ignoreEvent : function(evt) {
		OpenLayers.Event.stop(evt);
	},
						
	/**
	 * APIMethod: setMap
	 * 
	 * Set the map property for the control. This is done through an accessor so
	 * that subclasses can override this and take special action once they have
	 * their map variable set.
	 * 
	 * Parameters: 
	 * map - {<OpenLayers.Map>}
	 */
	setMap : function(map) {
		OpenLayers.Control.prototype.setMap.apply(this, [ map ]);
		if (this.guiManager) {
			if (this.map.addToToolBox && this.guiManager.getToggleButton) {
				this.map.addToToolBox(this.guiManager.getToggleButton());
			}
		}
		if(this.argParser==null){
			this.argParser=new this.argParserClass();
			this.map.addControl(this.argParser);
		}
	},
	
	/**
	 * APIMethod: setConfigManager
	 * 
	 * Sets the configManager property used to load an OXF (Oscar eXchange Format) source. 
	 * This will register event calls to *applyThemes* function when the configManager triggers 
	 * a *haveThemes* event.
	 * 
	 * Parameters:
	 * cm - {<oscar.Control.OXFConfigManager>}
	 */
	setConfigManager : function(cm) {
		this.configManager = cm;
		this.configManager.events.on( {
			"haveThemes" :this.applyThemes,
			scope :this
		});
	},

	/**
	 * APIMethod: setGuiManager
	 * 
	 * Sets the GUI manager to use if there is to be a visual display of themes.
	 * This method will trigger the *themeActivated* event when the GUI manager 
	 * triggers its themeActivated event.
	 * 
	 * Parameters: 
	 * gui - GUI manager.
	 */
	setGuiManager : function(gui) {
		this.guiManager = gui;
		this.guiManager.events.on( {
			"themeActivated" :this.themeActivated,
			scope :this
		});
	},
	
	/**
	 * Method: applyThemes
	 * 
	 * Gets triggered from the configuration manager object. This method loops
	 * through the themes and calls addTheme.
	 */
	applyThemes : function() {
		if (this.configManager) {
			for ( var i = 0; i < this.configManager.ox.themes.length; i++) {
				this.addTheme(this.configManager.ox.themes[i]);
			}
		}
	},
	
	/**
	 * Method: addTheme
	 * 
	 * This method takes a theme object and adds it to the theme manager.
	 * 
	 * Parameters: 
	 * themeObj - {<oscar.ox.Theme>}
	 */
	addTheme : function(themeObj) {
		this.themes.push(themeObj);
		this.events.triggerEvent("themeAdded", {
			theme :themeObj
		});
		if(this.argParser){
			if(this.argParser.args&&this.argParser.args.theme==themeObj.name){
					this.autoDraw=true;
					this.drawTheme(themeObj);
					var center = new OpenLayers.LonLat(parseFloat(this.argParser.args.lon),
                            parseFloat(this.argParser.args.lat));
					this.map.setCenter(center,parseInt(this.argParser.args.zoom));
					this.autoDraw = false;
					return;
				}
		}
		if(this.autoDraw) {
			/** draw the first theme * */
			if (this.activeTheme == null) {
				this.drawTheme(this.themes[0]);
			}
		}
	},
	
	/**
	 * Method: themeAdded
	 * 
	 * This method gets triggered when a theme is added. If a GUI manager is
	 * available it will call the addTheme function of the GUI manager passing the
	 * theme object.
	 * 
	 * Parameters: 
	 * themeObj - {<oscar.ox.Theme>}
	 */
	themeAdded : function(themeObj) {
		if (this.guiManager) {
			this.guiManager.setGuiContainer(this.div);
			this.guiManager.addTheme(themeObj.theme);
		}
	},
	
	/**
	 * Method: themeActivated
	 * 
	 * This method is triggered when a theme is activated and calls the
	 * drawTheme method.
	 * 
	 * Parameters: 
	 * e - {<OpenLayers.Event>}
	 */
	themeActivated : function(e) {
		if (e.theme.isActive)
			return;
		if (this.activeTheme) {
			this.activeTheme.isActive = false;

		}
		e.theme.isActive = true;
		this.drawTheme(e.theme);
	},
	
	/**
	 * Method: drawTheme
	 * 
	 * This method will take in a theme object and draw the layer of the theme
	 * on to the map.
	 * 
	 * Parameters: 
	 * theme - {<oscar.ox.Theme>}
	 */
	drawTheme : function(theme,callback) {

		//Look for an overview map and destroy it.
		try {
            var overviewControl = this.map.getControlsByClass("oscar.Control.OverviewMap")[0] ||
            	this.map.getControlsByClass("OpenLayers.Control.OverviewMap")[0];
            if(overviewControl) {
            	overviewControl.destroy();
            }
        } catch (err){}
        
		// Lets get the current view port so we can show the new theme in the
		// same location.
		var viewPort = {
			project :false
		}
		if (this.map.getExtent() != null) {
			viewPort.previousView = this.map.getExtent();
			viewPort.previousProjection = this.map.projection;
			viewPort.project = true;
		}

		this.activeTheme = theme;
		
		$$(this.map.div).css({
		    "backgroundColor":this.activeTheme.backgroundColor
		});
		
		this.layers = this.activeTheme.layers;
		var numZoomLevels = 16;
		try {
			numZoomLevels = parseInt(this.activeTheme.parameters["numzoomlevels"]);
		} catch(err) {
			numZoomLevels = 16;
		}
		
		var selectFeature = this.map.getControlsByClass("oscar.Control.SelectFeature")[0];
		if(selectFeature) {
			selectFeature.ctrl.deactivate();
		}
		/** clear the map * */
		while (this.map.layers.length > 0) {
			try {
				this.map.removeLayer(this.map.layers[this.map.layers.length - 1]);
			} catch(err) {}
		}

		/** check for spherical mercator srs * */
		var options = {};
		var maxExtent = null
		
		if((maxExtent=this.activeTheme.getMaxCover()) != null) {
			if (oscar.Util.isSphericalMercator(this.activeTheme.srs)) {
				options.maxResolution = 156543.0339;
			} else {
				options.maxResolution = "auto";
			}
			options.maxExtent = maxExtent;
		} else {
			if (oscar.Util.isSphericalMercator(this.activeTheme.srs)) {
				options = {
					 maxExtent: new OpenLayers.Bounds(
	                    -128 * 156543.0339,
	                    -128 * 156543.0339,
	                    128 * 156543.0339,
	                    128 * 156543.0339
	                ),
	                maxResolution: 156543.0339
				};
			} else {
				options = {
					maxResolution:1.40625,
					maxExtent :new OpenLayers.Bounds(-180,-90,180,90)
				};
			}
		}
		options.projection = new OpenLayers.Projection(this.activeTheme.srs);
		options.numZoomLevels = numZoomLevels;

		OpenLayers.Util.extend(this.map, options);
        
        var scope = this;
        
        var waitTillReady = function() {
        
            if(scope.map.projection.proj.readyToUse) {
                window.clearTimeout(scope.interval);
                scope.activeTheme.buildMap(scope.map);
                if(callback) {
                    callback.call();
                }

                var defaultCover=null;
                if(!scope.autoDraw) {return};
                if((defaultCover = scope.activeTheme.getDefaultCover())){
                    scope.doDraw(defaultCover);
                } else if (viewPort.project) {
                    var newExtent = viewPort.previousView.transform(
                            viewPort.previousProjection, new OpenLayers.Projection(
                                    scope.activeTheme.srs));
                    scope.doDraw(newExtent);
                } else {
                    scope.doDraw();
                }                
            }
               
        }
        
        this.interval = setInterval(waitTillReady,500);
	},
	
	/**
	 * APIMethod: doDraw
	 * 
	 * Draws the active theme.
	 * 
	 * Parameters: 
	 * extent - {<OpenLayers.Bounds>} or {<OpenLayers.LonLat>}
	 * options - {Object} optional.  
	 *  
	 */
	doDraw:function(extent,options) {
		
		if(extent) {
			if(extent.CLASS_NAME == "OpenLayers.LonLat") {
				var x = extent.clone();
				var bounds = new OpenLayers.Bounds();
				bounds.extend(extent);
				if(options && options.zoom) {
					this.map.setCenter(x,options.zoom);
				} else {
					extent = bounds;
					this.map.zoomToExtent(extent);
				}
			} else {
				this.map.zoomToExtent(extent);
			}
		} else {
			this.map.zoomToMaxExtent();
		}
		this.events.triggerEvent('afterDraw',this);		
	},	
	
	/**
	 * Constant: CLASS_NAME
	 * - oscar.Control.ThemeManager
	 */
	CLASS_NAME :"oscar.Control.ThemeManager"
});