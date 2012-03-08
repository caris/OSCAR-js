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
 * Class: oscar.Util.DivSelect
 * 
 * @deprecated
 */
oscar.Util.DivSelect = oscar.BaseClass( {

initialize : function(div, dragableIn) {
	// the div container
	this.selectDiv = div;
	// disable selection by dragging the mouse because it selects the texts
	// instead of options
	if (typeof document.onselectstart != "undefined") {
		this.selectDiv.onselectstart = new Function("return false");
	} else {
		this.selectDiv.onmousedown = new Function("return false");
		this.selectDiv.onmouseup = new Function("return true");
	}

	// the options
	this.options = new Array();

	// drag&dropable
	this.dragable = dragableIn;
	if (this.dragable) {
		new YAHOO.util.DDTarget(this.selectDiv, this.selectDiv.id);
	}
	
},

/*
 * This method selects(highlight) an option if the option is not selected.
 * Otherwise, it unselect the option.
 */
clickOptionDiv : function() {
	if (this.className == 'highlighted') {
		this.className = 'unhighlighted';
	} else if (this.className == 'unhighlighted') {
		this.className = 'highlighted';
	}
},

/*
 * This method adds an option to the DivSelect control @param option an object
 * implements the createHTMLDiv method. @param comparator a function to compare
 * two options. If it is not null, the option will be inserted to the options
 * array according to its value. Otherwise, the option will be added to the end
 * of the array.
 * 
 */
addOption : function(option, comparator) {
	var optionDiv = option.createHTMLDiv();
	option.optionDiv = optionDiv;

	if (optionDiv != null) {
		if (!comparator || this.options.length == 0) {
			this.selectDiv.appendChild(optionDiv);
			this.options[this.options.length] = option;
		} else {
			var optionDivs = this.selectDiv.childNodes;
			var foundPosition = false;
			for (i = 0; i < this.options.length; i++) {
				if (comparator(option, this.options[i]) < 0) {
					this.options.splice(i, 0, option);
					this.selectDiv.insertBefore(optionDiv, optionDivs[i]);
					foundPosition = true;
					break;
				}
			}
			if (!foundPosition) {
				this.selectDiv.appendChild(optionDiv);
				this.options[this.options.length] = option;
			}
		}

		optionDiv.onclick = this.clickOptionDiv;
		optionDiv.className = "unhighlighted";
	}

	if (this.dragable) {
		new oscar.Util.DivSelect.DD(this, optionDiv.id, this.selectDiv.id);
	}
},

/*
 * This method removes an option from the DivSelect control param index the
 * index of the option to be removed
 */
removeOption : function(index) {
	if (index > this.options.length - 1)
		return false;
	this.options.splice(index, 1);
	var optionDivs = this.selectDiv.childNodes;
	if (optionDivs != null) {
		this.selectDiv.removeChild(optionDivs[index]);
	}
},

/*
 * This method returns the option in request param index the index of the option
 * to be returned
 */
getOption : function(index) {
	return this.options[index];
},

/**
 * This method selects an option.
 * 
 * @param index
 *            the index of the option
 */
selectOption : function(index) {
	if (index > this.options.length - 1)
		return false;
	var optionDiv = this.selectDiv.childNodes[index];
	if (optionDiv.className == 'unhighlighted') {
		optionDiv.className = 'highlighted';
	}
},

/**
 * This method unselects an option.
 * 
 * @param index
 *            the index of the option
 */
unselectOption : function(index) {
	if (index > this.options.length - 1)
		return false;
	var optionDiv = this.selectDiv.childNodes[index];
	if (optionDiv.className == 'highlighted') {
		optionDiv.className = 'unhighlighted';
	}
},

/**
 * This method enables an option.
 * 
 * @param index
 *            the index of the option
 */
enableOption : function(index) {
	if (index > this.options.length - 1)
		return false;
	this.selectDiv.childNodes[index].className = 'unhighlighted';
},

/**
 * This method disables an option.
 * 
 * @param index
 *            the index of the option
 */
disableOption : function(index) {
	if (index > this.options.length - 1)
		return false;
	this.selectDiv.childNodes[index].className = 'isDisabled';
},

/*
 * This method removes the current selected options
 */
removeSelectedOptions : function() {
	var optionDivs = this.selectDiv.childNodes;
	if (optionDivs != null) {
		for (i = optionDivs.length - 1; i >= 0; i--) {
			var optionDiv = optionDivs[i];
			if (optionDiv.className == 'highlighted') {
				this.selectDiv.removeChild(optionDiv);
				this.options.splice(i, 1);
			}
		}
	}
},

/*
 * This method removes the current enabled options
 */
removeEnabledOptions : function() {
	var optionDivs = this.selectDiv.childNodes;
	if (optionDivs != null) {
		for (i = optionDivs.length - 1; i >= 0; i--) {
			var optionDiv = optionDivs[i];
			if (optionDiv.className != 'isDisabled') {
				this.selectDiv.removeChild(optionDiv);
				this.options.splice(i, 1);
			}
		}
	}
},

/*
 * This method removes all options
 */
removeAllOptions : function() {
	var optionDivs = this.selectDiv.childNodes;
	if (optionDivs != null) {
		for (i = optionDivs.length - 1; i >= 0; i--) {
			var optionDiv = optionDivs[i];
			this.selectDiv.removeChild(optionDiv);
			this.options.splice(i, 1);
		}
	}
},

/*
 * This method returns all options
 */
getAllOptions : function() {
	return this.options;
},

/*
 * This method returns the current selected options
 */
getSelectedOptions : function() {
	var ret = new Array();
	var optionDivs = this.selectDiv.childNodes;
	if (optionDivs != null) {
		for (i = 0; i < optionDivs.length; i++) {
			var optionDiv = optionDivs[i];
			if (optionDiv.className == 'highlighted') {
				ret.push(this.options[i]);
			}
		}
	}
	return ret;
},

/*
 * This method returns the current enabled options
 */
getEnabledOptions : function() {
	var ret = new Array();
	var optionDivs = this.selectDiv.childNodes;
	if (optionDivs != null) {
		for (i = 0; i < optionDivs.length; i++) {
			var optionDiv = optionDivs[i];
			if (optionDiv.className != 'isDisabled') {
				ret.push(this.options[i]);
			}
		}
	}
	return ret;
},

CLASS_NAME :"oscar.Util.DivSelect"
});

