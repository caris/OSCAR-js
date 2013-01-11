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
 * Class: oscar.debug
 */
oscar.debug = {
	canOutput:function() {
    	var canOutput = false;
    	try {
    		canOutput = (window.console)?true:false; 
    	} catch (err){}
    	
    	return canOutput 
    },
    error : function(obj) {
    	if(this.canOutput()) {
    		window.console.error(obj.message);
    	}
    }
};

/**
 * Class: oscar.Util
 */
oscar.Util = {};

/**
* APIMethod:getMetersConversionFactor
* Uses the projection to obtain a conversion factor value to display units in meters.
* Parameters:
* - projection ( OpenLayers.Projection)
*
*/
oscar.Util.getMetersConversionFactor = function(projection) {
	var proj = projection.proj;
	if(proj.projName == "longlat") {
		return OpenLayers.INCHES_PER_UNIT.degrees * OpenLayers.METERS_PER_INCH;
	} else if(proj.to_meter) {
		return proj.to_meter;
	} else {
		return 1;
	}
}


/**
*
* APIMethod: isFeatureInArray
* Returns true of a feature name is found in the array
* Parameters: 
* - featureName {String}
* - selectedFeatures - array of feature names {String}
*
**/
oscar.Util.isFeatureInArray = function(featureName,selectedFeatures) {
    for(var i in selectedFeatures) {
        if(featureName == selectedFeatures[i])
        return true;
    }
    return false;
};


/**
 * Method: createFormElement
 * @deprecated
 * 
 * {Note: I cannot find any usage of this function anywhere}
 */
oscar.Util.createFormElement = function(element, type, name, id, value, parent) {
	var e = document.createElement(element);
	e.setAttribute("name", name);
	e.setAttribute("type", type);
	e.setAttribute("id", id);
	e.setAttribute("value", value);
	parent.appendChild(e);
};

/**
 * APIMethod: checkAll
 * 
 * Checks all checkboxes in a form except a checkbox using the name "allbox"
 */
oscar.Util.checkAll = function(theForm) {
	for ( var i = 0; i < theForm.elements.length; i++) {
		var e = theForm.elements[i];
		var eName = e.name;
		if (eName != 'allbox' && e.type != null
				&& (e.type.indexOf("checkbox") == 0)) {
			e.checked = theForm.allbox.checked;
		}
	}
};

/**
 * APIMethod: isOneChecked
 * 
 * Takes an array of checkbox elements and checks to see if at least one is checked.
 */
oscar.Util.isOneChecked = function(checkbox) {
	if (checkbox == null) {
		return false;
	}
	if (checkbox.length) {
		for ( var i = 0; i < checkbox.length; i++) {
			if (checkbox[i].checked) {
				return true;
			}
		}
	} else {
		if (checkbox.checked) {
			return true;
		}
	}
	return false;
};

/**
 * APIMethod: isSphericalMercator
 * 
 * Returns true if the coordinate system is EPSG:3857 or EPSG:900913
 * 
 * Parameters:
 * 
 * srs - {String} A coordiante system reference such as "EPSG:4326" or "EPSG:3857"
 */
oscar.Util.isSphericalMercator = function(srs) {
	if ((srs == "EPSG:900913") || (srs == "EPSG:3857")) {
		return true;
	}
	return false;
};

/**
 * APIMethod: moveSelectedOptions
 * 
 * Moves selected options from one select box to another
 * 
 * Parameters:
 * 
 * fromSelectName - {String} Source select reference
 * 
 * toSelectName - {String} destination select reference
 */
oscar.Util.moveSelectedOptions = function(fromSelectName, toSelectName) {
	var fromSelect = document.getElementsByName(fromSelectName)[0];
	var toSelect = document.getElementsByName(toSelectName)[0];
	if (fromSelect != null && toSelect != null) {
		var i;
		for (i = 0; i < fromSelect.options.length; i++) {
			if (fromSelect.options[i].selected) {
				var opt = fromSelect.options[i];
				toSelect.options[toSelect.options.length] = new Option(
						opt.text, opt.value);
				fromSelect.remove(i);
				i--;
			}
		}
	}
};

