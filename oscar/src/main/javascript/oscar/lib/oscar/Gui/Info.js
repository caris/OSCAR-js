/*
 * CARIS oscar - Open Spatial Component ARchitecture
 * 
 * Copyright 2012 CARIS <http://www.caris.com>
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

oscar.Gui.Info = new oscar.BaseClass(oscar.Gui, {
    EVENT_TYPES : [ 'whatsthis' ],
    initialize : function(options) {
        this.EVENT_TYPES = this.EVENT_TYPES.concat(oscar.Gui.prototype.EVENT_TYPES);
        oscar.Gui.prototype.initialize.apply(this, [ options ]);
    },
    draw : function() {
        oscar.Gui.prototype.draw.apply(this);
        var btn = $$("<button></button>").html("What's This?");
        $$(this.div).append(btn);
        btn.button({
            icons : {
                primary : "ui-icon-help"
            },
            text : false
        }).click($$.proxy(function() {
            this.events.triggerEvent("whatsthis");
        }, this));
        
    },
    CLASS_NAME : "oscar.Gui.Info"
});