/**
 * The customized dragable YUI object
 * 
 * @param divSelect
 *            the divSelect
 * @param id
 *            the id of this dragable
 * @param sGroup
 *            the drag & drop group this dragable belongs to
 * @param config
 *            YUI DD config
 */
oscar.Util.DivSelect.DD = function(divSelect, id, sGroup, config) {
	oscar.Util.DivSelect.DD.superclass.constructor.call(this, id, sGroup,
			config);
	this.divSelect = divSelect;
	this.Dom = YAHOO.util.Dom;
	this.Event = YAHOO.util.Event;
	this.DDM = YAHOO.util.DragDropMgr;
	this.logger = this.logger || YAHOO;
	this.Dom.setStyle(this.getDragEl(), "opacity", 0.67); // The proxy is
	// slightly
	// transparent
	this.goingUp = false;
	this.lastY = 0;
}

/**
 * oscar.Util.DivSelect.DD extends YAHOO.util.DDProxy
 */
YAHOO.extend(oscar.Util.DivSelect.DD, YAHOO.util.DDProxy, {

	startDrag : function(x, y) {
		this.logger.log(this.id + " startDrag");

		// make the proxy look like the source element
	var dragEl = this.getDragEl();
	var clickEl = this.getEl();
	this.Dom.setStyle(clickEl, "visibility", "hidden");

	dragEl.innerHTML = clickEl.innerHTML;

	this.Dom.setStyle(dragEl, "text-align", this.Dom.getStyle(clickEl,
			"text-align"));
	this.Dom.setStyle(dragEl, "color", this.Dom.getStyle(clickEl, "color"));
	this.Dom.setStyle(dragEl, "backgroundColor", this.Dom.getStyle(clickEl,
			"backgroundColor"));
},

endDrag : function(e) {

	var srcEl = this.getEl();
	var proxy = this.getDragEl();

	// Show the proxy element and animate it to the src element's location
	this.Dom.setStyle(proxy, "visibility", "");
	var a = new YAHOO.util.Motion(proxy, {
		points : {
			to :this.Dom.getXY(srcEl)
		}
	}, 0.2, YAHOO.util.Easing.easeOut)
	var proxyid = proxy.id;
	var thisid = this.id;

	// Hide the proxy and show the source element when finished with the
	// animation
	a.onComplete.subscribe( function() {
		YAHOO.util.Dom.setStyle(proxyid, "visibility", "hidden");
		YAHOO.util.Dom.setStyle(thisid, "visibility", "");
	});
	a.animate();
},

onDragDrop : function(e, id) {

	// If there is one drop interaction, the div was dropped either on the
	// list,
	// or it was dropped on the current location of the source element.
	if (this.DDM.interactionInfo.drop.length === 1) {

		// The position of the cursor at the time of the drop
		// (YAHOO.util.Point)
		var pt = this.DDM.interactionInfo.point;

		// The region occupied by the source element at the time of the drop
		var region = this.DDM.interactionInfo.sourceRegion;

		// Check to see if we are over the source element's location. We
		// will
		// append to the bottom of the list once we are sure it was a drop
		// in
		// the negative space (the area of the list without any list items)
		if (!region.intersect(pt)) {
			var destEl = this.Dom.get(id);
			var destDD = this.DDM.getDDById(id);
			destEl.appendChild(this.getEl());
			destDD.isEmpty = false;
			this.DDM.refreshCache();
		}

	}
},

onDrag : function(e) {

	// Keep track of the direction of the drag for use during onDragOver
	var y = this.Event.getPageY(e);

	if (y < this.lastY) {
		this.goingUp = true;
	} else if (y > this.lastY) {
		this.goingUp = false;
	}

	this.lastY = y;
},

onDragOver : function(e, id) {

	var srcEl = this.getEl();
	var destEl = this.Dom.get(id);

	// We are only concerned with list items, we ignore the dragover
	// notifications for the list.
	if (destEl.className == 'highlighted'
			|| destEl.className == 'unhighlighted'
			|| destEl.className == 'isDisabled') {
		var orig_p = srcEl.parentNode;
		var p = destEl.parentNode;

		if (this.goingUp) {
			p.insertBefore(srcEl, destEl); // insert above
		} else {
			p.insertBefore(srcEl, destEl.nextSibling); // insert below
		}
		this.DDM.refreshCache();

		// Re-order the options in divSelect
		var options = this.divSelect.getAllOptions();
		var newOptions = new Array();
		var tempOptions = new Array();
		var srcOption = null;
		for (i = 0; i < options.length; i++) {
			if (options[i].optionDiv == srcEl)
				srcOption = options[i];
			else
				tempOptions[tempOptions.length] = options[i];
		}
		for (i = 0; i < tempOptions.length; i++) {
			if (tempOptions[i].optionDiv == destEl) {
				if (this.goingUp) {
					newOptions[newOptions.length] = srcOption;
					newOptions[newOptions.length] = tempOptions[i];
				} else {
					newOptions[newOptions.length] = tempOptions[i];
					newOptions[newOptions.length] = srcOption;
				}
			} else
				newOptions[newOptions.length] = tempOptions[i];
		}
		this.divSelect.options = newOptions;
	}
}

});
