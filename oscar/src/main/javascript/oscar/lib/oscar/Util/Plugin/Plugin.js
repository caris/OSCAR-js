/*
 * CARIS oscar - Open Spatial Component ARchitecture
 *
 * Copyright 2014 CARIS <http://www.caris.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
/**
 * Class: oscar.Util.Plugin
 * 
 * This is a base class for all plugins.
 */
oscar.Util.Plugin = new oscar.BaseClass({
    EVENT_TYPES : [],
    events : null,

    catalogueService : null,
    /**
     * APIProperty: pluginType
     * 
     * A string to define what the plugin is for. This will be used for the
     * plugin registration
     * 
     */
    pluginType : null,
    /**
     * APIPropery: icon
     * 
     * A css class that defines the icon for this plugin. The class should
     * follow the jQueryUI icon styles
     */
    icon : null,
    /**
     * APIMethod: getIcon Returns the icon
     */
    getIcon : function() {
        return this.icon;
    },
    getLabel : function() {
        return oscar.i18n(this.getPluginType());
    },
    initialize : function(options) {
        this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES, false, {
            includeXY : true
        });
        this.setOptions(options);
    },
    /**
     * APIMethod: getPluginType
     * 
     * Returns the plugin type
     */
    getPluginType : function() {
        return this.pluginType || "&nbsp;";
    },
    /**
     * APIMethod: setOptions
     * 
     * This method will take a JSON class definition and apply the properties to
     * this object. Parameter: - options A JSON class
     * 
     */
    setOptions : function(options) {
        OpenLayers.Util.extend(this, options);
    },

    destroy : function() {
    },

    /**
     * APIMethod: play
     * 
     * This is the method that is called to run the plugin.
     */
    play : function() {
    },

    drawTo : function($jqDiv) {
        var $button = $$("<button></button>").html(this.getPluginType());
        var scope = this;
        $button.button({
            icons : {
                primary : this.getIcon() || "ui-icon-disk"
            },
            text : false,
            label : this.getLabel()
        }).click($$.proxy(function() {
            this.play();
        }, this));
        $jqDiv.append($button);

    },
    CLASS_NAME : "oscar.Util.Plugin"
});