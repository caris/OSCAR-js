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
 * Class: oscar.Gui.ComboBox
 * 
 * A GUI ComboBox widget that user can directly type in the input field 
 * 
 * or select from the drop down list. 
 */ 
oscar.Gui.ComboBox = oscar.BaseClass(oscar.Gui,{
	   /**
		 * Properties:
		 */
	   /**
	    * APIProperty: data
	    * 
	    * Reference to the list that user can select.
	    */
        data:null,
        /**
    	 * APIProperty: container
    	 * 
    	 * Reference to the input default value.
    	 */
        defaultValue:"",
        /**
    	 * APIProperty: source
    	 * 
    	 * Reference to the select source based on the user input.
    	 */
        source:null,

        EVENT_TYPES:["onSelect","onRender", "onChange"],
        /**
    	 * Constructor: oscar.Gui.ComboBox
    	 * 
    	 * Parameters: 
    	 * options - {Object} An optional object whose properties will be set on
    	 * 			 this instance.
    	 */

        initialize:function(options) {
            this.EVENT_TYPES = oscar.Gui.ComboBox.prototype.EVENT_TYPES.concat(oscar.Gui.prototype.EVENT_TYPES);
            oscar.Gui.prototype.initialize.apply(this,[options]);
            this.draw();

        },
        /**
    	 * Method: draw
    	 * 
    	 * Creates the input field with a drop-down list .
    	 */
        
        draw:function() {
        	oscar.Gui.prototype.draw.apply(this); 
            this.input=document.createElement("input");
            this.input.setAttribute("class","comboBoxInput");
            if(this.defaultValue!=""){
            	this.input.value=this.defaultValue;
            }
            this.div.appendChild(this.input);
            var scope=this;
            var input=oscar.jQuery(this.input).autocomplete({             
                delay:0,
                minLength: 0,
                source: scope.source.bind(scope),                
                select :scope.select.bind(scope),                
                change:scope.change.bind(scope)
            });
           input.addClass( "ui-widget ui-widget-content ui-corner-left" );
           input.data( "autocomplete" )._renderItem =scope.render.bind(scope);
           this.button = document.createElement("button");
           this.button.setAttribute("type","button"); 
           this.button.innerHTML = "&nbsp";

           oscar.jQuery(this.button).attr( "tabIndex", -1 )
               .attr( "title", oscar.i18n("showall") )               
               .insertAfter( this.input )
               .button({
                    icons: {
                          primary: "ui-icon-triangle-1-s"
                        },
                    text: false
               }).removeClass( "ui-corner-all" ).addClass( "ui-corner-right ui-button-icon" )
               .click(function() {
               // close if already visible
                   if ( oscar.jQuery(scope.input).autocomplete( "widget" ).is( ":visible" ) ) {
                        oscar.jQuery(scope.input).autocomplete( "close" );
                        return;
                   }
               // pass empty string as value to search for, displaying all results
                   oscar.jQuery(scope.input).autocomplete( "search", "" );
                   oscar.jQuery(scope.input).focus(); 
             });      
        },
        /**
    	 * Method:select 
    	 * 
    	 * Triggers the select event passing the object reference to the 
	     * listeners.
    	 */
        select:function(event,ui) {
            if(this.onSelect) {
               this.onSelect.call(event.target,event,ui);
            }
            this.events.triggerEvent("onSelect",event.target.value);

        }, 
        /**
         * Method onSelect
         * When the item selected, set the div element value as the item value
         * 
         */
        onSelect:function(value){
            var div= document.createElement("div")
        	div.value=value;
        },
        /**
    	 * Method:render 
    	 * 
    	 * Triggers the list item render event passing the item reference to the 
	     * listeners.
    	 */
         render:function(ul,item) { 
           if(this.onRender) { 
                  this.onRender.call(this,ul,item);
                }           
           this.events.triggerEvent("onRender",ul,item);
           },
           
       /**
       	 * Method:onRender 
       	 * 
       	 * Add the item to the ul as "li" element.
   	     * 
       	 */ 
         onRender: function(ul,item){
        	 var li= document.createElement("li")
             oscar.jQuery(li).data( "item.autocomplete", item )
              .append( "<a>" + item.label +"</a>" )
              .appendTo( ul );
         },
           
       /**
       	 * Method:change 
       	 * 
       	 * Triggers the change event passing the input value reference to the 
   	     * listeners.
       	 */           
           change: function(event,ui){
          	 if(this.onChange) {
                   this.onChange.call(event.target,event,ui);
                }
                this.events.triggerEvent("onChange",event.target.value);
           },
           
       /**
        * Method onChange
        * When the input value changed, set the div element value as new value
        * 
        */ 
           onChange: function(value){
        	   var div= document.createElement("div") 
        	   div.value=value;	   
           },
       /**
       	 * Constant: CLASS_NAME
       	 * - oscar.Gui.ComboBox 
       	 */
        CLASS_NAME:"oscar.Gui.ComboBox"

    });