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
 * Class: oscar.Util.PluginManager
 * 
 * This class is used to manage plugins
 */
oscar.Util.PluginManager = new oscar.BaseClass({
	/**
	 * APIProperty: registeredPlugins
	 * 
	 * This is a mapping of registered plugins
	 */
	registeredPlugins : {},
	initialize : function() {
	},
	/**
	 * APIMethod: register
	 * 
	 * This is the method to register a plugin
	 * 
	 * Parameter: 
	 *	type - The type of plugin.
	 *  pluginClass: The class of the plugin.
	 * Ex: .register(oscar.Util.Plugin.Download.WCSService.prototype.pluginType,
	 *               oscar.Util.Plugin.Download.WCSService);
	 */
	register : function(type,pluginClass) {
		this.registeredPlugins[type] = pluginClass;
	},
	/**
	 * APIMethod: getPluginFor
	 * 
	 * Returns a plugin for the defined protocol string
	 * 
	 * Parameter:
	 * 
	 * getPluginType - The type of plugin
	 */
	getPluginFor : function(pluginType) {
		var plugin = this.registeredPlugins[pluginType];
		if (!plugin) {
			return new oscar.Util.Plugin();
		}
		return new plugin();
	},
	CLASS_NAME : "oscar.Util.PluginManager"
});

/**
 * This sets creates a plugin manager in oscar by default and creates a
 * getPluginManager method.
 */
oscar._pluginManager = new oscar.Util.PluginManager();
oscar.getPluginManager = function() {
	return oscar._pluginManager;
}