//This function moves all the options from the fromSelect to the toSelect
/**
 * APIMethod: moveAllSelectOptions
 * 
 * Moves all options from one select box to another
 * 
 * Parameters:
 * 
 * fromSelectName - {String} Source select reference
 * 
 * toSelectName - {String} destination select reference
 */
oscar.Util.moveAllSelectOptions = function(fromSelectName, toSelectName) {
	var fromSelect = document.getElementsByName(fromSelectName)[0];
	var toSelect = document.getElementsByName(toSelectName)[0];

	if (fromSelect != null && toSelect != null) {
		var i;
		var numOfFromSelectOptions = fromSelect.options.length;
		for (i = 0; i < numOfFromSelectOptions; i++) {
			var opt = fromSelect.options[0];
			toSelect.options[toSelect.options.length] = new Option(opt.text,
					opt.value);
			fromSelect.remove(0);
		}
	}
};

/**
 * Submits the given form. If an action other than the one already associated with the given
 * form is supplied, it applies that one instead.
 *
 * Input:
 *   form - The form to be submitted. By default it is submitted to the URI defined by the
 *   form's action property.
 *   action - (Optional) The name of the struts action to be invoked.
 */
oscar.Util.submitForm = function(form, action) {
	if (action != null)
		form.action = action;
	form.submit();
};

/**
 * APIMethod: getBrowserName
 * 
 * Returns: {String} A string which specifies which is the current browser in
 * which we are running.
 * 
 * Currently-supported browser detection and codes: * 'opera' -- Opera * 'msie' --
 * Internet Explorer * 'safari' -- Safari * 'firefox' -- FireFox * 'mozilla' --
 * Mozilla
 * 
 * If we are unable to property identify the browser, we return an empty string.
 */
oscar.Util.getBrowserName = function() {
	var browserName = "";

	var ua = navigator.userAgent.toLowerCase();
	if (ua.indexOf("opera") != -1) {
		browserName = "opera";
	} else if (ua.indexOf("msie") != -1) {
		browserName = "msie";
	} else if (ua.indexOf("safari") != -1) {
		browserName = "safari";
	} else if (ua.indexOf("mozilla") != -1) {
		if (ua.indexOf("firefox") != -1) {
			browserName = "firefox";
		} else {
			browserName = "mozilla";
		}
	}

	return browserName;
};

/**
 * APIMethod: buildWFSFilterForRequest
 * 
 * This method will generate a WFSFilter for WFS requests. geometry -
 * OpenLayers.LonLat || OpenLayers.Bounds
 * 
 * returns a WFSFilter
 * 
 */
oscar.Util.buildWFSFilterForRequest = function(geometry, srs, wfsVersion, propertyName) {
	var reqType = OpenLayers.Filter.Spatial.BBOX;
	spatialFilter = new OpenLayers.Filter.Spatial( {
		type :reqType,
		value :geometry,
		projection :srs,
		property :propertyName
	});
	var filterFormat = new OpenLayers.Format.Filter( {
		version :wfsVersion
	});
	var xml = new OpenLayers.Format.XML();
	return xml.write(filterFormat.write(spatialFilter));
};

/**
 * APIMethod: getDataFormatter
 * 
 * returns a data formatter for the passed-in data format
 * 
 * Parameters: 
 * 
 * 	dataFormatType - Type of the data format
 * 	options -  An optional object whose properties will be set on this instance
 */

