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
 * Class: oscar.Util.Plugin.Download
 * 
 * This is the base class for all plugins related to downloading.
 * 
 */
oscar.Util.Plugin.Download = new oscar.BaseClass(oscar.Util.Plugin, {
    /**
     * APIMethod: initialize
     * 
     * The initialize method
     */
    initialize : function(options) {
        oscar.Util.Plugin.prototype.initialize.apply(this, [ options ]);
    },
    CLASS_NAME : "oscar.Util.Plugin.Download"
});