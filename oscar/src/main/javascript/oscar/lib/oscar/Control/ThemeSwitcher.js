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
 * Class: oscar.Control.ThemeSwitcher
 * 
 * The Oscar ThemeSwitcher control allows users to switch
 * between themes.
 * 
 * 
 * Translation Keys:
 * - ThemeSwitcherToolTip
 * - ThemeSwitcherTitle
 * 
 * Inherits from:
 * - <oscar.Control.DragPanel>
 * 
 */


oscar.Control.ThemeSwitcher = oscar.BaseClass(oscar.Control.DragPanel, {
	/**
	 * APIProperty: tooltipText
	 * 
	 * {String} - translation key or text to use for the Theme Switcher tool tip. Default is ThemeSwitcherToolTip.
	 */
	tooltipText:"ThemeSwitcherToolTip",
	/**
	 * APIProperty: titleText
	 * 
	 * {String} - translation key or text to use for the Theme Switcher title. Default is ThemeSwitcherTitle.
	 */
	titleText:"ThemeSwitcherTitle",
	/**
	 * APIProperty: iconClass
	 * 
	 * {String} - css class to use for the icon of the widget.
	 */
	iconClass :"ThemesIcon",
	/**
	 * Property: closed
	 * 
	 * {Boolean} - Chooses if the widget should be open or closed initially. Default is false.
	 */
	closed:false,
	/**
	 * Property: collapsible
	 * 
	 * {Boolean} - Chooses if the widget can be collapsed. Default is true.
	 */
	collapsible:true,
	/**
	 * Property: themesPanel
	 * 
	 * {Array[HTMLDivElements} - Array containing the div elements for the different themes.
	 */
	themePanels:null,
	/**
	 * APIProperty: themeManager
	 * 
	 * <oscar.Control.ThemeManager> - The theme manager to use to draw the themes.
	 */
	themeManager: new oscar.Control.ThemeManager,
	/**
	 * APIProperty: configManager
	 * 
	 * <oscar.Control.OXFConfigManager> - The configuration manager to use to load theme configurations.
	 */
	configManager: new oscar.Control.OXFConfigManager,
	/**
	 * Property: toolbar
	 * 
	 */
	toolbar:null,
	
	/**
	 * APIProperty: activeTheme
	 * 
	 * Keeps track of the active theme.
	 */
    activeTheme:null,
    
    
	/**
	 * APIProperty: events
	 */
    
	events:null,
	/**
	 * APIProperty: EVENT_TYPES
	 */
	EVENT_TYPES:["switchthemes"],
	/**
	 * Constructor: new oscar.Control.ThemeSwitcher()
	 * Creates a new instance of the oscar.Control.ThemeSwitcher control.
	 */	
	initialize : function(options) {
		this.EVENT_TYPES = oscar.Control.ThemeSwitcher.prototype.EVENT_TYPES.concat(OpenLayers.Control.prototype.EVENT_TYPES);
		this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES,false,{includeXY :true});	
		oscar.Control.DragPanel.prototype.initialize.apply(this, [ options ]);
		if(this.configManager) {
			this.registerConfigManagerEvents();
		}
		this.themePanels=[];
        this.layerGroups=[];
        this.timers=[];
        this.layerCaps=[]; 
        this.resizable = false;
	},
	/**
	 * APIMethod: setConfigManager
	 * Sets the configuration manager to use.
	 * 
	 * Parameters:
	 * - configManager <oscar.Control.OXFConfigManager>
	 */
	setConfigManager : function(configManager) {
		this.configManager = configManager;
		this.registerConfigManagerEvents();
	},
	/**
	 * APIMethod: getConfigManager
	 * Returns the configuration manager.
	 * 
	 * Returns:
	 * - <oscar.Control.OXFConfigManager
	 */
	getConfigManager: function() {
		return this.configManager;
	},
	/**
	 * Method: registerConfigManagerEvents
	 * Called from setConfigManager. Sets the listeners on the events of the configuration manager.
	 */
	registerConfigManagerEvents:function() {
		this.configManager.events.on( {
			"haveThemes" :this.addThemes,
			scope :this
		});
	},
	/**
	 * Method: setMap
	 * Sets the map object reference
	 * 
	 * Parameters:
	 * - map <OpenLayers.Map>
	 */
	setMap : function(map) {
		this.map = map;
		if(this.configManager) this.map.addControl(this.configManager);
		if(this.themeManager) this.map.addControl(this.themeManager);
		this.toolbar = this.map.getControlsByClass("oscar.Control.ToolBar")[0];

		if((this.toolbar = this.map.getControlsByClass("oscar.Control.ToolBar")[0])) {
			this.events.on({"switchthemes":this.updateToolbar});
		}
        
        this.map.events.on({"addlayer":this.addLayer,scope:this});
        this.map.events.on({"removelayer":this.removeLayer,scope:this});

	},
	
	/**
	 * APIMethod: setThemeManager
	 * Sets the themeManager to use.
	 * 
	 * Parameters:
	 * - themeManager <oscar.Control.ThemeManager>
	 */
	setThemeManager : function(themeManager) {
		this.themeManager = themeManager;
	},
	/**
	 * APIMethod: getThemeManager
	 * Returns the theme manager object.
	 * 
	 * Returns:
	 * - <oscar.Control.ThemeManager> 
	 */
	getThemeManager: function() {
		return this.themeManager;
	},
	
	/**
	 * Method: addThemes
	 * Called when the configuration manager has completed its request.
	 * 
	 * Parameters:
	 * 
	 * - ox <oscar.ox>
	 */
	addThemes : function(ox) {
		this.ox = ox;
		this.buildMenu();
		
		/*
		 * Check to see if there is a specific theme being requested
		 * from a permalink
		 */
         if(this.themeManager.argParser) {
            var requestedThemeName = this.themeManager.argParser.args["theme"];
            for(var item in this.ox.themes) {
			  var theme = this.ox.themes[item];
			  if(theme.name == requestedThemeName) {
				  themeFound = true;
                  this.themeSelect[0].selectedIndex=item;
                  this.themeManager.autoDraw=false;
                  var scope = this;
                  this.changeTheme(item,function() {
                    var center = new OpenLayers.LonLat(parseFloat(scope.themeManager.argParser.args.lon),
                            parseFloat(scope.themeManager.argParser.args.lat));
                    var zoom = parseInt(scope.themeManager.argParser.args.zoom);
                    var options = {
                        zoom:zoom
                    };
                    scope.themeManager.doDraw(center,options);
                    }
                  );
                  return;
			  }
            }
         }
         this.changeTheme(0);
	},
	
	/**
	 * Method: changeTheme
	 * Draws a new theme
	 * 
	 * Parameters:
	 * 
	 * - val <Number> array index of the theme to draw.
	 */	
	changeTheme : function(val,callback) {
        if(this.activeTheme != null) { //check to see if it's already active
           if(this.activeTheme == val) return;
        }
        this.activeTheme = val;
        
        this.events.triggerEvent("switchthemes",this.ox.themes[val]);
        this.themeManager.drawTheme(this.ox.themes[val],callback);            
		
	},
	updateToolbar:function(theme) {
		this.toolbar.applyTheme(theme);
	},
	/**
	 * Method: buildMenu
	 * Creates the theme switcher menu.
	 */
	buildMenu : function() {
        var scope = this;
        
		var customContainer = document.createElement("div");
		var $customContainer = $$(customContainer);
		oscar.jQuery(customContainer).addClass("themeContainer");
		$$(this.content).append(customContainer);
        
        this.$themeDiv = $$("<div></div>").css({"position":"relative"});
        this.themeSelect = $$("<select></select>").change(function() {
            scope.changeTheme(scope.themeSelect[0].selectedIndex);
        });
        this.$themeDiv.append(this.themeSelect);
        $customContainer.append(this.$themeDiv);

		for ( var item in this.ox.themes) {
				var theme = this.ox.themes[item];
                var opt = $$("<option></option").html(theme.name);
                this.themeSelect.append(opt);

		}

        this.$layersPanel = $$("<div></div>").addClass("themeLayers").css({"height":"110px","overflow-y":"auto"});
        $$(this.content).append(this.$layersPanel);
	},

	/**
	 * Method: draw
	 * Draws the control on the map.
	 */
	draw : function() {
		oscar.Control.DragPanel.prototype.draw.apply(this);
		return this.div;
	},
	/**
     * Method: addLayer
     *  *Parameters*
     *  - evt <OpenLayers.Event> The event object passed in when the addlayer event is fired
     *  from the map object.
     */
    addLayer:function(evt) {
        if(evt.layer.isBaseLayer) { //first theme or switched theme
            this.layerGroups=[];
            this.timers=[];
            this.layerCaps=[];
        }
        if(evt.layer.displayInLayerSwitcher && evt.layer.isBaseLayer == false) {
        	this.getLayerCapabilities(evt.layer);
        }
    },
    /**
     * Method: removeLayer
     *  *Parameters*
     *  - evt <OpenLayers.Event> The event object passed in when the removelayer event is fired
     *  from the map object.
     */
    removeLayer:function(evt) {
        var node = $("LT_" + evt.layer.id);
        if(node != null) {
            $$(node).remove();
        }
    },
    /**
     * Method: getLayerCapabilities
     * Called when a layer is added. This method will create a capabilities request
     * based off of the layer properties.
     * Parameters:
     * - layer <OpenLayers.Layer> 
     * 
     */
    getLayerCapabilities:function(layer) {
    	this.setPlaceHolder(layer);
        var params = {
        	    request:"GetCapabilities",
        	    service:"WMS"
        }

        switch (layer.CLASS_NAME) {
        case "OpenLayers.Layer.WMS":
            var success = function(resp) {
                var formatter = new OpenLayers.Format.WMSCapabilities();
                var capabilities=null;
                try {
                	capabilities = formatter.read(resp.responseXML);
                } catch (err) {
                	capabilities = formatter.read(resp.responseText);
                }
                this.layerCaps[layer.url]=capabilities;
                this.displayLayer(layer);
            };
            var fail = function(resp) {};
            OpenLayers.loadURL(layer.url[0],params,this,success,fail);
             break;
        case "OpenLayers.Layer.WMTS":
            var baseUrl = layer.url;
            var capabilitiesUrl = baseUrl + "/" + layer.version + "/WMTSCapabilities.xml";
            var success = function(resp) {
                var formatter = new oscar.Format.WMTSCapabilities();
                var capabilities=null;
                try {
                	capabilities = formatter.read(resp.responseXML);
                } catch (err) {
                	capabilities = formatter.read(resp.responseText);
                }
                this.layerCaps[layer.url] = capabilities;
                this.displayLayer(layer);
            };
            var fail = function(resp){};
            
            //clear out the parameters object as it is not needed. 
            params = null;
            
            OpenLayers.loadURL(capabilitiesUrl,params,this,success,fail);
            break;   
        case "OpenLayers.Layer.GML":
        	this.displayLayer(layer);
            break;                
        }
    },
    /**
     * Method: setPlaceholder
     * Creates a DIV node to hold the the checkboxes and labels of the service layers.  
     * Parameters:
     * - layer <OpenLayers.Layer>
     * 
     */
    setPlaceHolder:function(layer) {
    	var layerDiv = document.createElement("div");
        layerDiv.setAttribute("class","layerToggle");
        id = "LT_" + layer.id;
        layerDiv.id = id;
        if(this.content.hasChildNodes()) {
            this.$layersPanel.prepend(layerDiv);
        } else {
        	this.$layersPanel.append(layerDiv);
        } 
    },
    /**
     * Method: showWMSLayer
     * Displays the checkboxes and labels for the service layers of the OL.Layer.WMS object.
     * 
     * Parameters:
     * - layer <OpenLayers.Layer.WMS>
     */
    showWMSLayer:function(layer) {
    	try {
    	var layerDiv = $("LT_" + layer.id);
        var layerGroupName = OpenLayers.Util.createUniqueID(layer.name);
        this.layerGroups[layerGroupName]={layer:layer,layers:[]};
        if(layer.params.LAYERS.length > 0) {
        	var CapabilitiesLayers = oscar.Util.Metadata.getLayers(this.layerCaps[layer.url]);
            var NameToTitle = function(name) {
                for(var sLayer in CapabilitiesLayers) {
                    var ServiceLayer = CapabilitiesLayers[sLayer];
                    if(name == ServiceLayer.name)
                        return ServiceLayer.title || ServiceLayer.name
                }
            }
            var serviceLayers = layer.params.LAYERS.slice(0);
            serviceLayers = serviceLayers.reverse();
            for(var wmsLayer in serviceLayers) {
                var layerTitle = NameToTitle(serviceLayers[wmsLayer]);
                var randomId = OpenLayers.Util.createUniqueID(layer.name);
                var inputDiv = document.createElement("div");
                oscar.jQuery(inputDiv).addClass("serviceLayer");
                var input = document.createElement("input");
                input.type="checkbox";
                input.title = layerTitle;
                input.value = serviceLayers[wmsLayer];
                var inputId = OpenLayers.Util.createUniqueID("checkbox");
                input.id = inputId;
                inputDiv.appendChild(input);
                input.checked=true;
                var label = document.createElement("label");
                label.setAttribute("for",inputId);
                oscar.jQuery(label).addClass("serviceLayerLabel");
                //label.setAttribute("className","serviceLayerLabel");
                label.innerHTML = layerTitle;
                var btn = document.createElement("button");
                btn.value = serviceLayers[wmsLayer];
                inputDiv.appendChild(label);
                //inputDiv.appendChild(btn);
                layerDiv.appendChild(inputDiv);
                oscar.jQuery(btn).button({
                    icons: {
	                    primary: "ui-icon-gear"
                	}
                });

                var getClickFn = function(context,layerGroup) {
                    return function(e) {
                        context.adjustLayerGroup(layerGroup);
                    };
                };
                this.layerGroups[layerGroupName].layers.push(input);
                OpenLayers.Event.observe(input, "click", 
                        OpenLayers.Function.bindAsEventListener(getClickFn(this,layerGroupName)));
            }
        }
    	} catch (err){}

    },
    /**
     * Method: showWMTSLayer
     * Displays the checkboxes and labels for the service layers of the OL.Layer.WMTS object.
     * 
     * Parameters:
     * - layer <OpenLayers.Layer.WMTS>
     */
    
    showWMTSLayer:function(layer) {
        var CapabilitiesLayers = oscar.Util.Metadata.getContent(this.layerCaps[layer.url]);
        var CapabilitiesThemes = oscar.Util.Metadata.getThemes(this.layerCaps[layer.url]);
        var items = CapabilitiesLayers.concat(CapabilitiesThemes);
        var NameToTitle = function(identifier) {
            for(var sLayer in items) {
                var ServiceLayer = items[sLayer];
                if(identifier == ServiceLayer.identifier)
                    return ServiceLayer.title || ServiceLayer.identifier
            }
        }
    	var layerDiv = $("LT_" + layer.id);
        var layerTitle =NameToTitle(layer.layer);
        var randomId = OpenLayers.Util.createUniqueID(layerTitle);
        var inputDiv = document.createElement("div");
        var input = document.createElement("input");
        input.type="checkbox";
        input.title = layerTitle;
        input.value = layer.layer;
        inputDiv.appendChild(input);
        input.checked=true;
        var inputId = OpenLayers.Util.createUniqueID("checkbox");
        input.id = inputId;
        var label = document.createElement("label");
        oscar.jQuery(label).addClass("serviceLayerLabel");
        label.setAttribute("for",inputId);
        label.innerHTML = layerTitle;
        inputDiv.appendChild(label);
        layerDiv.appendChild(inputDiv);
        var obj = {
              layer:layer
        }
        var getClickFn = function(layer) {
            return function(e) {
                layer.setVisibility(!layer.getVisibility());
            };
        };
        OpenLayers.Event.observe(input, "click", 
                OpenLayers.Function.bindAsEventListener(getClickFn(layer)));

    },
    /**
     * Method: showGMLLayer
     * 
     * This method allows the display of the POI layers which are 
     * based on the OpenLayers.Layer.GML layer.
     */
    showGMLLayer: function(layer) {
    	var layerDiv = $("LT_" + layer.id);
        var layerTitle =layer.name;
        var randomId = OpenLayers.Util.createUniqueID(layerTitle);
        var inputDiv = document.createElement("div");
        var input = document.createElement("input");
        input.type="checkbox";
        input.title = layerTitle;
        input.value = layer.layer;
        inputDiv.appendChild(input);
        input.checked=layer.visibility;
        var inputId = OpenLayers.Util.createUniqueID("checkbox");
        input.id = inputId;
        var label = document.createElement("label");
        oscar.jQuery(label).addClass("serviceLayerLabel");
        label.setAttribute("for",inputId);
        label.innerHTML = layerTitle;
        inputDiv.appendChild(label);
        layerDiv.appendChild(inputDiv);
        var obj = {
              layer:layer
        }
        var getClickFn = function(layer) {
            return function(e) {
                layer.setVisibility(!layer.getVisibility());
            };
        };
        OpenLayers.Event.observe(input, "click", 
                OpenLayers.Function.bindAsEventListener(getClickFn(layer)));
    	
    },
    
    /**
     * Method: displayLayer
     * Called after the capabilities object has been created.
     * Parameters:
     * - layer <OpenLayers.Layer>
     */
    displayLayer:function(layer) {
        if(layer.isBaseLayer) {
            return;
        }
        switch (layer.CLASS_NAME) {
        case "OpenLayers.Layer.WMS":
             this.showWMSLayer(layer);
             break;
        case "OpenLayers.Layer.WMTS":
            this.showWMTSLayer(layer);
            break;
        case "OpenLayers.Layer.GML":
        	this.showGMLLayer(layer);
        	break;
        }
        
    },
    /**
     * Method: adjustLayerGroup
     * This method will trigger the redraw method of a layer when a checkbox
     * has been clicked.
     * Parameters:
     * - layerGroup {String} - name of the layer group to adjust.
     */
    adjustLayerGroup:function(layerGroup) {
        if(this.timers[this.layerGroups[layerGroup].layer.id]) {
            window.clearTimeout(this.timers[this.layerGroups[layerGroup].layer.id]);
            this.timers[this.layerGroups[layerGroup].layer.id]=null;
        };
        
        var inputs = this.layerGroups[layerGroup].layers;
        var layer = this.layerGroups[layerGroup].layer;
        var layers =[];
        for(var i=0;i<inputs.length;i++) {
            if(inputs[i].checked) {
                layers.push(inputs[i].value);
            };
        }
        if(layers.length==0) {
            layer.setVisibility(false);

        } else {
            var redraw = function(layer,layers) {
                return function() {
                       var reversedLayers = layers.reverse();
                       layer.mergeNewParams({layers:reversedLayers});
                       layer.setVisibility(true);
                }
            };
            this.timers[this.layerGroups[layerGroup].layer.id] = window.setTimeout(redraw(layer,layers),this.threshold);
        }
    },    
	CLASS_NAME :"oscar.Control.ThemeSwitcher"
});