oscar.Util.getDataFormatter = function(dataFormatType, options) {
	var dft = dataFormatType.toLowerCase();
	if (dft.contains("gml2") || dft.contains("gml/2"))
		return new OpenLayers.Format.GML(options);
	else if (dft.contains("kml"))
		return new OpenLayers.Format.KML(options);
	else if (dft.contains("json"))
		return new OpenLayers.Format.GeoJSON(options);
	else if (dft == "georss_simple" || dft == "georss_geo")
		return new OpenLayers.Format.GeoRSS(options);
	return null;
};

/**
 * Maintain existing definition of $.
 */
if (typeof window.$ === "undefined") {
	window.$ = OpenLayers.Util.getElement;
}


/** 
 * Fix the getElementById method for IE 7 and lower
 * use browser sniffing to determine if using an affected version
 */
var isOldIE = false;
var userAgent = navigator.userAgent;
if (userAgent.indexOf("MSIE") != -1) {
	var userAgentVersion = parseFloat(navigator.userAgent.split("MSIE")[1]);
	if (userAgentVersion < 8.0) {
		isOldIE = true;
	}
}

if (isOldIE) {
	//overwrite the existing getElementById method
	document.nativeGetElementById = document.getElementById;
	document.getElementById = function(id) {
		var elem = document.nativeGetElementById(id);
		if (elem) {
			//verify it is a valid match
			if (elem.attributes['id'] && elem.attributes['id'].value == id) {
				return elem;
			} else {
				//the non-standard, document.all array has keys for all name'd, and id'd elements
				//start at one, because we know the first match is wrong
				for ( var i = 1; i < document.all[id].length; i++) {
					if (document.all[id][i].attributes['id']
							&& document.all[id][i].attributes['id'].value == id) {
						return document.all[id][i];
					}
				}
			}
		}
		return null;
	};
}
/**
 * Method: getTimeStamp
 * 
 *  Used to append to a URL to prevent caching
 * 
 * Returns:
 *  {String} Returns a key value pair. 
 *  
 *  Example
 *  
 *  timestamp=421564215
 * 
 */
oscar.Util.getTimeStamp = function() {
	var now = new Date().getTime();
	return "timestamp=" + now;
};

/**
 * Method: getToolTipId
 * 
 * returns the toolTipId
 */

oscar.Util.getToolTipId = function(objWithClassName) {
	return toolTipId = objWithClassName.CLASS_NAME.toLowerCase().replaceAll(
			".", "_");
};

/**
 * Class: oscar.Util.EpsgConversion
 * 
 * Converts epsg codes to urns and vice versa
 */
oscar.Util.EpsgConversion = {
	CRS :"CRS",
	OGC :"OGC",
	EPSG :"EPSG",
	EPSG_URN :"urn:ogc:def:crs:EPSG::",
	CRS_URN :"urn:ogc:def:crs:OGC:2:",

	/**
	 * APIMethod: oscar.Util.EpsgConversion.urnToEpsg
	 * 
	 * Convert urn to crs.
	 * 
	 * Parameters:
	 * 
	 * urn - {String} academic urn
	 * 
	 * Returns:
	 * 
	 * epsg - {String} epsg crs.
	 * 
	 * Usage: 
	 * > var epsg = oscar.Util.EpsgConversion.urnToEpsg("urn:ogc:def:crs:EPSG::4326");
	 * >
	 * > Returns "EPSG:4326"  
	 */
	urnToEpsg : function(urn) {
		var tokens = urn.split(":");
		if (tokens.length == 7) {
			if (tokens[4] == oscar.Util.EpsgConversion.OGC) {
				return oscar.Util.EpsgConversion.CRS + ':' + tokens[6];
			} else {
				return tokens[4] + ':' + tokens[6];
			}
		} else {
			return urn;
		}
	},
	/**
	 * APIMethod: oscar.Util.EpsgConversion.epsgToUrn
	 * 
	 * Convert espg crs to urn.
	 * 
	 * Parameters:
	 * 
	 * epsg - {String}
	 * 
	 * Returns:
	 * 
	 *  urn - {String} academic urn
	 *  
	 *  Usage: 
	 * > var urn = oscar.Util.EpsgConversion.epsgToUrn("EPSG:4326");
	 * >
	 * > Returns "urn:ogc:def:crs:EPSG::4326"
	 */
	epsgToUrn : function(epsg) {
		var s = epsg.split(":");
		if (s[0] == oscar.Util.EpsgConversion.EPSG) {
			return oscar.Util.EpsgConversion.EPSG_URN + s[1];
		} else if (s[0] == oscar.Util.EpsgConversion.CRS) {
			return oscar.Util.EpsgConversion.CRS_URN + s[1];
		} else {
			return epsg;
		}
	}
};

