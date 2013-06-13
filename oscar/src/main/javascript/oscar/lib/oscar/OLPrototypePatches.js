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
 * This file contains patches for OpenLayers objects
 */

/**
 * Method: outerBoundaryIs
 * 
 * Reads the outerBoundaryIs node from a GML3 response
 */
OpenLayers.Format.GML.v3.prototype.readers["gml"].outerBoundaryIs = function(node,obj) {
          this.readChildNodes(node,obj);
          obj.outer = obj.components[0];
    };

OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.namespaces["gmd"] = "http://www.isotc211.org/2005/gmd";
OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.namespaces["gco"] = "http://www.isotc211.org/2005/gco";
OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.namespaces["gmi"] = "http://www.isotc211.org/2005/gmi"
OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.namespaces["srv"] = "http://www.isotc211.org/2005/srv"
OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.readNode = function(node, obj) {
    if(!obj) {
        obj = {};
    }
    var group = this.readers[node.namespaceURI ? this.namespaceAlias[node.namespaceURI]: this.defaultPrefix];
    if(group) {
        var local = node.localName || node.nodeName.split(":").pop();
        var reader = group[local] || group["*"];
        if(reader) {
            reader.apply(this, [node, obj]);
        }
    }
    return obj;
}

OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.nonMappedNodes = function(node) {
    if(!this.errornodes) {
        this.errornodes = [];
    }
    if (node) {
        if($$.inArray(node.nodeName,this.errornodes) == -1)  {
            this.errornodes.push(node.nodeName);
            console.warn(node.parentNode.nodeName + " > " + node.nodeName + " is not mapped.");
        }
    }
}


OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.readers["gmd"] = {
"MI_Metadata":function(node,obj) {
    var metadata = {type: "MI_Metadata",title:[{value:null}]};
    metadata["abstract"]=[""];
    this.readChildNodes(node, metadata);
    obj.records.push(metadata);
},
"MD_Metadata":function(node,obj) {
    var metadata = {type: "MD_Metadata"};
    metadata["abstract"]=[""];
    this.readChildNodes(node, metadata);
    obj.records.push(metadata);
},

"*":function(node,obj) {
    var name = node.localName || node.nodeName.split(":").pop();
    obj[name] = {};
    if(node.attributes.length > 0) {
        for(var i = 0;i<node.attributes.length;i++) {
            var attribute = node.attributes[i];
            var attrName = attribute.name;
            obj[name][attrName] = this.getAttributeNS(node,"",attrName);
        }
    }
    this.readChildNodes(node,obj[name]);

},

"fileIdentifier":function(node,obj) { // contains gco:CharacterString element
    this.readChildNodes(node,obj);
},
"identifier":function(node,obj) {
    this.readChildNodes(node,obj);
},
"language":function(node,obj){
    this.readChildNodes(node,obj);
},
/**
* LanaguageCode has to attributes: codeList and codeListValue
**/
"LanguageCode":function(node,obj){
    var codeList = this.getAttributeNS(node,"","codeList");
    var codeListValue = this.getAttributeNS(node,"","codeListValue");
    obj.language = {};
    obj.language.codeList = codeList;
    obj.language.codeListValue = codeListValue;
},

"characterSet":function(node,obj){
    var CharacterSet = {}
    this.readChildNodes(node,CharacterSet);
    obj.CharacterSet = CharacterSet;
},
/**
* MD_CharacerSetCode has to attributes: codeList and codeListValue
**/
"MD_CharacterSetCode":function(node,obj){
    var codeList = this.getAttributeNS(node,"","codeList");
    var codeListValue = this.getAttributeNS(node,"","codeListValue");
    obj.codeList = codeList;
    obj.codeListValue = codeListValue;
},
/**
* MD_ScopeCode has to attributes: codeList and codeListValue
**/
"hierarchyLevel":function(node,obj){
    var ScopeCode = {}
    this.readChildNodes(node,ScopeCode);
    obj.ScopeCode = ScopeCode;
},

/**
* MD_ScopeCode has to attributes: codeList and codeListValue
**/
"MD_ScopeCode":function(node,obj){
    var codeList = this.getAttributeNS(node,"","codeList");
    var codeListValue = this.getAttributeNS(node,"","codeListValue");
    obj.codeList = codeList;
    obj.codeListValue = codeListValue;
},

"identificationInfo":function(node,obj) {this.readChildNodes(node,obj);},
"distributionInfo":function(node,obj) {
    obj.distributionInfo = {};
    this.readChildNodes(node,obj.distributionInfo);
},

"MD_Distribution":function(node,obj) {
    this.readChildNodes(node,obj);
},

"transferOptions":function(node,obj) {
    if(!obj.transferOptions) {
        obj.transferOptions = [];
    }
    var option = this.readChildNodes(node,{});
    obj.transferOptions.push(option);
},
"MD_DigitalTransferOptions":function(node,obj) {
    obj.digitalTransferOptions
    this.readChildNodes(node,obj);
},
"onLine":function(node,obj) {
    this.readChildNodes(node,obj);
},
"CI_OnlineResource":function(node,obj) {
    this.readChildNodes(node,obj);
},
"linkage":function(node,obj) {
    this.readChildNodes(node,obj);
},


"contact":function(node,obj){this.readChildNodes(node,obj);},
"dateStamp":function(node,obj){this.readChildNodes(node,obj);},
"metadataStandardName":function(node,obj){this.readChildNodes(node,obj);},
"metadataStandardVersion":function(node,obj){this.readChildNodes(node,obj);},
"referenceSystemInfo":function(node,obj){this.readChildNodes(node,obj);},
"date":function(node,obj){this.readChildNodes(node,obj);},
"abstract":function(node,obj){this.readChildNodes(node,obj);},
"resourceConstraints":function(node,obj){this.readChildNodes(node,obj);},
"spatialReferenceType":function(node,obj){this.readChildNodes(node,obj);},

"MD_DataIdentification":function(node,obj) {
    this.readChildNodes(node,obj);
},
"citation":function(node,obj) {this.readChildNodes(node,obj);},
"CI_Citation":function(node,obj) {this.readChildNodes(node,obj);},
"title":function(node,obj) { // contains gco:CharacterString element
    this.readChildNodes(node,obj);
},
"extent":function(node,obj) {this.readChildNodes(node,obj);},
"EX_Extent":function(node,obj) {this.readChildNodes(node,obj);},
"geographicElement":function(node,obj) {this.readChildNodes(node,obj);},
"EX_GeographicBoundingBox":function(node,obj) {
    var bounds={left:0,right:0,bottom:0,top:0};
    this.readChildNodes(node,bounds);
    obj.bounds = new OpenLayers.Bounds(bounds.left,bounds.bottom,bounds.right,bounds.top);
},
"westBoundLongitude":function(node,obj){
    var num ={};
    this.readChildNodes(node,num);
    obj.left = num.value;
},
"eastBoundLongitude":function(node,obj){
    var num ={};
    this.readChildNodes(node,num);
    obj.right = num.value;
},
"southBoundLatitude":function(node,obj){
    var num ={};
    this.readChildNodes(node,num);
    obj.bottom = num.value;
},
"northBoundLatitude":function(node,obj){
    var num ={};
    this.readChildNodes(node,num);
    obj.top = num.value;
},
"URL":function(node,obj) {
    obj.URL= this.getChildValue(node);
}
};

OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.readers["gmi"] = OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.readers["gmd"];
OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.readers["srv"]={
"coupledResource":function(node,obj) {
    if(!obj.coupledResources) {
        obj.coupledResources =[];
    }
    var coupledResource = {};
    this.readChildNodes(node,coupledResource);
    obj.coupledResources.push(coupledResource);
},
"SV_CoupledResource":function(node,obj) {
    this.readChildNodes(node,obj);
},
"operationName":function(node,obj) {//gco:CharacterString
    this.readChildNodes(node,obj);
},
"operatesOn":function(node,obj) {
    if(!obj.operatesOn) {
        obj.operatesOn = [];
    }
    var operatesOn = {
        uuidref:this.getAttributeNS(node,"","uuidref"),
        href:this.getAttributeNS(node,"http://www.w3.org/1999/xlink","href")
    }
    
    obj.operatesOn.push(operatesOn);

},
"identifier":function(node,obj) {
    this.readChildNodes(node,obj);
}
};
OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.readers["srv"]["*"] = OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.readers["gmd"]["*"];


OpenLayers.Format.CSWGetRecords.v2_0_2.prototype.readers["gco"] = {
"CharacterString":function(node,obj) {
    var localName = node.parentNode.localName;
    obj[localName] = this.getChildValue(node);
},
"Decimal":function(node,num) {
    var dec = this.getChildValue(node);
    num.value = dec;
},
"ScopedName":function(node,obj) {
    obj.scopedName = this.getChildValue(node);
},
"*":function(node,obj) {
    var localName = node.parentNode.localName;
    obj[localName] = this.getChildValue(node);
}
};

OpenLayers.Format.CSWGetRecordById =function(options) {
    options = OpenLayers.Util.applyDefaults(options,OpenLayers.Format.CSWGetRecordById.DEFAULTS);
    var cls = OpenLayers.Format.CSWGetRecordById["v"+options.version.replace(/\./g,"_")];
    if(!cls) {
        throw "Unsupported CSWGetRecordById version: " + options.version;
    }
    return new cls(options);
}
OpenLayers.Format.CSWGetRecordById.DEFAULTS = {
    "version":"2.0.2"
}

OpenLayers.Format.CSWGetRecordById.v2_0_2 = OpenLayers.Class(OpenLayers.Format.CSWGetRecords.v2_0_2, {
    CLASS_NAME:"OpenLayers.Format.CSWGetRecordById"
});
OpenLayers.Format.CSWGetRecordById.v2_0_2.prototype.readers["csw"]["GetRecordByIdResponse"] = function(node,obj) {
    obj.records=[];
    this.readChildNodes(node,obj);
    var version = this.getAttributeNS(node,"","version");
    if(version!="") {
        obj.version = version;
    }
    obj.record = obj.records[0];
    delete obj.records;
};


