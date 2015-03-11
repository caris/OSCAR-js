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
oscar.Control.AdvancedCatalogueSearch = new oscar.BaseClass(oscar.Control.CatalogueSearchForm, {
    EVENT_TYPES : [ 'close' ],
    autoSearch : false,
    errorId : null,
    help : "help/advanced-search-{0}.html",
    initialize : function(options) {
        oscar.Control.prototype.initialize.apply(this, [ options ]);
        this.searchHandler.events.on({
            "displayfilter" : this.displayFilter,
            scope : this
        });
        
        this.parser = new oscar.Util.Parser(CQL_Parser);
        this.parser.events.on({
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
        $$("#" + this.errorId).empty();
        
        if (this.autoSearch) {
            this.searchHandler.search(query);
        }
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
        
        var closeBtn = $$("<button></button>").html(oscar.i18n("Close"));
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
            // eliminate the focus change from the menu
            focus : function(e, ui) {
                return false;
            },
            select : $$.proxy(this._injectText, this)
        }).focus(function() {
            $$(this).autocomplete("search");
        }).bind('keypress', $$.proxy(function(event) {
            if (event.keyCode == 13) {
                try {
                    this.parser.parse(this.textarea.val());
                    this.performSearch(this.textarea.val());
                } catch (err) {
                }
                return false;
            }
        }, this));
        
        containerDiv.append(this.textarea);
        var btn = $$("<button></button>").html(oscar.i18n("Search"));
        btn.button({
            icons : {
                primary : "ui-icon-search"
            },
            text : true
        }).click($$.proxy(this.search, this));
        
        var ctrls = $$("<div></div>");
        ctrls.addClass("advSearchControls");
        containerDiv.append(ctrls);
        var parserErrorDiv = $$("<span></span>");
        this.errorId = OpenLayers.Util.createUniqueID(this.CLASS_NAME + ".errorDiv.");
        parserErrorDiv.attr("id", this.errorId);
        parserErrorDiv.addClass("errorDiv");
        
        ctrls.append(parserErrorDiv);
        var btns = $$("<div></div>");
        btns.addClass("advSearchButtons");
        btns.append(btn);
        this.addHelp("Syntax Help", btns);
        
        ctrls.append(btns);
    },
    search : function() {
        try {
            this.parser.parse(this.textarea.val());
            this.performSearch(this.textarea.val());
        } catch (parseError) {
            this.displayError(parseError);
        }
    },
    displayError : function(err) {
        var errString = "Suggestion: ";
        if (err.hash && err.hash.loc) {
            errString += " @";
            var errorLn = err.hash.loc.last_line;
            var errorCol = err.hash.loc.last_column;
            errString += errorLn + ":" + errorCol + ".";
        }
        
        if (err.hash && err.hash.expected) {
            var symbols = [];
            for (var i = 0; i < err.hash.expected.length; i++) {
                var symbol = null;
                if ((symbol = oscar.Util.getGrammarSymbol(err.hash.expected[i]))) {
                    symbols.push(symbol);
                }
            }
            if (symbols) {
                errString += " Expected " + symbols.join(" or ") + "."
            }
        }
        
        $$("#" + this.errorId).html(errString);
        
    },
    _injectText : function(e, ui) {
        // the query string
        var query = this.textarea.val();
        // injection value
        var injection = ui.item.value;
        
        // get the tokens
        var tokens = query.split(" ");
        var lastToken = tokens.pop();
        if (lastToken.indexOf("(") === 0) {
            lastToken = lastToken.substring(1, lastToken.length);
            tokens.push("(");
        }
        if (injection.toLowerCase().indexOf(lastToken.toLowerCase()) === -1) {
            tokens.push(lastToken);
        }
        tokens.push(injection);
        var tokenString = tokens.join(" ");
        this.textarea.val(tokenString);
        
        if (injection === "''") {
            setTimeout($$.proxy(function() {
                var query = this.textarea.val();
                var word_pos = query.lastIndexOf("'");
                var textarea = this.textarea[0];
                if (textarea.setSelectionRange) {
                    textarea.setSelectionRange(word_pos, word_pos);
                } else if (this.textarea[0].createTextRange) {
                    // because of IE
                }
            }, this), 100);
        }
        
        try {
            this.parser.parse(this.textarea.val());
        } catch (parseError) {
            this.displayError(parseError);
        }
        return false;
    },
    setQuery : function(query) {
        this.textarea.val(query);
        if (query.length > 0) {
            try {
                this.parser.parse(this.textarea.val());
                this.performSearch(this.textarea.val());
                
            } catch (parseError) {
                this.displayError(parseError);
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
        var getParserSuggestions = function(expectations, partial) {
            if (!expectations)
                return;
            var suggestions = [];
            for (var i = 0; i < expectations.length; i++) {
                var expectation = expectations[i].replace(/'/g, '');
                switch (expectation) {
                    case "FIELD":
                        suggestions = suggestions.concat(getFieldSuggestions(partial));
                        break;
                    default:
                        var symbol = oscar.Util.getGrammarSymbol(expectation);
                        if (symbol) {
                            if (partial) {
                                if (symbol.toLowerCase().indexOf(partial.toLowerCase()) === 0) {
                                    suggestions.push(symbol);
                                }
                            } else {
                                suggestions.push(symbol);
                            }
                        }
                }
            }
            return suggestions;
        };
        
        var term = req.term;
        var matches = [];
        
        term = term.split(" ").pop();
        if (term.indexOf("(") === 0 && term.length > 1) {
            term = term.substring(1, term.length);
        }
        
        if (term.length === 0) {
            try {
                this.parser.parse(this.textarea.val());
            } catch (err) {
                this.displayError(err);
                matches = getParserSuggestions(err.hash.expected);
            }
            
        } else {
            matches = matches.concat(getFieldSuggestions(term));
            if (matches.length === 0) {
                try {
                    this.parser.parse(this.textarea.val());
                } catch (err) {
                    this.displayError(err);
                    matches = getParserSuggestions(err.hash.expected, term);
                }
            }
        }
        if (matches) {
            matches.sort();
            return matches;
        }
    },
    displayFilter : function(filter) {
        this.textarea.val(filter.toString());
    },
    CLASS_NAME : "oscar.Control.AdvancedSearchForm"
});