/**
* Add additional functionality to existing JavaScript Objects
**/

String.prototype.replaceAll = function(stringToFind, stringToReplace) {
	var temp = this;
	var index = temp.indexOf(stringToFind);
	while (index != -1) {

		temp = temp.replace(stringToFind, stringToReplace);

		index = temp.indexOf(stringToFind);
	}
	return temp;
};

/**
 * APIMethod: oscar.Util.getServerGeometryPropertyName
 * 
 * returns the geometry property name of the current server
 * 
 * Parameters:
 * schema - {JSON} the DescribeFeatureType schema of current server
 * 
 * Returns:
 *  {String} Returns server GeometryPropertyName as a String. 
 *   
 */
oscar.Util.getServerGeometryPropertyName = function(schema) {
	var elements = schema.ComplexType.ComplexContent.Extension.Sequence.Elements;
	for(var i = 0; i < elements.length; i++){
		if(elements[i].type.indexOf("gml:") != -1){
			return geoPropName = elements[i].name;
		}
	}
	return "";
};
/**
 * Method: oscar.Util.convertFormat
 * 
 * returns the user-friendly format text name of the current server
 * 
 * Parameters: format -(String) the format description.
 * 
 * Returns: {String} Returns the format text as a String.
 * 
 */
oscar.Util.convertFormat= function(format){
	if (format != null || format.length > 0) {
		if(format.indexOf("gml/3")!=-1||format.indexOf("gml3")!=-1){
			return "gml3";
		}
		else if(format.indexOf("gml/2")!=-1||format.indexOf("gml2")!=-1){
			return "gml2";
		}
		else if(format.indexOf("kml")!=-1){
			return "kml"
		}
		else if(format.indexOf("json")!=-1){
			return "json";
		}
		else if (format.indexOf("tiff") != -1) {
			return "tiff";
		}
		else if (format.indexOf("xyz") != -1) {
			return "XYZ";
		}
		else if (format.indexOf("bag") != -1) {
			return "BAG";
		}
		else if (format.indexOf("shapefile") != -1) {
			return "ShapeFile";
		}
	}
	return format;			
};

/**
 * APIMethod: oscar.alert
 * 
 * Displays an alert dialog box to the user.
 */
oscar.alert = function(props,content,callbacks) {
	var _defaults = {
		modal:true,
		resizable:false,
		closeOnEscape: false,
		show:"fade",
		hide:"fade",
		draggable:false,
		open: function(event, ui) { $$(this).parent().children().children(".ui-dialog-titlebar-close").hide();}
	}
	var options = OpenLayers.Util.extend(props,_defaults);
	var $dlg = $$("<div></div>").dialog(options).html(content);
	var $buttonPanel = $$("<div></div>").addClass("dlgButtonPanel");
	var $ok = $$("<a></a>").html("Ok").button({
		icons: {
            primary: "ui-icon-check"
        },
        text: false
	}).click(function(){
		$dlg.dialog("close");
		if(callbacks && callbacks.complete) {
			callbacks.complete.apply(callbacks.scope,[true]);
		}
	});
	$buttonPanel.append($ok);
	$dlg.append($buttonPanel);
}


/**
 * APIMethod: oscar.confirm
 * 
 * Displays an confirm dialog box.
 */
