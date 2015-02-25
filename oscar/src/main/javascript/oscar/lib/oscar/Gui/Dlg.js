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

oscar.Gui.Dlg = new oscar.BaseClass(oscar.Gui, {
    position : null,
    initialize : function(title, content, options) {
        this.title = title;
        this.content = content;
        oscar.Gui.prototype.initialize.apply(this, [ options ]);
    },
    draw : function() {
        oscar.Gui.prototype.draw.apply(this);
        this.content.addClass("oscarGuiDlgContent");
        $$(this.div).append(this.content);
        var dlg = $$(this.div).dialog({
            title : this.title,
            position : this.position
        });
    },
    CLASS_NAME : "oscar.Gui.Dlg"
});