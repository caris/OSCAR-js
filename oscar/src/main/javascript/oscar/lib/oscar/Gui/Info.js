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
oscar.Gui.Info = new oscar.BaseClass(oscar.Gui, {
    EVENT_TYPES : [ 'whatsthis' ],
        context:null,
    initialize : function(options) {
                this.context = oscar.i18n("Help");
        this.EVENT_TYPES = this.EVENT_TYPES.concat(oscar.Gui.prototype.EVENT_TYPES);
        oscar.Gui.prototype.initialize.apply(this, [ options ]);
                this.id = "oscar-context-help";
                this.iframeId = "oscar-context-help-iframe";
                
    },
    draw : function() {
        oscar.Gui.prototype.draw.apply(this);
        this.btn = $$("<div></div>")
                this.btn.attr("title",this.context);
                this.btn.addClass("ui-button");
                this.btn.addClass("ico");
                this.btn.click($$.proxy(this.buildDlg, this));
        $$(this.div).append(this.btn);
                
                
        //
        
    },
        buildDlg:function() {
                this.close();
                
                var dlg = $$("<div></div>");
                dlg.attr("id",this.id);
                dlg.addClass("whatsthis-dlg");
                
                $$('body').append(dlg);

                dlg.position({
                        my : "right top",
                        at : "right bottom",
                        of : this.btn
                });

                var content = $$("<div></div>").html("");
                content.addClass("wt-content-container");
                
                                
                var titleBar = $$("<div></div>").html(this.context);
                titleBar.addClass("wt-titleBar");
                var closeBox = $$("<div></div>")
                var contentBox = $$("<div></div>");
                contentBox.addClass("wt-content");
                closeBox.addClass("closeBox");
                closeBox.click($$.proxy(this.close,this));
                titleBar.append(closeBox);
                content.append(titleBar);
                content.append(contentBox);
                var iframe = $$("<iframe></iframe>");
                iframe.attr("id",this.iframeId);
                iframe.attr("frameBorder","0");
                iframe.css({
                        "width":"100%",
                        "height":"100%"
                });
                contentBox.append(iframe);
                
                dlg.append(content);
                var containerHeight = content.height();
                var titleHeight = titleBar.height();
                var remainingHeight = containerHeight - titleHeight;
                contentBox.css({
                        "height":remainingHeight
                });
                
                
                dlg.draggable({
                        containment : "parent",
                        handle:titleBar
                });
                
                this.events.triggerEvent("whatsthis",this);
        },
        show:function(loc) {
                if(loc) {
                        $$("#"+this.iframeId).attr("src",loc);
                } else {
                        this.close();
                }
        },
        close:function() {
                try {
                        $$("#"+this.id).remove();
                } catch(err){}
        },
    CLASS_NAME : "oscar.Gui.Info"
});