oscar.confirm = function(props,content,callbacks) {
	var _defaults = {
		modal:true,
		resizable:false,
		closeOnEscape: false,
		show:"fade",
		hide:"fade",
		draggable:false,
		open: function(event, ui) { $$(this).parent().children().children(".ui-dialog-titlebar-close").hide();}
	}
	
	var options = OpenLayers.Util.extend(props,_defaults);
	
	var $dlg = $$("<div></div>").dialog(options).html(content);
	var $buttonPanel = $$("<div></div>").addClass("dlgButtonPanel");
	var $ok = $$("<a></a>").html("Ok").button({
		icons: {
            primary: "ui-icon-check"
        },
        text: false
	}).click(function(){
		$dlg.dialog("close");
		if(callbacks && callbacks.complete) {
			callbacks.complete.apply(callbacks.scope,[true]);
		}
	});
	var $cancel = $$("<a></a>").html("Cancel").button({
		icons: {
            primary: "ui-icon-cancel"
        },
        text: false
	}).click(function(){
		$dlg.dialog("close");
		if(callbacks && callbacks.complete) {
			callbacks.complete.apply(callbacks.scope,[false]);
		}
	});
	$buttonPanel.append($ok);
	$buttonPanel.append($cancel);
	$dlg.append($buttonPanel);
}

/**
 * Method: parseText
 * This method will take a String argument and look for URLs, email links and images and return anchor or image tags.
 * 
 * Usage: oscar.Util.parseText(String)
 */

oscar.Util.parseText = function(input) {
	if(input == null) return "";
	
	/** 
	 * internal functions for parsing images, email links and urls.
	 */
	var fns={
	    makeTag:function(tag) {
	        return document.createElement(tag);
	    },
	    url:function(input) {
	        if(input.indexOf("http://") ==0 ||
	            input.indexOf("https://") ==0) {
	            var elem = this.makeTag("span");
	            var anchor = this.makeTag("a");
	            elem.appendChild(anchor);
	            anchor.href = input;
	            anchor.innerHTML = input;
	            anchor.target = "_new";
	            input = elem.innerHTML;
	        }
	        return input;
	    },
	    
	    email: function(input) {
	        if(input.indexOf("@") > -1) {
	            var elem = this.makeTag("span");
	            var anchor = this.makeTag("a");
	            elem.appendChild(anchor);
	            anchor.href="mailto:" + input;
	            anchor.innerHTML = input;
	            input = elem.innerHTML;
	        }
	        return input;
	    },
	    image:function (input) {
	        if(input.indexOf(".png") > -1 ||
	            input.indexOf(".gif") > -1 ||
	            input.indexOf(".jpg") > -1 ||
	            input.indexOf(".jpeg") > -1) {
	            var elem = this.makeTag("span");
	            var image = this.makeTag("img");
	            elem.appendChild(image);
	            image.src = input;
	            input = elem.innerHTML;
	        }
	        return input;
	    }
	        
	};
	var arr = input.split(" ");
    for(var i=0;i<arr.length;i++) {
        var index = arr[i];
        arr[i] = fns.email(arr[i]);
        arr[i] = fns.image(arr[i]);
        arr[i] = fns.url(arr[i]);
    }    
    return arr.join(" ");
}

/**
* APIMethod: getGridOffsets
* Returns the correct offsets from a WCS DescribeCoverage operation
*/
oscar.Util.getGridOffsets = function(offsetsAsString) {
	var validOffsets = [];
	var offsets = offsetsAsString.split(" "); 
	//x offset
	validOffsets.push(parseFloat(offsets[0]));
	
	//y offset
	var yOffsetIndex = (offsets.length==2)? 1 : 3;
	validOffsets.push(parseFloat(offsets[yOffsetIndex]));
	
	return validOffsets;
}


/**
 * Override the default OL pink color for broken images
 */
OpenLayers.Util.onImageLoadErrorColor = "transparent";

