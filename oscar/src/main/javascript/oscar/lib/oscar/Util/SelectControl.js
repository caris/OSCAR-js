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
 * Class: oscar.Util.SelectControl
 * Class representing a Select Control for moving selected/unselected options
 * between two oscar.DivSelect containers.
 * 
 * @deprecated
 */
oscar.Util.SelectControl = oscar.BaseClass( {
    available: null,
    selected: null,

    /**
     * Constructor.
     * @param avialableOptions oscar.DivSelect containing the available or
     *        unselected options.
     * @param selectedOptions oscar.DivSelect containing the selected options.
     */
    initialize : function(availableOptions, selectedOptions) {
        this.available = availableOptions;
        this.selected = selectedOptions;

    },

    /**
     * Moves options from the available oscar.DivSelect to the selected
     * oscar.DivSelect.
     * @param selectedOnly If true will only move options the user has selected.
     *        If false will move all the options.
     * @param showListName If true will show the listName as part of the
     *        option name when the option is moved to the selected DivSelect.
     * @param toListId The id of the div containing the oscar.DivSelect
     *        for selected options.
     */
    selectOptions : function(selectedOnly, showListName, toListId) {
        this.moveOptions(selectedOnly, showListName, this.available,
                this.selected, toListId, '');
    },

    /**
     * Moves options from the selected oscar.DivSelect to the available
     * oscar.DivSelect.
     * @param selectedOnly If true will only move options the user has selected.
     *        If false will move all the options.
     * @param listName The listName of the available list options.
     * @param toListId The id of the div containing the oscar.DivSelect for
     *        available options.
     * @param toListName The name of the currently active available list.
     */
    unSelectOptions : function(selectedOnly, toListId, toListName) {
	    this.moveOptions(selectedOnly, false, this.selected, this.available,
	    	    toListId, toListName);
    },

    /**
     * Generic function for moving an oscar.Util.DivSelectOption from one
     * oscar.DivSelect to another oscar.DivSelect.
     * @param selectedOnly If true will only move options the user has selected.
     *        If false will move all the options.
     * @param showListName 
     * @param fromDiv The oscar.DivSelect the options will be removed from.
     * @param toDiv The oscar.DivSelect the options will be moved to.
     * @param toListId The id of the div containing the oscar.DivSelect options
     *        are being moved to.
     * @param toListName The name of the list options are being moved to.
     */
    moveOptions : function(selectedOnly, showListName, fromDiv, toDiv,
            toListId, toListName) {
        var options = null;
        if(selectedOnly === true) {
            options = fromDiv.getSelectedOptions();
        } else {
            options = fromDiv.getEnabledOptions();
        }

        for(var i = 0; i < options.length; i++) {
            var option = options[i];
            if(toListName === '' || toListName === option.listName) {
                toDiv.addOption(new oscar.Util.DivSelectOption(option.id,
                		option.name, toListId, option.listName, showListName));
            }
        }

        if(selectedOnly === true) {
            fromDiv.removeSelectedOptions();
        } else {
            fromDiv.removeEnabledOptions();
        }
    },

    CLASS_NAME :"oscar.Util.SelectControl"
});
