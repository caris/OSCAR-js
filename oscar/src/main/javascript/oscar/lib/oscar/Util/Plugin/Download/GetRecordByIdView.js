oscar.Util.Plugin.Download.GetRecordByIdView = new oscar.BaseClass(
		oscar.Util.Plugin.Download,
		{
			pluginType : "OGC:CSW-2.0.0-http-get-record-by-id-view",
			icon : "ui-icon-comment",
			defaultOutputSchema:"http://www.isotc211.org/2005/gmd",
			outputSchema:null,
			initialize : function(options) {
				oscar.Util.Plugin.Download.prototype.initialize.apply(this,
						[ options ]);
			},
			getOutputSchema:function() {
				if(this.outputSchema == null) {
					return this.defaultOutputSchema;
				} 
				return this.outputSchema;
			},
			
			destroy:function() {
				$$("#GetRecordByIdViewDlg").remove();
			},
			/**
			 * @Override
			 * @see oscar.Util.Plugin
			 */
			play : function() {
				if($$("#GetRecordByIdViewDlg").length) {this.destroy()};
				
				var params = {
				endPoint:this.link.url,
				request:"GetRecordById",
				service:"CSW",
				version:"2.0.2",
				identifier:this.record.identifier[0].value
				}
				
				var queryString = OpenLayers.Util.getParameterString(params);

				var actionUrl = oscar.ISOMetadataViewProxy+"?"+queryString;
				var iframeDiv = $$("<div></div>");
				iframeDiv.css("background-color","white");
				
				var iframe = $$("<iframe seamless></iframe>");
				iframe.attr("src",actionUrl);
				iframe.attr("width",500);
				iframe.attr("height",400);
				iframe.attr("frameborder",0);
				iframe.attr("seamless");
				
				dlg = $$("<div id='GetRecordByIdViewDlg'></div>").dialog({"width":"520px",resizable:false,position:{my:"right top", at:"right top", of:this.map.div}});
				iframeDiv.append(iframe);
				dlg.append(iframeDiv);
			},
			CLASS_NAME : "oscar.Util.Plugin.Download.GetRecordByIdView"
		});

oscar.getPluginManager().register(oscar.Util.Plugin.Download.GetRecordByIdView.prototype.pluginType,
	oscar.Util.Plugin.Download.GetRecordByIdView
);