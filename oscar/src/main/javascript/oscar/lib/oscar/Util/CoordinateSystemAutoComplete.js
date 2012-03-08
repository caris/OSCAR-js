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
 * Class: oscar.Util.CoordinateSystemAutoComplete
 * 
 * @deprecated
 */
oscar.Util.CoordinateSystemAutoComplete=oscar.BaseClass({
		 /**
		  * Property: filterTag
		  */
         filterTag:null,
         /**
		  * Property: containerTag
		  */
         containerTag:null,
         /**
		  * Property: context
		  */
         context: null,
         /**
		  * Property: coorDataSource
		  */
         coorDataSource:null,
         /**
          * Property: autoComplete
          */
         autoComplete:null,
         /**
          * Constructor: oscar.Util.CoordinateSystemAutoComplete
          * 
          * Parameters: 
          * filterTagIn - DOM element reference of an input field. 
          * containerTagIn - DOM element reference of an existing DIV.
          * contextIn - {Object} a reference to SFE ThemePageControls.
          */
         initialize: function(filterTagIn, containerTagIn, contextIn){
             this.filterTag=filterTagIn;
             this.containerTag=containerTagIn;
             this.context=contextIn;
             this.coorDataSource= new YAHOO.util.XHRDataSource('getEpsgs');
             this.coorDataSource.responseType = YAHOO.util.XHRDataSource.TYPE_JSON;
             this.coorDataSource.responseSchema = {
                     resultsList : "Response.Results",
                     fields:["code",
                             "name"
                             ]
             }; 
         this.autoComplete = new YAHOO.widget.AutoComplete(this.filterTag, 
                 this.containerTag, this.coorDataSource);
         this.autoComplete.minQueryLength = 3;
         this.autoComplete.queryDelay=0.3;
         this.autoComplete.maxResultsDisplayed=20;
         this.autoComplete.forceSelection=true;
         this.autoComplete.autoSnapContainer = true;
         this.autoComplete.applyLocalFilter=false;
         this.autoComplete.resultTypeList=false;
         this.autoComplete.generateRequest=function(sQuery) {
             return "?filter=" + sQuery; 
         };
         this.autoComplete.formatResult=function(oResultData, sQuery, sResultMatch){
             return oResultData.code+" ("+ oResultData.name+")";
         };
         var ctx=this.context;
         this.autoComplete.itemSelectEvent.subscribe(function(sType,aArgs){
                    var ac=aArgs[0];
                    var srsValue = aArgs[2];
                    ac._elTextbox.value=srsValue.code+"("+srsValue.name+")";
                    var srs=srsValue.code;
                    ctx.changeSrs(srs);
              });
         
     },
  /**
   * Constant: CLASS_NAME
   * - oscar.Util.CoordinateSystemAutoComplete
   */   
  CLASS_NAME :"oscar.Util.CoordinateSystemAutoComplete"
    });   