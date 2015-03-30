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
oscar.Util.Plugin.Download.Zipfile = new oscar.BaseClass(oscar.Util.Plugin.Download, {
    pluginType : "application/zip",
    icon : "ui-icon-disk",
    initialize : function(options) {
        oscar.Util.Plugin.Download.prototype.initialize.apply(this, [ options ]);

    },

    /**
     * @Override
     * @see oscar.Util.Plugin
     */
    play : function() {
        var elemIF = document.createElement("iframe");
        elemIF.src = this.link.url;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
    },
    CLASS_NAME : "oscar.Util.Plugin.Download.Zipfile"
});

oscar.getPluginManager().register(oscar.Util.Plugin.Download.Zipfile.prototype.pluginType, oscar.Util.Plugin.Download.Zipfile);