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
oscar.Gui.LinkedLists = new oscar.BaseClass(oscar.Gui, {
    displayClass : "oscarGuiLinkedLists",
    availableText : "",
    selectedText : "",
    EVENT_TYPES : [ "sourceReceived", "destinationReceived" ],
    initialize : function(options) {
        this.EVENT_TYPES = this.EVENT_TYPES.concat(oscar.Gui.prototype.EVENT_TYPES);
        oscar.Gui.prototype.initialize.apply(this, [ options ]);
        this.connectionClass = OpenLayers.Util.createUniqueID("connection");
        this.events.register("sourceReceived", this, this.sourceReceived);
        this.events.register("destinationReceived", this, this.destinationReceived);

    },
    filter : function() {
        return true;
    },
    destinationFilter : function() {
        return true;
    },
    draw : function() {
        var sourceId = OpenLayers.Util.createUniqueID("source");
        var destinationId = OpenLayers.Util.createUniqueID("destination");

        oscar.Gui.prototype.draw.apply(this);
        var $this = $$(this.div);
        this.sourceDiv = $$("<div></div>");
        this.sourceDiv.addClass("sourceDiv");
        this.sourceTextDiv = $$("<div></div>").html(oscar.i18n(this.availableText));
        this.sourceTextDiv.addClass("sourceText");
        this.navTextDiv = $$("<div></div>").html('&nbsp;');
        this.navTextDiv.addClass("navText");
        this.selectedTextDiv = $$("<div></div>").html(oscar.i18n(this.selectedText));
        this.selectedTextDiv.addClass("selectedText");

        this.sourceList = $$("<ul></ul>");
        this.sourceList.addClass(this.connectionClass);
        this.sourceList.attr("id", sourceId);
        this.sourceDiv.append(this.sourceList);

        this.buttonsDiv = $$("<div></div>");
        this.buttonsDiv.addClass("buttonsDiv");

        this.destinationDiv = $$("<div></div>");
        this.destinationDiv.addClass("selectedDiv");

        this.destinationList = $$("<ul></ul>");
        this.destinationList.attr("id", destinationId);
        this.destinationList.addClass(this.connectionClass);

        this.destinationDiv.append(this.destinationList);

        $this.append(this.sourceTextDiv);
        $this.append(this.navTextDiv);
        $this.append(this.selectedTextDiv);
        $this.append("<br clear='left'>");
        $this.append(this.sourceDiv);
        $this.append(this.sourceDiv);
        $this.append(this.sourceDiv);
        $this.append(this.buttonsDiv);
        $this.append(this.destinationDiv);

        $this.addClass(this.displayClass);
        this.buildButtons();
        $this.append("<br clear='left'>");
        $this.disableSelection();

    },
    sourceReceived : function(li) {
        this.sourceList.append(li);
        if (this.sourceDecorator) {
            this.sourceDecorator(li);
        }
        this.filter(li);
    },
    destinationReceived : function(li) {
        // check to see if this already exists
        var scope = this;
        var alreadyExists = false;
        this.destinationList.children().each(function() {
            var $this = $$(this);
            if (scope.compare(li, $$(this))) {
                alreadyExists = true;
            }
        });
        if (!alreadyExists) {
            this.destinationList.append(li);
        }
        if (this.destinationDecorator) {
            this.destinationDecorator(li);
        }
        this.destinationFilter(li);
    },

    buildButtons : function() {
        var scope = this;
        this.toTheRight = $$("<button onclick='return false;'></button>").html(oscar.i18n("MoveAllToTheRight"));
		this.toTheRight.prop('type','button');
		
        this.toTheRight.button({
            icons : {
                primary : "ui-icon-seek-next"
            },
            text : false
        });
        this.toTheRight.click(function() {
            var available = scope.sourceList.children();
            available.each(function() {
                scope.events.triggerEvent("destinationReceived", $$(this));
            });
            scope.destinationList.sortable('refresh');
            return false;
        });
        this.toTheRight.css("float", "center");
        
		this.toTheLeft = $$("<button onclick='return false;'></button>").html(oscar.i18n("MoveAllToTheLeft"));
		this.toTheLeft.prop('type','button');
		
        this.toTheLeft.button({
            icons : {
                primary : "ui-icon-seek-prev"
            },
            text : false
        });
        this.toTheLeft.click(function() {
            var available = scope.destinationList.children();
            available.each(function() {
                scope.events.triggerEvent("sourceReceived", $$(this));
            });
            return false;
        });
        this.toTheLeft.css("float", "center");
        this.buttonsDiv.append(this.toTheRight);
        this.buttonsDiv.append(this.toTheLeft);
    },
    addToSourceList : function(listItem) {
        var li = $$("<li></li>").html(listItem.text);
        li.attr("title", listItem.text);
        var data = listItem.getData();

        for ( var p in data) {
            li.data(p, data[p]);
        }

        li.addClass("ui-state-default");
        if (!this.isSelected(li)) {
            this.events.triggerEvent("sourceReceived", li);
        }
        this.sortable();
        return li;
    },
    addToDestinationList : function(listItem) {
        var li = $$("<li></li>").html(listItem.text);
        li.attr("title", listItem.text);
        var data = listItem.getData();

        for ( var p in data) {
            li.data(p, data[p]);
        }
        li.addClass("ui-state-default");
        this.events.triggerEvent("destinationReceived", li);
        this.sortable();

        return li;
    },
    sortable : function() {
        var scope = this;
        $$(this.sourceList).sortable({
            connectWith : "." + this.connectionClass,
            dropOnEmpty : true,
            cursor : "move",
            receive : function(event, ui) {
                scope.events.triggerEvent("sourceReceived", ui.item);
            }
        }).disableSelection();

        $$(this.destinationList).sortable({
            connectWith : "." + this.connectionClass,
            dropOnEmpty : true,
            cursor : "move",
            receive : function(event, ui) {
                scope.events.triggerEvent("destinationReceived", ui.item);
            }
        }).disableSelection();
    },
    getAvailable : function() {
        return this.sourceList.children();
    },
    getSelected : function() {
        return this.destinationList.children();
    },
    isSelected : function(li) {
        var isFound = false;
        var scope = this;
        this.destinationList.children().each(function() {
            if (scope.compare(li, $$(this))) {
                isFound = true;
            }
        });
        return isFound;
    },
    clearSourceList : function() {
        this.sourceList.empty();
    },
    clearDestinationList : function() {
        this.destinationList.empty();
    },
    compare : function(a, b) {
        if (a.html() == b.html())
            return true;
        else
            return false;
    },
    showHelp : function(str) {
        if (!this.helpDiv) {
            this.helpDiv = $$("<div></div>");
            this.helpDiv.addClass("help2");
            $$(this.div).after(this.helpDiv);
        }
        this.helpDiv.html("");
        this.helpDiv.html(oscar.i18n(str));

    },
    CLASS_NAME : "oscar.Gui.LinkedLists"

});
oscar.ListItem = new oscar.BaseClass({
    text : "",
    data : {},
    initialize : function(text, data) {
        this.text = text;
        if (data) {
            this.data = data;
        }
    },
    setData : function(data) {
        this.data = data;
    },
    getData : function(data) {
        return this.data;
    },
    CLASS_NAME : "oscar.ListItem"
});