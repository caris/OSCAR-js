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

oscar.Control.AdvancedCatalogueSearch = new oscar.BaseClass(oscar.Control.CatalogueSearchForm, {
    EVENT_TYPES : [ 'close' ],
    initialize : function(options) {
        oscar.Control.prototype.initialize.apply(this, [ options ]);
        this.searchHandler.events.on({
            "displayfilter" : this.displayFilter,
            scope : this
        });
    },
    draw : function(options) {
        oscar.Control.CatalogueSearchForm.prototype.draw.apply(this, arguments);
        var layout = $$("<div></div>");
        layout.addClass(this.displayClass);
        this.form.append(layout);
        this.getAdvancedUI(layout);
    },
    getAdvancedUI : function(container) {
        var closediv = $$("<div></div>");
        closediv.css({
            'width' : '25px',
            'height' : '25px',
            'position' : 'absolute',
            'right' : '0px',
            'top' : '0px'
        });
        container.append(closediv);
        
        var closeBtn = $$("<button></button>").html("Close");
        closediv.append(closeBtn);
        closeBtn.button({
            icons : {
                primary : 'ui-icon-close'
            },
            text : false
        }).click($$.proxy(function() {
            this.events.triggerEvent("close");
        }, this));
        var containerDiv = $$("<div></div>");
        containerDiv.css({
            "width" : "95%"
        });
        container.append(containerDiv);
        this.textarea = $$("<textarea></textarea>");
        this.textarea.addClass('advSearchTextArea');
        this.textarea.keypress($$.proxy(function(e) {
            if (e.ctrlKey) {
                if (e.keyCode === 32) {
                    return false;
                } else if (e.keyCode === 10) {
                    // trigger search
                    this.searchHandler.search(this.textarea.val());
                }
            }
        }, this));
        containerDiv.append(this.textarea);
        var btn = $$("<button></button>").html("Search");
        btn.button({
            icons : {
                primary : "ui-icon-search"
            },
            text : false
        }).click($$.proxy(function() {
            this.searchHandler.searchg(this.textarea.val());
        }, this));
        var btns = $$("<div></div>");
        btns.css({
            "text-align" : "right"
        });
        btns.append(btn);
        
        containerDiv.append(btns);
        
        this.addHelp(btns);
    },
    showHelp : function() {
        var content = $$("<div></div>").html("");
        content.css({
            "width" : "100%",
            "height" : "300px",
            "overflow" : "auto",
            "color" : "#000"
        
        });
        new oscar.Gui.Dlg("What's This?", content, {
            position : {
                my : "left top",
                at : "right top",
                of : this.textarea
            }
        }).draw();
    },
    displayFilter : function(filter) {
        this.textarea.val(filter.toString());
    },
    CLASS_NAME : "oscar.Control.AdvancedSearchForm"
});