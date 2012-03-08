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
 * Class: oscar.Util.DivSelectOption
 * Class representing a basic option for an oscar.DivSelect.
 * 
 * @deprecated
 */
oscar.Util.DivSelectOption = oscar.BaseClass( {
    listName : null,
    showListName : null,
    separator : "::",

    /**
     * Constructor.
     * @param optionId The id of the option.
     * @param optionName The name of the option.
     * @param optionInputTagName The tag name for the options div tag.
     * @param optionListName The listName of the option.
     * @param optionShowListName true if the listName should be displayed in
     *        the DivSelect as part of the option name, false otherwise.
     */
    initialize : function(optionId, optionName, optionInputTagName,
            optionListName, optionShowListName) {
        this.id = optionId;
        this.name = optionName;
        this.inputTagName = optionInputTagName;
        this.listName = optionListName;
        this.showListName = optionShowListName;
    },

    /**
     * Creates the div element inside the DivSelect that contains this option.
     */
    createHTMLDiv : function () {
        var ret = document.createElement('div');
        if (this.showListName) {
            ret.id = "selectedLayer" + this.id + "Option";
        } else {
            ret.id = "availableLayer" + this.id + "Option";
        }

        var content = "<input type='hidden' name='" + this.inputTagName
                + "' value='" + this.id + "'/>";

        if (this.showListName) {
            content += this.listName + this.separator + this.name;
        } else {
            content += this.name;
        }

        ret.innerHTML = content;
        return ret;
    },

    CLASS_NAME :"oscar.Util.DivSelectOption"
});
