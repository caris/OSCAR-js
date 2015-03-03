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
        
        this.parser = new oscar.Util.Parser(CQL_Parser);
        this.parser.events.on({
            // "parseerror":this.parseError,
            "parsesuccess" : this.parseSuccess,
            scope : this
        });
        
        this._getSupportedFieldList();
        
        this.events.on({
            "close" : function() {
                $$("#ac-matches").remove();
            },
            scope : this
        
        });
    },
    _getSupportedFieldList : function() {
        this.supportedFieldList = [];
        var service = this.catalogueServices[0];
        
        var op = oscar.Util.Metadata.getOperation(service.capabilities, "GetRecords");
        if (!op.constraints)
            return;
        var getConstraint = function(name, constraints) {
            for (var i = 0; i < constraints.length; i++) {
                if (name.toLowerCase() == constraints[i].name.toLowerCase()) {
                    return constraints[i].values;
                }
            }
            
        }

        var supportedQueryables = getConstraint("SupportedISOQueryables", op.constraints);
        var additionalQueryables = getConstraint("AdditionalQueryables", op.constraints);
        this.supportedFieldList = this.supportedFieldList.concat(supportedQueryables);
        this.supportedFieldList = this.supportedFieldList.concat(additionalQueryables);
    },
    draw : function(options) {
        oscar.Control.CatalogueSearchForm.prototype.draw.apply(this, arguments);
        var layout = $$("<div></div>");
        layout.addClass(this.displayClass);
        this.form.append(layout);
        this.getAdvancedUI(layout);
    },
    parseSuccess : function(query) {
        $$("#ac-matches").remove();
        // this.searchHandler.search(query);
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
        var scope = this;
        
        this.textarea.autocomplete({
            minLength : 0,
            source : function(req, resp) {
                resp(scope.getSuggestions(req));
            },
            // eliminate the focuse change from the menu
            focus : function(e, ui) {
                return false;
            },
            select : function(e, ui) {
                // the query string
                var query = $$(this).val();
                // injection value
                var injection = ui.item.value;
                
                // get the tokens
                var tokens = query.split(" ");
                tokens.pop();
                tokens.push(injection);
                var tokenString = tokens.join(" ");
                $$(this).val(tokenString);
                
                if (injection === "''") {
                    setTimeout($$.proxy(function() {
                        var $this = $$(this);
                        var query = $this.val();
                        var word_pos = query.lastIndexOf("'");
                        var textarea = $this[0];
                        if (textarea.setSelectionRange) {
                            textarea.setSelectionRange(word_pos, word_pos);
                        } else if (this.textarea[0].createTextRange) {
                            // because of IE
                        }
                    }, this), 100);
                }
                return false;
            }
        }).focus(function() {
            $$(this).autocomplete("search");
        }).keyup($$.proxy(function(e) {
            if (e.ctrlKey && e.keyCode === 13) {
                this.searchHandler.search(this.textarea.val());
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
            try {
                this.parser.parse(this.textarea.val());
                this.searchHandler.search(this.textarea.val());
            } catch (parseError) {
                console.log(parseError);
            }
            
        }, this));
        var btns = $$("<div></div>");
        btns.css({
            "text-align" : "right"
        });
        btns.append(btn);
        
        containerDiv.append(btns);
        
        this.addHelp(btns);
    },
    setQuery : function(query) {
        this.textarea.val(query);
        if (query.length > 0) {
            try {
                this.parser.parse(this.textarea.val());
                this.searchHandler.search(this.textarea.val());
                
            } catch (parseError) {
                
                setTimeout($$.proxy(function() {
                    this.textarea.focus();
                }, this), 500);
            }
            
        }
    },
    getSuggestions : function(req) {
        var scope = this;
        
        // get supported field suggestions
        var getFieldSuggestions = function(partial) {
            var suggestions = [];
            for (var i = 0; i < scope.supportedFieldList.length; i++) {
                var field = scope.supportedFieldList[i];
                if (partial) {
                    if (field.indexOf(partial) === 0) {
                        suggestions.push(field);
                    }
                } else {
                    suggestions.push(field);
                }
            }
            return suggestions
        };
        
        // get parser suggestions
        var getParserSuggestions = function(expectations) {
            if (!expectations)
                return;
            var suggestions = [];
            for (var i = 0; i < expectations.length; i++) {
                var expectation = expectations[i].replace(/'/g, '');
                switch (expectation) {
                    case "FIELD":
                        suggestions = suggestions.concat(getFieldSuggestions());
                        break;
                    case "LIKE":
                        suggestions.push("LIKE");
                        break;
                    case "EQUALS":
                        suggestions.push("=");
                        break;
                    case "LT":
                        suggestions.push("<");
                        break;
                    case "LTE":
                        suggestions.push("<=");
                        break;
                    case "GT":
                        suggestions.push(">");
                        break;
                    case "GTE":
                        suggestions.push(">=");
                        break;
                    case "NEQ":
                        suggestions.push("<>");
                        break;
                    
                    case "OPEN":
                        suggestions.push("(");
                        break;
                    case "CLOSE":
                        suggestions.push(")");
                        break;
                    case "WORD":
                        suggestions.push("''");
                        break;
                    case "AND":
                        suggestions.push("AND");
                        break;
                    case "OR":
                        suggestions.push("OR");
                        break;
                    case "EOF":
                        break;
                }
            }
            return suggestions;
        };
        
        var term = req.term;
        var matches = [];
        
        term = term.split(" ").pop();
        
        if (term.length === 0) {
            try {
                this.parser.parse(this.textarea.val());
            } catch (err) {
                matches = getParserSuggestions(err.hash.expected);
            }
        } else {
            matches = matches.concat(getFieldSuggestions(term));
            if (matches.length === 0) {
                try {
                    
                    this.parser.parse(this.textarea.val());
                } catch (err) {
                    matches = getParserSuggestions(err.hash.expected);
                }
            }
        }
        if (matches) {
            matches.sort();
            return matches;
        }
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